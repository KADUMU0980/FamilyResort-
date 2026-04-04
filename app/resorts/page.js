import { Suspense } from "react";
import ResortListing from "../components/ResortListing";
import { ResortCardSkeleton } from "../components/ui/Skeleton";

function ListingFallback() {
  return (
    <div className="min-h-[60vh] bg-luxury-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-10 w-48 animate-pulse rounded-xl bg-luxury-sand" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ResortCardSkeleton />
          <ResortCardSkeleton />
          <ResortCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export default function ResortsPage() {
  return (
    <Suspense fallback={<ListingFallback />}>
      <ResortListing />
    </Suspense>
  );
}
