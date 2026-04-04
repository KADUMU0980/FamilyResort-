"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-2xl border border-luxury-stone bg-white/90 px-4 py-3 text-sm text-luxury-black shadow-sm outline-none transition-all placeholder:text-luxury-stone focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 ${className}`}
      {...props}
    />
  );
});

export default Input;
