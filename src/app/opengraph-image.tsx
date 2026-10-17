import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/cms/get-site-config";

export const alt = "HRZenith: Platform HRIS Enterprise Skala Nasional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const config = await getSiteConfig();
  const ogImageUrl = config.seo.ogImageUrl || config.seo.og_image_url;

  // 1. Jika ada banner eksternal yang diunggah dari Admin Panel:
  if (ogImageUrl && ogImageUrl.trim() !== "") {
    try {
      const res = await fetch(ogImageUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const mime = res.headers.get("content-type") || "image/png";
        return new Response(buffer, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (err) {
      console.warn("[OG Image] Fallback ke visual card bawaan:", err);
    }
  }

  // 2. Banner visual card bawaan (Enterprise Style)
  const headline = config.hero.headline || "Tata kelola SDM yang dapat diaudit.";
  const brandColor = config.branding.primaryColor || "#1E3A8A";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: brandColor,
          padding: "64px",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        {/* Kolom Kiri: Branding & Value Proposition */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "560px",
          }}
        >
          {/* Logo Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "4px",
                backgroundColor: brandColor,
                border: "2px solid rgba(255, 255, 255, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7V13C3 18 7 21 12 22C17 21 21 18 21 13V7L12 2Z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              HRZenith
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.15,
              marginBottom: "20px",
              letterSpacing: "-0.015em",
            }}
          >
            {headline}
          </div>

          <div
            style={{
              fontSize: "20px",
              color: "#E2E8F0",
              lineHeight: 1.5,
              marginBottom: "32px",
            }}
          >
            Platform HRIS Enterprise untuk BUMN, institusi finansial, dan konglomerat berskala nasional & global.
          </div>

          {/* Tiga Pilar */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "14px",
              color: "#93C5FD",
              fontFamily: "monospace",
            }}
          >
            <span>Perizinan Berjenjang</span>
            <span>•</span>
            <span>Audit Trail SHA-256</span>
            <span>•</span>
            <span>Integrasi ERP</span>
          </div>
        </div>

        {/* Kolom Kanan: Kartu Rantai Persetujuan & Log Hash */}
        <div
          style={{
            width: "480px",
            backgroundColor: "#FFFFFF",
            borderRadius: "4px",
            border: "1px solid #CBD5E1",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #E2E8F0",
              paddingBottom: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                color: "#475569",
                fontWeight: 700,
              }}
            >
              RANTAI PERSETUJUAN MULTI-TIER
            </div>
            <div
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                backgroundColor: "#DCFCE7",
                color: "#166534",
                borderRadius: "2px",
                fontWeight: 700,
              }}
            >
              HASH TERVERIFIKASI
            </div>
          </div>

          {/* 4 Kotak Alur: Staff -> Spv -> Manager -> HRD Director */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            {["Staff", "Spv", "Manager", "HRD"].map((tier, idx) => (
              <div key={tier} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#F1F5F9",
                    border: "1px solid #CBD5E1",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: brandColor,
                  }}
                >
                  {tier}
                </div>
                {idx < 3 && (
                  <div
                    style={{
                      margin: "0 6px",
                      color: "#94A3B8",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 3 Baris Tabel Audit Trail Hash */}
          <div
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              borderTop: "1px solid #E2E8F0",
              paddingTop: "14px",
            }}
          >
            <div
              style={{
                color: "#64748B",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Log Berantai SHA-256 (Immutable)
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#1E293B",
              }}
            >
              <span>[08:15] Pengajuan Cuti (Budi S.)</span>
              <span style={{ color: brandColor, fontWeight: 700 }}>
                #b71a50df
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#1E293B",
              }}
            >
              <span>[09:30] Persetujuan Supervisor (Ahmad)</span>
              <span style={{ color: brandColor, fontWeight: 700 }}>
                #6203c9c9
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#1E293B",
              }}
            >
              <span>[11:05] Pengesahan Final HRD (Dewi R.)</span>
              <span style={{ color: "#166534", fontWeight: 700 }}>
                #fa1c6fc4 [OK]
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
