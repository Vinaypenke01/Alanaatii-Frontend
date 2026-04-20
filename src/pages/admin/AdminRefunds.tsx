import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockRefunds } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Search, RotateCcw, CheckCircle2, Clock, AlertCircle, DollarSign, Filter, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState(mockRefunds);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  const filteredRefunds = refunds.filter(ref => {
    const matchesSearch = ref.id.toLowerCase().includes(search.toLowerCase()) || 
                         ref.orderId.toLowerCase().includes(search.toLowerCase()) ||
                         ref.reason.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === "all" || ref.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleProcessRefund = (id: string) => {
    setRefunds(prev => prev.map(ref => ref.id === id ? { ...ref, status: "completed", processedAt: new Date().toISOString() } : ref));
    toast.success("Refund processed successfully!");
  };

  const totalRefunded = refunds
    .filter(r => r.status === "completed")
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingRefunds = refunds.filter(r => r.status === "pending").length;

  return (
    <DashboardLayout title="Refund Management" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-6">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Refunded</p>
              <p className="text-2xl font-display font-bold text-foreground">₹{totalRefunded}</p>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pending Action</p>
              <p className="text-2xl font-display font-bold text-foreground">{pendingRefunds}</p>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Success Rate</p>
              <p className="text-2xl font-display font-bold text-foreground">100%</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by ID, Order ID or Reason..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card border-border/50"
            />
          </div>
          <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50 w-full md:w-auto">
            {(["all", "pending", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold uppercase tracking-tighter rounded-md transition-all flex-1 md:flex-none",
                  statusFilter === f ? "bg-card text-primary shadow-sm ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Refund List */}
        <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Refund ID / Date</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order ID</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Reason</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Amount</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    No refund requests found.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((ref) => (
                  <tr key={ref.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{ref.id}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(ref.createdAt), "PPP")}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-primary font-bold">{ref.orderId}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-[11px] text-foreground/80 max-w-xs">{ref.reason}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-foreground">₹{ref.amount}</span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border",
                        ref.status === "completed" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700 border-orange-200"
                      )}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {ref.status === "pending" ? (
                          <Button 
                            className="bg-primary text-white h-8 text-[10px] font-bold gap-1.5 px-3"
                            onClick={() => handleProcessRefund(ref.id)}
                          >
                            <RotateCcw size={12} /> Process
                          </Button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold px-3">
                             <CheckCircle2 size={12} /> Done
                          </div>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                           <ExternalLink size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Logic Note */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-4">
          <AlertCircle className="text-primary shrink-0" size={20} />
          <div className="space-y-1">
             <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none">Security Note</p>
             <p className="text-[11px] text-primary/70 leading-relaxed italic">
               Refunding an order here will only update the status in the Alanaatii database. Actual payouts must be processed via the original UPI gateway using the reference ID provided in the payment logs.
             </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
