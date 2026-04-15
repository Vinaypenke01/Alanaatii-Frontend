import { DashboardLayout } from "@/components/DashboardLayout";
import { Home, Package, FileText, User, Bell } from "lucide-react";
import { mockOrders, statusLabels, productTypeLabels } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/dashboard/orders", label: "Orders", icon: Package },
  { to: "/dashboard/scripts", label: "Scripts", icon: FileText },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export { links as userDashboardLinks };

export default function UserDashboard() {
  const activeOrders = mockOrders.filter((o) => o.status !== "delivered");

  return (
    <DashboardLayout title="Dashboard" links={links} brandLabel="User Dashboard">
      <div className="space-y-6">
        <div className="bg-card rounded-xl border p-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Welcome back! 👋</h2>
          <p className="text-muted-foreground mt-1">Track your orders and manage your personalized letters.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Orders" value={mockOrders.length} />
          <StatCard label="Active Orders" value={activeOrders.length} />
          <StatCard label="Delivered" value={mockOrders.length - activeOrders.length} />
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Active Orders</h3>
          <div className="space-y-3">
            {activeOrders.length === 0 && <p className="text-muted-foreground text-sm">No active orders.</p>}
            {activeOrders.map((order) => (
              <Link key={order.id} to={`/dashboard/orders/${order.id}`}
                className="block bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{order.id} — {productTypeLabels[order.productType]}</p>
                    <p className="text-sm text-muted-foreground">To: {order.recipientName} • ₹{order.total}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-3 py-1 rounded-full font-medium",
                    order.status === "customer_review" || order.status === "script_submitted" ? "bg-accent/20 text-accent" :
                    order.status === "revision_requested" ? "bg-destructive/15 text-destructive" :
                    order.status === "under_writing" ? "bg-primary/15 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {statusLabels[order.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}
