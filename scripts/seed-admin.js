#!/usr/bin/env node

/**
 * Admin Seeding Script
 * 
 * This script creates an admin user for the Tooth Aids application.
 * It will fail if an admin already exists (to prevent accidental overwrites).
 * 
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=securepassword npm run seed:admin
 * 
 * Or via Docker:
 *   docker compose exec app npm run seed:admin
 * 
 * Environment Variables Required:
 *   - MONGODB_URI: MongoDB connection string
 *   - ADMIN_EMAIL: Email for the admin account
 *   - ADMIN_PASSWORD: Password for the admin account (min 8 characters)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SALT_ROUNDS = 12;

// Validation
function validateInputs() {
  const errors = [];

  if (!MONGODB_URI) {
    errors.push('MONGODB_URI environment variable is required');
  }

  if (!ADMIN_EMAIL) {
    errors.push('ADMIN_EMAIL environment variable is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL)) {
    errors.push('ADMIN_EMAIL must be a valid email address');
  }

  if (!ADMIN_PASSWORD) {
    errors.push('ADMIN_PASSWORD environment variable is required');
  } else if (ADMIN_PASSWORD.length < 8) {
    errors.push('ADMIN_PASSWORD must be at least 8 characters long');
  }

  return errors;
}

// Admin Schema (matching the TypeScript model)
const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

async function seedAdmin() {
  console.log('\n========================================');
  console.log('  Tooth Aids - Admin Seeding Script');
  console.log('========================================\n');

  // Validate inputs
  const validationErrors = validateInputs();
  if (validationErrors.length > 0) {
    console.error('Validation errors:');
    validationErrors.forEach(err => console.error(`  - ${err}`));
    console.error('\nUsage:');
    console.error('  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=securepassword npm run seed:admin\n');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'dentalcare',
    });
    console.log('Connected to MongoDB successfully.\n');

    // Get or create Admin model
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.error('ERROR: An admin account already exists.');
      console.error(`Existing admin email: ${existingAdmin.email}`);
      console.error('\nTo reset the admin account, you must clear the database first.');
      console.error('This is a safety measure to prevent accidental overwrites.\n');
      process.exit(1);
    }

    // Hash the password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    // Create the admin
    console.log('Creating admin account...');
    const admin = new Admin({
      email: ADMIN_EMAIL.toLowerCase().trim(),
      passwordHash,
    });

    await admin.save();

    console.log('\n========================================');
    console.log('  Admin account created successfully!');
    console.log('========================================');
    console.log(`  Email: ${admin.email}`);
    console.log('  Password: [hidden]');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\nFailed to seed admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
seedAdmin();
