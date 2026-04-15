import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders, statusLabels, statusOrder, mockWriters, getWriterById } from "@/lib/mockData";
import type { Order, OrderStatus } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState(mockOrders);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    toast.success(`Order ${id} updated to ${statusLabels[status]}`);
  };

  const assignWriter = (id: string, writerId: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, assignedWriterId: writerId, status: "assigned_to_writer" as const } : o));
    const writer = getWriterById(writerId);
    toast.success(`Order ${id} assigned to ${writer?.name}`);
  };

  return (
    <DashboardLayout title="Manage Orders" links={adminLinks} brandLabel="Admin Panel">
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Letter</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Recipient</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Writer</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="p-4 font-medium text-foreground">{o.id}</td>
                  <td className="p-4 text-muted-foreground">{o.letterType}</td>
                  <td className="p-4 text-muted-foreground">{o.recipientName}</td>
                  <td className="p-4 text-primary font-semibold">₹{o.total}</td>
                  <td className="p-4">
                    <Select value={o.assignedWriterId ?? ""} onValueChange={(v) => assignWriter(o.id, v)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Assign..." /></SelectTrigger>
                      <SelectContent>
                        {mockWriters.filter((w) => w.status === "active").map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                      <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOrder.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
