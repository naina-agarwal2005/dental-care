import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";
import { signSiteToken } from "@/lib/site-auth";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();

    if (!passcode) {
      return NextResponse.json(
        { error: "Passcode is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const admin = await Admin.findOne().lean();

    if (!admin || !admin.sitePasswordHash) {
      return NextResponse.json(
        { error: "No passcode configured. Admin must set the passcode first." },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(passcode, admin.sitePasswordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect passcode" },
        { status: 401 }
      );
    }

    // Generate token with 2 days expiration
    const payload = {
      unlocked: true,
      exp: Date.now() + 2 * 24 * 60 * 60 * 1000,
    };
    const sessionToken = await signSiteToken(payload);

    const response = NextResponse.json({ success: true });

    // Set HTTP-only cookie for access control
    response.cookies.set("site_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60, // 2 days
      path: "/",
    });

    return response;
  } catch (error) {
    logger.error("Unlock API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
