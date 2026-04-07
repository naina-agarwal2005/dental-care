import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TraumaModel } from "@/models/Trauma";
import { requireAuth } from "@/lib/auth";
import type { ProtocolType } from "@/lib/types";

type TraumaPayload = {
  title?: { en?: string; kn?: string };
  type?: ProtocolType;
  videoUrl?: string;
  thumbnail?: string;
  steps?: Array<{ stepNumber?: number; text?: { en?: string; kn?: string }; imageUrl?: string }>;
};

function normalizePayload(body: TraumaPayload) {
  const steps = (body.steps ?? []).map((step, index) => ({
    stepNumber: index + 1,
    text: {
      en: (step.text?.en ?? "").trim(),
      kn: (step.text?.kn ?? "").trim(),
    },
    imageUrl: (step.imageUrl ?? "").trim(),
  }));

  return {
    title: {
      en: (body.title?.en ?? "").trim(),
      kn: (body.title?.kn ?? "").trim(),
    },
    type: body.type || 'first_aid',
    videoUrl: (body.videoUrl ?? "").trim(),
    thumbnail: (body.thumbnail ?? "").trim(),
    numberOfFirstAidSteps: steps.length,
    steps,
  };
}

function validatePayload(payload: ReturnType<typeof normalizePayload>) {
  if (!payload.title.en || !payload.title.kn) {
    return "Title is required in English and Kannada";
  }
  if (!payload.videoUrl) {
    return "Main YouTube link is required";
  }
  if (!payload.thumbnail) {
    return "Thumbnail is required";
  }
  if (payload.steps.length === 0) {
    return "At least one first-aid step is required";
  }
  const hasInvalidStep = payload.steps.some((step) => !step.text.en || !step.text.kn);
  if (hasInvalidStep) {
    return "Each step must include English and Kannada text";
  }
  return null;
}

function mapTrauma(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    type: doc.type || 'first_aid',
    videoUrl: doc.videoUrl,
    thumbnail: doc.thumbnail,
    numberOfFirstAidSteps: doc.numberOfFirstAidSteps,
    steps: (doc.steps ?? []).map((step: any) => ({
      stepNumber: step.stepNumber,
      text: step.text,
      imageUrl: step.imageUrl || "",
    })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const traumas = await TraumaModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      { data: traumas.map(mapTrauma) },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to load traumas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as TraumaPayload;
    const payload = normalizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await connectToDatabase();
    const created = await TraumaModel.create(payload);
    return NextResponse.json({ data: mapTrauma(created.toObject()) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trauma" }, { status: 500 });
  }
}
