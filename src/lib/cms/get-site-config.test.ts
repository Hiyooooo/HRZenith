import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSiteConfig } from "./get-site-config";
import { DEFAULT_SITE_CONFIG } from "./defaults";

describe("getSiteConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns default config when env variables are empty without calling fetch", async () => {
    delete process.env.API_URL;
    delete process.env.SITE_ID;
    delete process.env.SITE_SECRET;

    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const config = await getSiteConfig();
    expect(config).toEqual(DEFAULT_SITE_CONFIG);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns default config and logs concise warning on network rejection", async () => {
    process.env.API_URL = "http://localhost:8000";
    process.env.SITE_ID = "04-hrzenith";
    process.env.SITE_SECRET = "secret-1234567890";

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network connection refused"))
    );

    const config = await getSiteConfig();
    expect(config).toEqual(DEFAULT_SITE_CONFIG);
    expect(warnSpy).toHaveBeenCalledWith("[cms] fallback: network error");
  });

  it("returns default config on HTTP 500 error", async () => {
    process.env.API_URL = "http://localhost:8000";
    process.env.SITE_ID = "04-hrzenith";
    process.env.SITE_SECRET = "secret-1234567890";

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    const config = await getSiteConfig();
    expect(config).toEqual(DEFAULT_SITE_CONFIG);
    expect(warnSpy).toHaveBeenCalledWith("[cms] fallback: status 500");
  });

  it("returns default config on invalid JSON response", async () => {
    process.env.API_URL = "http://localhost:8000";
    process.env.SITE_ID = "04-hrzenith";
    process.env.SITE_SECRET = "secret-1234567890";

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error("Unexpected token in JSON")),
      })
    );

    const config = await getSiteConfig();
    expect(config).toEqual(DEFAULT_SITE_CONFIG);
    expect(warnSpy).toHaveBeenCalledWith("[cms] fallback: network error");
  });

  it("merges partial response over defaults and attaches tags and revalidate", async () => {
    process.env.API_URL = "http://localhost:8000";
    process.env.SITE_ID = "04-hrzenith";
    process.env.SITE_SECRET = "secret-1234567890";
    process.env.REVALIDATE_SECONDS = "120";

    const mockResponse = {
      hero: {
        headline: "Headline Dari Mock Backend",
      },
    };

    let capturedOptions: RequestInit | undefined;
    const fetchSpy = vi.fn().mockImplementation((_url, options) => {
      capturedOptions = options;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
    });
    vi.stubGlobal("fetch", fetchSpy);

    const config = await getSiteConfig();
    expect(config.hero.headline).toBe("Headline Dari Mock Backend");
    expect(config.hero.subheadline).toBe(DEFAULT_SITE_CONFIG.hero.subheadline);

    // Verify headers and next options
    expect(capturedOptions?.headers).toEqual({
      "X-Site-Id": "04-hrzenith",
      "X-Site-Secret": "secret-1234567890",
      Accept: "application/json",
    });

    const nextOpts = (capturedOptions as { next?: { revalidate: number; tags: string[] } })?.next;
    expect(nextOpts?.revalidate).toBe(120);
    expect(nextOpts?.tags).toEqual(["site-config"]);
  });

  it("never prints SITE_SECRET in console output", async () => {
    process.env.API_URL = "http://localhost:8000";
    process.env.SITE_ID = "04-hrzenith";
    const SECRET = "very-confidential-secret-key-123";
    process.env.SITE_SECRET = SECRET;

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Fetch failed"))
    );

    await getSiteConfig();
    const calls = warnSpy.mock.calls.flat().join(" ");
    expect(calls).not.toContain(SECRET);
  });

  it("updates primaryColor when backend provides custom color", async () => {
    process.env.API_URL = "http://localhost:8000";
    process.env.SITE_ID = "04-hrzenith";
    process.env.SITE_SECRET = "secret-1234567890";

    const mockResponse = {
      branding: {
        primary_color: "#10B981",
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const config = await getSiteConfig();
    expect(config.branding.primaryColor).toBe("#10B981");
    expect(config.branding.primary_color).toBe("#10B981");
  });
});
