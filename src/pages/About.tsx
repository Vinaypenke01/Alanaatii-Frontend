import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <Reveal className="container max-w-3xl" width="100%">
          <h1 className="font-display text-4xl font-bold text-foreground text-center mb-8">About Alanaatii</h1>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              <span className="text-gradient-gold font-display font-semibold text-xl">Alanaatii</span> was born from a simple belief — that in our fast-paced digital world, a handwritten letter still holds the power to move hearts and create lasting memories.
            </p>
            <p>
              We craft personalized letters, pair them with elegant boxes and thoughtful gifts, and deliver moments of pure joy to doorsteps across India. Every letter is written with care, every box is assembled with love.
            </p>

            <h2 className="font-display text-2xl font-semibold text-foreground pt-4">Our Mission</h2>
            <p>
              To revive the art of personal expression through beautifully crafted letters and gifts. We believe that the most meaningful presents aren't bought — they're felt.
            </p>

            <h2 className="font-display text-2xl font-semibold text-foreground pt-4">Contact Us</h2>
            <p>Email: hello@alanaatii.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Based in Hyderabad, India 🇮🇳</p>
          </div>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}
