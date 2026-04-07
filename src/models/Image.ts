import { Schema, model, models, type InferSchemaType } from "mongoose";

const imageSchema = new Schema(
  {
    filename: { type: String, required: true, trim: true },
    mimeType: { 
      type: String, 
      required: true, 
      enum: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    },
    size: { type: Number, required: true }, // Size in bytes
    data: { type: Buffer, required: true }, // Binary image data
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups by ID (default _id index is sufficient)
// Add index on createdAt for potential cleanup operations
imageSchema.index({ createdAt: -1 });

export type ImageDocument = InferSchemaType<typeof imageSchema>;

export const ImageModel = models.Image || model("Image", imageSchema);
