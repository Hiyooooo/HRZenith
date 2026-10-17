import { describe, it, expect } from "vitest";
import { normalizeSiteConfig } from "./normalize";
import { DEFAULT_SITE_CONFIG } from "./defaults";

describe("normalizeSiteConfig", () => {
  it("returns full default config for empty object or invalid input", () => {
    expect(normalizeSiteConfig(null)).toEqual(DEFAULT_SITE_CONFIG);
    expect(normalizeSiteConfig({})).toEqual(DEFAULT_SITE_CONFIG);
    expect(normalizeSiteConfig("invalid string")).toEqual(DEFAULT_SITE_CONFIG);
  });

  it("partially overrides only valid fields", () => {
    const raw = {
      hero: {
        headline: "Headline Khusus Enterprise HRIS",
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.hero.headline).toBe("Headline Khusus Enterprise HRIS");
    expect(res.hero.subheadline).toBe(DEFAULT_SITE_CONFIG.hero.subheadline);
    expect(res.branding.primaryColor).toBe(DEFAULT_SITE_CONFIG.branding.primaryColor);
  });

  it("accepts custom primary color from admin panel", () => {
    const raw = {
      branding: {
        primary_color: "#F97316",
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.branding.primaryColor).toBe("#F97316");
  });

  it("falls back to default primary color when invalid color is provided", () => {
    const raw = {
      branding: {
        primary_color: "not-a-color",
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.branding.primaryColor).toBe(DEFAULT_SITE_CONFIG.branding.primaryColor);
  });

  it("rejects invalid whatsapp url and uses fallback", () => {
    const raw = {
      cta: {
        whatsapp_url: "https://evil.example.com/phishing",
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.cta.whatsapp_url).toBe(DEFAULT_SITE_CONFIG.cta.whatsapp_url);
  });

  it("constructs whatsapp url from phone and template if url missing", () => {
    const raw = {
      cta: {
        whatsapp_number: "+62 812 3456 7890",
        whatsapp_message_template: "Halo HRZenith Demo",
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.cta.whatsapp_url).toContain("https://wa.me/6281234567890?text=Halo%20HRZenith%20Demo");
  });

  it("filters social links with invalid hosts or XSS payloads", () => {
    const raw = {
      contact: {
        social_links: [
          { platform: "linkedin", url: "https://www.linkedin.com/company/hrzenith" },
          { platform: "instagram", url: "https://evil.example.com/fake" },
          { platform: "x", url: "https://x.com/hrzenith" },
        ],
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.contact.social_links).toHaveLength(2);
    expect(res.contact.social_links[0].platform).toBe("linkedin");
    expect(res.contact.social_links[1].platform).toBe("x");
  });

  it("auto-fixes http and missing protocol for social links (like instagram) and formats labels", () => {
    const raw = {
      contact: {
        social_links: {
          instagram: "http://instagram.com/HRZenith.id",
          facebook: "facebook.com/hrzenith",
          linkedin: "https://linkedin.com/company/hrzenith",
          youtube: "",
        },
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.contact.social_links).toHaveLength(3);

    const ig = res.contact.social_links.find((s) => s.platform === "instagram");
    expect(ig).toBeDefined();
    expect(ig?.url).toBe("https://instagram.com/HRZenith.id");
    expect(ig?.name).toBe("Instagram");

    const fb = res.contact.social_links.find((s) => s.platform === "facebook");
    expect(fb).toBeDefined();
    expect(fb?.url).toBe("https://facebook.com/hrzenith");
    expect(fb?.name).toBe("Facebook");
  });

  it("rejects script tags or invalid tracking ids", () => {
    const raw = {
      tracking: {
        ga_id: "<script>alert(1)</script>",
        meta_pixel_id: "not-a-number",
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.tracking.ga_id).toBeNull();
    expect(res.tracking.meta_pixel_id).toBeNull();
  });

  it("rejects headline longer than 120 characters", () => {
    const raw = {
      hero: {
        headline: "A".repeat(121),
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.hero.headline).toBe(DEFAULT_SITE_CONFIG.hero.headline);
  });

  it("handles data wrapped in data: { ... }", () => {
    const raw = {
      data: {
        hero: {
          headline: "Judul Dalam Pembungkus Data",
        },
      },
    };
    const res = normalizeSiteConfig(raw);
    expect(res.hero.headline).toBe("Judul Dalam Pembungkus Data");
  });
});
