import logger from "@/lib/logger";
import { NextResponse } from "next/server";
import { Admin } from "@/models/Admin";
import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    // Find admin by token and verify token hasn't expired
    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear token
    admin.passwordHash = passwordHash;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    return NextResponse.json(
      { message: "Password reset successful." },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
