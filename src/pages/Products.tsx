import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductListRow } from "@/components/ProductListRow";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { effectivePrice } from "@/lib/product";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const fetchAll = async (): Promise<Product[]> => unwrap<Product[]>(await api.get("/api/products"));

const Products = () => {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(search);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "grid">("grid");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAll,
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    (data || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let list = data || [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (category) {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (priceMax != null) {
      list = list.filter((p) => effectivePrice(p, 0) <= priceMax);
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case "rating":
        sorted.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }
    return sorted;
  }, [data, search, category, sort, priceMax]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("search", searchInput.trim() || null);
  };

  const clearFilters = () => {
    setParams(new URLSearchParams());
    setSearchInput("");
    setPriceMax(null);
  };

  return (
    <div className="container-wide py-8 md:py-12">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {category ? <span className="capitalize">{category}</span> : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
          </Button>
          <div className="hidden sm:inline-flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={cn(
                "px-2.5 py-1.5 text-xs font-medium transition-smooth",
                view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={cn(
                "px-2.5 py-1.5 text-xs font-medium border-l border-border transition-smooth",
                view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Select value={sort} onValueChange={(v) => setParam("sort", v === "newest" ? null : v)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar filters */}
        <aside
          className={cn(
            "md:block",
            showFilters
              ? "fixed inset-0 z-50 bg-background p-6 overflow-auto md:static md:p-0"
              : "hidden"
          )}
        >
          <div className="flex items-center justify-between md:hidden mb-4">
            <h3 className="font-display text-xl">Filters</h3>
            <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
          </div>
          <div className="space-y-6 md:sticky md:top-32">
            <form onSubmit={onSearch}>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Search</label>
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="mt-2"
              />
            </form>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</label>
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => setParam("category", null)}
                  className={cn(
                    "block w-full text-left px-3 py-1.5 rounded-md text-sm capitalize",
                    !category ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  )}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setParam("category", c)}
                    className={cn(
                      "block w-full text-left px-3 py-1.5 rounded-md text-sm capitalize",
                      category === c ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Max Price</label>
              <Input
                type="number"
                min={0}
                placeholder="₹ — any"
                value={priceMax ?? ""}
                onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : null)}
                className="mt-2"
              />
            </div>
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        </aside>

        {/* Results */}
        <section>
          <div className="border-b border-border pb-3 mb-4">
            <h2 className="font-display text-2xl font-bold">Results</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Check each product page for other buying options.
            </p>
          </div>
          {isLoading ? (
            <ProductGridSkeleton count={9} />
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-destructive font-medium">Failed to load products</p>
              <p className="text-sm text-muted-foreground mt-1">{(error as Error)?.message}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <p className="font-display text-2xl">No products match your search</p>
              <p className="text-sm text-muted-foreground mt-2">Try clearing filters or a different keyword.</p>
              <Button onClick={clearFilters} className="mt-6" variant="hero">Clear filters</Button>
            </div>
          ) : view === "list" ? (
            <div className="space-y-3 md:space-y-4">
              {filtered.map((p) => <ProductListRow key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
