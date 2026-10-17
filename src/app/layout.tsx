import type { Metadata, Viewport } from "next";
import { Public_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { getSiteConfig } from "@/lib/cms/get-site-config";
import { deriveBrand } from "@/lib/cms/color";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { TrackingScripts } from "@/components/ui/TrackingScripts";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, branding } = await getSiteConfig();
  const og = seo.ogImageUrl || "/og-default";

  return {
    metadataBase: new URL(site.url),
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: "/",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: "HRZenith: Alur persetujuan berjenjang dan audit trail kepatuhan enterprise",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [og],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: branding.faviconUrl || "/favicon.svg",
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { branding } = await getSiteConfig();
  return {
    themeColor: branding.primaryColor,
    width: "device-width",
    initialScale: 1,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  const derived = deriveBrand(config.branding.primaryColor);

  const brandColor = derived?.brand || config.branding.primaryColor || "#1E3A8A";
  const brandHover = derived?.hover || "#1A3277";
  const brandTint = derived?.tint || "#EDEFF6";
  const onBrand = derived?.onBrand || "#FFFFFF";

  const brandStyles = {
    "--brand": brandColor,
    "--primary": brandColor,
    "--brand-hover": brandHover,
    "--primary-hover": brandHover,
    "--brand-tint": brandTint,
    "--primary-tint": brandTint,
    "--on-brand": onBrand,
    "--on-primary": onBrand,
  } as React.CSSProperties;

  return (
    <html
      lang="id"
      className={`${publicSans.variable} ${robotoMono.variable}`}
      style={brandStyles}
    >
      <head>
        {/* Dynamic Theme Colors from Admin Panel */}
        <style
          id="admin-theme-colors"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand: ${brandColor};
                --primary: ${brandColor};
                --brand-hover: ${brandHover};
                --primary-hover: ${brandHover};
                --brand-tint: ${brandTint};
                --primary-tint: ${brandTint};
                --on-brand: ${onBrand};
                --on-primary: ${onBrand};
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-canvas text-ink antialiased">
        {/* Aksesibilitas: Lewati ke konten */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-ink text-white px-4 py-2 rounded-[4px] font-semibold text-sm outline-none"
        >
          Lewati ke konten utama
        </a>

        {/* Pelacakan (Hanya terpasang jika ID valid) */}
        <TrackingScripts
          gaId={config.tracking.ga_id}
          metaPixelId={config.tracking.meta_pixel_id}
        />

        <UtilityBar email={config.contact.email} />
        <Navbar config={config} />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer config={config} />
        <WhatsAppFloat whatsappUrl={config.whatsapp.url} />
      </body>
    </html>
  );
}
