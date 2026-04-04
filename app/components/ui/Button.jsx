"use client";

import { forwardRef } from "react";

const variants = {
  primary:
    "bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light shadow-luxury-gold",
  outline:
    "border border-luxury-stone bg-white/80 text-luxury-black hover:bg-white hover:border-luxury-gold/50",
  ghost: "text-luxury-black hover:bg-luxury-sand/80",
  dark: "bg-luxury-black text-white hover:bg-luxury-charcoal",
};

const Button = forwardRef(function Button(
  { className = "", variant = "primary", type = "button", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
