import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { writerLinks, CURRENT_WRITER_ID } from "./WriterDashboard";
import { mockOrders, statusLabels } from "@/lib/mockData";
import type { Order } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function WriterEditor() {
  const writableStatuses: Order["status"][] = ["accepted_by_writer", "script_in_progress"];
  const [orders, setOrders] = useState<Order[]>(
    mockOrders.filter((o) => o.assignedWriterId === CURRENT_WRITER_ID && writableStatuses.includes(o.status))
  );
  const [selectedId, setSelectedId] = useState<string>(orders[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(orders.map((o) => [o.id, o.scriptContent ?? ""]))
  );

  const selected = orders.find((o) => o.id === selectedId);

  const saveDraft = () => {
    toast.success("Draft saved!");
  };

  const submitScript = () => {
    if (!selected) return;
    setOrders((prev) => prev.map((o) => o.id === selectedId ? { ...o, status: "script_submitted" as const, scriptContent: drafts[selectedId] } : o));
    toast.success(`Script submitted for ${selectedId}! Customer will be notified.`);
  };

  return (
    <DashboardLayout title="Write Script" links={writerLinks} brandLabel="Script Writer">
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders available for writing. Accept a request first.</p>
      ) : (
        <div className="space-y-6">
          {/* Order selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium text-foreground shrink-0">Select Order:</label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {orders.map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.id} — {o.letterType} for {o.recipientName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Left: User details */}
              <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3 md:space-y-4">
                <h3 className="font-display text-base md:text-lg font-semibold text-foreground">Order Details</h3>
                <DetailRow label="Order ID" value={selected.id} />
                <DetailRow label="Letter Type" value={selected.letterType} />
                <DetailRow label="Recipient" value={`${selected.recipientName} (${selected.relation})`} />
                <DetailRow label="Tone" value={selected.tone || "Not specified"} />
                <DetailRow label="Text Style" value={selected.textStyle} />
                <DetailRow label="Delivery Date" value={selected.deliveryDate} />
                <DetailRow label="Status" value={statusLabels[selected.status]} />

                {selected.userAnswers && selected.userAnswers.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-foreground mb-3">User Answers</p>
                    {selected.userAnswers.map((qa, i) => (
                      <div key={i} className="mb-3">
                        <p className="text-xs text-muted-foreground font-medium">{qa.question}</p>
                        <p className="text-sm text-foreground mt-0.5">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Script editor */}
              <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3 md:space-y-4">
                <h3 className="font-display text-base md:text-lg font-semibold text-foreground">Script Editor</h3>
                <Textarea
                  value={drafts[selectedId] ?? ""}
                  onChange={(e) => setDrafts((p) => ({ ...p, [selectedId]: e.target.value }))}
                  placeholder="Write the letter script here... Pour your heart into it ✨"
                  rows={10}
                  className="font-serif text-sm leading-relaxed"
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button variant="outline" onClick={saveDraft} className="w-full sm:w-auto">Save Draft</Button>
                  <Button
                    onClick={submitScript}
                    disabled={!drafts[selectedId]?.trim()}
                    className="w-full sm:w-auto bg-gradient-gold text-primary-foreground hover:opacity-90"
                  >
                    Submit Script
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between text-sm py-1.5 border-b last:border-0 gap-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground sm:text-right">{value}</span>
    </div>
  );
}