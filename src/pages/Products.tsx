import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/lib/orderStore";
import { productTypes } from "@/lib/data";
import productLetter from "@/assets/product-letter.jpg";
import productLetterBox from "@/assets/product-letterbox.jpg";
import productGiftSet from "@/assets/product-giftset.jpg";

const productDetails: Record<string, { img: string; includes: string[] }> = {
  script: {
    img: productLetter,
    includes: ["Choice of script package", "Relation & tone-based writing", "Express review option", "Digital delivery"],
  },
  letterPaper: {
    img: productLetterBox,
    includes: ["Choice of paper design", "Quantity selection", "Classic, Floral, or Premium options", "Physical delivery"],
  },
  letter: {
    img: productLetter,
    includes: ["Choice of letter type", "Text style selection", "Premium paper", "Personalized content"],
  },
  letterBox: {
    img: productLetterBox,
    includes: ["Everything in Letter", "Premium box packaging", "Ribbon & seal", "Gift-ready presentation"],
  },
  letterBoxGift: {
    img: productGiftSet,
    includes: ["Everything in Letter + Box", "Choice of gifts", "Teddy, chocolates, flowers", "Custom gift options"],
  },
};

export default function Products() {
  const setField = useOrderStore((s) => s.setField);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container">
          <h1 className="font-display text-4xl font-bold text-foreground text-center mb-2">Our Products</h1>
          <p className="text-muted-foreground text-center mb-10">Choose the perfect option for your special someone</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productTypes.map((pt) => {
              const details = productDetails[pt.id];
              return (
                <div key={pt.id} className="flex flex-col h-full">
                  <div className="rounded-xl overflow-hidden border bg-card shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={details.img} 
                        alt={pt.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                        loading="lazy" 
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="font-display text-2xl font-bold text-card-foreground">{pt.title}</h2>
                      <p className="text-muted-foreground mt-2 text-sm flex-grow">{pt.description}</p>
                      
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-primary font-bold text-2xl">From ₹{pt.from}</p>
                        <ul className="mt-4 space-y-2">
                          {details.includes.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link 
                        to="/order" 
                        onClick={() => setField("productType", pt.id)}
                        className="mt-6"
                      >
                        <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold py-6">
                          Start Creating
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
