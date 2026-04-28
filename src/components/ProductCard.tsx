import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Leaf } from "lucide-react";
import type { Product } from "@/types";
import { effectivePrice, formatINR, inStock, productImage } from "@/lib/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: Props) => {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [selectedVariant, setSelectedVariant] = useState(0);

  const price = effectivePrice(product, selectedVariant);
  const mrp = Number(product.price) || 0;
  const showMrp = product.variants?.[selectedVariant]?.price != null && mrp > 0 && mrp > price;
  const wished = has(product.id);
  const available = inStock(product, selectedVariant);
  const rating = Number(product.rating) || 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-card rounded-xl overflow-hidden border border-border hover:shadow-elegant transition-smooth",
        className
      )}
    >
      <Link to={`/products/${product.id}`} className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={productImage(product, selectedVariant)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
        />
        {product.is_organic && (
          <span className="absolute top-3 left-3 bg-leaf text-leaf-foreground text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Leaf className="h-4 w-4" /> Organic
          </span>
        )}
        {!available && (
          <span className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] grid place-items-center text-background font-bold text-base uppercase tracking-widest">
            Out of stock
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product);
            toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label="Toggle wishlist"
          className={cn(
            "absolute top-3 right-3 grid place-items-center h-10 w-10 rounded-full backdrop-blur-md bg-background/90 hover:bg-background shadow-sm hover:scale-110 transition-smooth",
            wished && "text-destructive"
          )}
        >
          <Heart className={cn("h-5 w-5", wished && "fill-current")} />
        </button>
      </Link>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-base md:text-lg line-clamp-2 leading-snug text-foreground hover:text-primary transition-smooth">
            {product.name}
          </h3>
        </Link>
        {product.subtitle && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1">{product.subtitle}</p>
        )}

        <div className="flex items-center gap-1.5 mt-2.5 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-medium text-foreground">{rating ? rating.toFixed(1) : "New"}</span>
          {!!product.review_count && <span>({product.review_count})</span>}
          {product.category && (
            <span className="ml-auto capitalize px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {product.category}
            </span>
          )}
        </div>

        {/* Variant Selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {product.variants.map((v, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(idx);
                }}
                className={cn(
                  "px-4 py-2 text-sm font-bold border rounded-md transition-smooth",
                  selectedVariant === idx
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <div className="font-display text-xl font-bold text-primary leading-none">{formatINR(price)}</div>
            {showMrp && (
              <div className="text-sm text-muted-foreground line-through mt-1">{formatINR(mrp)}</div>
            )}
          </div>
          <button
            disabled={!available}
            onClick={(e) => {
              e.preventDefault();
              add(product, 1, selectedVariant);
              toast.success(`Added ${product.variants?.[selectedVariant]?.label || ""} to cart`);
            }}
            aria-label="Add to cart"
            className="grid place-items-center h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow disabled:opacity-50 shadow-elegant hover:-translate-y-0.5 transition-smooth"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
