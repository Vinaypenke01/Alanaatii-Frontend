import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { writerLinks, CURRENT_WRITER_ID } from "./WriterDashboard";
import { mockOrders } from "@/lib/mockData";
import type { Order } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function WriterRevisions() {
  const [orders, setOrders] = useState<Order[]>(
    mockOrders.filter((o) => o.assignedWriterId === CURRENT_WRITER_ID && o.status === "revision_requested")
  );
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(orders.map((o) => [o.id, o.scriptContent ?? ""]))
  );

  const handleResubmit = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "script_submitted" as const, scriptContent: drafts[id] } : o));
    toast.success(`Revised script resubmitted for ${id}!`);
  };

  return (
    <DashboardLayout title="Revisions" links={writerLinks} brandLabel="Script Writer">
      <div className="space-y-6">
        {orders.filter((o) => o.status === "revision_requested").length === 0 && (
          <p className="text-muted-foreground">No revisions pending. Great work! ✨</p>
        )}
        {orders.filter((o) => o.status === "revision_requested").map((order) => (
          <div key={order.id} className="bg-card rounded-xl border p-6 space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">{order.id} — {order.letterType}</h3>
              <p className="text-sm text-muted-foreground">For: {order.recipientName} ({order.relation})</p>
            </div>

            {/* Customer feedback */}
            {order.revisionFeedback && (
              <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
                <p className="text-sm font-medium text-destructive mb-1">Customer Feedback:</p>
                <p className="text-sm text-foreground">{order.revisionFeedback}</p>
              </div>
            )}

            {/* Previous version */}
            {order.scriptVersions && order.scriptVersions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Previous Version (v{order.scriptVersions[order.scriptVersions.length - 1].version}):</p>
                <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground whitespace-pre-line font-serif border">
                  {order.scriptVersions[order.scriptVersions.length - 1].content}
                </div>
              </div>
            )}

            {/* Edit script */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Revised Script:</p>
              <Textarea
                value={drafts[order.id] ?? ""}
                onChange={(e) => setDrafts((p) => ({ ...p, [order.id]: e.target.value }))}
                rows={10}
                className="font-serif text-sm leading-relaxed"
                placeholder="Write your revised script..."
              />
            </div>

            <Button
              onClick={() => handleResubmit(order.id)}
              disabled={!drafts[order.id]?.trim()}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            >
              Resubmit Script
            </Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
