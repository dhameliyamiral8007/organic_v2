import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { effectivePrice, formatINR, productImage } from "@/lib/product";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, remove, clear } = useWishlist();
  const { add } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-wide py-20 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold">Your wishlist is empty</h1>
        <p className="text-muted-foreground mt-2">Save the products you love for later.</p>
        <Button asChild variant="hero" size="lg" className="mt-6">
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Wishlist</h1>
        <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
          Clear wishlist
        </button>
      </div>
      <div className="grid gap-3 md:gap-4">
        {items.map((p) => (
          <div key={p.id} className="flex gap-4 bg-card border border-border rounded-2xl p-4">
            <Link to={`/products/${p.id}`} className="h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
              <img src={productImage(p, 0)} alt={p.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 flex flex-col">
              <Link to={`/products/${p.id}`} className="font-medium hover:text-primary line-clamp-2">{p.name}</Link>
              {p.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{p.subtitle}</p>}
              <div className="font-display text-lg font-bold text-primary mt-1">
                {formatINR(effectivePrice(p, 0))}
              </div>
              <div className="flex gap-2 mt-auto pt-2">
                <Button
                  size="sm"
                  variant="hero"
                  onClick={() => { add(p, 1, 0); toast.success("Added to cart"); }}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add to cart
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
