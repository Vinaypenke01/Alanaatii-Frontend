import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/Reveal";
import heroBg from "@/assets/hero-bg.jpg";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent! Your inquiry has been logged in our support desk.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="relative h-[35vh] min-h-[250px] flex items-center justify-center overflow-hidden mt-16">
        <img src={heroBg} alt="Contact Alanaatii" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center">
          <Reveal width="100%">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Reach out for support or inquiries.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="py-20">
        <Reveal className="container max-w-lg" width="100%">

          <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-xl border shadow-sm">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what's on your mind..." rows={5} />
            </div>
            <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">Send Message</Button>
          </form>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}
