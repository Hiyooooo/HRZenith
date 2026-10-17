#!/usr/bin/env node
import http from "node:http";

const PORT = 8000;
const args = process.argv.slice(2);
const isFail = args.includes("--fail");
const isSlow = args.includes("--slow");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/api/v1/site/config" && req.method === "GET") {
    const siteId = req.headers["x-site-id"];
    const siteSecret = req.headers["x-site-secret"];

    if (siteId !== "04-hrzenith" || siteSecret !== "test-secret") {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Unauthorized site credentials" }));
      return;
    }

    if (isFail) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error (simulated)" }));
      return;
    }

    const payload = {
      site: {
        id: "04-hrzenith",
        name: "HRZenith (Mock)",
        domain: "hrzenith.id",
      },
      branding: {
        logo_url: "",
        favicon_url: "/favicon.svg",
        primary_color: "#1E3A8A",
      },
      hero: {
        headline: "Tata kelola SDM yang dapat diaudit, di seluruh organisasi. (Mock)",
        subheadline:
          "Perizinan berjenjang dengan jejak audit yang dapat diverifikasi, keamanan informasi selaras ISO/IEC 27001, dan integrasi ke ERP Anda.",
        cta_text: "Jadwalkan Konsultasi",
      },
      cta: {
        whatsapp_number: "6281200000000",
        whatsapp_message_template: "Halo HRZenith dari mock server",
        whatsapp_url:
          "https://wa.me/6281200000000?text=Halo%20HRZenith%20dari%20mock%20server",
      },
      contact: {
        email: "halo@hrzenith.id",
        phone: "+62 21 5000 0000",
        address: "Gedung Contoh Lantai 20, Jl. Jenderal Sudirman Kav. 00, Jakarta",
        social_links: [
          { platform: "linkedin", url: "https://www.linkedin.com/company/hrzenith" },
        ],
      },
      footer_text: "© 2026 HRZenith Mock. Seluruh hak dilindungi.",
      tracking: {
        ga_id: null,
        meta_pixel_id: null,
      },
      seo: {
        meta_title: "HRZenith - Platform HRIS Enterprise (Mock)",
        meta_description:
          "Standar tertinggi pengelolaan SDM, audit trail perizinan berjenjang, dan integrasi kepatuhan korporasi.",
        keywords: ["HRIS Enterprise", "Audit Trail", "Mock"],
        og_image_url: "",
      },
    };

    const delay = isSlow ? 6000 : 0;
    setTimeout(() => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(payload));
    }, delay);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Mock CMS server running at http://localhost:${PORT}`);
  if (isFail) console.log("Mode: --fail (HTTP 500)");
  if (isSlow) console.log("Mode: --slow (Delay 6000ms)");
});
