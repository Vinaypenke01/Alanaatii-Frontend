import { useParams, Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/lib/orderStore";
import { productTypes } from "@/lib/data";
import { CheckCircle2, PackageOpen, Sparkles, ScrollText, PenLine, ChevronRight, Clock, Heart } from "lucide-react";
import productLetter from "@/assets/product-letter.jpg";
import productLetterBox from "@/assets/product-letterbox.jpg";
import productGiftSet from "@/assets/product-giftset.jpg";

// Extended product details for the standalone pages
const productDetailsMap: Record<string, { img: string; heroDesc: string; perfectFor: string; deliveryTime: string; steps: string[]; features: {icon: any, title: string, desc: string}[]; includes: string[] }> = {
  script: {
    img: productLetter,
    heroDesc: "A purely digital experience. We craft the perfect words for your emotions and deliver a beautifully written script that you can use anywhere.",
    perfectFor: "Birthdays, Anniversaries, and heartfelt digital messages.",
    deliveryTime: "24 to 48 hours (Digital PDF)",
    steps: ["Select your occasion & tone", "Share your personal story", "Receive your custom script via email"],
    features: [
      { icon: PenLine, title: "Expert Copywriting", desc: "Written by professional script writers tailored to your relation and tone." },
      { icon: ScrollText, title: "Digital Delivery", desc: "Receive your final script directly in your dashboard or email." },
      { icon: Sparkles, title: "Revision Cycles", desc: "Request changes until the words feel exactly right." }
    ],
    includes: ["Choice of script package", "Relation & tone-based writing", "Express review option", "Digital PDF delivery"],
  },
  letterPaper: {
    img: productLetterBox,
    heroDesc: "For the DIY romantic. Select from our curated collection of premium, handcrafted calligraphy papers.",
    perfectFor: "Calligraphers, writers, and DIY crafters.",
    deliveryTime: "Dispatched in 24 hours. Delivered in 3-5 days.",
    steps: ["Choose your favorite paper design", "Select the quantity you need", "We safely pack & ship it to your doorstep"],
    features: [
      { icon: PackageOpen, title: "Premium Materials", desc: "Thick, textured GSM papers perfect for ink and calligraphy." },
      { icon: Sparkles, title: "Beautiful Designs", desc: "Choose from floral, vintage, or modern minimalist borders." }
    ],
    includes: ["Choice of paper design", "Quantity selection", "Classic, Floral, or Premium options", "Physical delivery"],
  },
  letter: {
    img: productLetter,
    heroDesc: "Our signature service. A completely personalized, handwritten letter crafted to perfection on premium paper.",
    perfectFor: "Long-distance relationships, apologies, and deep emotional expressions.",
    deliveryTime: "Written in 2 days. Delivered in 4-6 days.",
    steps: ["Share your thoughts or choose a script", "We handwrite it beautifully", "Sealed with wax and safely shipped to them"],
    features: [
      { icon: PenLine, title: "Handwritten Calligraphy", desc: "Authentic, beautiful handwriting in your choice of style." },
      { icon: ScrollText, title: "Personalized Script", desc: "We write the content based on your unique story." },
      { icon: PackageOpen, title: "Wax Seal Finish", desc: "Sealed with an authentic vintage wax stamp." }
    ],
    includes: ["Choice of letter type", "Text style selection", "Premium paper", "Personalized content"],
  },
  letterBox: {
    img: productLetterBox,
    heroDesc: "Elevate your letter with a luxurious unboxing experience. The handwritten letter comes presented in a premium keepsake box.",
    perfectFor: "Proposals, Milestone Anniversaries, and premium luxury gifting.",
    deliveryTime: "Crafted in 2 days. Delivered in 4-6 days.",
    steps: ["Customize your letter content", "We handwrite & pack it in a velvet box", "Delivered as a royal unboxing experience"],
    features: [
      { icon: PackageOpen, title: "Keepsake Box", desc: "A velvet-lined, sturdy premium box designed to last." },
      { icon: Sparkles, title: "Ribbon & Decoration", desc: "Tied with a silk ribbon for a perfect presentation." },
      { icon: ScrollText, title: "Signature Letter", desc: "Includes our premium handwritten calligraphy letter." }
    ],
    includes: ["Everything in Letter", "Premium box packaging", "Ribbon & seal", "Gift-ready presentation"],
  },
  letterBoxGift: {
    img: productGiftSet,
    heroDesc: "The ultimate gifting experience. Combine our premium handwritten letter box with curated add-on gifts to make their day unforgettable.",
    perfectFor: "Valentine's Day, Major Birthdays, and Ultimate Surprises.",
    deliveryTime: "Crafted & Assembled in 3 days. Delivered in 5-7 days.",
    steps: ["Customize letter & select special gifts", "We create a stunning gift package", "Delivered to their doorstep to amaze them"],
    features: [
      { icon: Sparkles, title: "Curated Add-ons", desc: "Choose from chocolates, polaroids, teddies, and more." },
      { icon: PackageOpen, title: "Premium Packaging", desc: "Everything is safely and beautifully packed together." },
      { icon: PenLine, title: "Complete Personalization", desc: "From the words to the gifts, it's entirely your choice." }
    ],
    includes: ["Everything in Letter + Box", "Choice of gifts", "Teddy, chocolates, flowers", "Custom gift options"],
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const setField = useOrderStore((s) => s.setField);
  
  const productType = productTypes.find(p => p.id === id);
  if (!productType || !id || !productDetailsMap[id]) {
    return <Navigate to="/products" replace />;
  }

  const details = productDetailsMap[id];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 border-b">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">{productType.title}</span>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Section */}
          <div className="space-y-6">
            <div className="aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-xl border bg-card">
              <img 
                src={details.img} 
                alt={productType.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-max">
              Alanaatii Premium
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {productType.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {details.heroDesc}
            </p>

            <div className="mb-10 p-6 bg-card border rounded-xl shadow-sm">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Starting From</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">₹{productType.from}</span>
                <span className="text-sm text-muted-foreground">+ Delivery</span>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Heart className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Perfect For</p>
                  <p className="text-sm text-muted-foreground leading-snug">{details.perfectFor}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Clock className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Delivery Time</p>
                  <p className="text-sm text-muted-foreground leading-snug">{details.deliveryTime}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <h3 className="font-display text-2xl font-bold border-b pb-2">Why Choose This?</h3>
              <div className="grid gap-6">
                {details.features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">{feature.title}</h4>
                        <p className="text-muted-foreground mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How It Works */}
            <div className="space-y-6 mb-12">
              <h3 className="font-display text-2xl font-bold border-b pb-2">How It Works</h3>
              <div className="flex flex-col gap-5">
                {details.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0 border border-primary/20">
                      {idx + 1}
                    </div>
                    <p className="text-foreground font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <h3 className="font-display text-xl font-bold">What's Included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sticky bottom-4 z-10 bg-background/80 backdrop-blur-md p-4 -mx-4 rounded-xl border shadow-lg md:relative md:bg-transparent md:backdrop-blur-none md:p-0 md:mx-0 md:border-none md:shadow-none">
              <Link 
                to="/order" 
                onClick={() => setField("productType", productType.id)}
                className="block"
              >
                <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 font-bold py-7 text-lg shadow-xl shadow-primary/20">
                  Start Customizing Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
