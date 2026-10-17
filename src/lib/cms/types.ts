export interface SocialLink {
  platform?: string;
  name?: string;
  url: string;
}

export interface SiteConfig {
  site: {
    id: string;
    name: string;
    domain: string;
  };
  branding: {
    logoUrl: string | null;
    logo_url: string;
    faviconUrl: string;
    favicon_url: string;
    primaryColor: string;
    primary_color: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    cta_text: string;
  };
  whatsapp: {
    url: string;
  };
  cta: {
    whatsapp_number: string;
    whatsapp_message_template: string;
    whatsapp_url: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    socials: SocialLink[];
    social_links: SocialLink[];
    copyright: string;
  };
  footer_text: string;
  tracking: {
    ga_id: string | null;
    meta_pixel_id: string | null;
  };
  seo: {
    metaTitle: string;
    meta_title: string;
    metaDescription: string;
    meta_description: string;
    keywords: string[];
    ogImageUrl: string | null;
    og_image_url: string;
    gaId: string | null;
    metaPixelId: string | null;
  };
}

export interface BrandColors {
  brand: string;
  hover: string;
  tint: string;
  onBrand?: string;
}

export interface CmsEnv {
  apiUrl?: string;
  siteId?: string;
  siteSecret?: string;
  revalidateSeconds?: number;
}
