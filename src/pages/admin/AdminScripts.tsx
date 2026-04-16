import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders, statusLabels, getWriterById } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function AdminScripts() {
  const scriptOrders = mockOrders.filter((o) => o.assignedWriterId);

  return (
    <DashboardLayout title="Script Tracking" links={adminLinks} brandLabel="Admin Panel">
      {/* Mobile-Responsive Cards */}
      <div className="block lg:hidden space-y-4">
        {scriptOrders.map((o) => {
          const writer = getWriterById(o.assignedWriterId!);
          return (
            <div key={o.id} className="bg-card rounded-xl border p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">
                  {o.id}
                </span>
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                  o.status === "approved" || o.status === "delivered" ? "bg-green-100 text-green-700 border-green-200" :
                  o.status === "revision_requested" ? "bg-destructive/10 text-destructive border-destructive/20" :
                  "bg-muted text-muted-foreground border-border"
                )}>
                  {statusLabels[o.status]}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">{o.letterType}</h4>
                <p className="text-xs text-muted-foreground italic">For {o.recipientName}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[8px] uppercase">
                      {writer?.name.charAt(0) ?? "?"}
                   </div>
                   <span className="text-xs font-medium text-foreground">{writer?.name ?? "Unassigned"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{o.scriptVersions?.length ?? 0} versions</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Letter Info</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Assigned Writer</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Script Status</th>
                <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">History</th>
              </tr>
            </thead>
            <tbody>
              {scriptOrders.map((o) => {
                const writer = getWriterById(o.assignedWriterId!);
                return (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{o.id}</td>
                    <td className="p-4">
                       <p className="font-bold text-foreground">{o.letterType}</p>
                       <p className="text-[11px] text-muted-foreground italic">Recipient: {o.recipientName}</p>
                    </td>
                    <td className="p-4">
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase border border-primary/20">
                             {writer?.name.charAt(0) ?? "U"}
                          </div>
                          <span className="font-medium text-foreground">{writer?.name ?? "Unassigned"}</span>
                       </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border shadow-sm",
                        o.status === "approved" || o.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" :
                        o.status === "revision_requested" ? "bg-destructive/5 text-destructive border-destructive/15" :
                        o.status === "script_submitted" || o.status === "customer_review" ? "bg-accent/10 text-accent border-accent/20" :
                        "bg-muted text-muted-foreground border-border"
                      )}>
                        {statusLabels[o.status]}
                      </span>
                    </td>
                    <td className="p-4 text-right text-muted-foreground font-bold">
                       {o.scriptVersions?.length ?? 0} <span className="text-[10px]">VERSIONS</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
