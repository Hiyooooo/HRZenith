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
    // Izinkan https, serta http khusus lokal/development (localhost & 127.0.0.1)
    if (parsed.protocol === "https:") return true;
    if (
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    ) {
      return true;
    }
    return false;
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
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Aset lokal Next.js bawaan di folder public (jangan diubah)
  if (
    trimmed === "/favicon.svg" ||
    trimmed === "/logo.svg" ||
    trimmed === "/opengraph-image" ||
    trimmed === "/og-default"
  ) {
    return trimmed;
  }

  if (!cleanApiUrl) {
    return trimmed;
  }

  try {
    const apiOrigin = new URL(cleanApiUrl).origin;

    // Jika alamat relatif (misalnya diawali dengan /storage/ atau storage/)
    if (trimmed.startsWith("/")) {
      return `${apiOrigin}${trimmed}`;
    }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return `${apiOrigin}/${trimmed}`;
    }

    // Jika backend mengirimkan alamat localhost:8000 / 127.0.0.1 padahal API_URL pakai domain/ngrok lain
    const parsedUrl = new URL(trimmed);
    const isLocalhostBackend =
      parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";
    const apiHostIsDifferent = new URL(cleanApiUrl).hostname !== parsedUrl.hostname;

    if (isLocalhostBackend && apiHostIsDifferent) {
      return `${apiOrigin}${parsedUrl.pathname}${parsedUrl.search}`;
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}
