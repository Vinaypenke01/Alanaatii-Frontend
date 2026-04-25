import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders, statusLabels, statusOrder, mockWriters, getWriterById } from "@/lib/mockData";
import type { Order, OrderStatus } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye, User, Phone, Mail, MapPin, Package, Gift, Type, Clock, Calendar, CheckCircle2, History, MessageSquareText, PenLine, ScrollText, Copy, Check, CreditCard, ShieldCheck, Sparkles, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("approved");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    if (activeTab === "customer_review") return ["customer_review", "script_submitted"].includes(order.status);
    return order.status === activeTab;
  });

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
      <div className="space-y-6">
        {/* Tabs Filter */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 p-1 mb-6 w-full flex overflow-x-auto justify-start no-scrollbar h-auto min-h-[44px]">
            <TabsTrigger value="all" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
              All Orders
            </TabsTrigger>
            <TabsTrigger value="payment_pending" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white whitespace-nowrap">
              1. Payment Pending
            </TabsTrigger>
            <TabsTrigger value="order_placed" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white whitespace-nowrap">
              2. Order Placed
            </TabsTrigger>
            <TabsTrigger value="awaiting_details" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-purple-400 data-[state=active]:text-white whitespace-nowrap">
              3. Awaiting Details
            </TabsTrigger>
            <TabsTrigger value="assigned_to_writer" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white whitespace-nowrap">
              4. Assigned to Writer
            </TabsTrigger>
            <TabsTrigger value="assignment_rejected" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-red-600 data-[state=active]:text-white whitespace-nowrap">
              5. Assignment Rejected
            </TabsTrigger>
            <TabsTrigger value="accepted_by_writer" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white whitespace-nowrap">
              6. Accepted by Writer
            </TabsTrigger>
            <TabsTrigger value="customer_review" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white whitespace-nowrap">
              7. Customer Review
            </TabsTrigger>
            <TabsTrigger value="revision_requested" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white whitespace-nowrap">
              8. Revision Requested
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-green-600 data-[state=active]:text-white whitespace-nowrap">
              9. Approved
            </TabsTrigger>
            <TabsTrigger value="under_writing" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white whitespace-nowrap">
              10. Under Writing
            </TabsTrigger>
            <TabsTrigger value="out_for_delivery" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white whitespace-nowrap">
              11. Out for Delivery
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white whitespace-nowrap">
              12. Delivered
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Mobile-Responsive View: Cards on Small Screens */}
        <div className="block lg:hidden space-y-4">
          {filteredOrders.length > 0 ? filteredOrders.map((o) => (
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
              <div className="text-right">
                <p className="text-lg font-black text-primary">₹{o.total}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setViewingOrder(o)}
                  className="mt-1 h-7 px-2 text-[10px] font-bold text-primary hover:bg-primary/5 border border-primary/20"
                >
                  <Eye size={12} className="mr-1" /> View Config
                </Button>
              </div>
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
          )) : (
            <div className="p-12 text-center bg-card border rounded-xl italic text-muted-foreground">
              No orders found in this category.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-card rounded-xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order ID</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Letter</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Recipient</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Sender (Customer)</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Total</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Writer</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? filteredOrders.map((o) => (
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
                  <td className="p-4 text-center">
                    <Select value={o.assignedWriterId ?? ""} onValueChange={(v) => assignWriter(o.id, v)}>
                      <SelectTrigger className="w-full h-8 text-xs bg-muted/30 border-none"><SelectValue placeholder="Assign..." /></SelectTrigger>
                      <SelectContent>
                        {mockWriters.filter((w) => w.status === "active").map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                        <SelectTrigger className="w-full h-8 text-xs bg-primary/5 text-primary border-none font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statusOrder.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setViewingOrder(o)}
                        className="h-7 w-full text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/5"
                      >
                        <Eye size={12} className="mr-1" /> View Configuration
                      </Button>
                    </div>
                  </td>
                </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center italic text-muted-foreground">
                      No orders found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Configuration Viewer Modal */}
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 border-b bg-muted/5">
            <div className="flex justify-between items-start pr-8">
              <div>
                <p className="text-[10px] font-bold uppercase text-primary tracking-widest mb-1">Configuration Overview</p>
                <DialogTitle className="font-display text-2xl font-bold">Order #{viewingOrder?.id}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                    viewingOrder?.status === "approved" || viewingOrder?.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                  )}>
                    {viewingOrder ? statusLabels[viewingOrder.status] : ""}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                    <Calendar size={12} /> {viewingOrder?.createdAt}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Total Value</p>
                <p className="text-3xl font-black text-primary">₹{viewingOrder?.total}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Package size={14} className="text-primary" /> Product Selection
                </h4>
                <div className="bg-card border rounded-2xl p-4 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Type size={16} /></div>
                      <p className="text-sm font-bold text-foreground">Letter Type</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {viewingOrder?.letterType}
                      <span className="ml-2 text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded">₹{viewingOrder?.basePrice || 0}</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><MessageSquareText size={16} /></div>
                      <p className="text-sm font-bold text-foreground">Text Style</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {viewingOrder?.textStyle}
                      {viewingOrder?.stylePrice ? <span className="ml-2 text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded">₹{viewingOrder.stylePrice}</span> : null}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Package size={16} /></div>
                      <p className="text-sm font-bold text-foreground">Luxury Box</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {viewingOrder?.box || "None"}
                      {viewingOrder?.boxPrice ? <span className="ml-2 text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded">₹{viewingOrder.boxPrice}</span> : null}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Gift size={16} /></div>
                      <p className="text-sm font-bold text-foreground">Gift Add-on</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {viewingOrder?.gift || "None"}
                      {viewingOrder?.giftPrice ? <span className="ml-2 text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded">₹{viewingOrder.giftPrice}</span> : null}
                    </p>
                  </div>
                  
                  {/* Static Quality Details */}
                  <div className="pt-4 grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2">
                      <ShieldCheck size={14} className="text-green-600" />
                      <div>
                        <p className="text-[8px] font-black uppercase text-muted-foreground leading-none">QC Status</p>
                        <p className="text-[10px] font-bold text-foreground">Verified</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" />
                      <div>
                        <p className="text-[8px] font-black uppercase text-muted-foreground leading-none">Material</p>
                        <p className="text-[10px] font-bold text-foreground">Premium 300GSM</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2">
                      <Feather size={14} className="text-blue-500" />
                      <div>
                        <p className="text-[8px] font-black uppercase text-muted-foreground leading-none">Ink Type</p>
                        <p className="text-[10px] font-bold text-foreground">Calligraphy Ink</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      <div>
                        <p className="text-[8px] font-black uppercase text-muted-foreground leading-none">Crafted</p>
                        <p className="text-[10px] font-bold text-foreground">Handmade</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin size={14} className="text-primary" /> Delivery Details
                </h4>
                <div className="bg-card border rounded-2xl p-4 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Calendar size={16} /></div>
                      <p className="text-sm font-bold text-foreground">Target Date</p>
                    </div>
                    <p className="text-sm font-medium">{viewingOrder?.deliveryDate}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><MapPin size={16} /></div>
                      <p className="text-sm font-bold text-foreground">Shipping Address</p>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm text-foreground font-medium">{viewingOrder?.address}</p>
                      <p className="text-xs text-muted-foreground">{viewingOrder?.city} - {viewingOrder?.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown Section - Premium Invoice Style */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CreditCard size={14} className="text-primary" /> Invoice Summary
              </h4>
              <div className="bg-white border rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
                <div className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30 border-b">
                        <th className="text-left py-3 px-4 text-[10px] font-bold uppercase text-muted-foreground">Description</th>
                        <th className="text-right py-3 px-4 text-[10px] font-bold uppercase text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dashed">
                      <tr className="hover:bg-muted/5 transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-bold text-foreground">Base Product</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{viewingOrder?.letterType}</p>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-foreground">
                          ₹{viewingOrder?.basePrice || (viewingOrder ? viewingOrder.total - (viewingOrder.stylePrice || 0) - (viewingOrder.boxPrice || 0) - (viewingOrder.giftPrice || 0) - (viewingOrder.deliveryPrice || 0) - (viewingOrder.expressPrice || 0) : 0)}
                        </td>
                      </tr>
                      {viewingOrder?.stylePrice ? (
                        <tr className="hover:bg-muted/5 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-foreground">Calligraphy Style</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{viewingOrder.textStyle}</p>
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-foreground">₹{viewingOrder.stylePrice}</td>
                        </tr>
                      ) : null}
                      {viewingOrder?.boxPrice ? (
                        <tr className="hover:bg-muted/5 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-foreground">Luxury Box</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{viewingOrder.box || "Selected Box"}</p>
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-foreground">₹{viewingOrder.boxPrice}</td>
                        </tr>
                      ) : null}
                      {viewingOrder?.giftPrice ? (
                        <tr className="hover:bg-muted/5 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-foreground">Gift Add-ons</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{viewingOrder.gift || "Selected Gift"}</p>
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-foreground">₹{viewingOrder.giftPrice}</td>
                        </tr>
                      ) : null}
                      {viewingOrder?.expressPrice ? (
                        <tr className="hover:bg-muted/5 transition-colors">
                          <td className="py-4 px-4 text-amber-700">
                            <p className="font-bold">Early Delivery Fee</p>
                            <p className="text-[10px] uppercase font-medium">Processing Priority</p>
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-amber-700">₹{viewingOrder.expressPrice}</td>
                        </tr>
                      ) : null}
                      {viewingOrder?.deliveryPrice ? (
                        <tr className="hover:bg-muted/5 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-foreground">Shipping & Handling</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Pincode: {viewingOrder.pincode}</p>
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-foreground">₹{viewingOrder.deliveryPrice}</td>
                        </tr>
                      ) : null}
                    </tbody>
                    <tfoot>
                      {viewingOrder?.discountAmount ? (
                        <tr className="bg-green-50/50">
                          <td className="py-3 px-4 font-bold text-green-700 text-xs uppercase">Coupon Discount</td>
                          <td className="py-3 px-4 text-right font-black text-green-700">- ₹{viewingOrder.discountAmount}</td>
                        </tr>
                      ) : null}
                      <tr className="bg-primary text-white">
                        <td className="py-4 px-4 font-display text-lg font-bold">Grand Total</td>
                        <td className="py-4 px-4 text-right font-display text-2xl font-black italic">₹{viewingOrder?.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User size={14} className="text-primary" /> Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <span className={cn(
                      "text-[8px] px-2 py-0.5 rounded font-black uppercase",
                      viewingOrder?.primaryContact === "sender" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"
                    )}>
                      {viewingOrder?.primaryContact === "sender" ? "PRIMARY" : "SENDER"}
                    </span>
                  </div>
                  <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    Sender: {viewingOrder?.customerName}
                  </h5>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Phone size={12} /> {viewingOrder?.customerPhone}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Mail size={12} /> {viewingOrder?.customerEmail}</p>
                  </div>
                </div>
                <div className="bg-card border rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <span className={cn(
                      "text-[8px] px-2 py-0.5 rounded font-black uppercase",
                      viewingOrder?.primaryContact === "recipient" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    )}>
                      {viewingOrder?.primaryContact === "recipient" ? "PRIMARY" : "RECIPIENT"}
                    </span>
                  </div>
                  <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    Recipient: {viewingOrder?.recipientName}
                  </h5>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-2 text-primary font-bold"><User size={12} /> Relation: {viewingOrder?.relation}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Phone size={12} /> {viewingOrder?.recipientPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Relationship Questionnaire Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MessageSquareText size={14} className="text-primary" /> Personalization Context (Questionnaire)
              </h4>
              <div className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm bg-muted/5">
                {viewingOrder?.userAnswers && viewingOrder.userAnswers.length > 0 ? (
                  viewingOrder.userAnswers.map((item, idx) => (
                    <div key={idx} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                      <p className="text-sm font-bold text-foreground">{idx + 1}. {item.question}</p>
                      <p className="text-sm text-muted-foreground italic leading-relaxed pl-4 border-l-2 border-primary/20">"{item.answer}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Clock size={32} className="text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">Questionnaire answers have not been submitted yet.</p>
                  </div>
                )}
                
                {viewingOrder?.specialNotes && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Special Notes / Instructions</p>
                    <p className="text-sm text-foreground bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                      {viewingOrder.specialNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Script & Writer Timeline Section */}
            {(viewingOrder?.scriptContent || viewingOrder?.assignedWriterId) && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <PenLine size={14} className="text-primary" /> Script & Writer Timeline
                </h4>
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5 border-b bg-muted/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {viewingOrder?.assignedWriterId ? getWriterById(viewingOrder.assignedWriterId)?.name.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Assigned Writer</p>
                        <p className="text-sm font-bold text-foreground">
                          {viewingOrder?.assignedWriterId ? getWriterById(viewingOrder.assignedWriterId)?.name : "Not Assigned"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {viewingOrder?.assignedAt && (
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground">Assigned On</p>
                          <p className="text-[11px] font-medium text-foreground">{viewingOrder.assignedAt}</p>
                        </div>
                      )}
                      {viewingOrder?.submittedAt && (
                        <div className="text-right border-l pl-4">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground">Submitted On</p>
                          <p className="text-[11px] font-medium text-foreground">{viewingOrder.submittedAt}</p>
                        </div>
                      )}
                      {viewingOrder?.approvedAt && (
                        <div className="text-right border-l pl-4">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground text-green-600">Approved On</p>
                          <p className="text-[11px] font-bold text-green-700">{viewingOrder.approvedAt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {viewingOrder?.scriptContent && (
                    <div className="p-6 bg-muted/5 relative group">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                          <ScrollText size={12} /> Final Script Content
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(viewingOrder.scriptContent!)}
                          className="h-7 px-2 text-[10px] font-bold text-primary hover:bg-primary/5 border border-primary/10"
                        >
                          {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                          {copied ? "Copied" : "Copy Script"}
                        </Button>
                      </div>
                      <div className="font-serif text-lg leading-relaxed text-foreground whitespace-pre-wrap italic bg-white p-6 rounded-xl border border-dashed border-primary/20 shadow-inner">
                        {viewingOrder.scriptContent}
                      </div>
                    </div>
                  )}
                  
                  {viewingOrder?.revisionFeedback && (
                    <div className="m-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                      <div className="flex items-center gap-2 text-red-600 mb-1">
                        <History size={12} />
                        <p className="text-[10px] font-bold uppercase tracking-wider">Revision Request Details</p>
                      </div>
                      <p className="text-xs text-red-700 leading-relaxed italic">{viewingOrder.revisionFeedback}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 border-t bg-muted/5 flex justify-between sm:justify-between items-center">
            <p className="text-[10px] text-muted-foreground italic hidden sm:block">Alanaatii Order Management System • ID: {viewingOrder?.id}</p>
            <Button onClick={() => setViewingOrder(null)} className="bg-gradient-gold text-primary-foreground font-bold px-8 shadow-md">
              Close Overview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
