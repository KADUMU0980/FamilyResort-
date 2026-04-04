import SiteLayout from "./layout/SiteLayout";
import ProductCollection from "./ProductCollection";

export default async function ResortListing() {
  return (
    <SiteLayout>
      <div className="border-b border-luxury-stone/60 bg-luxury-sand/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
            Explore resorts
          </h1>
          <p className="mt-2 max-w-2xl text-luxury-charcoal/75">
            Browse the full collection with live filters — same booking experience as home.
          </p>
        </div>
      </div>
      <ProductCollection />
    </SiteLayout>
  );
}
