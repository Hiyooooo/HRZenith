import { DEFAULT_REVALIDATE_SECONDS } from "./defaults";
import type { CmsEnv } from "./types";

export function parseRevalidate(raw?: string): number {
  if (!raw) return DEFAULT_REVALIDATE_SECONDS;
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return DEFAULT_REVALIDATE_SECONDS;
  const num = parseInt(trimmed, 10);
  if (num < 1 || num > 86400) return DEFAULT_REVALIDATE_SECONDS;
  return num;
}

export function readCmsEnv(): CmsEnv {
  const apiUrl = process.env.API_URL ? process.env.API_URL.trim() : undefined;
  const siteId = process.env.SITE_ID ? process.env.SITE_ID.trim() : undefined;
  const siteSecret = process.env.SITE_SECRET
    ? process.env.SITE_SECRET.trim()
    : undefined;
  const revalidateSeconds = parseRevalidate(process.env.REVALIDATE_SECONDS);

  return {
    apiUrl,
    siteId,
    siteSecret,
    revalidateSeconds,
  };
}
