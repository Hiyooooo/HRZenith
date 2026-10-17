import "server-only";
import { cache } from "react";
import { API_TIMEOUT_MS, DEFAULT_SITE_CONFIG } from "./defaults";
import { buildRequest } from "./endpoint";
import { readCmsEnv } from "./env";
import { normalizeSiteConfig } from "./normalize";
import type { SiteConfig } from "./types";

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const env = readCmsEnv();

  // Jika kredensial kosong, kembalikan default tanpa network request
  if (!env.apiUrl || !env.siteId || !env.siteSecret) {
    return DEFAULT_SITE_CONFIG;
  }

  const { url, headers } = buildRequest(env);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
      next: {
        revalidate: env.revalidateSeconds,
        tags: ["site-config"],
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[cms] fallback: status ${response.status}`);
      return DEFAULT_SITE_CONFIG;
    }

    const json = await response.json();
    return normalizeSiteConfig(json, env.apiUrl);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.message.includes("aborted"))
    ) {
      console.warn("[cms] fallback: timeout");
    } else {
      console.warn("[cms] fallback: network error");
    }
    return DEFAULT_SITE_CONFIG;
  }
});
