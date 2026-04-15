import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary border-t py-12">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold text-gradient-gold mb-3">Alanaatii</h3>
          <p className="text-sm text-muted-foreground">Crafting heartfelt letters, boxes & gifts that create unforgettable moments.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="space-y-2">
            {[{ to: "/products", label: "Products" }, { to: "/about", label: "About" }, { to: "/contact", label: "Contact" }].map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">hello@alanaatii.com</p>
          <p className="text-sm text-muted-foreground mt-1">+91 98765 43210</p>
        </div>
      </div>
      <div className="container mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Alanaatii. All rights reserved.
      </div>
    </footer>
  );
}
