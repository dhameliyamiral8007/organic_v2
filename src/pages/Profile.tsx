import { Link } from "react-router-dom";
import { Heart, LogOut, Package, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { items: wish } = useWishlist();

  if (!user) return null;

  return (
    <div className="container-wide py-8 md:py-12 max-w-4xl">
      <div className="bg-hero text-primary-foreground rounded-3xl p-8 md:p-10 flex items-center gap-6">
        <div className="grid place-items-center h-20 w-20 rounded-full bg-accent text-accent-foreground font-display text-3xl font-bold">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] opacity-80">Welcome back</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">{user.name}</h1>
          <p className="opacity-85 mt-1 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Link to="/orders" className="group bg-card border border-border rounded-2xl p-5 hover:shadow-elegant transition-smooth">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="font-semibold mt-3">Your orders</h3>
          <p className="text-xs text-muted-foreground mt-1">Track and review past orders</p>
        </Link>
        <Link to="/wishlist" className="group bg-card border border-border rounded-2xl p-5 hover:shadow-elegant transition-smooth">
          <Heart className="h-6 w-6 text-primary" />
          <h3 className="font-semibold mt-3">Wishlist <span className="text-xs text-muted-foreground">({wish.length})</span></h3>
          <p className="text-xs text-muted-foreground mt-1">Saved for later</p>
        </Link>
        <Link to="/cart" className="group bg-card border border-border rounded-2xl p-5 hover:shadow-elegant transition-smooth">
          <UserIcon className="h-6 w-6 text-primary" />
          <h3 className="font-semibold mt-3">Cart <span className="text-xs text-muted-foreground">({count})</span></h3>
          <p className="text-xs text-muted-foreground mt-1">Items waiting for you</p>
        </Link>
      </div>

      <section className="mt-6 bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-4">Account details</h2>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Name</dt>
            <dd className="mt-1">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</dt>
            <dd className="mt-1">{user.email}</dd>
          </div>
          {user.phone && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone</dt>
              <dd className="mt-1">{user.phone}</dd>
            </div>
          )}
        </dl>
        <Button variant="outline" className="mt-6 rounded-full" onClick={logout}>
          <LogOut className="h-4 w-4 mr-1" /> Sign out
        </Button>
      </section>
    </div>
  );
};

export default Profile;
