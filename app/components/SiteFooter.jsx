import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-luxury-stone/80 bg-luxury-black text-luxury-sand">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-luxury-gold/20 ring-1 ring-luxury-gold/40">
                <Sparkles className="h-5 w-5 text-luxury-gold-light" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                Aurum Retreats
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-luxury-stone">
              Curated luxury stays with seamless booking and attentive service.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/resorts" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">
                  Resorts
                </Link>
              </li>
              <li>
                <Link href="/user/bookings" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">
                  Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-luxury-sand/90">
              <li>
                <a href="tel:+919849660462" className="hover:text-luxury-gold-light transition-colors">
                  +91 98496 60462
                </a>
              </li>
              <li>info@holidayresort.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">
              Hours
            </h3>
            <p className="mt-4 text-sm text-luxury-sand/90">
              Concierge: 24/7
              <br />
              Reservations: 9am – 9pm IST
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-luxury-stone sm:flex-row">
          <p>© {new Date().getFullYear()} Aurum Retreats. All rights reserved.</p>
          <Link href="/terms" className="hover:text-luxury-gold-light transition-colors">
            Terms & Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
