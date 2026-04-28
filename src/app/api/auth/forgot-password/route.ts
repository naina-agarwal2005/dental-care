import logger from "@/lib/logger";
import { NextResponse } from "next/server";
import { Admin } from "@/models/Admin";
import { connectToDatabase } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return NextResponse.json(
        { message: "If that admin email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    admin.resetToken = resetToken;
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save();

    // Send email via SMTP
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.error("SMTP_USER or SMTP_PASS is missing in environment variables.");
      return NextResponse.json({ error: "Email service is not configured properly." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Determine the base URL (for local vs. production)
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const baseUrl = process.env.NODE_ENV === "production" ? "https://toothaids.com" : `${protocol}://${host}`;
    
    const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;
    logger.info(`Reset URL generated: ${resetUrl}`);
    logger.info(`Base URL: ${baseUrl}`);
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: admin.email,
      subject: "Admin Password Reset",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "If that admin email exists, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
