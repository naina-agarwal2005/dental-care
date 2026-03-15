import { Schema, model, models, type InferSchemaType } from "mongoose";

const clinicSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (value: number[]) => Array.isArray(value) && value.length === 2,
          message: "Coordinates must be [lng, lat]",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

clinicSchema.index({ location: "2dsphere" });

export type ClinicDocument = InferSchemaType<typeof clinicSchema>;

export const ClinicModel = models.Clinic || model("Clinic", clinicSchema);
