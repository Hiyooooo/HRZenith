import type { BrandColors } from "./types";
import { isHexColor } from "./validators";

function sRgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * sRgbToLinear(r) +
    0.7152 * sRgbToLinear(g) +
    0.0722 * sRgbToLinear(b)
  );
}

export function contrastRatioVsWhite(r: number, g: number, b: number): number {
  const lum = relativeLuminance(r, g, b);
  // White has luminance 1.0
  return (1.0 + 0.05) / (lum + 0.05);
}

function toHex2(c: number): string {
  const clamped = Math.max(0, Math.min(255, c));
  return clamped.toString(16).padStart(2, "0").toUpperCase();
}

export function deriveBrand(rawHex: unknown): BrandColors | null {
  if (!isHexColor(rawHex)) return null;

  const hex = rawHex.trim().toUpperCase();

  // Pure white cannot be used as primary brand color
  if (hex === "#FFFFFF") {
    return null;
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // hover = campur 14% hitam (target 0)
  const hoverR = Math.round(r + (0 - r) * 0.14);
  const hoverG = Math.round(g + (0 - g) * 0.14);
  const hoverB = Math.round(b + (0 - b) * 0.14);
  const hover = `#${toHex2(hoverR)}${toHex2(hoverG)}${toHex2(hoverB)}`;

  // tint = campur 92% putih (target 255)
  const tintR = Math.round(r + (255 - r) * 0.92);
  const tintG = Math.round(g + (255 - g) * 0.92);
  const tintB = Math.round(b + (255 - b) * 0.92);
  const tint = `#${toHex2(tintR)}${toHex2(tintG)}${toHex2(tintB)}`;

  // Tentukan warna teks di atas latar brand agar selalu kontras dan terbaca
  const lum = relativeLuminance(r, g, b);
  const onBrand = lum > 0.45 ? "#0F172A" : "#FFFFFF";

  return {
    brand: hex,
    hover,
    tint,
    onBrand,
  };
}
