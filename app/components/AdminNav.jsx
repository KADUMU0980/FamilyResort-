"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const ADMIN_LINKS = [
  { href: "/admin", label: "Post resorts", icon: LayoutDashboard },
  { href: "/admin/manage-resorts", label: "Manage resorts", icon: Building2 },
  { href: "/admin/get-users", label: "Manage users", icon: Users },
];

function AdminNavLinks({ pathname, onLinkClick }) {
  return (
    <nav className="flex flex-col gap-1">
      {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href !== "/admin" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              active
                ? "bg-luxury-gold/15 text-luxury-gold-light ring-1 ring-luxury-gold/30"
                : "text-luxury-sand/85 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

const AdminNav = ({ userName = "" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMobile = () => setMenuOpen(false);

  return (
    <>
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-luxury-black lg:flex">
        <div className="border-b border-white/10 p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-gold/20 ring-1 ring-luxury-gold/40">
              <Sparkles className="h-5 w-5 text-luxury-gold-light" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold/80">
                Console
              </p>
              <p className="font-display text-lg font-semibold text-white">Admin</p>
            </div>
          </Link>
          {userName && (
            <p className="mt-4 truncate text-sm text-luxury-sand/70">{userName}</p>
          )}
        </div>
        <div className="flex-1 p-4">
          <AdminNavLinks pathname={pathname} />
        </div>
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-14 items-center justify-between border-b border-white/10 bg-luxury-black px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 text-white">
          <Sparkles className="h-6 w-6 text-luxury-gold-light" />
          <span className="font-display font-semibold">Admin</span>
        </Link>
        <button
          type="button"
          className="rounded-xl p-2 text-white hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-b border-white/10 bg-luxury-black px-4 py-4 lg:hidden">
          <AdminNavLinks pathname={pathname} onLinkClick={closeMobile} />
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default AdminNav;
