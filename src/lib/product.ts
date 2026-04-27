import type { Product, ProductVariant } from "@/types";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop";

export function productImage(p?: Product | null, variantIndex?: number): string {
  if (!p) return FALLBACK_IMG;
  if (variantIndex != null && p.variants?.[variantIndex]?.image) {
    const img = p.variants[variantIndex].image!;
    return img.secureUrl || img.url || FALLBACK_IMG;
  }
  if (p.featured_image)
    return p.featured_image.secureUrl || p.featured_image.url || FALLBACK_IMG;
  if (p.images?.[0]) return p.images[0].secureUrl || p.images[0].url || FALLBACK_IMG;
  if (p.variants?.[0]?.image) {
    const img = p.variants[0].image!;
    return img.secureUrl || img.url || FALLBACK_IMG;
  }
  return FALLBACK_IMG;
}

export function effectivePrice(p?: Product | null, variantIndex?: number): number {
  if (!p) return 0;
  const idx = variantIndex ?? 0;
  const v: ProductVariant | undefined = p.variants?.[idx];
  if (v?.price != null) return Number(v.price) || 0;
  return Number(p.price) || 0;
}

export function inStock(p?: Product | null, variantIndex?: number): boolean {
  if (!p) return false;
  const v = p.variants?.[variantIndex ?? 0];
  if (v) return (v.stock ?? 0) > 0;
  return (p.stock ?? 0) > 0;
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
