import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { writerLinks, CURRENT_WRITER_ID } from "./WriterDashboard";
import { mockOrders, statusLabels } from "@/lib/mockData";
import type { Order } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WriterRequests() {
  const [orders, setOrders] = useState<Order[]>(
    mockOrders.filter((o) => o.assignedWriterId === CURRENT_WRITER_ID)
  );

  const handleAccept = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "accepted_by_writer" as const } : o));
    toast.success(`Order ${id} accepted! You can now start writing.`);
  };

  const handleDecline = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.info(`Order ${id} declined. It will be reassigned to another writer.`);
  };

  const assigned = orders.filter((o) => o.status === "assigned_to_writer");
  const accepted = orders.filter((o) => !["assigned_to_writer", "delivered"].includes(o.status));

  return (
    <DashboardLayout title="Script Requests" links={writerLinks} brandLabel="Script Writer">
      <div className="space-y-8">
        {/* Pending Requests */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Pending Requests</h3>
          {assigned.length === 0 && <p className="text-muted-foreground text-sm">No pending requests.</p>}
          <div className="space-y-4">
            {assigned.map((order) => (
              <div key={order.id} className="bg-card rounded-xl border p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-lg">{order.id} — {order.letterType}</p>
                    <p className="text-sm text-muted-foreground">Recipient: {order.recipientName} ({order.relation})</p>
                    <p className="text-sm text-muted-foreground">Tone: {order.tone || "Not specified"}</p>
                    <p className="text-sm text-muted-foreground">Delivery by: {order.deliveryDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAccept(order.id)} className="bg-gradient-gold text-primary-foreground hover:opacity-90">
                      Accept
                    </Button>
                    <Button variant="outline" onClick={() => handleDecline(order.id)}>
                      Decline
                    </Button>
                  </div>
                </div>
                {order.userAnswers && order.userAnswers.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium text-foreground mb-2">User Answers:</p>
                    {order.userAnswers.map((qa, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-xs text-muted-foreground">{qa.question}</p>
                        <p className="text-sm text-foreground">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Accepted / In Progress */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Accepted Orders</h3>
          {accepted.length === 0 && <p className="text-muted-foreground text-sm">No accepted orders.</p>}
          <div className="space-y-3">
            {accepted.map((order) => (
              <div key={order.id} className="bg-card rounded-xl border p-5 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-foreground">{order.id} — {order.letterType}</p>
                  <p className="text-sm text-muted-foreground">For: {order.recipientName}</p>
                </div>
                <span className={cn(
                  "text-xs px-3 py-1 rounded-full font-medium",
                  order.status === "revision_requested" ? "bg-destructive/15 text-destructive" :
                  order.status === "approved" ? "bg-green-100 text-green-700" :
                  "bg-primary/15 text-primary"
                )}>
                  {statusLabels[order.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
