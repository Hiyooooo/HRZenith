export function isHexColor(hex: unknown): hex is string {
  if (typeof hex !== "string") return false;
  return /^#[0-9A-Fa-f]{6}$/.test(hex.trim());
}

export function isHttpsUrl(url: unknown, maxLen = 500): url is string {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.length === 0 || trimmed.length > maxLen) return false;

  // Izinkan path lokal absolut
  if (trimmed.startsWith("/")) return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isWhatsAppUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.length === 0 || trimmed.length > 600) return false;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;
    return parsed.hostname === "wa.me" || parsed.hostname === "api.whatsapp.com";
  } catch {
    return false;
  }
}

export function isEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 120) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function isPhone(phone: unknown): phone is string {
  if (typeof phone !== "string") return false;
  const trimmed = phone.trim();
  return /^[+0-9 ()\-]{6,24}$/.test(trimmed);
}

export function isGaId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  return /^G-[A-Z0-9]{4,20}$/.test(id.trim());
}

export function isPixelId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  return /^\d{8,20}$/.test(id.trim());
}

export function clampText(
  text: unknown,
  minLen: number,
  maxLen: number
): string | null {
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  if (trimmed.length < minLen || trimmed.length > maxLen) return null;
  return trimmed;
}

export function resolveUrl(
  url: string | null | undefined,
  cleanApiUrl?: string
): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/") && cleanApiUrl) {
    const base = cleanApiUrl.replace(/\/+$/, "");
    return `${base}${trimmed}`;
  }

  if (
    cleanApiUrl &&
    trimmed.includes("localhost:8000") &&
    !cleanApiUrl.includes("localhost:8000")
  ) {
    const base = cleanApiUrl.replace(/\/+$/, "");
    return trimmed.replace(/https?:\/\/[^/]+/, base);
  }

  return trimmed;
}
