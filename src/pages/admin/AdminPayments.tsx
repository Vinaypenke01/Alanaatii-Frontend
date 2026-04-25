import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders, statusLabels, mockWriters, getWriterById } from "@/lib/mockData";
import type { Order } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, CreditCard, UserPlus, User, Phone, Mail, MapPin, Package, Gift, Type, Clock, Calendar, MessageSquareText, PenLine, ScrollText, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminPayments() {
  const [orders, setOrders] = useState(mockOrders.filter(o => o.status === "payment_pending" || o.paymentScreenshot));
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

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
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "payment_pending" as const } : o));
    toast.error(`Payment for order ${id} rejected. Customer will be notified to re-upload.`);
    setViewingOrder(null);
  };

  return (
    <DashboardLayout title="Verify Payments" links={adminLinks} brandLabel="Admin Panel">
      <div className="relative flex flex-col lg:flex-row gap-6">
        {/* Main List */}
        <div className="transition-all duration-300 w-full">
          <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 border-b bg-muted/10">
              <h2 className="text-lg font-bold text-foreground">Pending Payment Verifications</h2>
              <p className="text-sm text-muted-foreground">Review screenshots and approve payments.</p>
            </div>
            
            <div className="block md:hidden divide-y">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No pending payments.</div>
              ) : (
                orders.map((o) => (
                  <div 
                    key={o.id} 
                    className={cn(
                      "p-4 active:bg-primary/5 transition-colors cursor-pointer",
                      viewingOrder?.id === o.id && "bg-primary/5 border-l-4 border-l-primary"
                    )}
                    onClick={() => setViewingOrder(o)}
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
                        <Eye size={12} /> View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

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
                        viewingOrder?.id === o.id && "bg-primary/5 shadow-inner"
                      )} onClick={() => setViewingOrder(o)}>
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
                                onClick={() => setViewingOrder(o)}
                              >
                                <Eye size={14} /> View Breakdown
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

      {/* Payment Verification Modal */}
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 border-b bg-muted/5">
            <div className="flex justify-between items-start pr-8">
              <div>
                <p className="text-[10px] font-bold uppercase text-primary tracking-widest mb-1">Payment Verification & Breakdown</p>
                <DialogTitle className="font-display text-2xl font-bold">Order #{viewingOrder?.id}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                    viewingOrder?.status === "payment_pending" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-green-50 text-green-700 border-green-200"
                  )}>
                    {viewingOrder ? statusLabels[viewingOrder.status] : ""}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                    <Calendar size={12} /> Ordered: {viewingOrder?.createdAt}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">To be Verified</p>
                <p className="text-3xl font-black text-primary">₹{viewingOrder?.total}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Screenshot Viewer */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CreditCard size={14} className="text-primary" /> Payment Screenshot
                </h4>
                <div className="bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-800 shadow-inner group relative">
                  {viewingOrder?.paymentScreenshot ? (
                    <img 
                      src={viewingOrder.paymentScreenshot} 
                      alt="Payment Receipt" 
                      className="max-w-full h-auto max-h-[500px] object-contain shadow-2xl rounded-lg transition-transform group-hover:scale-[1.02] duration-500"
                    />
                  ) : (
                    <div className="py-20 text-center space-y-4">
                      <AlertCircle size={48} className="text-slate-700 mx-auto" />
                      <p className="text-slate-500 italic">No screenshot uploaded yet.</p>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">
                    RECEIPT
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Please verify the Bank Reference Number and total amount matches exactly before approving. Check for any tampering in the screenshot.
                  </p>
                </div>
              </div>

              {/* Right Column: Order Breakdown */}
              <div className="lg:col-span-7 space-y-8">
                {/* Product Selection */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Package size={14} className="text-primary" /> Project Breakdown
                  </h4>
                  <div className="bg-card border rounded-2xl p-4 grid grid-cols-2 gap-4 shadow-sm">
                    <div className="flex items-center gap-3 border-r pr-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Type size={16} /></div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Type</p>
                        <p className="text-sm font-bold flex items-center gap-2">
                          {viewingOrder?.letterType}
                          <span className="text-[9px] text-primary bg-primary/5 px-1 rounded">₹{viewingOrder?.basePrice || 0}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><MessageSquareText size={16} /></div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Style</p>
                        <p className="text-sm font-bold flex items-center gap-2">
                          {viewingOrder?.textStyle}
                          {viewingOrder?.stylePrice ? <span className="text-[9px] text-primary bg-primary/5 px-1 rounded">₹{viewingOrder.stylePrice}</span> : null}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border-t pt-4 border-r pr-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Package size={16} /></div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Box</p>
                        <p className="text-sm font-bold flex items-center gap-2">
                          {viewingOrder?.box || "None"}
                          {viewingOrder?.boxPrice ? <span className="text-[9px] text-primary bg-primary/5 px-1 rounded">₹{viewingOrder.boxPrice}</span> : null}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border-t pt-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Gift size={16} /></div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Gift</p>
                        <p className="text-sm font-bold flex items-center gap-2">
                          {viewingOrder?.gift || "None"}
                          {viewingOrder?.giftPrice ? <span className="text-[9px] text-primary bg-primary/5 px-1 rounded">₹{viewingOrder.giftPrice}</span> : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Static Quality Details */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2 border border-dashed border-muted-foreground/20">
                      <ShieldCheck size={12} className="text-green-600" />
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">QC Verified</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2 border border-dashed border-muted-foreground/20">
                      <Sparkles size={12} className="text-amber-500" />
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Premium Material</p>
                    </div>
                  </div>
                </div>

                {/* Billing Breakdown - Premium Invoice Style */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CreditCard size={14} className="text-primary" /> Invoice Summary
                  </h4>
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
                    <table className="w-full text-[11px] sm:text-xs">
                      <thead>
                        <tr className="bg-muted/30 border-b">
                          <th className="text-left py-2 px-3 font-bold uppercase text-muted-foreground">Description</th>
                          <th className="text-right py-2 px-3 font-bold uppercase text-muted-foreground">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dashed">
                        <tr>
                          <td className="py-3 px-3">
                            <p className="font-bold text-foreground">Base Product</p>
                            <p className="text-[9px] text-muted-foreground uppercase">{viewingOrder?.letterType}</p>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-foreground">
                            ₹{viewingOrder?.basePrice || (viewingOrder ? viewingOrder.total - (viewingOrder.stylePrice || 0) - (viewingOrder.boxPrice || 0) - (viewingOrder.giftPrice || 0) - (viewingOrder.deliveryPrice || 0) - (viewingOrder.expressPrice || 0) : 0)}
                          </td>
                        </tr>
                        {viewingOrder?.stylePrice ? (
                          <tr>
                            <td className="py-3 px-3">
                              <p className="font-bold text-foreground">Calligraphy Style</p>
                              <p className="text-[9px] text-muted-foreground uppercase">{viewingOrder.textStyle}</p>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-foreground">₹{viewingOrder.stylePrice}</td>
                          </tr>
                        ) : null}
                        {viewingOrder?.boxPrice ? (
                          <tr>
                            <td className="py-3 px-3">
                              <p className="font-bold text-foreground">Luxury Box</p>
                              <p className="text-[9px] text-muted-foreground uppercase">{viewingOrder.box || "Selected Box"}</p>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-foreground">₹{viewingOrder.boxPrice}</td>
                          </tr>
                        ) : null}
                        {viewingOrder?.giftPrice ? (
                          <tr>
                            <td className="py-3 px-3">
                              <p className="font-bold text-foreground">Gift Add-ons</p>
                              <p className="text-[9px] text-muted-foreground uppercase">{viewingOrder.gift || "Selected Gift"}</p>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-foreground">₹{viewingOrder.giftPrice}</td>
                          </tr>
                        ) : null}
                        {viewingOrder?.expressPrice ? (
                          <tr className="text-amber-700">
                            <td className="py-3 px-3">
                              <p className="font-bold">Early Delivery Fee</p>
                            </td>
                            <td className="py-3 px-3 text-right font-bold">₹{viewingOrder.expressPrice}</td>
                          </tr>
                        ) : null}
                        {viewingOrder?.deliveryPrice ? (
                          <tr>
                            <td className="py-3 px-3">
                              <p className="font-bold text-foreground">Shipping Fee</p>
                              <p className="text-[9px] text-muted-foreground uppercase">Pincode: {viewingOrder.pincode}</p>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-foreground">₹{viewingOrder.deliveryPrice}</td>
                          </tr>
                        ) : null}
                      </tbody>
                      <tfoot>
                        {viewingOrder?.discountAmount ? (
                          <tr className="bg-green-50/50">
                            <td className="py-2 px-3 font-bold text-green-700 text-[10px] uppercase">Discount</td>
                            <td className="py-2 px-3 text-right font-black text-green-700">- ₹{viewingOrder.discountAmount}</td>
                          </tr>
                        ) : null}
                        <tr className="bg-primary text-white">
                          <td className="py-3 px-3 font-bold">Grand Total</td>
                          <td className="py-3 px-3 text-right font-black text-base italic">₹{viewingOrder?.total}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border rounded-2xl p-4">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Sender (Customer)</p>
                    <p className="text-sm font-bold">{viewingOrder?.customerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Phone size={10} /> {viewingOrder?.customerPhone}</p>
                  </div>
                  <div className="bg-card border rounded-2xl p-4">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Recipient</p>
                    <p className="text-sm font-bold">{viewingOrder?.recipientName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-bold text-primary"><User size={10} /> {viewingOrder?.relation}</p>
                  </div>
                </div>

                {/* Questionnaire Context */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <MessageSquareText size={14} className="text-primary" /> Personalization Context
                  </h4>
                  <div className="bg-muted/30 border rounded-2xl p-5 space-y-4 italic">
                    {viewingOrder?.userAnswers && viewingOrder.userAnswers.length > 0 ? (
                      viewingOrder.userAnswers.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.question}</p>
                          <p className="text-xs text-foreground leading-relaxed">"{item.answer}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">No questionnaire details submitted yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-muted/5 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
            <div className="hidden sm:block">
              <p className="text-[10px] text-muted-foreground italic uppercase font-bold tracking-tighter">Order Verification Flow</p>
            </div>
            <div className="flex gap-3 col-span-2 sm:justify-end">
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none h-11 px-6 border-red-200 text-red-600 hover:bg-red-50 font-bold gap-2"
                onClick={() => viewingOrder && rejectPayment(viewingOrder.id)}
              >
                <X size={16} /> Reject Payment
              </Button>
              <Button 
                className="flex-1 sm:flex-none h-11 px-10 bg-green-600 hover:bg-green-700 text-white font-bold gap-2 shadow-lg shadow-green-600/20"
                onClick={() => {
                  if (viewingOrder) {
                    verifyPayment(viewingOrder.id);
                    setViewingOrder(null);
                  }
                }}
              >
                <Check size={18} /> Approve & Auto-Assign
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

      {!viewingOrder && (
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
