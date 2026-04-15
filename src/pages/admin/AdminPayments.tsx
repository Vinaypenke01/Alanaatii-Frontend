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
      <div className="relative flex min-h-[calc(100vh-12rem)] gap-6">
        {/* Main List */}
        <div className={cn("transition-all duration-300", selectedScreenshot ? "w-1/2" : "w-full")}>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-foreground">Pending Payment Verifications</h2>
              <p className="text-sm text-muted-foreground">Review screenshots and approve payments.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
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
                        <td className="p-4 font-mono font-medium text-foreground">{o.id}</td>
                        <td className="p-4">
                          <p className="font-medium text-foreground">{o.recipientName}</p>
                          <p className="text-xs text-muted-foreground">{statusLabels[o.status]}</p>
                        </td>
                        <td className="p-4 text-primary font-bold">₹{o.total}</td>
                        <td className="p-4">
                          <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                            {o.status === "payment_pending" ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 border-primary text-primary hover:bg-primary/5 gap-2"
                                onClick={() => setSelectedScreenshot(o.paymentScreenshot || "/placeholder.svg")}
                              >
                                <Eye size={14} /> View Receipt
                              </Button>
                            ) : (
                              <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check size={14} /> Verified</span>
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

        {/* Side Panel Viewer */}
        {selectedScreenshot && (
          <div className="w-1/2 h-fit sticky top-0 animate-in slide-in-from-right duration-300">
            <div className="bg-card rounded-xl border overflow-hidden flex flex-col shadow-xl">
              <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <span className="font-bold text-sm flex items-center gap-2"><CreditCard size={16} /> Payment Receipt</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedScreenshot(null)}>
                  <X size={18} />
                </Button>
              </div>
              <div className="p-4 bg-slate-900 flex items-center justify-center min-h-[300px]">
                <img 
                  src={selectedScreenshot} 
                  alt="Payment Receipt" 
                  className="max-w-full max-h-[500px] object-contain shadow-2xl rounded"
                />
              </div>
              <div className="p-4 border-t bg-muted/20 flex flex-col gap-3">
                <p className="text-xs text-muted-foreground text-center">
                  Review the amount and transaction ID carefully.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedScreenshot(null)}>Close</Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                    onClick={() => {
                      const order = orders.find(o => o.paymentScreenshot === selectedScreenshot);
                      if (order) verifyPayment(order.id);
                      setSelectedScreenshot(null);
                    }}
                  >
                    <Check size={16} /> Mark as Verified
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
