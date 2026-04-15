import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  selected?: boolean;
  onClick?: () => void;
  badge?: string;
}

export function PricingCard({ title, description, price, selected, onClick, badge }: PricingCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-lg border-2 p-5 transition-all duration-200 hover:shadow-md",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/40"
      )}
    >
      {badge && (
        <span className="absolute -top-2.5 right-3 bg-gradient-gold text-primary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <h4 className="font-display font-semibold text-lg text-card-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <p className="mt-3 font-semibold text-primary text-lg">₹{price}</p>
    </button>
  );
}
