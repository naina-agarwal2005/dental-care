#!/usr/bin/env node

/**
 * Clinic Seeding Script
 * 
 * This script creates test dental clinics in Bangalore and Mandya
 * for the Tooth Aids application.
 * 
 * Usage:
 *   npm run seed:clinics
 * 
 * Or via Docker:
 *   docker compose exec app npm run seed:clinics
 * 
 * Environment Variables Required:
 *   - MONGODB_URI: MongoDB connection string
 */

const mongoose = require('mongoose');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;

// Clinic Schema (matching the TypeScript model)
const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    mapsUrl: { type: String, trim: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
  },
  {
    timestamps: true,
  }
);

clinicSchema.index({ location: '2dsphere' });

// Clinics in Bangalore (Central and surrounding areas)
const bangaloreClinics = [
  {
    name: 'V S Dental College & Hospital',
    contactNumber: '+91 80 2661 1707',
    mapsUrl: 'https://maps.google.com/?q=VS+Dental+College+VV+Puram+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.5710, 12.9400], // [lng, lat] - VV Puram area
    },
  },
  {
    name: 'Apollo White Dental - Jayanagar',
    contactNumber: '+91 80 4353 5353',
    mapsUrl: 'https://maps.google.com/?q=Apollo+White+Dental+Jayanagar+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.5831, 12.9307], // Jayanagar
    },
  },
  {
    name: 'Smile Dental Clinic - Koramangala',
    contactNumber: '+91 98450 12345',
    mapsUrl: 'https://maps.google.com/?q=Koramangala+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.6245, 12.9352], // Koramangala
    },
  },
  {
    name: 'Clove Dental - Indiranagar',
    contactNumber: '+91 80 4122 3344',
    mapsUrl: 'https://maps.google.com/?q=Clove+Dental+Indiranagar+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.6411, 12.9716], // Indiranagar
    },
  },
  {
    name: 'Dr. Reddy\'s Dental Care - HSR Layout',
    contactNumber: '+91 80 4211 5566',
    mapsUrl: 'https://maps.google.com/?q=HSR+Layout+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.6389, 12.9081], // HSR Layout
    },
  },
  {
    name: 'Smiline Dental Hospital - Whitefield',
    contactNumber: '+91 80 4902 0000',
    mapsUrl: 'https://maps.google.com/?q=Whitefield+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.7510, 12.9698], // Whitefield
    },
  },
  {
    name: 'Dental Solutions - Malleshwaram',
    contactNumber: '+91 80 2334 5678',
    mapsUrl: 'https://maps.google.com/?q=Malleshwaram+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.5688, 13.0067], // Malleshwaram
    },
  },
  {
    name: 'City Dental Clinic - Rajajinagar',
    contactNumber: '+91 80 2322 1199',
    mapsUrl: 'https://maps.google.com/?q=Rajajinagar+Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.5540, 12.9866], // Rajajinagar
    },
  },
];

// Clinics in Mandya (Karnataka)
const mandyaClinics = [
  {
    name: 'Mandya Institute of Dental Sciences',
    contactNumber: '+91 8232 222 555',
    mapsUrl: 'https://maps.google.com/?q=Mandya+Institute+of+Dental+Sciences',
    location: {
      type: 'Point',
      coordinates: [76.8958, 12.5218], // Mandya city center
    },
  },
  {
    name: 'Sri Sai Dental Clinic - Mandya',
    contactNumber: '+91 8232 244 333',
    mapsUrl: 'https://maps.google.com/?q=Mandya+Karnataka',
    location: {
      type: 'Point',
      coordinates: [76.8933, 12.5244], // Mandya
    },
  },
  {
    name: 'Srinivas Dental Care - Mandya',
    contactNumber: '+91 94480 56789',
    mapsUrl: 'https://maps.google.com/?q=Mandya+Karnataka',
    location: {
      type: 'Point',
      coordinates: [76.9010, 12.5180], // Mandya
    },
  },
  {
    name: 'Kaveri Dental Hospital - Maddur',
    contactNumber: '+91 8232 282 100',
    mapsUrl: 'https://maps.google.com/?q=Maddur+Karnataka',
    location: {
      type: 'Point',
      coordinates: [77.0449, 12.5841], // Maddur (near Mandya)
    },
  },
  {
    name: 'Naveen Dental Clinic - Nagamangala',
    contactNumber: '+91 8234 255 222',
    mapsUrl: 'https://maps.google.com/?q=Nagamangala+Karnataka',
    location: {
      type: 'Point',
      coordinates: [76.7550, 12.8195], // Nagamangala (near Mandya)
    },
  },
  {
    name: 'Sharada Dental Care - Pandavapura',
    contactNumber: '+91 8236 266 444',
    mapsUrl: 'https://maps.google.com/?q=Pandavapura+Karnataka',
    location: {
      type: 'Point',
      coordinates: [76.6658, 12.4912], // Pandavapura (near Mandya)
    },
  },
];

async function seedClinics() {
  console.log('\n========================================');
  console.log('  Tooth Aids - Clinic Seeding Script');
  console.log('========================================\n');

  // Validate MongoDB URI
  if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI environment variable is required');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'dentalcare',
    });
    console.log('Connected to MongoDB successfully.\n');

    // Get or create Clinic model
    const Clinic = mongoose.models.Clinic || mongoose.model('Clinic', clinicSchema);

    // Check existing clinics
    const existingCount = await Clinic.countDocuments();
    console.log(`Found ${existingCount} existing clinics.`);

    if (existingCount > 0) {
      console.log('Clearing existing clinics...');
      await Clinic.deleteMany({});
      console.log('Existing clinics cleared.\n');
    }

    // Combine all clinics
    const allClinics = [...bangaloreClinics, ...mandyaClinics];

    // Insert clinics
    console.log('Creating test clinics...');
    const created = await Clinic.insertMany(allClinics);

    // Ensure 2dsphere index exists
    console.log('Ensuring geospatial index...');
    await Clinic.collection.createIndex({ location: '2dsphere' });

    console.log('\n========================================');
    console.log('  Clinics created successfully!');
    console.log('========================================');
    console.log(`  Bangalore clinics: ${bangaloreClinics.length}`);
    console.log(`  Mandya clinics: ${mandyaClinics.length}`);
    console.log(`  Total clinics created: ${created.length}`);
    console.log('========================================\n');

    // Display created clinics
    console.log('Created clinics:');
    console.log('----------------');
    for (const clinic of created) {
      const [lng, lat] = clinic.location.coordinates;
      console.log(`  - ${clinic.name}`);
      console.log(`    Phone: ${clinic.contactNumber}`);
      console.log(`    Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    console.error('\nFailed to seed clinics:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
seedClinics();
