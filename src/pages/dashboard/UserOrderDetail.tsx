import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { StatusTimeline } from "@/components/StatusTimeline";
import { mockOrders, statusLabels, productTypeLabels, getWriterById } from "@/lib/mockData";
import { ArrowLeft, Check, FileText, Send, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

  return (
    <DashboardLayout title={`Order ${order.id}`} links={userDashboardLinks} brandLabel="User Dashboard">
      <div className="space-y-4 md:space-y-6">
        <Link to="/dashboard/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft size={16} className="mr-1" /> Back to Orders
        </Link>

        <div className="bg-card rounded-xl border p-4 md:p-6">
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-4">Order Status</h2>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <StatusTimeline status={order.status} />
          </div>
        </div>

        {/* Script Review Section */}
        {order.scriptContent && (
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Script Draft
              </h2>
              {order.status === "script_submitted" && (
                <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">New Draft</span>
              )}
            </div>
            
            <div className="bg-muted/30 rounded-lg p-5 border font-serif text-sm leading-relaxed text-foreground whitespace-pre-line shadow-inner min-h-[150px]">
              {order.scriptContent}
            </div>

            {order.status === "script_submitted" ? (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2 h-11"
                  onClick={() => {
                    setOrder({...order, status: "approved" as any});
                    toast.success("Script approved! Writer will now begin physical production.");
                  }}
                >
                  <Check size={18} /> Approve & Finalize
                </Button>
                
                <Dialog open={revisionOpen} onOpenChange={setRevisionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/5 gap-2 h-11">
                      <MessageSquare size={18} /> Request Revision
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Request Script Revision</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Label htmlFor="revision-note" className="text-sm">What should the writer change?</Label>
                      <Textarea 
                        id="revision-note" 
                        placeholder="Please make it more emotional/add a mention of..." 
                        value={revisionText}
                        onChange={(e) => setRevisionText(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRevisionOpen(false)}>Cancel</Button>
                      <Button 
                        disabled={!revisionText.trim()}
                        onClick={() => {
                          setOrder({...order, status: "revision_requested" as any, revisionFeedback: revisionText});
                          setRevisionOpen(false);
                          toast.success("Revision request sent to the writer.");
                        }}
                        className="bg-primary text-white gap-2"
                      >
                        <Send size={16} /> Send Feedback
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : order.status === "approved" || order.status === "under_writing" || order.status === "delivered" ? (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                <Check size={14} /> This script has been approved and is locked.
              </p>
            ) : null}
          </div>
        )}

        {/* Rating & Review Section */}
        {order.status === "delivered" && (
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4 border-primary/20 bg-primary/5">
            <h2 className="font-display text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Star size={20} className="text-primary fill-primary" /> How was your experience?
            </h2>
            
            {!reviewSubmitted ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setRating(s)}
                      className={cn(
                        "transition-all duration-200 hover:scale-110",
                        rating >= s ? "text-primary" : "text-muted"
                      )}
                    >
                      <Star size={32} fill={rating >= s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="review" className="text-sm font-medium">Your Review (optional)</Label>
                  <Textarea 
                    id="review" 
                    placeholder="Tell us what you liked..." 
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={3}
                    className="bg-card shadow-inner"
                  />
                </div>

                <Button 
                  disabled={rating === 0}
                  onClick={() => {
                    setReviewSubmitted(true);
                    toast.success("Thank you for your feedback! It means the world to us ✨");
                  }}
                  className="w-full sm:w-auto bg-gradient-gold text-primary-foreground font-bold h-11 px-8"
                >
                  Submit Review
                </Button>
              </div>
            ) : (
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4 text-center">
                <p className="text-green-600 font-bold mb-1">Feedback Received!</p>
                <p className="text-xs text-muted-foreground">Thank you for helping us provide premium letters to everyone.</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
          <h3 className="font-display text-base md:text-lg font-semibold text-foreground">Order Details</h3>
          <DetailRow label="Order ID" value={order.id} />
          <DetailRow label="Product Type" value={productTypeLabels[order.productType]} />

          {order.productType === "script" && (
            <>
              {order.scriptPackage && <DetailRow label="Script Package" value={order.scriptPackage} />}
              {order.expressScript && <DetailRow label="Express Review" value="Yes (+₹100)" />}
            </>
          )}

          {order.productType === "letterPaper" && (
            <>
              {order.paperType && <DetailRow label="Paper Type" value={order.paperType} />}
              {order.paperQuantity && <DetailRow label="Quantity" value={String(order.paperQuantity)} />}
            </>
          )}

          {["letter", "letterBox", "letterBoxGift"].includes(order.productType) && (
            <>
              <DetailRow label="Letter Type" value={order.letterType} />
              <DetailRow label="Text Style" value={order.textStyle} />
            </>
          )}

          {order.box && <DetailRow label="Box" value={order.box} />}
          {order.gift && <DetailRow label="Gift" value={order.gift} />}
          <DetailRow label="Recipient" value={`${order.recipientName} (${order.relation})`} />
          {order.deliveryDate && <DetailRow label="Delivery Date" value={order.deliveryDate} />}
          {order.address && <DetailRow label="Address" value={`${order.address}, ${order.city} - ${order.pincode}`} />}
          <DetailRow label="Total" value={`₹${order.total}`} highlight />
          <DetailRow label="Status" value={statusLabels[order.status]} />
          {order.paymentScreenshot && (
            <div className="flex flex-col gap-2 py-3 border-b">
              <span className="text-sm text-muted-foreground">Payment Receipt</span>
              <img src={order.paymentScreenshot} alt="Payment Receipt" className="w-32 h-32 object-cover rounded-lg border shadow-sm cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(order.paymentScreenshot, "_blank")} />
            </div>
          )}
          {writer && <DetailRow label="Assigned Writer" value={writer.name} />}
          {order.status === "revision_requested" && (
            <DetailRow label="Script Status" value="Revision Requested — Writer is updating the script" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between text-sm py-1.5 border-b last:border-0 gap-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-bold text-primary" : "font-medium text-foreground sm:text-right"}>{value}</span>
    </div>
  );
}