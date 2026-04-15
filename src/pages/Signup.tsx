import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agreed: false
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!formData.agreed) {
      toast.error("You must agree to the Terms and Conditions");
      return;
    }
    toast.success("Account created successfully! Welcome to Alanaatii.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground font-gradient-gold">Start Your Story</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Join the most premium gifting experience</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card p-6 sm:p-8 rounded-xl border shadow-lg space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="John Doe" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                placeholder="you@example.com" 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="+91 00000 00000" 
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreed} 
                onCheckedChange={(v) => setFormData({ ...formData, agreed: !!v })} 
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button type="submit" className="w-full h-11 mt-4 bg-gradient-gold text-primary-foreground font-bold hover:opacity-90">
              Create Account
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
