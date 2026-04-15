import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { productTypeLabels } from "@/lib/mockData";
import { mockOrders, statusLabels } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function UserOrders() {
  return (
    <DashboardLayout title="My Orders" links={userDashboardLinks} brandLabel="User Dashboard">
      <div className="space-y-3">
        {mockOrders.map((order) => (
          <Link key={order.id} to={`/dashboard/orders/${order.id}`}
            className="block bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-foreground">{order.id} — {productTypeLabels[order.productType]}</p>
                <p className="text-sm text-muted-foreground">
                  To: {order.recipientName} • {order.letterType} {order.deliveryDate ? `• Delivery: ${order.deliveryDate}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">₹{order.total}</p>
                <span className={cn(
                  "text-xs px-3 py-1 rounded-full font-medium inline-block mt-1",
                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                  order.status === "payment_pending" ? "bg-orange-100 text-orange-700" :
                  order.status === "revision_requested" ? "bg-destructive/15 text-destructive" :
                  order.status === "customer_review" ? "bg-accent/20 text-accent" :
                  order.status === "out_for_delivery" ? "bg-blue-100 text-blue-700" :
                  "bg-muted text-muted-foreground"
                )}>
                  {statusLabels[order.status]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
