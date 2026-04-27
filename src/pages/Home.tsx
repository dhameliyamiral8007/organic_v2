import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, Truck, Sprout } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-organic.jpg";
import bannerImg from "@/assets/banner-categories.jpg";
import { JivdayaBanner } from "@/components/JivdayaBanner";
import { Testimonials } from "@/components/Testimonials";

const fetchAll = async (): Promise<Product[]> => unwrap<Product[]>(await api.get("/api/products"));
const fetchFeatured = async (): Promise<Product[]> => unwrap<Product[]>(await api.get("/api/products/featured"));

const CATEGORIES = [
  { name: "Fruits", slug: "fruits", emoji: "🍎" },
  { name: "Vegetables", slug: "vegetables", emoji: "🥦" },
  { name: "Herbs", slug: "herbs", emoji: "🌿" },
  { name: "Grains", slug: "grains", emoji: "🌾" },
  { name: "Spices", slug: "spices", emoji: "🌶️" },
  { name: "Dairy", slug: "dairy", emoji: "🥛" },
];

const Home = () => {
  const { data: all, isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchAll });
  const { data: featured } = useQuery({ queryKey: ["products", "featured"], queryFn: fetchFeatured });

  const showcase = (featured && featured.length > 0 ? featured : all)?.slice(0, 8) ?? [];
  const recent = all?.slice(0, 4) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Organic farm"
            className="w-full h-full object-cover"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
        </div>
        <div className="relative container-wide py-20 md:py-32 text-primary-foreground max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em]">
            <Leaf className="h-3.5 w-3.5 text-accent" /> Certified Organic · Farm to Door
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-6 leading-[1.05]">
            Pure goodness, <span className="text-accent">rooted</span> in nature.
          </h1>
          <p className="mt-5 text-base md:text-lg opacity-90 max-w-xl leading-relaxed">
            Hand-picked organic produce, herbs and pantry staples — sourced directly from trusted Indian farms,
            delivered to your home with care.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/products">Shop the harvest <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/products?category=fruits">Browse fruits</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="bg-secondary border-y border-border">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-6 py-6 text-secondary-foreground">
          {[
            { icon: Leaf, t: "100% Organic", s: "Certified pure" },
            { icon: Truck, t: "Fast Delivery", s: "3-5 days pan-India" },
            { icon: ShieldCheck, t: "500+ Happy Customers", s: "Trusted families" },
            { icon: Sprout, t: "Eco Friendly", s: "Sustainable packaging" },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs opacity-70">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-wide py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Shop by category</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Pick your aisle</h2>
          </div>
          <Link to="/products" className="hidden md:inline text-sm font-semibold text-primary hover:underline">
            Browse all →
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-soft transition-smooth"
            >
              <div className="text-3xl md:text-4xl group-hover:scale-110 transition-smooth">{c.emoji}</div>
              <div className="text-sm font-medium text-center">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section className="container-wide pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Featured</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">This week's harvest</h2>
          </div>
          <Link to="/products" className="hidden md:inline text-sm font-semibold text-primary hover:underline">
            See all →
          </Link>
        </div>
        {isLoading ? (
          <ProductGridSkeleton />
        ) : showcase.length === 0 ? (
          <p className="text-muted-foreground">No products available right now.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {showcase.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="container-wide pb-16">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src={bannerImg}
            alt="Organic ingredients"
            className="w-full h-72 md:h-96 object-cover"
            loading="lazy"
            width={1600}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 grid items-center">
            <div className="px-8 md:px-14 max-w-xl text-primary-foreground">
              <h3 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                The cleanest pantry, on us.
              </h3>
              <p className="mt-3 opacity-90">
                Get 10% off your first order with code <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded font-semibold">NISARG10</span>
              </p>
              <Button asChild variant="hero" size="lg" className="mt-6">
                <Link to="/products">Start shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (live) */}
      <Testimonials />

      {/* Jivdaya Trust */}
      <JivdayaBanner />

      {/* Recent */}
      {recent.length > 0 && (
        <section className="container-wide pb-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Just landed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recent.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
