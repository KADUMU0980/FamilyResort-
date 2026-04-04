import Link from "next/link";
import { Sparkles, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-cream px-4 py-16">
      <div className="max-w-lg rounded-2xl border border-luxury-stone/80 bg-white/95 p-10 text-center shadow-luxury">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-luxury-black shadow-luxury">
          <Sparkles className="h-8 w-8 text-luxury-gold-light" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-luxury-gold-dark">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-luxury-black">
          This page drifted away
        </h1>
        <p className="mt-3 text-luxury-charcoal/75">
          The address may have changed, or the page was removed. Let&apos;s get you back to
          something beautiful.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-luxury-gold px-6 py-3 text-sm font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
          >
            <Home className="h-4 w-4" />
            Back home
          </Link>
          <Link
            href="/resorts"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-luxury-stone bg-white px-6 py-3 text-sm font-semibold text-luxury-black transition hover:border-luxury-gold/50"
          >
            <Search className="h-4 w-4" />
            Browse resorts
          </Link>
        </div>
      </div>
    </div>
  );
}
