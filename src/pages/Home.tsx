import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, Truck, Sprout } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { JivdayaBanner } from "@/components/JivdayaBanner";
import { Testimonials } from "@/components/Testimonials";
import { HeroSlider } from "@/components/HeroSlider";

const fetchAll = async (): Promise<Product[]> => unwrap<Product[]>(await api.get("/api/products"));
const fetchFeatured = async (): Promise<Product[]> => unwrap<Product[]>(await api.get("/api/products/featured"));

const CATEGORY_ICONS: Record<string, string> = {
  fruits: "🍎",
  vegetables: "🥦",
  herbs: "🌿",
  grains: "🌾",
  flowers: "🌸",
  flower: "🌸",
  seeds: "🌱",
  spices: "🌶️",
  organic: "🍃",
  pantry: "🍯",
  dairy: "🥛",
};

const Home = () => {
  const { t } = useI18n();
  const { data: all, isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchAll });
  const { data: featured } = useQuery({ queryKey: ["products", "featured"], queryFn: fetchFeatured });

  const showcase = (featured && featured.length > 0 ? featured : all)?.slice(0, 8) ?? [];
  const recent = all?.slice(0, 4) ?? [];

  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    (all || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort().map(cat => ({
      name: cat,
      slug: cat,
      emoji: CATEGORY_ICONS[cat.toLowerCase()] || "📦"
    }));
  }, [all]);

  return (
    <>
      {/* Hero slider */}
      <HeroSlider />

      {/* USP strip */}
      <section className="bg-secondary border-y border-border">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-6 py-6 text-secondary-foreground">
          {[
            { icon: Leaf, t: t("trust.organic"), s: t("trust.organic.sub") },
            { icon: Truck, t: t("trust.delivery"), s: t("trust.delivery.sub") },
            { icon: ShieldCheck, t: t("trust.customers"), s: t("trust.customers.sub") },
            { icon: Sprout, t: t("trust.eco"), s: t("trust.eco.sub") },
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
            <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">{t("section.category_badge")}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">{t("section.categories")}</h2>
          </div>
          <Link to="/products" className="hidden md:inline text-sm font-semibold text-primary hover:underline">
            {t("common.browse_all")} →
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {dynamicCategories.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              className="group relative flex flex-col items-center gap-4 py-8 px-4 rounded-3xl bg-white border border-border hover:border-primary/30 hover:shadow-elegant transition-smooth overflow-hidden text-center w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] md:w-48"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              <div className="relative z-10 text-4xl md:text-5xl group-hover:scale-110 transition-smooth duration-500 drop-shadow-md">
                {c.emoji}
              </div>
              <div className="relative z-10 text-sm md:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-smooth">
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section className="container-wide pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">{t("section.featured_badge")}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">{t("section.featured")}</h2>
          </div>
          <Link to="/products" className="hidden md:inline text-sm font-semibold text-primary hover:underline">
            {t("common.see_all")} →
          </Link>
        </div>
        {isLoading ? (
          <ProductGridSkeleton />
        ) : showcase.length === 0 ? (
          <p className="text-muted-foreground">{t("products.none")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {showcase.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Testimonials (live) */}
      <Testimonials />

      {/* Jivdaya Trust */}
      <JivdayaBanner />

      {/* Recent */}
      {recent.length > 0 && (
        <section className="container-wide pb-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{t("section.recent")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {recent.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
};

export default Home;

