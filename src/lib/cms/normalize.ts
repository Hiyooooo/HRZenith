import { DEFAULT_SITE_CONFIG } from "./defaults";
import type { SiteConfig, SocialLink } from "./types";
import {
  clampText,
  isEmail,
  isGaId,
  isHttpsUrl,
  isPhone,
  isPixelId,
  isWhatsAppUrl,
  resolveUrl,
} from "./validators";
import { deriveBrand } from "./color";

const ALLOWED_PLATFORMS = new Set([
  "linkedin",
  "instagram",
  "facebook",
  "x",
  "twitter",
  "youtube",
  "tiktok",
]);

const PLATFORM_LABEL_MAP: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  facebook: "Facebook",
  tiktok: "TikTok",
  x: "X (Twitter)",
  twitter: "X (Twitter)",
};

function sanitizeSocialUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== "string") return null;
  let url = rawUrl.trim();
  if (!url) return null;

  // Auto-Fix awalan https:// jika user mengetik tanpa protocol atau http://
  if (url.startsWith("http://")) {
    url = "https://" + url.slice(7);
  } else if (!url.startsWith("https://")) {
    url = "https://" + url;
  }

  return url;
}

function isValidSocialHost(platform: string, urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();

    switch (platform) {
      case "linkedin":
        return host === "linkedin.com" || host.endsWith(".linkedin.com");
      case "instagram":
        return (
          host === "instagram.com" ||
          host.endsWith(".instagram.com") ||
          host === "instagr.am" ||
          host.endsWith(".instagr.am")
        );
      case "facebook":
        return host === "facebook.com" || host.endsWith(".facebook.com");
      case "x":
      case "twitter":
        return (
          host === "x.com" ||
          host.endsWith(".x.com") ||
          host === "twitter.com" ||
          host.endsWith(".twitter.com")
        );
      case "youtube":
        return (
          host === "youtube.com" ||
          host.endsWith(".youtube.com") ||
          host === "youtu.be"
        );
      case "tiktok":
        return host === "tiktok.com" || host.endsWith(".tiktok.com");
      default:
        return false;
    }
  } catch {
    return false;
  }
}

export function normalizeSocialLinks(rawSocials: unknown): SocialLink[] {
  const result: SocialLink[] = [];

  const processEntry = (rawPlatform: string, rawUrl: unknown) => {
    const platformKey = rawPlatform.toLowerCase().trim();
    if (!platformKey || !ALLOWED_PLATFORMS.has(platformKey)) return;

    const cleanedUrl = sanitizeSocialUrl(rawUrl);
    if (!cleanedUrl) return;

    if (isValidSocialHost(platformKey, cleanedUrl)) {
      const prettyName =
        PLATFORM_LABEL_MAP[platformKey] ||
        (platformKey.charAt(0).toUpperCase() + platformKey.slice(1));
      result.push({
        platform: platformKey,
        name: prettyName,
        url: cleanedUrl,
      });
    }
  };

  if (Array.isArray(rawSocials)) {
    for (const item of rawSocials) {
      if (item && typeof item === "object") {
        const platform = String(
          (item as { platform?: string; name?: string }).platform ||
            (item as { platform?: string; name?: string }).name ||
            ""
        );
        const url = (item as { url?: unknown }).url;
        processEntry(platform, url);
      }
    }
  } else if (
    rawSocials &&
    typeof rawSocials === "object" &&
    rawSocials !== null
  ) {
    for (const [key, val] of Object.entries(rawSocials)) {
      processEntry(key, val);
    }
  }

  return result.slice(0, 6);
}

// Record<string, any> is avoided; using unknown and narrowing
export function normalizeSiteConfig(
  raw: unknown,
  cleanApiUrl?: string
): SiteConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_SITE_CONFIG };
  }

  const rawObj = raw as Record<string, unknown>;
  const data =
    rawObj.data && typeof rawObj.data === "object"
      ? (rawObj.data as Record<string, unknown>)
      : rawObj;

  const rawBranding =
    data.branding && typeof data.branding === "object"
      ? (data.branding as Record<string, unknown>)
      : {};
  const rawHero =
    data.hero && typeof data.hero === "object"
      ? (data.hero as Record<string, unknown>)
      : {};
  const rawCta =
    data.cta && typeof data.cta === "object"
      ? (data.cta as Record<string, unknown>)
      : {};
  const rawWhatsapp =
    data.whatsapp && typeof data.whatsapp === "object"
      ? (data.whatsapp as Record<string, unknown>)
      : {};
  const rawContact =
    data.contact && typeof data.contact === "object"
      ? (data.contact as Record<string, unknown>)
      : {};
  const rawTracking =
    data.tracking && typeof data.tracking === "object"
      ? (data.tracking as Record<string, unknown>)
      : {};
  const rawSeo =
    data.seo && typeof data.seo === "object"
      ? (data.seo as Record<string, unknown>)
      : {};
  const rawSite =
    data.site && typeof data.site === "object"
      ? (data.site as Record<string, unknown>)
      : {};

  // Site info
  const siteId =
    clampText(rawSite.id, 1, 64) ?? DEFAULT_SITE_CONFIG.site.id;
  const siteName =
    clampText(rawSite.name, 1, 64) ?? DEFAULT_SITE_CONFIG.site.name;
  const siteDomain =
    clampText(rawSite.domain, 1, 128) ?? DEFAULT_SITE_CONFIG.site.domain;

  // Branding
  const resolvedLogo = resolveUrl(
    (rawBranding.logo_url as string) || (rawBranding.logoUrl as string),
    cleanApiUrl
  );
  const logoValid =
    isHttpsUrl(resolvedLogo, 500) &&
    /\.(svg|png|webp|jpg|jpeg)$/i.test(resolvedLogo.split("?")[0]);
  const logoUrl = logoValid ? resolvedLogo : DEFAULT_SITE_CONFIG.branding.logoUrl;

  const resolvedFavicon = resolveUrl(
    (rawBranding.favicon_url as string) || (rawBranding.faviconUrl as string),
    cleanApiUrl
  );
  const faviconValid =
    isHttpsUrl(resolvedFavicon, 500) &&
    /\.(ico|svg|png)$/i.test(resolvedFavicon.split("?")[0]);
  const faviconUrl = faviconValid
    ? resolvedFavicon
    : DEFAULT_SITE_CONFIG.branding.faviconUrl;

  const rawColor =
    (rawBranding.primary_color as string) ||
    (rawBranding.primaryColor as string);
  const derivedBrand = deriveBrand(rawColor);
  const primaryColor = derivedBrand
    ? derivedBrand.brand
    : DEFAULT_SITE_CONFIG.branding.primaryColor;

  // Hero
  const headline =
    clampText(rawHero.headline, 1, 120) ?? DEFAULT_SITE_CONFIG.hero.headline;
  const subheadline =
    clampText(rawHero.subheadline, 1, 320) ??
    DEFAULT_SITE_CONFIG.hero.subheadline;
  const ctaText =
    clampText(rawHero.cta_text || rawHero.ctaText, 1, 40) ??
    DEFAULT_SITE_CONFIG.hero.ctaText;

  // WhatsApp & CTA
  const rawWaUrl =
    (rawCta.whatsapp_url as string) || (rawWhatsapp.url as string);
  let whatsappUrl = DEFAULT_SITE_CONFIG.whatsapp.url;

  if (isWhatsAppUrl(rawWaUrl)) {
    whatsappUrl = rawWaUrl.trim();
  } else if (rawCta.whatsapp_number && isPhone(rawCta.whatsapp_number)) {
    const cleanNum = String(rawCta.whatsapp_number).replace(/[^0-9]/g, "");
    const template = String(rawCta.whatsapp_message_template || "");
    whatsappUrl = `https://wa.me/${cleanNum}${
      template ? `?text=${encodeURIComponent(template)}` : ""
    }`;
  }

  const whatsappNumber =
    clampText(rawCta.whatsapp_number, 1, 32) ??
    DEFAULT_SITE_CONFIG.cta.whatsapp_number;
  const whatsappTemplate =
    clampText(rawCta.whatsapp_message_template, 1, 200) ??
    DEFAULT_SITE_CONFIG.cta.whatsapp_message_template;

  // Contact
  const email = isEmail(rawContact.email)
    ? (rawContact.email as string).trim()
    : DEFAULT_SITE_CONFIG.contact.email;
  const phone = isPhone(rawContact.phone)
    ? (rawContact.phone as string).trim()
    : DEFAULT_SITE_CONFIG.contact.phone;
  const address =
    clampText(rawContact.address, 1, 240) ??
    DEFAULT_SITE_CONFIG.contact.address;
  const socialLinks = normalizeSocialLinks(
    rawContact.social_links || rawContact.socials
  );
  const copyright =
    clampText(data.footer_text || rawContact.copyright, 1, 160) ??
    DEFAULT_SITE_CONFIG.contact.copyright;

  // Tracking
  const gaId =
    isGaId(rawTracking.ga_id)
      ? (rawTracking.ga_id as string).trim()
      : isGaId(rawSeo.google_analytics_id)
      ? (rawSeo.google_analytics_id as string).trim()
      : null;

  const metaPixelId =
    isPixelId(rawTracking.meta_pixel_id)
      ? (rawTracking.meta_pixel_id as string).trim()
      : isPixelId(rawSeo.meta_pixel_id)
      ? (rawSeo.meta_pixel_id as string).trim()
      : null;

  // SEO
  const metaTitle =
    clampText(rawSeo.meta_title || rawSeo.metaTitle, 1, 70) ??
    DEFAULT_SITE_CONFIG.seo.metaTitle;
  const metaDescription =
    clampText(rawSeo.meta_description || rawSeo.metaDescription, 1, 200) ??
    DEFAULT_SITE_CONFIG.seo.metaDescription;
  const keywords = Array.isArray(rawSeo.keywords)
    ? rawSeo.keywords
        .filter((k): k is string => typeof k === "string" && k.trim().length > 0)
        .map((k) => k.trim())
    : DEFAULT_SITE_CONFIG.seo.keywords;

  const resolvedOg = resolveUrl(
    (rawSeo.og_image_url as string) || (rawSeo.ogImageUrl as string),
    cleanApiUrl
  );
  const ogValid =
    isHttpsUrl(resolvedOg, 500) &&
    /\.(png|jpg|jpeg|webp)$/i.test(resolvedOg.split("?")[0]);
  const ogImageUrl = ogValid ? resolvedOg : DEFAULT_SITE_CONFIG.seo.ogImageUrl;

  return {
    site: {
      id: siteId,
      name: siteName,
      domain: siteDomain,
    },
    branding: {
      logoUrl,
      logo_url: logoUrl ?? "",
      faviconUrl,
      favicon_url: faviconUrl,
      primaryColor,
      primary_color: primaryColor,
    },
    hero: {
      headline,
      subheadline,
      ctaText,
      cta_text: ctaText,
    },
    whatsapp: {
      url: whatsappUrl,
    },
    cta: {
      whatsapp_number: whatsappNumber,
      whatsapp_message_template: whatsappTemplate,
      whatsapp_url: whatsappUrl,
    },
    contact: {
      email,
      phone,
      address,
      socials: socialLinks,
      social_links: socialLinks,
      copyright,
    },
    footer_text: copyright,
    tracking: {
      ga_id: gaId,
      meta_pixel_id: metaPixelId,
    },
    seo: {
      metaTitle,
      meta_title: metaTitle,
      metaDescription,
      meta_description: metaDescription,
      keywords,
      ogImageUrl,
      og_image_url: ogImageUrl ?? "",
      gaId,
      metaPixelId,
    },
  };
}
