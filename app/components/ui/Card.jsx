export default function Card({ className = "", children, as: Component = "div", ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-luxury-stone/60 bg-white/90 shadow-glass backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
