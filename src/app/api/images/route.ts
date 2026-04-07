import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ImageModel } from "@/models/Image";
import { requireAuth } from "@/lib/auth";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await connectToDatabase();

    // Save to MongoDB
    const image = await ImageModel.create({
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: buffer,
    });

    // Return the image URL
    const imageUrl = `/api/images/${image._id}`;

    return NextResponse.json(
      {
        data: {
          id: image._id.toString(),
          url: imageUrl,
          filename: image.filename,
          mimeType: image.mimeType,
          size: image.size,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
