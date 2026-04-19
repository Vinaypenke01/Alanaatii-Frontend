import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockOrders, statusLabels, getWriterById, mockWriters } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, UserPlus, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminScripts() {
  const [orders, setOrders] = useState(mockOrders);

  const activeScripts = orders.filter((o) => o.assignedWriterId && o.status !== "assignment_rejected");
  const rejectedScripts = orders.filter((o) => o.status === "assignment_rejected");

  const reassignWriter = (orderId: string, newWriterId: string) => {
    setOrders((prev) => 
      prev.map((o) => 
        o.id === orderId 
          ? { 
              ...o, 
              assignedWriterId: newWriterId, 
              status: "assigned_to_writer" as const,
              rejectionReason: undefined 
            } 
          : o
      )
    );
    const writer = getWriterById(newWriterId);
    toast.success(`Successfully re-assigned to ${writer?.name}`);
  };

  return (
    <DashboardLayout title="Script Tracking" links={adminLinks} brandLabel="Admin Panel">
      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="active" className="px-6 py-2 leading-none">
              Active Tracking ({activeScripts.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="px-6 py-2 leading-none relative">
              Rejected {rejectedScripts.length > 0 && (
                <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white animate-pulse">
                  {rejectedScripts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
            <RefreshCw size={12} className="text-primary animate-spin-slow" />
            <span>Updated real-time from writer activity</span>
          </div>
        </div>

        <TabsContent value="active" className="space-y-6">
          {/* Mobile-Responsive Cards */}
          <div className="block lg:hidden space-y-4">
            {activeScripts.map((o) => {
              const writer = getWriterById(o.assignedWriterId!);
              return (
                <div key={o.id} className="bg-card rounded-xl border p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">
                      {o.id}
                    </span>
                    <span className={cn(
                      "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                      o.status === "approved" || o.status === "delivered" ? "bg-green-100 text-green-700 border-green-200" :
                      o.status === "revision_requested" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      "bg-muted text-muted-foreground border-border"
                    )}>
                      {statusLabels[o.status]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{o.letterType}</h4>
                    <p className="text-xs text-muted-foreground italic">For {o.recipientName}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[8px] uppercase">
                          {writer?.name.charAt(0) ?? "?"}
                       </div>
                       <span className="text-xs font-medium text-foreground">{writer?.name ?? "Unassigned"}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{o.scriptVersions?.length ?? 0} versions</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-card rounded-xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order</th>
                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Letter Info</th>
                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Assigned Writer</th>
                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Script Status</th>
                    <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">History</th>
                  </tr>
                </thead>
                <tbody>
                  {activeScripts.map((o) => {
                    const writer = getWriterById(o.assignedWriterId!);
                    return (
                      <tr key={o.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-mono font-bold text-primary">{o.id}</td>
                        <td className="p-4">
                           <p className="font-bold text-foreground">{o.letterType}</p>
                           <p className="text-[11px] text-muted-foreground italic">Recipient: {o.recipientName}</p>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase border border-primary/20">
                                 {writer?.name.charAt(0) ?? "U"}
                              </div>
                              <span className="font-medium text-foreground">{writer?.name ?? "Unassigned"}</span>
                           </div>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border shadow-sm",
                            o.status === "approved" || o.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" :
                            o.status === "revision_requested" ? "bg-destructive/5 text-destructive border-destructive/15" :
                            o.status === "script_submitted" || o.status === "customer_review" ? "bg-accent/10 text-accent border-accent/20" :
                            "bg-muted text-muted-foreground border-border"
                          )}>
                            {statusLabels[o.status]}
                          </span>
                        </td>
                        <td className="p-4 text-right text-muted-foreground font-bold">
                           {o.scriptVersions?.length ?? 0} <span className="text-[10px]">VERSIONS</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedScripts.length === 0 ? (
            <div className="bg-card rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="font-bold text-foreground overflow-hidden">No Rejected Assignments</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">Great job! All writers have accepted their assigned scripts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {rejectedScripts.map((o) => {
                const rejectingWriter = getWriterById(o.rejectedByWriterId!);
                return (
                  <div key={o.id} className="bg-card rounded-2xl border border-destructive/20 shadow-sm overflow-hidden group hover:border-destructive/40 transition-all">
                    <div className="bg-destructive/5 px-6 py-3 border-b border-destructive/10 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-destructive animate-pulse" />
                        <span className="text-xs font-black text-destructive uppercase tracking-widest font-mono">
                          Rejection Alert: {o.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{o.createdAt}</span>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rejected By</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-[10px]">
                            {rejectingWriter?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground leading-tight">{rejectingWriter?.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Writer identified conflict</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Writer's Reason</p>
                        <div className="bg-muted px-3 py-2 rounded-lg text-xs italic text-foreground/80 leading-relaxed border italic border-muted-foreground/10">
                          "{o.rejectionReason}"
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                          <UserPlus size={12} /> Re-assign Order
                        </p>
                        <div className="flex gap-2">
                          <Select onValueChange={(v) => reassignWriter(o.id, v)}>
                            <SelectTrigger className="w-full h-10 text-xs bg-muted/30 border-primary/20">
                              <SelectValue placeholder="Select New Writer" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockWriters
                                .filter((w) => w.status === "active" && w.id !== o.rejectedByWriterId)
                                .map((w) => (
                                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
