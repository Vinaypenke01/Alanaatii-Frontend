import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { mockOrders, getWriterById } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

export default function UserScripts() {
  const reviewableStatuses = ["script_submitted", "customer_review"];
  const ordersWithScripts = mockOrders.filter((o) => o.scriptContent && (reviewableStatuses.includes(o.status) || o.scriptApproved));
  const [approvedMap, setApprovedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(ordersWithScripts.map((o) => [o.id, o.scriptApproved ?? false]))
  );
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const handleApprove = (id: string) => {
    setApprovedMap((p) => ({ ...p, [id]: true }));
    toast.success("Script approved! Writer and admin have been notified.");
  };

  const handleRequestChanges = (id: string) => {
    if (!feedbackMap[id]?.trim()) {
      setShowFeedback((p) => ({ ...p, [id]: true }));
      return;
    }
    toast.info("Revision request sent to writer!");
    setShowFeedback((p) => ({ ...p, [id]: false }));
    setFeedbackMap((p) => ({ ...p, [id]: "" }));
  };

  return (
    <DashboardLayout title="Script Review" links={userDashboardLinks} brandLabel="User Dashboard">
      <div className="space-y-6">
        {ordersWithScripts.length === 0 && <p className="text-muted-foreground">No scripts to review.</p>}
        {ordersWithScripts.map((order) => {
          const writer = order.assignedWriterId ? getWriterById(order.assignedWriterId) : null;
          return (
            <div key={order.id} className="bg-card rounded-xl border p-6">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{order.id} — {order.letterType}</h3>
                  {writer && <p className="text-xs text-muted-foreground">Written by: {writer.name}</p>}
                </div>
                {approvedMap[order.id] && (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Approved</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">For: {order.recipientName} ({order.relation})</p>

              {/* Version history */}
              {order.scriptVersions && order.scriptVersions.length > 1 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Version history: {order.scriptVersions.map((v) => `v${v.version} (${v.date})`).join(" → ")}</p>
                </div>
              )}

              <div className="bg-muted rounded-lg p-5 font-serif text-foreground leading-relaxed whitespace-pre-line text-sm border">
                {order.scriptContent}
              </div>

              {!approvedMap[order.id] && (
                <div className="mt-4 space-y-3">
                  {showFeedback[order.id] && (
                    <Textarea
                      placeholder="Describe what changes you'd like..."
                      value={feedbackMap[order.id] ?? ""}
                      onChange={(e) => setFeedbackMap((p) => ({ ...p, [order.id]: e.target.value }))}
                      rows={3}
                    />
                  )}
                  <div className="flex gap-3">
                    <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90"
                      onClick={() => handleApprove(order.id)}>
                      Approve
                    </Button>
                    <Button variant="outline" onClick={() => handleRequestChanges(order.id)}>
                      {showFeedback[order.id] ? "Send Feedback" : "Request Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
