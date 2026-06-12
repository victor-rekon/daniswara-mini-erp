export const ACCESS_COOKIE_NAME = "daniswara_internal_access";

export function getAccessPassword() {
  return process.env.APP_ACCESS_PASSWORD?.trim() || null;
}

export function isAccessGateEnabled() {
  return Boolean(getAccessPassword());
}

export async function createAccessToken(password: string) {
  const salt = process.env.APP_AUTH_SALT || "daniswara-mini-erp-v1";
  const input = `${password}:${salt}`;
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
