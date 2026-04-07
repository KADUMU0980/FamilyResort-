import Link from "next/link";
import SiteLayout from "@/app/components/layout/SiteLayout";
import { Lock } from "lucide-react";

export default function LoginRequiredPage() {
  return (
    <SiteLayout>
      <div className="luxury-page flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="luxury-surface px-4 py-10 text-center sm:px-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-luxury-gold/15 ring-1 ring-luxury-gold/30">
              <Lock className="h-9 w-9 text-luxury-gold-dark" />
            </div>

            <h2 className="mb-4 font-display text-3xl font-semibold text-luxury-black">
              Login Required
            </h2>

            <p className="mb-8 text-lg text-luxury-charcoal/75">
              You need to login to access this page.
            </p>

            <div className="space-y-4">
              <Link
                href="/login"
                className="flex w-full justify-center rounded-2xl bg-luxury-gold px-4 py-3 text-base font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
              >
                Login
              </Link>

              <Link
                href="/registration"
                className="flex w-full justify-center rounded-2xl border border-luxury-stone bg-luxury-sand/50 px-4 py-3 text-base font-semibold text-luxury-black transition hover:border-luxury-gold/40 hover:bg-luxury-sand"
              >
                Sign Up
              </Link>

              <Link
                href="/"
                className="mt-6 block text-sm text-luxury-charcoal/60 underline transition hover:text-luxury-black"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
