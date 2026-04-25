import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Star, MessageSquareQuote, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Reviews Data
const mockReviews = [
  {
    id: "r1",
    customerName: "Rahul Sharma",
    orderId: "ORD-1004",
    rating: 5,
    text: "The handwritten letter was absolutely beautiful. My wife cried when she read it. The premium box and the wax seal added such a luxurious touch. Highly recommended!",
    date: "2024-03-15",
    isPublished: true,
  },
  {
    id: "r2",
    customerName: "Sneha Reddy",
    orderId: "ORD-1002",
    rating: 4,
    text: "Great service and beautiful handwriting. The teddy bear could have been a bit bigger, but overall the experience was very smooth.",
    date: "2024-03-18",
    isPublished: true,
  },
  {
    id: "r3",
    customerName: "Vikram Singh",
    orderId: "ORD-1008",
    rating: 5,
    text: "I was skeptical about buying a script online, but the writer captured my feelings perfectly. The revision process was fast.",
    date: "2024-03-20",
    isPublished: false,
  },
  {
    id: "r4",
    customerName: "Anjali Gupta",
    orderId: "ORD-1011",
    rating: 2,
    text: "Delivery was delayed by two days. The letter is nice but the delay ruined the surprise for the anniversary.",
    date: "2024-03-22",
    isPublished: false,
  }
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(mockReviews);

  const togglePublish = (id: string, currentStatus: boolean) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isPublished: !currentStatus } : r));
    if (!currentStatus) {
      toast.success("Review published to Landing Page");
    } else {
      toast.info("Review unpublished from Landing Page");
    }
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success("Review deleted permanently");
  };

  const publishedCount = reviews.filter(r => r.isPublished).length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <DashboardLayout title="Review Moderation" links={adminLinks} brandLabel="Admin Panel">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Reviews</p>
          <p className="text-3xl font-display font-bold mt-1 text-foreground">{reviews.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-3xl font-display font-bold text-foreground">{avgRating}</p>
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm bg-primary/5 border-primary/20">
          <p className="text-sm font-bold text-primary uppercase tracking-wider">Published to Site</p>
          <p className="text-3xl font-display font-bold mt-1 text-primary">{publishedCount}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareQuote size={18} className="text-muted-foreground" />
            <h3 className="font-display text-lg font-bold text-foreground">Customer Testimonials</h3>
          </div>
        </div>

        <div className="divide-y">
          {reviews.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No reviews found.</div>
          )}
          {reviews.map((review) => (
            <div key={review.id} className={cn("p-6 transition-colors", review.isPublished ? "bg-card" : "bg-muted/10")}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                
                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-foreground">{review.customerName}</h4>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">Order: {review.orderId} • {review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted border-muted"} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg relative">
                    <MessageSquareQuote size={24} className="absolute text-muted/20 -top-2 -left-2" />
                    <p className="text-sm text-foreground italic relative z-10 leading-relaxed">
                      "{review.text}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-64 flex flex-col gap-4 border-l pl-6 py-2">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Visibility Status</p>
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={review.isPublished} 
                        onCheckedChange={() => togglePublish(review.id, review.isPublished)} 
                        className="data-[state=checked]:bg-green-500"
                      />
                      <span className={cn("text-sm font-bold", review.isPublished ? "text-green-600" : "text-muted-foreground")}>
                        {review.isPublished ? "Published on Site" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                      onClick={() => deleteReview(review.id)}
                    >
                      <XCircle size={14} className="mr-2" /> Delete Review
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
