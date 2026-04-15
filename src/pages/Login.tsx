import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("OTP sent to your email! (Demo mode)");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Sign in to track your orders and more</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card p-6 sm:p-8 rounded-xl border shadow-sm space-y-5">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
              Send OTP
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}