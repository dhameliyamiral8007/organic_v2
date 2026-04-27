import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, Leaf, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { Product } from "@/types";
import { effectivePrice, formatINR, inStock, productImage, stripHtml } from "@/lib/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProductReviews } from "@/components/ProductReviews";

const fetchProduct = async (id: string): Promise<Product> =>
  unwrap<Product>(await api.get(`/api/products/${id}`));

const ProductDetail = () => {
  const { id = "" } = useParams();
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container-wide py-12 grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square bg-muted rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 bg-muted rounded" />
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-12 w-1/2 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container-wide py-20 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Button asChild variant="hero" className="mt-6"><Link to="/products">Back to shop</Link></Button>
      </div>
    );
  }

  const variants = product.variants || [];
  const price = effectivePrice(product, variantIdx);
  const mrp = Number(product.price) || 0;
  const showMrp = variants[variantIdx]?.price != null && mrp > 0 && mrp > price;
  const available = inStock(product, variantIdx);
  const wished = has(product.id);
  const rating = Number(product.rating) || 0;

  const gallery: string[] = [
    productImage(product, variantIdx),
    ...(product.images || []).map((i) => i.secureUrl || i.url || "").filter(Boolean),
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  const mainImg = gallery[imgIdx] || gallery[0];

  return (
    <div className="container-wide py-8 md:py-12">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary">Shop</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary capitalize">
              {product.category}
            </Link>
          </>
        )}
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-card rounded-2xl border border-border overflow-hidden">
            <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={cn(
                    "h-20 w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-smooth",
                    imgIdx === i ? "border-primary" : "border-border hover:border-primary/50"
                  )}
                >
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.is_organic && (
              <span className="bg-leaf text-leaf-foreground text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                <Leaf className="h-3 w-3" /> Organic
              </span>
            )}
            {product.category && (
              <span className="bg-secondary text-secondary-foreground text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full capitalize">
                {product.category}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{product.name}</h1>
          {product.subtitle && (
            <p className="text-muted-foreground mt-2">{product.subtitle}</p>
          )}

          <div className="flex items-center gap-3 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{rating ? rating.toFixed(1) : "New"}</span>
            </div>
            {!!product.review_count && (
              <span className="text-muted-foreground">({product.review_count} reviews)</span>
            )}
            {product.marketed_by && (
              <span className="text-muted-foreground">· by {product.marketed_by}</span>
            )}
          </div>

          <div className="flex items-end gap-3 mt-6">
            <span className="font-display text-4xl font-bold text-primary">{formatINR(price)}</span>
            {showMrp && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatINR(mrp)}</span>
                <span className="text-sm font-semibold text-leaf">
                  {Math.round(((mrp - price) / mrp) * 100)}% off
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes · Free shipping above ₹499</p>

          {variants.length > 0 && (
            <div className="mt-6">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pack size</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => { setVariantIdx(i); setImgIdx(0); }}
                    className={cn(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-smooth",
                      variantIdx === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary"
                    )}
                  >
                    {v.label} · {formatINR(Number(v.price))}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-border rounded-full overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-secondary"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 hover:bg-secondary"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className={cn("text-sm font-medium", available ? "text-leaf" : "text-destructive")}>
              {available ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="hero"
              size="lg"
              disabled={!available}
              onClick={() => {
                add(product, qty, variantIdx);
                toast.success(`Added ${qty} × ${product.name}`);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> Add to cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => {
                toggle(product);
                toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
              }}
            >
              <Heart className={cn("h-4 w-4 mr-1", wished && "fill-destructive text-destructive")} />
              {wished ? "Wishlisted" : "Wishlist"}
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-center">
            {[
              { i: Truck, t: "Free Delivery" },
              { i: ShieldCheck, t: "Quality Promise" },
              { i: Leaf, t: "100% Organic" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="bg-secondary rounded-xl p-3 flex flex-col items-center gap-1">
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl font-bold mb-4">About this product</h2>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
            {stripHtml(product.description)}
          </p>
        </section>
      )}

      {/* Reviews */}
      <ProductReviews productId={id} />
    </div>
  );
};

export default ProductDetail;
