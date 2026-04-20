import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { StatusTimeline } from "@/components/StatusTimeline";
import { mockOrders, statusLabels, productTypeLabels, getWriterById } from "@/lib/mockData";
import { ArrowLeft, Check, FileText, Send, MessageSquare, Star, Truck, MapPin, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function UserOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(mockOrders.find((o) => o.id === orderId));
  const [revisionText, setRevisionText] = useState("");
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!order) {
    return (
      <DashboardLayout title="Order Not Found" links={userDashboardLinks} brandLabel="User Dashboard">
        <p className="text-muted-foreground">Order not found.</p>
      </DashboardLayout>
    );
  }

  const writer = order.assignedWriterId ? getWriterById(order.assignedWriterId) : null;

  // Simulate tracking data
  const trackingData = {
    courierName: order.courierName || "Delhivery",
    trackingId: order.trackingId || "ALN" + Math.random().toString().slice(2, 10).toUpperCase(),
    estArrival: order.estArrival || format(new Date(), "MMMM dd, yyyy"),
    shippedAt: order.shippedAt || format(new Date(), "PP p"),
  };

  const isShipped = ["out_for_delivery", "delivered"].includes(order.status);

  return (
    <DashboardLayout title={`Order ${order.id}`} links={userDashboardLinks} brandLabel="User Dashboard">
      <div className="space-y-4 md:space-y-6">
        <Link to="/dashboard/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft size={16} className="mr-1" /> Back to Orders
        </Link>

        {/* Status Timeline */}
        <div className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm">
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-6">Fulfillment Journey</h2>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <StatusTimeline status={order.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Main Content: Script & Review */}
           <div className="lg:col-span-2 space-y-6">
              {/* Script Review Section */}
              {order.scriptContent && (
                <div className="bg-card rounded-2xl border p-6 md:p-8 space-y-4 shadow-sm border-primary/10">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                      <FileText size={20} className="text-primary" /> Script Draft
                    </h2>
                    {order.status === "script_submitted" && (
                      <span className="bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border border-primary/10">New Draft</span>
                    )}
                  </div>
                  
                  <div className="bg-muted/10 rounded-xl p-6 border border-border/50 font-serif text-sm md:text-base leading-relaxed text-foreground whitespace-pre-line shadow-inner min-h-[200px] relative">
                    <div className="absolute top-4 right-4 opacity-10"><FileText size={48} /></div>
                    {order.scriptContent}
                  </div>

                  {order.status === "script_submitted" ? (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button 
                        className="flex-1 bg-gradient-gold text-primary-foreground font-bold gap-2 h-12 shadow-lg"
                        onClick={() => {
                          setOrder({...order, status: "approved" as any});
                          toast.success("Script approved! Our artists will now begin the physical calligraphy.");
                        }}
                      >
                        <Check size={18} /> Approve & Finalize
                      </Button>
                      
                      <Dialog open={revisionOpen} onOpenChange={setRevisionOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/5 gap-2 h-12 font-bold">
                            <MessageSquare size={18} /> Request Revision
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="font-display text-xl">Request Customization Change</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Label htmlFor="revision-note" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What should the writer change?</Label>
                            <Textarea 
                              id="revision-note" 
                              placeholder="e.g., 'Make it sound more romantic', 'Mention the special memory we shared at the beach'..." 
                              value={revisionText}
                              onChange={(e) => setRevisionText(e.target.value)}
                              rows={5}
                              className="bg-muted/30 border-none"
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="ghost" onClick={() => setRevisionOpen(false)}>Cancel</Button>
                            <Button 
                              disabled={!revisionText.trim()}
                              onClick={() => {
                                setOrder({...order, status: "revision_requested" as any, revisionFeedback: revisionText});
                                setRevisionOpen(false);
                                toast.success("Feedback sent! Writer will update the script soon.");
                              }}
                              className="bg-primary text-white gap-2 font-bold px-8"
                            >
                              <Send size={16} /> Submit Feedback
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : ["approved", "under_writing", "delivered"].includes(order.status) ? (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-3">
                       <CheckCircle2 size={18} className="text-green-600" />
                       <p className="text-xs text-green-700 font-bold uppercase tracking-wider">
                         This script has been finalized and approved.
                       </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Rating & Review Section */}
              {order.status === "delivered" && (
                <div className="bg-card rounded-2xl border p-6 md:p-8 space-y-4 border-primary/20 bg-primary/5 shadow-sm">
                  <h2 className="font-display text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                    <Star size={20} className="text-primary fill-primary" /> Share the Magic
                  </h2>
                  
                  {!reviewSubmitted ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground italic">How was your Alanaatii experience? Your feedback helps us perfect the art of gifting.</p>
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button 
                            key={s} 
                            onClick={() => setRating(s)}
                            className={cn(
                              "transition-all duration-200 hover:scale-125 transform",
                              rating >= s ? "text-primary" : "text-muted"
                            )}
                          >
                            <Star size={36} fill={rating >= s ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="review" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Write a testimonial</Label>
                        <Textarea 
                          id="review" 
                          placeholder="The calligraphy was breathtaking..." 
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          rows={3}
                          className="bg-card border-border/50 shadow-sm"
                        />
                      </div>

                      <Button 
                        disabled={rating === 0}
                        onClick={() => {
                          setReviewSubmitted(true);
                          toast.success("Feedback shared! Your words mean a lot to us. ✨");
                        }}
                        className="w-full sm:w-auto bg-gradient-gold text-primary-foreground font-bold h-12 px-10 shadow-lg"
                      >
                        Publish Testimonial
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-6 text-center">
                      <CheckCircle2 size={32} className="text-green-600 mx-auto mb-3" />
                      <p className="text-green-700 font-bold mb-1">Testimonial Published!</p>
                      <p className="text-xs text-muted-foreground">Thank you for being part of the Alanaatii family.</p>
                    </div>
                  )}
                </div>
              )}
           </div>

           {/* Sidebar: Delivery Tracking & Order Info */}
           <div className="space-y-6">
              {/* Delivery Tracking Card */}
              <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Truck size={20} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">Delivery Tracking</h3>
                </div>

                {isShipped ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Courier Partner</p>
                      <p className="text-sm font-bold text-foreground">{trackingData.courierName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Tracking Number</p>
                      <div className="flex items-center group cursor-pointer">
                        <p className="text-sm font-mono font-bold text-primary mr-2 uppercase tracking-tight">{trackingData.trackingId}</p>
                        <ExternalLink size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="pt-2 flex items-center gap-3 text-sm font-medium text-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                       <Clock size={16} className="text-primary" />
                       <span>ETA: {trackingData.estArrival}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3 bg-muted/30 rounded-xl border border-dashed border-border">
                    <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                      <MapPin size={24} />
                    </div>
                    <div className="space-y-1 px-4">
                      <p className="text-xs font-bold text-foreground">Awaiting Dispatch</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">Tracking details will be shared here once the artist finishes the creation.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Quick Details */}
              <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-4">
                <h3 className="font-display text-lg font-bold text-foreground border-b pb-3 mb-2">Order Info</h3>
                <div className="space-y-3">
                  <DetailRow label="Product" value={productTypeLabels[order.productType]} />
                  <DetailRow label="Recipient" value={order.recipientName} />
                  <DetailRow label="Total Value" value={`₹${order.total}`} highlight />
                </div>
              </div>

              {/* Payment Receipt */}
              {order.paymentScreenshot && (
                <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-4">
                   <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-widest">Payment Proof</h3>
                   <div className="relative group overflow-hidden rounded-xl border-4 border-white shadow-md">
                      <img 
                        src={order.paymentScreenshot} 
                        alt="Payment Receipt" 
                        className="w-full aspect-square object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110" 
                        onClick={() => window.open(order.paymentScreenshot, "_blank")} 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button variant="secondary" size="sm" className="font-bold text-[10px] uppercase gap-2">View Receipt</Button>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold text-foreground">Order Configuration</h3>
            <span className="text-[10px] font-black uppercase tracking-tighter bg-muted px-3 py-1 rounded-full border">{statusLabels[order.status]}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
            <DetailRow label="Category" value={order.letterType || "Standard"} />
            <DetailRow label="Calligraphy Style" value={order.textStyle || "Handwritten"} />
            {order.box && <DetailRow label="Packaging" value={order.box} />}
            {order.gift && <DetailRow label="Add-on Gift" value={order.gift} />}
            <DetailRow label="Relation" value={order.relation} />
            <DetailRow label="Target Delivery" value={order.deliveryDate} />
            <div className="md:col-span-2 mt-2 pt-2 border-t">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Shipping Destination</p>
               <p className="text-sm font-medium text-foreground leading-relaxed">{order.address}, {order.city} - {order.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm py-2 group">
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
      <span className={highlight ? "font-bold text-primary" : "font-medium text-foreground text-right"}>{value}</span>
    </div>
  );
}