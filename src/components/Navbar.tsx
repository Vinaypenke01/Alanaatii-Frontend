import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productTypes } from "@/lib/data";
import { useOrderStore } from "@/lib/orderStore";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/writer", label: "Writer" },
  { to: "/admin", label: "Admin" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  const setField = useOrderStore((s) => s.setField);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-2xl font-bold text-gradient-gold">
          Alanaatii
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={cn("text-sm font-medium transition-colors hover:text-primary", location.pathname === "/" ? "text-primary" : "text-muted-foreground")}>
            Home
          </Link>

          {/* Products dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                location.pathname === "/products" || location.pathname === "/order" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Products <ChevronDown size={14} className={cn("transition-transform", productsOpen && "rotate-180")} />
            </button>
            {productsOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-card border rounded-lg shadow-lg py-2 z-50">
                <Link to="/products" onClick={() => setProductsOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted font-medium">
                  All Products
                </Link>
                <div className="border-t my-1" />
                {productTypes.map((pt) => (
                  <Link key={pt.id} to="/order"
                    onClick={() => { setField("productType", pt.id); setProductsOpen(false); }}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                    {pt.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {links.slice(1).map((l) => (
            <Link key={l.to} to={l.to}
              className={cn("text-sm font-medium transition-colors hover:text-primary",
                (location.pathname === l.to || (l.to !== "/" && location.pathname.startsWith(l.to + "/"))) ? "text-primary" : "text-muted-foreground"
              )}>
              {l.label}
            </Link>
          ))}
          <Link to="/login">
            <Button size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90">Login</Button>
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background p-4 space-y-3 animate-fade-in">
          <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-foreground hover:text-primary">Home</Link>
          <Link to="/products" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-foreground hover:text-primary">Products</Link>
          {productTypes.map((pt) => (
            <Link key={pt.id} to="/order" onClick={() => { setField("productType", pt.id); setOpen(false); }}
              className="block py-2 pl-4 text-sm text-muted-foreground hover:text-primary">
              {pt.title}
            </Link>
          ))}
          {links.slice(1).map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-foreground hover:text-primary">
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full bg-gradient-gold text-primary-foreground">Login</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
