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
      {/* Mobile-Responsive View: Cards on Small Screens */}
      <div className="block lg:hidden space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-card rounded-xl border p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">
                  {o.id}
                </span>
                <div className="mt-2 pt-2 border-t border-dashed">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">Recipient Contact</p>
                      <p className="text-[11px] font-bold text-foreground">{o.recipientName}</p>
                      <p className="text-[10px] text-muted-foreground">{o.recipientPhone}</p>
                    </div>
                    {o.primaryContact === "recipient" && (
                      <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-black h-fit">PRIMARY</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">Ordered By (Sender)</p>
                      <p className="text-[11px] font-bold text-foreground">{o.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{o.customerPhone}</p>
                    </div>
                    {o.primaryContact === "sender" && (
                      <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black h-fit uppercase">PRIMARY</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-lg font-black text-primary">₹{o.total}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t font-medium">
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Assign Writer</p>
                <Select value={o.assignedWriterId ?? ""} onValueChange={(v) => assignWriter(o.id, v)}>
                  <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-none"><SelectValue placeholder="Assign..." /></SelectTrigger>
                  <SelectContent>
                    {mockWriters.filter((w) => w.status === "active").map((w) => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Status</p>
                <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                  <SelectTrigger className="w-full h-9 text-xs bg-primary/5 text-primary border-none font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOrder.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order ID</th>
                <th className="text-left p-4 p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Letter</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Recipient</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Sender (Customer)</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Total</th>
                <th className="text-left p-4 p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Writer</th>
                <th className="text-left p-4 p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">{o.id}</td>
                  <td className="p-4 text-muted-foreground font-medium">{o.letterType}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{o.recipientName}</span>
                      <span className="text-[11px] text-muted-foreground">{o.recipientPhone}</span>
                      {o.primaryContact === "recipient" && (
                        <span className="text-[9px] text-green-600 font-black mt-1">PRIMARY CONTACT</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{o.customerName}</span>
                      <span className="text-[11px] text-muted-foreground">{o.customerPhone}</span>
                      {o.primaryContact === "sender" && (
                        <span className="text-[9px] text-blue-600 font-black mt-1 uppercase">Primary Contact</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-primary font-black">₹{o.total}</td>
                  <td className="p-4">
                    <Select value={o.assignedWriterId ?? ""} onValueChange={(v) => assignWriter(o.id, v)}>
                      <SelectTrigger className="w-[150px] h-8 text-xs bg-muted/20 border-border/50"><SelectValue placeholder="Assign..." /></SelectTrigger>
                      <SelectContent>
                        {mockWriters.filter((w) => w.status === "active").map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                      <SelectTrigger className="w-[180px] h-8 text-xs bg-primary/5 text-primary border-primary/20 font-bold"><SelectValue /></SelectTrigger>
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
