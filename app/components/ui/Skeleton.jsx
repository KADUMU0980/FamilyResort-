export function ResortCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-luxury-stone/60 bg-white shadow-glass">
      <div className="h-56 animate-pulse bg-luxury-sand" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 max-w-[240px] animate-pulse rounded-lg bg-luxury-sand" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-luxury-sand/80" />
        <div className="h-16 animate-pulse rounded-lg bg-luxury-sand/60" />
        <div className="flex justify-between pt-2">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-luxury-sand" />
          <div className="h-10 w-28 animate-pulse rounded-2xl bg-luxury-sand" />
        </div>
      </div>
    </div>
  );
}

export function HeroSearchSkeleton() {
  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-white/20" />
        ))}
      </div>
    </div>
  );
}
