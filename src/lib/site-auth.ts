const JWT_SECRET = "toothaids_fallback_jwt_signing_secret_key_secure_2026";

export type SiteSessionPayload = {
  unlocked: boolean;
  exp: number;
};

// Convert ArrayBuffer to base64url string
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Convert JSON object to base64url string
function jsonToBase64Url(obj: any): string {
  const str = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Convert base64url string to JSON object
function base64UrlToJson(str: string): any {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Generates an HMAC SHA-256 signature using global Web Crypto API (Edge safe)
async function getHmacSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  const messageData = encoder.encode(data);

  // Import raw key data into SubtleCrypto
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Sign message
  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return bufferToBase64Url(signature);
}

/**
 * Signs a payload to create a secure, tamper-proof session token.
 */
export async function signSiteToken(payload: SiteSessionPayload): Promise<string> {
  const data = jsonToBase64Url(payload);
  const signature = await getHmacSignature(data);
  return `${data}.${signature}`;
}

/**
 * Verifies the signature of a session token and returns the payload if valid.
 * Returns null if the signature is invalid or the token has expired.
 */
export async function verifySiteToken(token: string): Promise<SiteSessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [data, signature] = parts;
    const expectedSignature = await getHmacSignature(data);

    if (signature !== expectedSignature) return null;

    const payload = base64UrlToJson(data) as SiteSessionPayload;
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
