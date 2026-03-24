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
            href="/user"
            className={`px-5 py-2.5 rounded-lg transition-all font-medium ${isActive('/user')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50'
              }`}
          >
            Home
          </Link>

          <Link
            href="/user/bookings"
            className={`px-5 py-2.5 rounded-lg transition-all font-medium ${isActive('/user/bookings')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 text-md'
              }`}
          >
            Reservations
          </Link>

          <Link
            href="/user/profile"
            className={` rounded-lg transition-all font-medium ${isActive('/user/profile')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 text-md px-5 py-2.5'
              }`}
          >
            Profile
          </Link>

          <a href="tel:+919849660462">
            <button className="bg-green-400 text-white px-3 py-2 rounded-lg font-small">
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
              <p className="text-sm font-semibold text-gray-800">99999999</p>
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
