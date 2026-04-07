import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
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
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create index on email for faster lookups
AdminSchema.index({ email: 1 });

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
