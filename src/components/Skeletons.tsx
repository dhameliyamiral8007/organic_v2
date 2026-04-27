export const ProductCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 bg-muted rounded" />
      <div className="h-3 w-1/2 bg-muted rounded" />
      <div className="h-6 w-1/3 bg-muted rounded mt-3" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
