import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ImageModel } from "@/models/Image";

// Cache images for 1 year (immutable content)
const CACHE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate MongoDB ObjectId format
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Don't use .lean() to preserve Buffer type
    const image = await ImageModel.findById(id);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Ensure we have a proper Buffer
    const imageBuffer = Buffer.isBuffer(image.data) 
      ? image.data 
      : Buffer.from(image.data);

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": image.size.toString(),
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        "ETag": `"${id}"`,
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
