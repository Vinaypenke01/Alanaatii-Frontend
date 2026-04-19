import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { 
  ScrollText, 
  FileImage, 
  FileText, 
  Type, 
  Package, 
  Gift, 
  ChevronRight,
  Banknote,
  TicketPercent,
  Settings2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  mockAdminScriptPackages, 
  mockAdminLetterPapers, 
  mockAdminLetters, 
  mockAdminTextStyles, 
  mockAdminBoxes, 
  mockAdminGifts 
} from "@/lib/mockData";

export default function AdminCatalog() {
  const navigate = useNavigate();

  const physicalCategories = [
    { 
      id: "script-packages", 
      title: "Script Packages", 
      icon: ScrollText, 
      count: mockAdminScriptPackages.length,
      to: "/admin/script-packages",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    { 
      id: "letter-papers", 
      title: "Letter Papers", 
      icon: FileImage, 
      count: mockAdminLetterPapers.length,
      to: "/admin/letter-papers",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    { 
      id: "letters", 
      title: "Letters", 
      icon: FileText, 
      count: mockAdminLetters.length,
      to: "/admin/letters",
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    { 
      id: "text-styles", 
      title: "Text Styles", 
      icon: Type, 
      count: mockAdminTextStyles.length,
      to: "/admin/text-styles",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    { 
      id: "boxes", 
      title: "Boxes", 
      icon: Package, 
      count: mockAdminBoxes.length,
      to: "/admin/boxes",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    { 
      id: "gifts", 
      title: "Gifts", 
      icon: Gift, 
      count: mockAdminGifts.length,
      to: "/admin/gifts",
      color: "text-amber-500",
      bgColor: "bg-amber-50"
    },
  ];

  const businessRules = [
    { 
      id: "pricing", 
      title: "Pricing Rules", 
      icon: Banknote, 
      count: "Early Delivery + Pincode Rules",
      to: "/admin/pricing",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    { 
      id: "coupons", 
      title: "Coupon Management", 
      icon: TicketPercent, 
      count: "4 Active Coupons",
      to: "/admin/coupons",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
  ];

  return (
    <DashboardLayout title="Catalog Management" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Settings2 size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Platform Core</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">Management Hub</h2>
          <p className="text-sm text-muted-foreground">Configure your product catalog, financial rules, and promotional strategies.</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60 px-1">Physical Catalog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {physicalCategories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => navigate(cat.to)}
                className="group relative bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110 ${cat.bgColor}`} 
                     style={{ backgroundColor: cat.color.includes('blue') ? '#3b82f6' : 
                                              cat.color.includes('purple') ? '#a855f7' : 
                                              cat.color.includes('pink') ? '#ec4899' : 
                                              cat.color.includes('orange') ? '#f97316' : 
                                              cat.color.includes('emerald') ? '#10b981' : '#f59e0b' }} />
                
                <div className="relative flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${cat.bgColor} ${cat.color}`}>
                    <cat.icon size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cat.count} {cat.count === 1 ? 'item' : 'items'} in catalog
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center text-xs font-bold text-primary uppercase tracking-wider group-hover:gap-1 transition-all">
                    Manage {cat.title.split(' ')[0]} <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60 px-1">Global Business Rules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessRules.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => navigate(cat.to)}
                className="group relative bg-indigo-50/10 rounded-2xl border border-indigo-100/50 p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all cursor-pointer overflow-hidden"
              >
                 <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110 ${cat.bgColor}`} 
                     style={{ backgroundColor: cat.color.includes('red') ? '#ef4444' : '#6366f1' }} />

                <div className="relative flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${cat.bgColor} ${cat.color}`}>
                    <cat.icon size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-indigo-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cat.count}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 uppercase tracking-wider group-hover:gap-1 transition-all">
                    Configure Rules <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
