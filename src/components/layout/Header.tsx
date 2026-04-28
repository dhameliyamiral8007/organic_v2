import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { count } = useCart();
  const { items: wishItems } = useWishlist();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.shop") },
    { to: "/about", label: t("nav.about") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/donate", label: "Donate" },
    { to: "/contact", label: t("nav.contact") },
  ];

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-elegant">
      {/* Top bar */}
      {!isScrolled && (
        <div className="bg-primary-foreground/5 border-b border-primary-foreground/10 text-xs">
          <div className="container-wide flex h-8 items-center justify-between">
            <span className="hidden md:inline opacity-80">{t("header.tagline")}</span>
            <span className="opacity-80">Pure · Natural · Trusted</span>
          </div>
        </div>
      )}

      {/* Main */}
      <div className={`container-wide flex items-center gap-3 md:gap-6 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-16 md:h-20'}`}>
        <button
          className="md:hidden p-2 -ml-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Ba Prerna Nisarg" className={`transition-all duration-300 object-contain ${isScrolled ? 'h-12' : 'h-16'}`} />
        </Link>

        {!isScrolled && (
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full rounded-full overflow-hidden bg-background text-foreground shadow-soft">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("header.search")}
                className="flex-1 px-5 py-2.5 bg-transparent outline-none text-sm"
              />
              <button
                type="submit"
                className="px-5 bg-accent text-accent-foreground hover:brightness-105 transition-smooth"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {isScrolled && <div className="flex-1" />}

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {isScrolled && (
            <nav className="hidden lg:flex items-center gap-0.5 mr-2">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    `text-[11px] uppercase tracking-wider px-2.5 py-1.5 rounded-full whitespace-nowrap transition-smooth ${
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-primary-foreground/10"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          )}

          {!isScrolled && <LanguageSwitcher />}

          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-primary-foreground/10 transition-smooth"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center">
                {wishItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-primary-foreground/10 transition-smooth"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-primary-foreground/10 transition-smooth">
                  <span className="grid place-items-center h-7 w-7 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  {!isScrolled && <span className="text-sm font-medium max-w-[120px] truncate">{user.name?.split(" ")[0]}</span>}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Hello, {user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile">Your Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/orders">Your Orders</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/wishlist">Wishlist</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="hero" size="sm" className={`hidden md:inline-flex ${isScrolled ? 'px-3' : ''}`}>
              <Link to="/login">
                <User className="h-4 w-4 mr-1" /> {!isScrolled && t("header.signin")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile search */}
      {!isScrolled && (
        <div className="md:hidden container-wide pb-3">
          <form onSubmit={onSearch} className="flex">
            <div className="flex w-full rounded-full overflow-hidden bg-background text-foreground">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("header.search")}
                className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
              />
              <button type="submit" className="px-4 bg-accent text-accent-foreground" aria-label="Search">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category strip */}
      {!isScrolled && (
        <nav className="hidden md:block bg-primary-glow/30 border-t border-primary-foreground/10">
          <div className="container-wide flex items-center gap-1 h-10 overflow-x-auto">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap transition-smooth ${
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-primary-foreground/10"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      {open && (
        <div className="md:hidden border-t border-primary-foreground/10 bg-primary">
          <div className="container-wide py-3 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm border-b border-primary-foreground/10 last:border-0"
              >
                {n.label}
              </Link>
            ))}
            {!user ? (
              <Link to="/login" onClick={() => setOpen(false)} className="mt-3 py-2 text-sm font-semibold text-accent">
                Sign in / Create account
              </Link>
            ) : (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="py-2 text-sm border-b border-primary-foreground/10">Profile</Link>
                <Link to="/orders" onClick={() => setOpen(false)} className="py-2 text-sm border-b border-primary-foreground/10">Orders</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="py-2 text-sm text-left text-destructive">Sign out</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
