import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Star, PenLine, Package, Gift, FileText, ScrollText } from "lucide-react";
import { testimonials, productTypes } from "@/lib/data";
import heroBg from "@/assets/hero-bg.jpg";
import productLetter from "@/assets/product-letter.jpg";
import productLetterBox from "@/assets/product-letterbox.jpg";
import productGiftSet from "@/assets/product-giftset.jpg";

const productImages: Record<string, string> = {
  script: productLetter,
  letterPaper: productLetterBox,
  letter: productLetter,
  letterBox: productLetterBox,
  letterBoxGift: productGiftSet,
};

const steps = [
  { icon: PenLine, title: "Choose Your Product", desc: "Pick from scripts, letter papers, letters, boxes & gifts" },
  { icon: Package, title: "Customize & Personalize", desc: "Add your details, choose styles, and make it yours" },
  { icon: Gift, title: "We Deliver the Magic", desc: "Sit back while we craft and deliver your gift" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <img src={heroBg} alt="Personalized letters and gifts" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="container relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 animate-fade-up">
            Words That Touch<br />Hearts Forever
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Personalized scripts, letters, elegant boxes & thoughtful gifts — crafted with love and delivered to your doorstep.
          </p>
          <Link to="/order" className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="bg-gradient-gold text-primary-foreground text-lg px-8 py-6 hover:opacity-90 shadow-lg">
              Create Your Letter
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-warm">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                  <s.icon className="text-primary-foreground" size={24} />
                </div>
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products — all 5 */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productTypes.map((p) => (
              <div key={p.id} className="rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-shadow group">
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
      <section className="py-20 bg-gradient-warm">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border shadow-sm text-left">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-card-foreground italic text-sm mb-4">"{t.text}"</p>
                <p className="text-sm font-semibold text-primary">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Create Something Special?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">Start crafting your personalized letter today and make someone's day unforgettable.</p>
          <Link to="/order">
            <Button size="lg" className="bg-gradient-gold text-primary-foreground text-lg px-8 py-6 hover:opacity-90 shadow-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
