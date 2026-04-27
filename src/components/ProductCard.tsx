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
  const price = effectivePrice(product, 0);
  const mrp = Number(product.price) || 0;
  const showMrp = product.variants?.[0]?.price != null && mrp > 0 && mrp > price;
  const wished = has(product.id);
  const available = inStock(product, 0);
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
          src={productImage(product, 0)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
        />
        {product.is_organic && (
          <span className="absolute top-2 left-2 bg-leaf text-leaf-foreground text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full flex items-center gap-1">
            <Leaf className="h-3 w-3" /> Organic
          </span>
        )}
        {!available && (
          <span className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px] grid place-items-center text-background font-semibold text-sm">
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
            "absolute top-2 right-2 grid place-items-center h-8 w-8 rounded-full backdrop-blur bg-background/80 hover:bg-background transition-smooth",
            wished && "text-destructive"
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
      </Link>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-sm md:text-[15px] line-clamp-2 leading-snug text-foreground hover:text-primary transition-smooth">
            {product.name}
          </h3>
        </Link>
        {product.subtitle && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.subtitle}</p>
        )}

        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-medium text-foreground">{rating ? rating.toFixed(1) : "New"}</span>
          {!!product.review_count && <span>({product.review_count})</span>}
          {product.category && (
            <span className="ml-auto capitalize px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]">
              {product.category}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <div className="font-display text-lg font-bold text-primary">{formatINR(price)}</div>
            {showMrp && (
              <div className="text-xs text-muted-foreground line-through">{formatINR(mrp)}</div>
            )}
          </div>
          <button
            disabled={!available}
            onClick={(e) => {
              e.preventDefault();
              add(product, 1, 0);
              toast.success("Added to cart");
            }}
            aria-label="Add to cart"
            className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow disabled:opacity-50 transition-smooth"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
