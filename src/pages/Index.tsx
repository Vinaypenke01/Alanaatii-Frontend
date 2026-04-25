import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Star, PenLine, Package, Gift, FileText, ScrollText, CreditCard, ShieldCheck, ClipboardList, MousePointerClick, CheckCircle2, Truck, Feather } from "lucide-react";
import { testimonials, productTypes } from "@/lib/data";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import productLetter from "@/assets/product-letter.jpg";
import productLetterBox from "@/assets/product-letterbox.jpg";
import productGiftSet from "@/assets/product-giftset.jpg";
import brandStory from "@/assets/elegant_script_detail_1776613332492.png";

const productImages: Record<string, string> = {
  script: productLetter,
  letterPaper: productLetterBox,
  letter: productLetter,
  letterBox: productLetterBox,
  letterBoxGift: productGiftSet,
};

const steps = [
  { icon: MousePointerClick, title: "1. Select & Customize", desc: "Browse our collection of scripts, elegant letter papers, boxes, and gifts. Pick the perfect combination for your occasion." },
  { icon: CreditCard, title: "2. Secure Payment", desc: "Complete your payment safely via UPI. Upload your receipt screenshot directly in the flow to confirm your order." },
  { icon: ShieldCheck, title: "3. Admin Verification", desc: "Our team reviews your payment receipt shortly. Once verified, your order moves to the next phase of personalization." },
  { icon: ClipboardList, title: "4. Detailed Info Form", desc: "You'll receive a WhatsApp/Email notification with a link to a form. Provide all specific details about the recipient to help us customize." },
  { icon: Feather, title: "5. Script Crafting", desc: "Our professional script writers craft a heart-touching message based on your details, ensuring every word resonates perfectly." },
  { icon: CheckCircle2, title: "6. Your Approval", desc: "Review the drafted script. You can approve it instantly or request revisions until you are 100% satisfied with the content." },
  { icon: Package, title: "7. Premium Production", desc: "Once approved, our artists start the physical production — hand-writing your letter and elegantly packaging it into your chosen box." },
  { icon: Truck, title: "8. Magic Delivered", desc: "You'll get a notification when your order is out for delivery. Sit back as we deliver your heartfelt gift to your loved one." },
];
const marqueeItems = [
  "Handcrafted Letters", "Premium Gift Sets", "Bespoke Scripts",
  "Elegant Letter Boxes", "Same-Day Verification", "Pan-India Delivery",
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[75vh] min-h-[600px] flex items-center overflow-hidden">
        <img src={heroBg} alt="Personalized letters and gifts" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="container relative z-10 text-center">
          <Reveal width="100%" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4">
              Words That Touch<br />Hearts Forever
            </h1>
          </Reveal>
          <Reveal width="100%" delay={0.3}>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Personalized scripts, letters, elegant boxes & thoughtful gifts — crafted with love and delivered to your doorstep.
            </p>
          </Reveal>
          <Reveal width="100%" delay={0.5}>
            <Link to="/products">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground text-lg px-8 py-6 hover:opacity-90 shadow-lg">
                Create Your Letter
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
      {/* ── MARQUEE ── */}
      <div style={{ background: "#120D07", overflow: "hidden", padding: "0.95rem 0", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#C9A84C", display: "flex", alignItems: "center",
                gap: "1rem", flexShrink: 0,
              }}
            >
              {item}
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
            </span>
          ))}
        </div>
      </div>

      {/* Brand Story - The Art of Correspondence */}
      <section className="pt-12 pb-24 bg-background overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-fade-up">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl skew-y-1">
                <img
                  src={brandStory}
                  alt="The Art of Writing"
                  className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative behind-image element */}
              <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-primary/20 rounded-2xl -z-0" />
            </div>

            <Reveal className="space-y-8" delay={0.2}>
              <div className="space-y-4">
                <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Our Heritage</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Because Your Feelings <br />
                  <span className="text-primary italic">Deserve to be Held</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                  In an era of instant messages and ephemeral notifications, Alanaatii preserves the soul of communication. We believe that true sentiment isn't just felt — it's touched, smelled, and kept forever in a box of memories.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <ScrollText className="text-primary" size={32} />
                  <h4 className="font-bold text-foreground">Hand-Authored</h4>
                  <p className="text-xs text-muted-foreground">Every word is physically written on premium parchment.</p>
                </div>
                <div className="space-y-2">
                  <ShieldCheck className="text-primary" size={32} />
                  <h4 className="font-bold text-foreground">Artisanal Quality</h4>
                  <p className="text-xs text-muted-foreground">Curated boxes and wax seals for a royal presentation.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Products — all 5 */}
      <section className="py-20 bg-primary/5">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productTypes.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1} width="100%">
                <Link to={`/products/${p.id}`} className="block h-full">
                  <div className="rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-shadow group h-full">
                    <div className="overflow-hidden h-56">
                      <img src={productImages[p.id]} alt={p.title} loading="lazy" width={800} height={800}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="font-display text-xl font-semibold text-card-foreground">{p.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{p.description}</p>
                      <p className="text-primary font-semibold mt-3">From ₹{p.from}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Link to="/products" className="mt-10 inline-block">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-warm overflow-hidden">
        <div className="container text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Our Customers Say</h2>
        </div>

        <div className="relative mask-horizontal-fades py-4">
          <div className="marquee-track hover:[animation-play-state:paused]" style={{ animationDuration: '40s' }}>
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={`t-${i}`} className="p-6 rounded-xl bg-card border shadow-sm text-left w-80 md:w-96 flex-shrink-0 whitespace-normal">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-card-foreground italic text-sm mb-4 leading-relaxed">"{t.text}"</p>
                <p className="text-sm font-semibold text-primary">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Horizontal Track (Relocated) */}
      <section className="py-24 bg-gradient-warm relative overflow-hidden">
        <div className="container relative z-10">
          <Reveal className="text-center mb-16" width="100%">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">The Alanaatii Process</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold bg-primary/10 inline-block px-4 py-1 rounded-full">8 Steps to Gifting Magic</p>
          </Reveal>

          <div className="relative max-w-6xl mx-auto">
            {/* The Horizontal Path Line (Desktop Only) */}
            <div className="absolute top-[3.25rem] left-[5%] right-[5%] h-1 bg-gradient-to-r from-primary/5 via-primary to-primary/5 rounded-full hidden lg:block" />

            {/* The Vertical Path Line (Mobile Only) */}
            <div className="absolute left-[2.45rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/5 via-primary to-primary/5 rounded-full lg:hidden block" />

            <div className="grid grid-cols-1 lg:grid-cols-8 gap-10 lg:gap-4 px-4 overflow-visible">
              {steps.map((s, i) => (
                <Reveal key={i} delay={i * 0.1} width="100%">
                  <div className="flex lg:flex-col items-center gap-6 lg:gap-4 relative group">
                    {/* Icon Circle */}
                    <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-gold border-4 border-background shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                      <s.icon className="text-primary-foreground" size={28} />
                      {/* Floating Step Number */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background text-xs font-black flex items-center justify-center border-4 border-background shadow-lg">
                        {i + 1}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="lg:text-center flex-1">
                      <h3 className="font-display text-base lg:text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                        {s.title.split('. ')[1] || s.title}
                      </h3>
                    </div>

                    {/* Small pulse animation for the active look */}
                    <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100 pointer-events-none" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <Reveal className="container" width="100%">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Create Something Special?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">Start crafting your personalized letter today and make someone's day unforgettable.</p>
          <Link to="/products">
            <Button size="lg" className="bg-gradient-gold text-primary-foreground text-lg px-8 py-6 hover:opacity-90 shadow-lg">
              Get Started Now
            </Button>
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
