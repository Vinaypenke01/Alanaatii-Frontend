import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center min-w-[60px]">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                i < current
                  ? "bg-gradient-gold text-primary-foreground"
                  : i === current
                  ? "border-2 border-primary text-primary bg-background"
                  : "border-2 border-border text-muted-foreground bg-background"
              )}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={cn(
              "text-xs mt-1 text-center leading-tight whitespace-nowrap",
              i <= current ? "text-foreground font-medium" : "text-muted-foreground"
            )}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "w-6 h-0.5 mx-0.5 mt-[-12px]",
              i < current ? "bg-primary" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
