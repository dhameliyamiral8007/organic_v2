import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { effectivePrice, formatINR, productImage } from "@/lib/product";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, subtotal, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-wide py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Time to fill it with some goodness from nature.</p>
        <Button asChild variant="hero" size="lg" className="mt-6">
          <Link to="/products">Start shopping</Link>
        </Button>
      </div>
    );
  }

  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          {items.map((item) => {
            const price = effectivePrice(item.product, item.variantIndex);
            const variant = item.product.variants?.[item.variantIndex ?? 0];
            return (
              <div
                key={`${item.productId}-${item.variantIndex ?? 0}`}
                className="flex gap-4 bg-card border border-border rounded-2xl p-4"
              >
                <Link
                  to={`/products/${item.productId}`}
                  className="h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden bg-muted shrink-0"
                >
                  <img
                    src={productImage(item.product, item.variantIndex)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-2">
                    <Link to={`/products/${item.productId}`} className="font-medium hover:text-primary line-clamp-2">
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => remove(item.productId, item.variantIndex)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {variant && (
                    <p className="text-xs text-muted-foreground mt-0.5">Pack: {variant.label}</p>
                  )}
                  <div className="flex items-end justify-between mt-auto pt-3">
                    <div className="flex items-center border border-border rounded-full overflow-hidden">
                      <button
                        onClick={() => setQty(item.productId, item.quantity - 1, item.variantIndex)}
                        className="px-2.5 py-1.5 hover:bg-secondary"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => setQty(item.productId, item.quantity + 1, item.variantIndex)}
                        className="px-2.5 py-1.5 hover:bg-secondary"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-primary">
                        {formatINR(price * item.quantity)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatINR(price)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-32">
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="font-medium">{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-leaf">Add {formatINR(499 - subtotal)} more for free shipping!</p>
            )}
            <div className="border-t border-border pt-3 mt-3 flex justify-between text-lg">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display font-bold text-primary">{formatINR(total)}</dd>
            </div>
          </dl>
          <Button asChild variant="hero" size="lg" className="w-full mt-6">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full mt-2">
            <Link to="/products">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
