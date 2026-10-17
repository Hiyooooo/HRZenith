# 07 — Integrasi Next.js dengan Admin Panel Laravel (WAJIB)

Situs ini membaca sebagian kecil konfigurasinya dari admin panel Laravel. **Prinsip utama: halaman tidak boleh rusak atau kosong apa pun kondisi API.** Setiap nilai dinamis punya default yang tertulis di kode, dan setiap nilai dari API divalidasi sebelum dipakai.

## 0. Ringkasan Aturan
1. Empat kunci di `.env.local`, **tanpa** awalan `NEXT_PUBLIC_`.
2. Data API hanya diambil di **Server Component** (modul `server-only`), tidak pernah di komponen klien.
3. Hanya bagian yang tercantum di §3 yang dinamis; desain, animasi, dan konten 5 modul tetap di komponen (§4).
4. Fallback per-bidang (bukan semua-atau-tidak-sama-sekali): bidang yang kosong atau tidak valid memakai default, bidang valid dari API tetap dipakai.
5. Durasi cache **hanya** dari `REVALIDATE_SECONDS`, melalui satu fungsi (§9).
6. Selesai bila `typecheck`, `build`, dan `test` hijau (§14).

## 1. Kunci Akses (`.env.local`)
```bash
# .env.local  (TIDAK di-commit. Diisi pemilik/DevOps)
API_URL=http://localhost:8000          # alamat backend Laravel (tanpa slash di akhir)
SITE_ID=hrzenith                       # ID unik website ini di admin panel
SITE_SECRET=                           # kunci otentikasi (rahasia)
REVALIDATE_SECONDS=300                 # durasi cache dalam detik
```
- **Jangan pernah** memakai `NEXT_PUBLIC_` pada keempatnya, agar tidak masuk ke bundel klien dan tidak terlihat pengunjung.
- Sediakan `.env.example` (di-commit) berisi keempat kunci dengan **nilai contoh/default** dan komentar di atas; **tanpa rahasia asli**. Pastikan `.gitignore` memuat `.env*.local` (bawaan `create-next-app` sudah, verifikasi).
- `SITE_SECRET` hanya dibaca di `lib/cms/get-site-config.ts` (dan `env.ts`); tidak boleh dikirim ke komponen, props, log, atau respons.
- Perilaku bila kunci hilang: lihat §5 (tanpa panggilan jaringan, langsung default).

## 2. Kontrak API (TERKONFIRMASI dari Admin Panel)
Endpoint dan skema API telah dikonfirmasi sesuai standar admin panel terpusat (Laravel 11) dan implementasi proyek seri sebelumnya.

**Permintaan**
```
GET {API_URL}/api/v1/site/config
X-Site-Id: {SITE_ID}
X-Site-Secret: {SITE_SECRET}
Accept: application/json
```
**Respons sukses** (HTTP 200, JSON; semua bidang opsional, bidang tak dikenal diabaikan):
```json
{
  "site": {
    "id": "04-hrzenith",
    "name": "HRZenith",
    "domain": "hrzenith.id"
  },
  "branding": {
    "logo_url": "https://cdn.contoh.id/logo.svg",
    "favicon_url": "https://cdn.contoh.id/favicon.png",
    "primary_color": "#1E3A8A"
  },
  "hero": {
    "headline": "…",
    "subheadline": "…",
    "cta_text": "Jadwalkan Konsultasi"
  },
  "cta": {
    "whatsapp_number": "6281200000000",
    "whatsapp_message_template": "Halo HRZenith…",
    "whatsapp_url": "https://wa.me/6281200000000?text=Halo%20HRZenith…"
  },
  "contact": {
    "email": "halo@hrzenith.id",
    "phone": "+62 21 5000 0000",
    "social_links": [
      { "platform": "linkedin", "url": "https://www.linkedin.com/company/…" }
    ]
  },
  "footer_text": "© 2026 HRZenith. Seluruh hak dilindungi.",
  "tracking": {
    "ga_id": "G-XXXXXXXXXX",
    "meta_pixel_id": "1234567890"
  },
  "seo": {
    "meta_title": "…",
    "meta_description": "…",
    "keywords": ["HRIS", "Enterprise", "Audit Trail"],
    "og_image_url": "https://cdn.contoh.id/og.png"
  }
}
```
- Normalizer menerima respons langsung (root) maupun jika dibungkus `data: { ... }`.
- Bidang `contact.social_links` diterima dalam format array `[{ platform, url }]` maupun objek key-value `{ linkedin: url }`.
- Bidang URL (`logo_url`, `favicon_url`, `og_image_url`) mendukung resolusi URL relatif (awalan `/` diselesaikan dengan `{API_URL}`) melalui utilitas `resolveUrl`.
- Jika `cta.whatsapp_url` kosong tetapi `cta.whatsapp_number` ada, URL WhatsApp dirakit otomatis `https://wa.me/{number}?text={template}`.
- Status selain 200, JSON tidak valid, atau error jaringan ⇒ kembalikan konfigurasi default (`DEFAULT_SITE_CONFIG`).

## 3. Bagian yang Menjadi Dinamis
| Area | Bidang `SiteConfig` | Dipakai di | Default |
|---|---|---|---|
| Branding | `branding.logoUrl`, `branding.faviconUrl`, `branding.primaryColor` | `BrandLogo` (Navbar, Footer), `metadata.icons`, variabel tema (`--brand*`), `viewport.themeColor` | logo lokal `ui/Logo`, `/favicon.svg`, `#1E3A8A` |
| Hero | `hero.headline`, `hero.subheadline`, `hero.ctaText` | `Hero` (H1, paragraf, teks tombol primer) | Teks default `03` §1 |
| WhatsApp | `whatsapp.url` | Tombol WhatsApp di **Hero** dan **WhatsAppFloat** (pojok kanan bawah), `FinalCta` | Tautan placeholder (§7) |
| Footer & kontak | `contact.email`, `contact.phone`, `contact.address`, `contact.socials[]`, `contact.copyright` | `Footer`, blok kontak `FinalCta`, tautan `mailto:` CTA, JSON-LD `Organization.email` | Nilai default §7 |
| SEO & pelacakan | `seo.metaTitle`, `seo.metaDescription`, `seo.ogImageUrl`, `seo.gaId`, `seo.metaPixelId` | `generateMetadata` (title, description, `og:*`, `twitter:*`), `TrackingScripts` | Judul/deskripsi persis `05` §1; OG `/og-default`; tanpa pelacakan |

- Tombol CTA lain, tautan anchor, dan seluruh teks di luar tabel ini **tidak** dinamis.
- Nama merek "HRZenith" pada teks tetap statis. Logo dinamis hanya mengganti gambar logo.

## 4. Bagian yang TETAP Asli (jangan diubah menjadi dinamis)
- **Desain & animasi**: struktur tata letak, grid, efek visual, lebar halaman, responsivitas mobile, diagram, token statis.
- **Konten 5 modul** (Perizinan, Absensi, Gaji, Library, Exam): penjelasan, sub-fitur, demo interaktif, dan seluruh logika di `lib/*.ts` tetap ditulis di komponen Next.js.
- Section lain (perbandingan, edisi, implementasi, studi kasus, FAQ, teks CTA selain hero) tetap statis.

## 5. Arsitektur Kode (`src/lib/cms/`, semua server-only)
```
types.ts            // type SiteConfig + tipe turunan
defaults.ts         // DEFAULT_SITE_CONFIG, DEFAULT_REVALIDATE_SECONDS, API_TIMEOUT_MS
env.ts              // readCmsEnv(), parseRevalidate()
validators.ts       // isHexColor, isHttpsUrl, isWhatsAppUrl, isGaId, isPixelId, isEmail, isPhone, clampText
color.ts            // deriveBrand(hex): { brand, hover, tint } | null  (+ contrast)
endpoint.ts         // buildRequest(env): { url, headers }
normalize.ts        // normalizeSiteConfig(raw): SiteConfig (merge per-bidang di atas default)
get-site-config.ts  // getSiteConfig(): Promise<SiteConfig>  (tidak pernah melempar)
```
**`getSiteConfig()` (aturan wajib)**
1. Berkas diawali `import "server-only";`. Tidak ada komponen klien yang mengimpornya; komponen klien menerima data lewat **props** dari parent server.
2. Dibungkus `React.cache` agar `layout`, `generateMetadata`, dan `page` dalam satu render tidak memanggil berulang.
3. Jika `API_URL`, `SITE_ID`, atau `SITE_SECRET` kosong/tidak valid ⇒ **kembalikan `DEFAULT_SITE_CONFIG` tanpa panggilan jaringan**.
4. Panggil `fetch(url, { headers, next: { revalidate: <hasil parseRevalidate>, tags: ["site-config"] } })` dengan **timeout** (`API_TIMEOUT_MS`, konstanta bernama di `defaults.ts`, bukan di page/layout) memakai `AbortController`. Uji bahwa cache tetap bekerja; jika `signal` mengganggu cache pada versi Next terpasang, ganti dengan `Promise.race` + timer.
5. `try/catch` menyeluruh: jaringan gagal, timeout, status ≠ 200, `res.json()` gagal, hasil normalisasi error ⇒ `DEFAULT_SITE_CONFIG`. **Tidak pernah melempar** ke pemanggil.
6. Log: satu `console.warn` ringkas per kegagalan (jenis kegagalan saja, mis. `[cms] fallback: timeout`). **Dilarang** mencetak URL penuh dengan rahasia, header, `SITE_SECRET`, atau isi respons. (`console.warn` hanya boleh di `lib/cms/`.)
7. Hasil selalu lolos `normalizeSiteConfig`, sehingga komponen menerima objek `SiteConfig` **lengkap** (semua bidang terisi) dan tidak perlu memeriksa `null`.
8. Saat `next build`, bila API tidak tersedia, build **tetap sukses** dengan default.

**Pola komponen**
- `layout.tsx` (server): `const cfg = await getSiteConfig()` → menyuntik tema di `<html style>`, `generateMetadata`/`generateViewport`, `<TrackingScripts ids=… />`, meneruskan `cfg` ke `Navbar`, `Footer`, `WhatsAppFloat`.
- `page.tsx` (server): `await getSiteConfig()` → meneruskan bagian yang relevan ke `Hero`, `FinalCta`, dst.
- Komponen klien (`NavbarShell`, `ModuleTabs`, demo) hanya menerima props sederhana (string/boolean), tidak mengimpor `lib/cms`.

## 6. Validasi & Normalisasi (per bidang)
Merge: `final = { ...DEFAULT, ...bidangValidDariApi }` per bidang. String dipangkas (`trim`), kosong ⇒ default. **Semua string dirender sebagai teks biasa** (React meng-escape); dilarang `dangerouslySetInnerHTML` untuk data API.

| Bidang | Aturan valid | Jika tidak valid |
|---|---|---|
| `logoUrl` | URL `https:` atau path dimulai `/`; ekstensi `.svg/.png/.webp/.jpg/.jpeg`; ≤ 500 karakter | default (logo lokal) |
| `faviconUrl` | seperti logo, ekstensi tambahan `.ico` | `/favicon.svg` |
| `primaryColor` | `#RRGGBB` (6 heks, huruf besar/kecil → dinormalisasi besar) **dan** kontras terhadap putih ≥ 4,5:1 (§8) | `#1E3A8A` |
| `headline` | 1–120 karakter | default |
| `subheadline` | 1–320 karakter | default |
| `ctaText` | 1–40 karakter | `Jadwalkan Konsultasi` |
| `whatsapp.url` | `https:` dan host `wa.me` atau `api.whatsapp.com`; ≤ 600 karakter | tautan default |
| `email` | pola email sederhana, ≤ 120 | default |
| `phone` | `^[+0-9 ()\-]{6,24}$`; `tel:` memakai digit dan `+` saja | default |
| `address` | 1–240 karakter | default |
| `socials[]` | maks 6; tiap item `platform ∈ {linkedin, instagram, facebook, x, youtube, tiktok}` dan URL `https:` dengan host cocok platform (`linkedin.com`, `instagram.com`, `facebook.com`, `x.com`/`twitter.com`, `youtube.com`, `tiktok.com` atau subdomainnya); item tak valid dibuang | `[]` (blok disembunyikan) |
| `copyright` | 1–160 karakter | default |
| `metaTitle` | 1–70 karakter | judul default `05` §1 |
| `metaDescription` | 1–200 karakter | deskripsi default `05` §1 |
| `ogImageUrl` | URL `https:` absolut, ekstensi `.png/.jpg/.jpeg/.webp` | `/og-default` |
| `gaId` | `^G-[A-Z0-9]{4,20}$` | `null` (tidak dipasang) |
| `metaPixelId` | `^\d{8,20}$` | `null` (tidak dipasang) |

Contoh kasus uji normalizer (`normalize.test.ts`): objek kosong ⇒ default penuh; hanya `hero.headline` valid ⇒ headline dari API, sisanya default; `primary_color: "#F97316"` ⇒ default (kontras 2,80:1); `whatsapp.url: "https://evil.example/x"` ⇒ default; `socials` berisi satu `linkedin` valid + satu `instagram` ke `evil.example` ⇒ hanya yang valid; `gaId: "<script>"` ⇒ `null`; headline 500 karakter ⇒ default.

## 7. Nilai Cadangan (`defaults.ts`)
`DEFAULT_SITE_CONFIG` berisi **teks dan logo bawaan situs ini** (tidak boleh kosong; ini yang tampil bila API mati):
```ts
export const DEFAULT_REVALIDATE_SECONDS = 300;
export const API_TIMEOUT_MS = 4000;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  branding: { logoUrl: null /* → komponen Logo lokal */, faviconUrl: "/favicon.svg", primaryColor: "#1E3A8A" },
  hero: {
    headline: "Tata kelola SDM yang dapat diaudit, di seluruh organisasi.",
    subheadline: "Perizinan berjenjang dengan jejak audit yang dapat diverifikasi, keamanan informasi selaras ISO/IEC 27001, dan integrasi ke ERP Anda. Satu standar alur birokrasi untuk setiap cabang.",
    ctaText: "Jadwalkan Konsultasi",
  },
  whatsapp: { url: "https://wa.me/6281200000000?text=Halo%20HRZenith%2C%20saya%20ingin%20berkonsultasi%20mengenai%20platform%20HRIS%20enterprise." }, // PLACEHOLDER: nomor contoh
  contact: {
    email: "halo@hrzenith.id",                                   // PLACEHOLDER
    phone: "+62 21 5000 0000",                                    // PLACEHOLDER
    address: "Gedung Contoh Lantai 20, Jl. Jenderal Sudirman Kav. 00, Jakarta 10220", // PLACEHOLDER
    socials: [],
    copyright: "© 2026 HRZenith. Seluruh hak dilindungi.",
  },
  seo: {
    metaTitle: "HRZenith - Platform HRIS Enterprise untuk Skala Nasional & Global",
    metaDescription: "Standar tertinggi pengelolaan SDM, audit trail perizinan berjenjang, dan integrasi kepatuhan korporasi.",
    ogImageUrl: null /* → "/og-default" */, gaId: null, metaPixelId: null,
  },
};
```
- Nomor WhatsApp, email, telepon, alamat default adalah **placeholder**; tandai komentar dan laporkan.
- Default media sosial sengaja kosong agar tidak menaut ke akun orang lain.

## 8. Tema Warna Dinamis (brand)
Tujuan: warna tombol dan aksen mengikuti `primary_color` dari admin panel, tanpa mengubah layout.
- Token runtime: `--brand`, `--brand-hover`, `--brand-tint`; `--on-brand` selalu `#FFFFFF`. Default di `globals.css` (`02` §2) agar halaman benar walau API mati.
- **`deriveBrand(hex)`** (`lib/cms/color.ts`, fungsi murni): normalisasi huruf besar; tolak bila bukan `#RRGGBB`; hitung kontras dengan putih (rumus WCAG); **tolak bila < 4,5:1** (karena warna dipakai sebagai teks tautan dan latar tombol bertulisan putih); `hover = campur 14% hitam`, `tint = campur 92% putih`; campuran per kanal `Math.round(c + (target − c) × a)`. Hasil `{ brand, hover, tint }` atau `null` (⇒ default).
- Penyuntikan **server-side** di `layout.tsx`: `<html lang="id" style={{ "--brand": b.brand, "--brand-hover": b.hover, "--brand-tint": b.tint }}>` sehingga tema benar sejak render pertama (tanpa kilatan). `viewport.themeColor = brand`.
- Tailwind memetakan `bg-brand`, `text-brand`, `bg-brand-hover`, `bg-brand-tint` ke variabel (`02` §9). Dilarang menulis hex brand di komponen.

**Test vector (`color.test.ts`)**
| Input | Kontras vs putih | Hasil |
|---|---|---|
| `#1E3A8A` | 10,36 | `{ brand "#1E3A8A", hover "#1A3277", tint "#EDEFF6" }` |
| `#1e3a8a` (huruf kecil) | 10,36 | sama dengan di atas (dinormalisasi) |
| `#0F766E` | 5,47 | `{ "#0F766E", "#0D655F", "#ECF4F3" }` |
| `#1D4ED8` | 6,70 | `{ "#1D4ED8", "#1943BA", "#EDF1FC" }` |
| `#F97316` | 2,80 | `null` |
| `#3B82F6` | 3,68 | `null` |
| `#FFFFFF` | 1,00 | `null` |
| `1E3A8A`, `blue`, `#12345`, `#1E3A8AFF` | n/a | `null` |

Catatan: kontras `#FFFFFF` di atas `hover #1A3277` = 11,89:1.

## 9. Cache (ISR) dari `REVALIDATE_SECONDS`
**Satu sumber angka**: `parseRevalidate(raw?: string): number` di `env.ts`.
- Trim; hanya bilangan bulat desimal `1`–`86400`; selain itu (kosong, `undefined`, `abc`, `0`, `-5`, `12.5`, `86401`) ⇒ `DEFAULT_REVALIDATE_SECONDS` (300).
- Vektor (`env.test.ts`): `"300"→300` · `" 120 "→120` · `"60"→60` · `"86400"→86400` · `undefined→300` · `""→300` · `"abc"→300` · `"0"→300` · `"-5"→300` · `"12.5"→300` · `"86401"→300`.
- Dipakai **hanya** sebagai `next.revalidate` pada `fetch` di `get-site-config.ts`.

**Catatan teknis penting (jangan dilanggar)**
- Next.js mensyaratkan `export const revalidate = <literal>` pada route segment bersifat **literal statis**; nilai dari `process.env` tidak dapat dipakai di sana. Karena itu **dilarang** menulis `export const revalidate` di `page.tsx`/`layout.tsx` (baik angka maupun ekspresi). Durasi ISR halaman mengikuti `next.revalidate` pada `fetch` yang membaca konfigurasi.
- Dilarang `export const dynamic = "force-dynamic"` atau `cache: "no-store"` pada fetch konfigurasi (menghilangkan ISR).
- Bila API gagal dan default dipakai, halaman hasil render dapat tersimpan di cache hingga `REVALIDATE_SECONDS`. Itu diterima; laporkan. (Opsional: tidak menambah env baru; bila pemilik meminta pemicu segar, sediakan route handler `POST /api/revalidate` yang memverifikasi `Authorization: Bearer ${SITE_SECRET}` dengan perbandingan waktu-konstan lalu memanggil `revalidateTag("site-config")`. **Jangan menambah kunci env kelima.**)
- Verifikasi perilaku cache pada versi Next yang terpasang (mis. dengan `npm run build && npm start`, ubah mock API, tunggu melewati `REVALIDATE_SECONDS`, muat ulang dua kali).

## 10. Metadata, Favicon, OG, Pelacakan
- `generateMetadata()` di `layout.tsx` memakai `cfg.seo`: `title`, `description`, `openGraph` (`title`, `description`, `images: [{ url: ogImageUrl ?? "/og-default", width: 1200, height: 630, alt }]`), `twitter` (`summary_large_image`), `icons: { icon: cfg.branding.faviconUrl }`, `alternates.canonical: "/"`, `metadataBase` dari `site.url` (statis).
- **Jangan** memakai berkas file-convention `opengraph-image.tsx` (akan bersaing dengan `images` dinamis). Default OG dirender oleh route `src/app/og-default/route.tsx` (`ImageResponse`, 1200×630, desain `05` §3).
- **`TrackingScripts`** (server component, `next/script`): bila `gaId` valid ⇒ muat `https://www.googletagmanager.com/gtag/js?id=<gaId>` + inline `gtag('config', '<gaId>')` (string dibangun dari ID tervalidasi, bukan kode mentah dari admin); bila `metaPixelId` valid ⇒ inline Meta Pixel standar dengan ID tersebut. `strategy="afterInteractive"`. Kedua ID kosong ⇒ tidak merender apa pun. **Dilarang** memasukkan skrip bebas dari admin panel.
- Catatan privasi (laporkan): pelacakan perlu persetujuan sesuai kebijakan privasi/UU PDP; keputusan banner persetujuan ada di pemilik.
- JSON-LD `Organization` memakai `contact.email` dan logo dari konfigurasi (bila `logoUrl` absolut `https`); bila tidak, tanpa `logo`.
- `sitemap.ts` dan `robots.ts` memakai `site.url` statis.

## 11. Tombol WhatsApp (Hero dan Melayang)
- Kedua tombol memakai **`cfg.whatsapp.url` apa adanya** (tautan sudah memuat nomor tujuan dan draf pesan dari admin). **Dilarang** merakit URL dari nomor atau menambah/mengubah `text=`.
- `WhatsAppFloat` (server component, `02` §8) dirender di `layout.tsx`; tombol Hero di `Hero`; `FinalCta` memakai tautan yang sama.
- Atribut: `target="_blank" rel="noopener noreferrer"`, `aria-label` jelas.
- Jika tautan API tidak valid ⇒ tautan default (§7), tombol tetap berfungsi.

## 12. Footer & Kontak
- `Footer`: email (`mailto:`), telepon (`tel:` dari digit), alamat (teks), media sosial (tautan teks, blok disembunyikan bila kosong), baris copyright dari konfigurasi.
- Blok kontak `FinalCta` dan tautan `mailto:` pada CTA memakai `contact.email`.

## 13. Pengujian
- `vitest.config.ts`: alias `server-only` ke modul kosong (mis. `src/test/server-only-stub.ts`) agar impor di uji tidak melempar.
- Uji unit murni: `parseRevalidate`, `validators`, `deriveBrand`, `normalizeSiteConfig` (kasus §6), `buildRequest`.
- Uji `getSiteConfig` dengan `vi.stubGlobal("fetch", …)`: (1) env kosong ⇒ `fetch` tidak dipanggil, hasil = default; (2) fetch menolak/timeout ⇒ default; (3) HTTP 500 ⇒ default; (4) JSON rusak ⇒ default; (5) respons parsial ⇒ gabungan per bidang; (6) opsi `fetch` memuat `next.revalidate` = hasil `parseRevalidate(env)` dan `tags: ["site-config"]`; (7) header `X-Site-Id` dan `X-Site-Secret` terkirim tetapi `SITE_SECRET` tidak pernah muncul di keluaran `console.warn`.
- `scripts/mock-cms.mjs` (Node murni, tanpa dependensi): `node scripts/mock-cms.mjs` melayani kontrak §2 di `http://localhost:8000` dengan verifikasi header `X-Site-Id: 04-hrzenith` dan `X-Site-Secret: test-secret`; dapat dijalankan dengan varian `--fail` (HTTP 500) dan `--slow` (respons > `API_TIMEOUT_MS`).
- Seluruh uji lama (approval, audit, sync, score360, compliance, slip, library) **tetap hijau**.

## 14. Kriteria Selesai (WAJIB, urut)
1. `npm run typecheck` (`tsc --noEmit`) tanpa error.
2. `npm run build` sukses 100% tanpa pesan error **dalam tiga kondisi**: (a) tanpa `.env.local`, (b) `API_URL` menunjuk host tak terjangkau, (c) mock API valid (`SITE_SECRET=test-secret`).
3. `npm test` semua hijau.
4. Pemeriksaan manual: dengan mock valid, ubah headline/warna/WhatsApp/footer di mock → setelah melewati `REVALIDATE_SECONDS` halaman memperlihatkan perubahan; dengan `--fail` halaman tampil normal dengan default; dengan warna `#F97316` brand tetap default.
5. Audit keamanan & aturan (semua **tanpa hasil**):
```bash
# kredensial tidak boleh bocor ke klien
grep -rnE "NEXT_PUBLIC_(API_URL|SITE_ID|SITE_SECRET|REVALIDATE_SECONDS)" src .env.example .env.local next.config.ts 2>/dev/null
grep -rn "SITE_SECRET" src | grep -v -e "lib/cms/env.ts" -e "lib/cms/get-site-config.ts" -e "\.test\.ts"
# pengambilan data API hanya di server
grep -rln "lib/cms" src/components | xargs -r grep -ln "use client"
grep -rn "server-only" src/lib/cms/get-site-config.ts
# tidak ada angka cache hardcode di page/layout
grep -rnE "export const (revalidate|dynamic)" src/app
grep -rnE "revalidate:\s*[0-9]" src
# string API tidak dirender sebagai HTML
grep -rn "dangerouslySetInnerHTML" src | grep -v "schema"
```
(Baris `grep "server-only"` harus **ada** hasilnya. Pengecualian sah `dangerouslySetInnerHTML`: hanya JSON-LD dari objek terkontrol.)

## 15. Laporan Tambahan (selain `05` §10)
- Asumsi kontrak API (endpoint, header, bentuk JSON) dan berkas yang perlu disesuaikan.
- Hasil tiga kondisi build, hasil `typecheck`, `test`, dan uji manual cache.
- Daftar bidang dinamis dan nilai default yang aktif.
- Keputusan pemilik: kontrak API final; nomor WhatsApp, email, telepon, alamat asli; kebijakan pelacakan/persetujuan; perlu tidaknya pemicu revalidate on-demand.
