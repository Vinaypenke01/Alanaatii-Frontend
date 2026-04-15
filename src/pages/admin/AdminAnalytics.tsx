import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders } from "@/lib/mockData";

export default function AdminAnalytics() {
  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = Math.round(totalRevenue / mockOrders.length);
  const delivered = mockOrders.filter((o) => o.status === "delivered").length;

  // Simple bar chart data
  const months = ["Jan", "Feb", "Mar", "Apr"];
  const monthData = [0, 0, 1, 2]; // mock distribution

  return (
    <DashboardLayout title="Analytics" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
          <AnalyticsCard label="Total Orders" value={String(mockOrders.length)} />
          <AnalyticsCard label="Avg Order Value" value={`₹${avgOrderValue}`} />
          <AnalyticsCard label="Delivery Rate" value={`${Math.round((delivered / mockOrders.length) * 100)}%`} />
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-6">Orders by Month</h3>
          <div className="flex items-end gap-4 h-48">
            {months.map((m, i) => (
              <div key={m} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-gradient-gold rounded-t-md transition-all"
                  style={{ height: `${Math.max((monthData[i] / Math.max(...monthData)) * 100, 8)}%` }}
                />
                <span className="text-xs text-muted-foreground mt-2">{m}</span>
                <span className="text-xs font-semibold text-foreground">{monthData[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            {mockOrders.map((o) => (
              <div key={o.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                <div>
                  <span className="font-medium text-foreground">{o.id}</span>
                  <span className="text-muted-foreground ml-2">{o.letterType}</span>
                </div>
                <span className="font-semibold text-primary">₹{o.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function AnalyticsCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}
