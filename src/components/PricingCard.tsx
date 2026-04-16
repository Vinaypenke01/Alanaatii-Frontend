import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
  badge?: string;
}

export function PricingCard({ title, description, price, image, selected, onClick, badge }: PricingCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md overflow-hidden",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/40"
      )}
    >
      {badge && (
        <span className="absolute -top-1 right-3 bg-gradient-gold text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
          {badge}
        </span>
      )}
      
      <div className="flex items-center">
        {image && (
          <div className="w-24 sm:w-32 h-24 sm:h-28 shrink-0 overflow-hidden border-r">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
              loading="lazy" 
            />
          </div>
        )}
        <div className="p-4 flex-grow">
          <h4 className="font-display font-semibold text-base sm:text-lg text-card-foreground line-clamp-1">{title}</h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          <p className="mt-2 font-semibold text-primary text-base sm:text-lg">₹{price}</p>
        </div>
      </div>
    </button>
  );
}
