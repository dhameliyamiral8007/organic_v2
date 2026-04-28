import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Truck, Leaf, Heart } from "lucide-react";
import type { Product } from "@/types";
import { effectivePrice, formatINR, inStock, productImage, stripHtml } from "@/lib/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
}

const deliveryDates = () => {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const today = new Date();
  const free = new Date(today);
  free.setDate(today.getDate() + 4);
  const fast = new Date(today);
  fast.setDate(today.getDate() + 2);
  return { free: fmt(free), fast: fmt(fast) };
};

export const ProductListRow = ({ product }: Props) => {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [selectedVariant, setSelectedVariant] = useState(0);

  const price = effectivePrice(product, selectedVariant);
  const mrp = Number(product.price) || 0;
  const showMrp = product.variants?.[selectedVariant]?.price != null && mrp > price;
  const discount = showMrp ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const wished = has(product.id);
  const available = inStock(product, selectedVariant);
  const rating = Number(product.rating) || 0;
  const { free, fast } = deliveryDates();
  const desc = stripHtml(product.description || product.subtitle || "");

  return (
    <article className="group bg-card border border-border rounded-xl p-3 sm:p-4 hover:shadow-soft transition-smooth">
      <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[200px_1fr] gap-3 sm:gap-6">
        {/* Image */}
        <Link
          to={`/products/${product.id}`}
          className="relative block aspect-square bg-muted rounded-lg overflow-hidden"
        >
          <img
            src={productImage(product, selectedVariant)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-smooth duration-500"
          />
          {product.is_organic && (
            <span className="absolute top-1.5 left-1.5 bg-leaf text-leaf-foreground text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Leaf className="h-2.5 w-2.5" /> Organic
            </span>
          )}
        </Link>

        {/* Details */}
        <div className="flex flex-col min-w-0">
          <Link to={`/products/${product.id}`} className="block">
            <h2 className="font-medium text-sm sm:text-lg leading-snug text-primary hover:text-accent transition-smooth line-clamp-2">
              {product.name}
            </h2>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5 text-xs sm:text-sm">
            <span className="font-medium text-foreground">{rating ? rating.toFixed(1) : "New"}</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i <= Math.round(rating)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            {!!product.review_count && (
              <a href="#" className="text-primary hover:text-accent ml-1">
                ({product.review_count})
              </a>
            )}
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(idx);
                  }}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold border rounded-md transition-smooth",
                    selectedVariant === idx
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mt-2.5">
            <span className="font-display text-xl sm:text-2xl font-bold text-foreground">
              <span className="text-sm align-top">₹</span>
              {price.toLocaleString("en-IN")}
            </span>
            {showMrp && (
              <>
                <span className="text-xs text-muted-foreground">
                  M.R.P: <span className="line-through">{formatINR(mrp)}</span>
                </span>
                <span className="text-xs font-semibold text-leaf">({discount}% off)</span>
              </>
            )}
          </div>

          {/* Delivery */}
          <div className="mt-2.5 text-xs sm:text-sm text-muted-foreground space-y-0.5">
            <p className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-leaf shrink-0" />
              FREE delivery <span className="font-semibold text-foreground">{free}</span>
            </p>
            <p className="hidden sm:block pl-5">
              Or fastest delivery <span className="font-semibold text-foreground">{fast}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
            <button
              disabled={!available}
              onClick={() => {
                add(product, 1, selectedVariant);
                toast.success(`Added ${product.variants?.[selectedVariant]?.label || ""} to cart`);
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-soft disabled:opacity-50 transition-smooth"
            >
              {available ? "Add to cart" : "Out of stock"}
            </button>
            <button
              onClick={() => {
                toggle(product);
                toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
              }}
              className={cn(
                "inline-flex items-center gap-1 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-border hover:border-primary transition-smooth",
                wished && "text-destructive border-destructive/40"
              )}
            >
              <Heart className={cn("h-3.5 w-3.5", wished && "fill-current")} />
              <span className="hidden sm:inline">{wished ? "Wishlisted" : "Wishlist"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
