import { DashboardLayout } from "@/components/DashboardLayout";
import { LayoutDashboard, FileText, PenLine, RotateCcw, Bell, User } from "lucide-react";
import { mockOrders, statusLabels, getWriterById } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const CURRENT_WRITER_ID = "w1"; // Simulated logged-in writer

const links = [
  { to: "/writer", label: "Dashboard", icon: LayoutDashboard },
  { to: "/writer/profile", label: "Profile", icon: User },
  { to: "/writer/requests", label: "Script Requests", icon: FileText },
  { to: "/writer/editor", label: "Write Script", icon: PenLine },
  { to: "/writer/revisions", label: "Revisions", icon: RotateCcw },
  { to: "/writer/notifications", label: "Notifications", icon: Bell },
];

export { links as writerLinks, CURRENT_WRITER_ID };

export default function WriterDashboard() {
  const myOrders = mockOrders.filter((o) => o.assignedWriterId === CURRENT_WRITER_ID);
  const assigned = myOrders.filter((o) => o.status === "assigned_to_writer");
  const accepted = myOrders.filter((o) => ["accepted_by_writer", "script_in_progress", "script_submitted", "customer_review", "revision_requested"].includes(o.status));
  const completed = myOrders.filter((o) => ["approved", "under_writing", "out_for_delivery", "delivered"].includes(o.status));

  return (
    <DashboardLayout title="Writer Dashboard" links={links} brandLabel="Script Writer">
      <div className="space-y-6">
        <div className="bg-card rounded-xl border p-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Welcome, {getWriterById(CURRENT_WRITER_ID)?.name} ✍️</h2>
          <p className="text-muted-foreground mt-1">Manage your script assignments and write beautiful letters.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Pending Requests" value={assigned.length} />
          <StatCard label="Active Scripts" value={accepted.length} />
          <StatCard label="Completed" value={completed.length} />
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Active Orders</h3>
          <div className="space-y-3">
            {accepted.length === 0 && <p className="text-muted-foreground text-sm">No active scripts.</p>}
            {accepted.map((order) => (
              <Link key={order.id} to={order.status === "revision_requested" ? "/writer/revisions" : "/writer/editor"}
                className="block bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{order.id} — {order.letterType}</p>
                    <p className="text-sm text-muted-foreground">For: {order.recipientName} ({order.relation}) • Tone: {order.tone}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-3 py-1 rounded-full font-medium",
                    order.status === "revision_requested" ? "bg-destructive/15 text-destructive" :
                    order.status === "script_in_progress" ? "bg-primary/15 text-primary" :
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
