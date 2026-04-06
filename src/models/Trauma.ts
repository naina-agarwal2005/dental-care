import { Schema, model, models, type InferSchemaType } from "mongoose";

const traumaStepSchema = new Schema(
  {
    stepNumber: { type: Number, required: true, min: 1 },
    text: {
      en: { type: String, required: true, trim: true },
      kn: { type: String, required: true, trim: true },
    },
    imageUrl: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const traumaSchema = new Schema(
  {
    title: {
      en: { type: String, required: true, trim: true },
      kn: { type: String, required: true, trim: true },
    },
    videoUrl: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    numberOfFirstAidSteps: { type: Number, required: true, min: 1 },
    steps: {
      type: [traumaStepSchema],
      required: true,
      validate: {
        validator: (value: unknown[]) => Array.isArray(value) && value.length > 0,
        message: "At least one first-aid step is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting by creation date (most common query)
traumaSchema.index({ createdAt: -1 });

export type TraumaDocument = InferSchemaType<typeof traumaSchema>;

export const TraumaModel = models.Trauma || model("Trauma", traumaSchema);
