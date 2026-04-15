import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders, statusLabels, getWriterById } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function AdminScripts() {
  const scriptOrders = mockOrders.filter((o) => o.assignedWriterId);

  return (
    <DashboardLayout title="Script Tracking" links={adminLinks} brandLabel="Admin Panel">
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Order</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Letter Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Assigned Writer</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Script Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Revisions</th>
              </tr>
            </thead>
            <tbody>
              {scriptOrders.map((o) => {
                const writer = getWriterById(o.assignedWriterId!);
                return (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="p-4 font-medium text-foreground">{o.id}</td>
                    <td className="p-4 text-muted-foreground">{o.letterType} for {o.recipientName}</td>
                    <td className="p-4 text-foreground">{writer?.name ?? "—"}</td>
                    <td className="p-4">
                      <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full font-medium",
                        o.status === "approved" || o.status === "delivered" ? "bg-green-100 text-green-700" :
                        o.status === "revision_requested" ? "bg-destructive/15 text-destructive" :
                        o.status === "script_submitted" || o.status === "customer_review" ? "bg-accent/20 text-accent" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {statusLabels[o.status]}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{o.scriptVersions?.length ?? 0} version(s)</td>
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
