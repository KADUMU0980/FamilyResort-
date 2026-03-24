"use client";
import React, { useState } from "react";
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
  User
} from "lucide-react";

const UserNavigation = ({ userName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Desktop Navigation - Text Only, No Icons */}
      <nav className="hidden lg:flex items-center justify-between bg-white shadow-lg px-8 py-4 rounded-2xl sticky top-4 z-50 mx-4 my-4 border border-gray-200">
        {/* Logo/Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Holiday Resort
            </h2>
            <p className="text-xs text-gray-500">Your Perfect Getaway</p>
          </div>
        </Link>

        {/* Center Navigation Links - Text Only */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-5 py-2.5 rounded-lg transition-all text-[24px] font-medium ${isActive('/user')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50'
              }`}
          >
            Home
          </Link>

          <Link
            href="/user/bookings"
            className={`px-5 py-2.5 rounded-lg transition-all text-[24px] font-medium ${isActive('/user/bookings')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 text-md'
              }`}
          >
            Reservations
          </Link>

          <Link
            href="/user/profile"
            className={` rounded-lg transition-all font-medium text-[24px] ${isActive('/user/profile')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 text-md px-5 py-2.5'
              }`}
          >
            Profile
          </Link>

          <a href="tel:+919849660462">
            <button className="relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
              </svg>
              Call Resort
            </button>
          </a>

        </div>

        {userName ? (
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm font-medium"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        )}
      </nav>

      <nav className="hidden md:flex lg:hidden items-center justify-between bg-white shadow-lg px-6 py-4 rounded-2xl sticky top-4 z-50 mx-4 my-4 border border-gray-200">
        {/* Logo */}
        <Link href="/user" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Holiday Resort
          </h2>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/user"
            className={`p-3 rounded-lg transition-all ${isActive('/user')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50'
              }`}
            title="Home"
          >
            <Home className="w-5 h-5" />
          </Link>

          <Link
            href="/user/bookings"
            className={`p-3 rounded-lg transition-all ${isActive('/user/bookings')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50'
              }`}
            title="Reservations"
          >
            <Calendar className="w-5 h-5" />
          </Link>

          <Link
            href="/user/profile"
            className={`p-3 rounded-lg transition-all ${isActive('/user/profile')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50'
              }`}
            title="Profile"
          >
            <User className="w-5 h-5" />
          </Link>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200" title="Contact: 123 456 789">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>

          {userName ? (
            <Link
              href="/api/auth/signout"
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
              title="Login"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation - Icons Only */}
      <nav className="md:hidden bg-white shadow-lg rounded-2xl mx-4 my-4 border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/user" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Holiday Resort
            </h2>
          </Link>

          {/* Icon Navigation - Always Visible */}
          <div className="flex items-center gap-1">
            <Link
              href="/user"
              className={`p-2.5 rounded-lg transition-all ${isActive('/user')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-50'
                }`}
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Link>

            <Link
              href="/user/bookings"
              className={`p-2.5 rounded-lg transition-all ${isActive('/user/bookings')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-50'
                }`}
              title="Reservations"
            >
              <Calendar className="w-5 h-5" />
            </Link>

            <Link
              href="/user/profile"
              className={`p-2.5 rounded-lg transition-all ${isActive('/user/profile')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-50'
                }`}
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="tel:+919849660462"
            >
              <Phone className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors ml-1"
              title="More"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Only Contact & Logout */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 px-4 py-3 space-y-2 bg-gray-50">
            {/* Contact Info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200">
              <Phone className="w-5 h-5 text-blue-600" />
              <a href="tel:+919849660462" className="text-sm font-semibold text-gray-800">
                Call Resort
              </a>
            </div>

            {/* Email Contact */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Email us</p>
                <p className="text-sm font-semibold text-gray-800">info@holidayresort.com</p>
              </div>
            </div>

            {/* Auth Link */}
            {userName ? (
              <Link
                href="/api/auth/signout"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-semibold text-white">Logout</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-sm font-semibold text-white">Login</span>
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default UserNavigation;
