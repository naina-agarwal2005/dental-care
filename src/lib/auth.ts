import { NextRequest, NextResponse } from "next/server";

/**
 * Check if the request has a valid admin session
 */
export function isAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get("admin_session");
  if (!sessionCookie?.value) return false;

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString()
    );
    return sessionData.exp > Date.now();
  } catch {
    return false;
  }
}

/**
 * Helper to return 401 Unauthorized response
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Middleware helper that checks authentication and returns error response if not authenticated
 * Returns null if authenticated, or the error response if not
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }
  return null;
}
