import { cn } from "@/lib/utils";
import { statusOrder, statusLabels } from "@/lib/mockData";
import type { OrderStatus } from "@/lib/mockData";
import { Check } from "lucide-react";

export function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIdx = statusOrder.indexOf(status);
  // For "revision_requested", show up to "customer_review" as current
  const displayIdx = status === "revision_requested" ? statusOrder.indexOf("customer_review") : currentIdx;

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {statusOrder.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center min-w-[60px]">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold",
              i <= displayIdx ? "bg-gradient-gold text-primary-foreground" : "border-2 border-border text-muted-foreground bg-background"
            )}>
              {i <= displayIdx ? <Check size={12} /> : i + 1}
            </div>
            <span className={cn("text-[9px] mt-1 text-center leading-tight max-w-[60px]", i <= displayIdx ? "text-foreground font-medium" : "text-muted-foreground")}>
              {statusLabels[s]}
            </span>
          </div>
          {i < statusOrder.length - 1 && (
            <div className={cn("w-4 h-0.5 mt-[-14px]", i < displayIdx ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  );
}
