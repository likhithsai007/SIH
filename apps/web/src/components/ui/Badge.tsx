type BadgeVariant = "default" | "gold" | "success" | "muted" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-navy text-white",
  gold: "bg-gold-muted text-navy",
  success: "bg-green-100 text-green-800",
  muted: "bg-beige text-warm-gray",
  outline: "border border-border text-warm-gray",
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
