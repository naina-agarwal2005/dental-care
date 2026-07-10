import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { requireAuth } from "@/lib/auth";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToDatabase();
    const admin = await Admin.findOne().lean();
    
    return NextResponse.json({
      passcodeSet: !!(admin && admin.sitePassword),
      passcode: admin ? (admin.sitePassword || "") : "",
    });
  } catch (error) {
    logger.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const { passcode } = await request.json();

    if (passcode === undefined) {
      return NextResponse.json({ error: "Passcode parameter is required" }, { status: 400 });
    }

    await connectToDatabase();
    const admin = await Admin.findOne();
    if (!admin) {
      return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
    }

    if (passcode === "") {
      admin.sitePassword = "";
    } else {
      if (passcode.length < 4) {
        return NextResponse.json({ error: "Passcode must be at least 4 characters long" }, { status: 400 });
      }
      admin.sitePassword = passcode;
    }

    await admin.save();
    return NextResponse.json({ success: true, passcodeSet: !!admin.sitePassword });
  } catch (error) {
    logger.error("PUT settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
