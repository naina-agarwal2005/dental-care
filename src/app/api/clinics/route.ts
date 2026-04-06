import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ClinicModel } from "@/models/Clinic";

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
    distanceKm: doc.distanceMeters ? Number((doc.distanceMeters / 1000).toFixed(1)) : undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    const lat = latParam ? Number(latParam) : NaN;
    const lng = lngParam ? Number(lngParam) : NaN;

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      const clinics = await ClinicModel.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            key: "location",
            distanceField: "distanceMeters",
            spherical: true,
          },
        },
      ]);

      return NextResponse.json(
        { data: clinics.map(mapClinic) },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          },
        }
      );
    }

    const clinics = await ClinicModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      { data: clinics.map(mapClinic) },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to load clinics" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClinicPayload;
    const payload = normalizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await connectToDatabase();
    const created = await ClinicModel.create({
      name: payload.name,
      contactNumber: payload.contactNumber,
      mapsUrl: payload.mapsUrl || undefined,
      location: {
        type: "Point",
        coordinates: [payload.lng, payload.lat],
      },
    });

    return NextResponse.json({ data: mapClinic(created.toObject()) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create clinic" }, { status: 500 });
  }
}
