import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { TraumaModel } from "@/models/Trauma";

type TraumaPayload = {
  title?: { en?: string; kn?: string };
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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid trauma id" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const trauma = await TraumaModel.findById(id).lean();
    if (!trauma) {
      return NextResponse.json({ error: "Trauma not found" }, { status: 404 });
    }
    return NextResponse.json({ data: mapTrauma(trauma) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load trauma" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid trauma id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as TraumaPayload;
    const payload = normalizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await TraumaModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Trauma not found" }, { status: 404 });
    }

    return NextResponse.json({ data: mapTrauma(updated) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update trauma" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid trauma id" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const deleted = await TraumaModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Trauma not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete trauma" }, { status: 500 });
  }
}
