import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders, statusLabels, mockWriters, getWriterById } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, CreditCard, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminPayments() {
  const [orders, setOrders] = useState(mockOrders.filter(o => o.status === "payment_pending" || o.paymentScreenshot));
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const findLeastLoadedWriter = () => {
    const activeWriters = mockWriters.filter(w => w.status === "active");
    // Count active assignments for each writer in the mock data
    const writerCounts = activeWriters.map(writer => {
      const count = mockOrders.filter(o => o.assignedWriterId === writer.id && !["delivered", "payment_pending"].includes(o.status)).length;
      return { id: writer.id, count };
    });
    
    // Sort by count and pick the first
    writerCounts.sort((a, b) => a.count - b.count);
    return writerCounts[0]?.id;
  };

  const verifyPayment = (id: string) => {
    const bestWriterId = findLeastLoadedWriter();
    const writer = bestWriterId ? getWriterById(bestWriterId) : null;

    setOrders((prev) => prev.map((o) => 
      o.id === id 
        ? { 
            ...o, 
            status: "assigned_to_writer" as const, 
            assignedWriterId: bestWriterId 
          } 
        : o
    ));
    
    if (writer) {
      toast.success(`Payment verified! Auto-assigned to ${writer.name} (Least loaded).`);
    } else {
      toast.success(`Payment verified! Order status updated to Order Placed.`);
    }
  };

  const rejectPayment = (id: string) => {
    toast.error(`Payment for order ${id} rejected.`);
  };

  return (
    <DashboardLayout title="Verify Payments" links={adminLinks} brandLabel="Admin Panel">
      <div className="relative flex flex-col lg:flex-row gap-6">
        {/* Main List */}
        <div className={cn("transition-all duration-300 w-full", selectedScreenshot && "lg:w-1/2")}>
          <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 border-b bg-muted/10">
              <h2 className="text-lg font-bold text-foreground">Pending Payment Verifications</h2>
              <p className="text-sm text-muted-foreground">Review screenshots and approve payments.</p>
            </div>
            
            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No pending payments.</div>
              ) : (
                orders.map((o) => (
                  <div 
                    key={o.id} 
                    className={cn(
                      "p-4 active:bg-primary/5 transition-colors cursor-pointer",
                      selectedScreenshot === o.paymentScreenshot && "bg-primary/5 border-l-4 border-l-primary"
                    )}
                    onClick={() => setSelectedScreenshot(o.paymentScreenshot || "/placeholder.svg")}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-mono text-xs font-bold text-primary">{o.id}</span>
                       <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                        o.status === "payment_pending" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700"
                      )}>
                        {statusLabels[o.status]}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-bold text-foreground">{o.recipientName}</p>
                        <p className="text-sm font-black text-primary mt-1">₹{o.total}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-primary text-primary hover:bg-primary/5 gap-2 text-xs"
                      >
                        <Eye size={12} /> View
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order ID</th>
                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Customer</th>
                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Total</th>
                    <th className="text-center p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">No pending payments.</td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className={cn(
                        "border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                        selectedScreenshot === o.paymentScreenshot && "bg-primary/5 shadow-inner"
                      )} onClick={() => setSelectedScreenshot(o.paymentScreenshot || "/placeholder.svg")}>
                        <td className="p-4 font-mono font-bold text-foreground">{o.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-foreground">{o.recipientName}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{statusLabels[o.status]}</p>
                        </td>
                        <td className="p-4 text-primary font-black">₹{o.total}</td>
                        <td className="p-4">
                          <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                            {o.status === "payment_pending" ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 border-primary text-primary hover:bg-primary/5 gap-2 shadow-sm"
                                onClick={() => setSelectedScreenshot(o.paymentScreenshot || "/placeholder.svg")}
                              >
                                <Eye size={14} /> View Receipt
                              </Button>
                            ) : (
                              <span className="text-xs text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-100 italic"><Check size={14} /> Verified</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel Viewer / Overlay on Mobile */}
        {selectedScreenshot && (
          <div className="w-full lg:w-1/2 h-fit lg:sticky lg:top-0 animate-in slide-in-from-bottom lg:slide-in-from-right duration-300 z-10">
            <div className="bg-card rounded-xl border overflow-hidden flex flex-col shadow-2xl ring-1 ring-black/5">
              <div className="p-4 border-b flex items-center justify-between bg-muted/40">
                <span className="font-bold text-sm tracking-tight flex items-center gap-2"><CreditCard size={16} className="text-primary" /> Payment Receipt</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSelectedScreenshot(null)}>
                  <X size={18} />
                </Button>
              </div>
              <div className="p-4 bg-slate-900 flex items-center justify-center min-h-[350px]">
                <img 
                  src={selectedScreenshot} 
                  alt="Payment Receipt" 
                  className="max-w-full max-h-[60vh] lg:max-h-[500px] object-contain shadow-2xl rounded-lg"
                />
              </div>
              <div className="p-4 lg:p-6 border-t bg-card flex flex-col gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-dashed text-center">
                  <p className="text-xs text-muted-foreground font-medium">
                    Please verify the bank reference and total amount matched before approving.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => setSelectedScreenshot(null)}>Close</Button>
                  <Button 
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white gap-2 font-bold shadow-lg shadow-green-600/20"
                    onClick={() => {
                      const order = orders.find(o => o.paymentScreenshot === selectedScreenshot);
                      if (order) verifyPayment(order.id);
                      setSelectedScreenshot(null);
                    }}
                  >
                    <Check size={18} /> Approve Payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!selectedScreenshot && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
              <CreditCard size={20} />
            </div>
            <h3 className="font-bold text-foreground">Payment Summary</h3>
            <p className="text-3xl font-black text-primary mt-2">₹{orders.reduce((s, o) => s + (o.status === "payment_pending" ? o.total : 0), 0)}</p>
            <p className="text-sm text-muted-foreground mt-1">Pending verification total</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
