"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Calendar,
  LogOut,
  LogIn,
  Menu,
  X,
  Home,
  Sparkles,
  Mail,
  Building2,
  Shield,
} from "lucide-react";

const UserNavigation = ({ userName = "", isAdmin = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const linkClass = (path) =>
    `rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
      isActive(path)
        ? "bg-luxury-gold/15 text-luxury-gold-dark ring-1 ring-luxury-gold/30"
        : "text-luxury-charcoal/90 hover:bg-luxury-sand/80"
    }`;

  const iconLinkClass = (path) =>
    `rounded-xl p-3 transition-all duration-300 ${
      isActive(path)
        ? "bg-luxury-gold/15 text-luxury-gold-dark ring-1 ring-luxury-gold/30"
        : "text-luxury-charcoal/90 hover:bg-luxury-sand/80"
    }`;

  const initial = userName?.trim()?.charAt(0)?.toUpperCase() || "?";

  const navShell = `sticky top-0 z-[100] transition-all duration-300 ${
    scrolled
      ? "border-b border-luxury-stone/50 bg-luxury-cream/75 shadow-luxury backdrop-blur-xl"
      : "border-b border-transparent bg-luxury-cream/40 backdrop-blur-md"
  }`;

  return (
    <>
      <header className={navShell}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-luxury-black shadow-luxury ring-1 ring-luxury-gold/30 transition-transform duration-300 group-hover:scale-[1.02]">
              <Sparkles className="h-6 w-6 text-luxury-gold-light" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display truncate text-lg font-semibold tracking-tight text-luxury-black sm:text-xl">
                Aurum Retreats
              </h2>
              <p className="hidden text-xs text-luxury-charcoal/60 sm:block">
                Luxury Resort Booking
              </p>
            </div>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/resorts" className={linkClass("/resorts")}>
              Resorts
            </Link>
            <Link href="/user/bookings" className={linkClass("/user/bookings")}>
              Bookings
            </Link>
            {isAdmin && (
              <Link href="/admin" className={linkClass("/admin")}>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  Admin
                </span>
              </Link>
            )}
            <a href="tel:+919849660462">
              <span className="ml-1 inline-flex items-center gap-2 rounded-2xl bg-luxury-black px-4 py-2 text-sm font-medium text-white shadow-luxury transition hover:bg-luxury-charcoal">
                <Phone className="h-4 w-4 text-luxury-gold-light" />
                Call
              </span>
            </a>
            <Link
              href="/user/profile"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-luxury-sand ring-1 ring-luxury-stone/80 transition hover:ring-luxury-gold/40"
              title="Profile"
            >
              <span className="text-sm font-semibold text-luxury-black">{initial}</span>
            </Link>
            {userName ? (
              <Link
                href="/api/auth/signout"
                className="inline-flex items-center gap-2 rounded-2xl border border-luxury-stone bg-white px-4 py-2 text-sm font-medium text-luxury-charcoal shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden xl:inline">Logout</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-luxury-gold px-4 py-2 text-sm font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </nav>

          {/* Tablet */}
          <nav className="hidden items-center gap-1 md:flex lg:hidden">
            <Link href="/" className={iconLinkClass("/")} title="Home">
              <Home className="h-5 w-5" />
            </Link>
            <Link href="/resorts" className={iconLinkClass("/resorts")} title="Resorts">
              <Building2 className="h-5 w-5" />
            </Link>
            <Link
              href="/user/bookings"
              className={iconLinkClass("/user/bookings")}
              title="Bookings"
            >
              <Calendar className="h-5 w-5" />
            </Link>
            {isAdmin && (
              <Link href="/admin" className={iconLinkClass("/admin")} title="Admin">
                <Shield className="h-5 w-5" />
              </Link>
            )}
            <Link href="/user/profile" title="Profile">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-luxury-sand text-sm font-semibold ring-1 ring-luxury-stone">
                {initial}
              </span>
            </Link>
            {userName ? (
              <Link
                href="/api/auth/signout"
                className="rounded-xl bg-white p-2.5 text-red-600 shadow-sm ring-1 ring-luxury-stone"
              >
                <LogOut className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-luxury-gold p-2.5 text-luxury-black shadow-luxury-gold"
              >
                <LogIn className="h-5 w-5" />
              </Link>
            )}
          </nav>

          {/* Mobile bar */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/user/profile">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-luxury-sand text-xs font-semibold ring-1 ring-luxury-stone">
                {initial}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 text-luxury-charcoal hover:bg-luxury-sand"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-luxury-stone/60 bg-luxury-cream/95 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 ${linkClass("/")}`}
              >
                Home
              </Link>
              <Link
                href="/resorts"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 ${linkClass("/resorts")}`}
              >
                Resorts
              </Link>
              <Link
                href="/user/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 ${linkClass("/user/bookings")}`}
              >
                Bookings
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 ${linkClass("/admin")}`}
                >
                  Admin
                </Link>
              )}
              <a
                href="tel:+919849660462"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-luxury-charcoal hover:bg-luxury-sand"
              >
                <Phone className="h-5 w-5 text-luxury-gold-dark" />
                Call resort
              </a>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                <Mail className="h-5 w-5 text-luxury-gold-dark" />
                <span className="text-sm">info@holidayresort.com</span>
              </div>
              {userName ? (
                <Link
                  href="/api/auth/signout"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-luxury-black py-3 text-sm font-semibold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-luxury-gold py-3 text-sm font-semibold text-luxury-black"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default UserNavigation;
