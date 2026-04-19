import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon, Menu, X } from "lucide-react";

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  category: string;
  items: NavLink[];
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  links: (NavLink | NavSection)[];
  brandLabel: string;
}

export function DashboardLayout({ children, title, links, brandLabel }: DashboardLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderLinks = (items: (NavLink | NavSection)[]) => {
    return items.map((item, idx) => {
      if ("category" in item) {
        return (
          <div key={item.category} className={cn("pt-4 first:pt-0", idx !== 0 && "mt-2")}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
              {item.category}
            </p>
            <div className="space-y-1">
              {item.items.map((l) => (
                <NavItem key={l.to} link={l} active={location.pathname === l.to} />
              ))}
            </div>
          </div>
        );
      }
      return <NavItem key={(item as NavLink).to} link={item as NavLink} active={location.pathname === (item as NavLink).to} />;
    });
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b text-center md:text-left">
          <Link to="/" className="font-display text-xl font-bold text-gradient-gold">Alanaatii</Link>
          <p className="text-xs text-muted-foreground mt-1">{brandLabel}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {renderLinks(links)}
        </nav>
        <div className="p-4 border-t">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <Link to="/" className="font-display text-lg font-bold text-gradient-gold">Alanaatii</Link>
                <p className="text-xs text-muted-foreground">{brandLabel}</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {renderLinks(links)}
            </nav>
            <div className="p-4 border-t">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to Home</Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-14 md:h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 md:px-6 gap-3">
          <button className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-base md:text-xl font-bold text-foreground truncate uppercase tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                A
             </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ link, active, onClick }: { link: NavLink; active: boolean; onClick?: () => void }) {
  return (
    <Link to={link.to} onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}>
      <link.icon size={18} />
      {link.label}
    </Link>
  );
}