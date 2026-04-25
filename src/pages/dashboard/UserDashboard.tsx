import { DashboardLayout } from "@/components/DashboardLayout";
import { Home, Package, FileText, User, Bell, ArrowRight, AlertCircle } from "lucide-react";
import { mockOrders, statusLabels, productTypeLabels } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/dashboard/orders", label: "Orders", icon: Package },
  { to: "/dashboard/required-details", label: "Required Details", icon: AlertCircle },
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
                className="block bg-card rounded-xl border p-5 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {!order.messageContent && order.productType !== "letterPaper" && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
                )}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{order.id} — {productTypeLabels[order.productType]}</p>
                    <p className="text-sm text-muted-foreground">To: {order.recipientName} • ₹{order.total}</p>
                    <span
                      className={cn(
                        "text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap",
                        order.status === "delivered" ? "bg-green-100 text-green-700" :
                        order.status === "payment_pending" ? "bg-destructive/10 text-destructive" :
                        (!order.messageContent && order.productType !== "letterPaper") ? "bg-orange-100 text-orange-700" :
                        "bg-muted text-muted-foreground"
                      )}
                    >
                      {(!order.messageContent && order.productType !== "letterPaper") ? "Awaiting Details" : (statusLabels[order.status] || order.status)}
                    </span>
                  </div>
                </div>
                {!order.messageContent && (
                  <div className="mt-4 pt-3 border-t">
                    <Link to={`/dashboard/details/${order.id}`} className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                      Action Required: Complete your Script Details Form to begin writing <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
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
