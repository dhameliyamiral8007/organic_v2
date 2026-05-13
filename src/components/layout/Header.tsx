import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(false);

  console.log(scrolled);
  
 useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const NAV = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.shop") },
    { to: "/about", label: t("nav.about") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/donate", label: t("nav.donate") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    setOpen(false);
  };

  const RightActions = (isCompact: boolean) => (
    <div className="flex items-center gap-1 md:gap-2 shrink-0">
      <LanguageSwitcher showLabel={!isCompact} />
      <Link
        to="/wishlist"
        className="relative p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
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
        className="relative p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
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
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-primary-foreground/10 transition-colors">
              <span className="grid place-items-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>{t("auth.hello")}, {user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/profile">{t("auth.profile")}</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/orders">{t("auth.orders")}</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/wishlist">{t("auth.wishlist")}</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">{t("auth.signout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild variant="hero" size="sm" className="hidden md:inline-flex">
          <Link to="/login">
            <User className="h-4 w-4 mr-1" />
            {!isCompact && <span>{t("header.signin")}</span>}
            {isCompact && <span className="sr-only">{t("header.signin")}</span>}
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Spacer to prevent content jump when headers are fixed */}
      <div className={cn(
        "transition-all duration-300 bg-primary",
        scrolled ? "h-16" : "h-[116px] md:h-[156px]"
      )} />

      {/* === LARGE HEADER (Default) === */}
      <header 
        className={cn(
          "fixed top-0 left-0 w-full z-40 bg-primary text-primary-foreground shadow-elegant transition-all duration-300 ease-in-out",
          scrolled ? "-translate-y-full pointer-events-none" : "translate-y-0"
        )}
      >
        {/* Top tagline */}
        <div className="hidden md:block bg-primary-foreground/5 border-b border-primary-foreground/10 text-xs">
          <div className="container-wide flex h-8 items-center justify-between">
            <span className="opacity-80">{t("header.tagline")}</span>
            <span className="opacity-80">Pure · Natural · Trusted</span>
          </div>
        </div>

        {/* Main row: logo + search + actions */}
        <div className="container-wide flex items-center gap-3 md:gap-6 h-16 md:h-20">
          <button
            className="md:hidden p-2 -ml-2 shrink-0"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Ba Prerna Nisarg" className="object-contain h-12 md:h-14" />
          </Link>

          {/* Search */}
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-2xl mx-auto">
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

          <div className="ml-auto">{RightActions(false)}</div>
        </div>

        {/* Mobile search */}
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

        {/* Bottom nav strip */}
        <nav className="hidden md:block bg-primary-glow/30 border-t border-primary-foreground/10">
          <div className="container-wide flex items-center gap-1 h-11 overflow-x-auto">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "text-xs uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-primary-foreground/10"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {/* === COMPACT HEADER (Scrolled) === */}
      <header 
        className={cn(
          "fixed top-0 left-0 w-full z-50 bg-primary text-primary-foreground shadow-elegant transition-all duration-300 ease-in-out",
          scrolled ? "translate-y-0" : "-translate-y-full pointer-events-none"
        )}
      >
        <div className="container-wide flex items-center gap-3 md:gap-6 h-16">
          <button
            className="md:hidden p-2 -ml-2 shrink-0"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Ba Prerna Nisarg" className="object-contain h-10 md:h-11" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 mx-auto">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "text-xs uppercase tracking-wider px-3 py-2 rounded-full whitespace-nowrap transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-primary-foreground/10"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto">{RightActions(true)}</div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-[60] md:hidden"
          style={{ top: scrolled ? '64px' : '116px' }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-primary border-t border-primary-foreground/10 py-4 flex flex-col px-6 shadow-xl animate-in slide-in-from-top duration-300">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-primary-foreground/10 last:border-0 flex items-center justify-between"
              >
                {n.label}
                <span className="opacity-30">→</span>
              </Link>
            ))}
            {!user ? (
              <Link 
                to="/login" 
                onClick={() => setOpen(false)} 
                className="mt-4 py-3 text-sm font-bold text-accent bg-accent/10 rounded-lg px-4 text-center"
              >
                {t("auth.signin_create")}
              </Link>
            ) : (
              <div className="mt-4 space-y-1">
                <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 text-sm opacity-80">{t("auth.profile")}</Link>
                <Link to="/orders" onClick={() => setOpen(false)} className="block py-2 text-sm opacity-80">{t("auth.orders")}</Link>
                <button 
                  onClick={() => { logout(); setOpen(false); }} 
                  className="block w-full text-left py-2 text-sm text-destructive font-medium"
                >
                  {t("auth.signout")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
