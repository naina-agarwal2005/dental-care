import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import logger from "@/lib/logger";

export async function GET() {
  try {
    await connectToDatabase();
    const admin = await Admin.findOne().lean();
    
    return NextResponse.json({
      passcodeSet: !!(admin && admin.sitePassword),
    });
  } catch (error) {
    logger.error("GET settings status error:", error);
    return NextResponse.json({ error: "Failed to get settings status" }, { status: 500 });
  }
}
