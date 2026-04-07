"use client";
import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm transform rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 shadow-luxury transition-all">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-luxury-gold/15 ring-1 ring-luxury-gold/30">
            <Lock className="h-6 w-6 text-luxury-gold-dark" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-semibold text-luxury-black">
            Login Required
          </h2>
          <p className="text-luxury-charcoal/75">Please login to continue this action.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex w-full justify-center rounded-2xl bg-luxury-gold py-3 px-4 text-sm font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
          >
            Login
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex w-full justify-center rounded-2xl border border-luxury-stone bg-white py-3 px-4 text-sm font-medium text-luxury-black transition hover:bg-luxury-sand/80"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
