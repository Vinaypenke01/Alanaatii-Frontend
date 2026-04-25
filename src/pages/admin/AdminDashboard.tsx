import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Type, Package, Gift, HelpCircle, ShoppingCart, PenLine, Settings, Ticket, BarChart3, Users, ScrollText, FileImage, CreditCard, RefreshCw, MessageSquareQuote } from "lucide-react";
import { mockOrders, statusLabels, productTypeLabels } from "@/lib/mockData";

const links = [
  { to: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
  {
    category: "Operations",
    items: [
      { to: "/admin/orders", label: "Manage Orders", icon: ShoppingCart },
      { to: "/admin/payments", label: "Verify Payments", icon: CreditCard },
      { to: "/admin/scripts", label: "Master Scripts", icon: PenLine },
      { to: "/admin/writers", label: "Manage Writers", icon: Users },
      { to: "/admin/support", label: "Support Inquiries", icon: HelpCircle },
      { to: "/admin/refunds", label: "Manage Refunds", icon: RefreshCw },
    ]
  },
  {
    category: "Catalog Management",
    items: [
      { to: "/admin/catalog", label: "Catalog Overview", icon: Package },
    ]
  },
  {
    category: "System & Tools",
    items: [
      { to: "/admin/questions", label: "Admin Questions", icon: HelpCircle },
      { to: "/admin/coupons", label: "Discount Coupons", icon: Ticket },
      { to: "/admin/reviews", label: "Customer Reviews", icon: MessageSquareQuote },
      { to: "/admin/analytics", label: "Detailed Analytics", icon: BarChart3 },
      { to: "/admin/settings", label: "Global Settings", icon: Settings },
    ]
  },
];

export { links as adminLinks };

export default function AdminDashboard() {
  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const pendingPayments = mockOrders.filter((o) => o.status === "payment_pending").length;
  const pendingScripts = mockOrders.filter((o) => ["assigned_to_writer", "script_in_progress", "revision_requested"].includes(o.status)).length;

  // Detailed revenue breakdown
  const categoryStats = Object.keys(productTypeLabels).map(type => {
    const orders = mockOrders.filter(o => o.productType === type);
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    return {
      type: type as keyof typeof productTypeLabels,
      label: productTypeLabels[type as keyof typeof productTypeLabels],
      revenue,
      count: orders.length
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "script": return PenLine;
      case "letter": return FileText;
      case "letterPaper": return FileImage;
      case "letterBox": return Package;
      case "letterBoxGift": return Gift;
      default: return ShoppingCart;
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard" links={links} brandLabel="Admin Panel">
      <div className="space-y-6 md:space-y-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Orders" value={String(mockOrders.length)} icon={ShoppingCart} color="bg-blue-500" />
          <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={BarChart3} color="bg-green-500" />
          <StatCard label="Pending Payments" value={String(pendingPayments)} icon={CreditCard} color="bg-orange-500" />
          <StatCard label="Active Scripts" value={String(pendingScripts)} icon={PenLine} color="bg-purple-500" />
        </div>

        {/* Revenue Breakdown */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-display text-lg md:text-xl font-bold text-foreground">Revenue by Category</h3>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground bg-muted px-2 py-1 rounded border">Live Distribution</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categoryStats.map((stat) => {
              const Icon = getCategoryIcon(stat.type);
              const percentage = totalRevenue > 0 ? Math.round((stat.revenue / totalRevenue) * 100) : 0;
              return (
                <div key={stat.type} className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                      {percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium truncate mb-1">{stat.label}</p>
                  <p className="text-lg md:text-xl font-black text-foreground mb-auto">₹{stat.revenue.toLocaleString()}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[10px] text-muted-foreground">{stat.count} sales</span>
                       <span className="text-[10px] font-bold text-primary">{percentage}%</span>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4 md:p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-base md:text-lg font-bold text-foreground">Recent Orders</h3>
            <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10">View All</Button>
          </div>
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground">
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-[10px]">ID</th>
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-[10px]">Product</th>
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-[10px]">Recipient</th>
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-[10px]">Total</th>
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-mono font-bold text-foreground text-xs">{o.id}</td>
                    <td className="p-3 text-muted-foreground text-[11px] leading-tight font-medium max-w-[150px] truncate">{productTypeLabels[o.productType]}</td>
                    <td className="p-3 text-muted-foreground text-[11px] font-medium">{o.recipientName}</td>
                    <td className="p-3 text-primary font-bold whitespace-nowrap">₹{o.total}</td>
                    <td className="p-3">
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter whitespace-nowrap",
                        o.status === "delivered" ? "bg-green-100 text-green-700 border border-green-200" :
                        o.status === "payment_pending" ? "bg-orange-100 text-orange-700 border border-orange-200" :
                        "bg-muted text-muted-foreground border border-border"
                      )}>
                        {statusLabels[o.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="bg-card rounded-xl border p-5 relative overflow-hidden group">
      <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-110", color)} />
      <div className="relative flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-foreground mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}
