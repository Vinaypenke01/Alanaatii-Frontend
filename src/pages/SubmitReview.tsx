import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SubmitReview() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for your review!");
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container max-w-xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">Share Your Experience</h1>
            <p className="text-muted-foreground">Your feedback helps us create more magical moments for everyone.</p>
          </div>

          <div className="bg-card rounded-2xl border shadow-xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center">
                <Label className="text-lg font-semibold mb-4">How would you rate us?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                    >
                      <Star
                        size={40}
                        className={cn(
                          "transition-colors duration-200",
                          (hoveredRating || rating) >= star
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-3 text-sm font-medium text-primary animate-in fade-in slide-in-from-top-1">
                    {rating === 5 ? "Loved it!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Could be better" : "Disappointed"}
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell us what you loved or how we can improve..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    className="min-h-[150px] resize-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
