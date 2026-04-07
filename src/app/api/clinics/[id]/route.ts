import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ClinicModel } from "@/models/Clinic";
import { requireAuth } from "@/lib/auth";

type ClinicPayload = {
  name?: string;
  contactNumber?: string;
  lat?: number;
  lng?: number;
  mapsUrl?: string;
};

function normalizePayload(body: ClinicPayload) {
  return {
    name: (body.name ?? "").trim(),
    contactNumber: (body.contactNumber ?? "").trim(),
    lat: Number(body.lat),
    lng: Number(body.lng),
    mapsUrl: (body.mapsUrl ?? "").trim(),
  };
}

function validatePayload(payload: ReturnType<typeof normalizePayload>) {
  if (!payload.name) return "Clinic name is required";
  if (!payload.contactNumber) return "Contact number is required";
  if (Number.isNaN(payload.lat) || payload.lat < -90 || payload.lat > 90) return "Latitude is invalid";
  if (Number.isNaN(payload.lng) || payload.lng < -180 || payload.lng > 180) return "Longitude is invalid";
  return null;
}

function mapClinic(doc: any) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    contactNumber: doc.contactNumber,
    lat: doc.location?.coordinates?.[1],
    lng: doc.location?.coordinates?.[0],
    mapsUrl: doc.mapsUrl,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid clinic id" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const clinic = await ClinicModel.findById(id).lean();
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json({ data: mapClinic(clinic) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load clinic" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Require admin authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid clinic id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as ClinicPayload;
    const payload = normalizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await ClinicModel.findByIdAndUpdate(
      id,
      {
        name: payload.name,
        contactNumber: payload.contactNumber,
        mapsUrl: payload.mapsUrl || undefined,
        location: {
          type: "Point",
          coordinates: [payload.lng, payload.lat],
        },
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json({ data: mapClinic(updated) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update clinic" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Require admin authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid clinic id" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const deleted = await ClinicModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete clinic" }, { status: 500 });
  }
}
