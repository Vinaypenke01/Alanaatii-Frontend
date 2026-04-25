import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockWriters, mockOrders, statusLabels, type Order } from "@/lib/mockData";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Languages, 
  FileText, 
  History, 
  RefreshCcw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ScrollText,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminWriterDetail() {
  const { id } = useParams();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("approved");
  const writer = mockWriters.find(w => w.id === id);
  
  if (!writer) {
    return (
      <DashboardLayout title="Writer Not Found" links={adminLinks} brandLabel="Admin Panel">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle size={48} className="text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Writer Not Found</h2>
          <p className="text-muted-foreground mb-6">The writer you are looking for does not exist or has been removed.</p>
          <Link to="/admin/writers">
            <Button className="bg-gradient-gold text-primary-foreground">
              <ArrowLeft size={16} className="mr-2" /> Back to Writers
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const writerOrders = mockOrders.filter(o => o.assignedWriterId === writer.id);
  
  const stats = {
    total: writerOrders.length,
    completed: writerOrders.filter(o => o.status === "approved" || o.status === "delivered").length,
    pending: writerOrders.filter(o => o.status === "script_in_progress" || o.status === "accepted_by_writer" || o.status === "assigned_to_writer").length,
    rejected: writerOrders.filter(o => o.status === "assignment_rejected").length,
    totalRevisions: writerOrders.reduce((acc, o) => acc + (o.scriptVersions?.length ? o.scriptVersions.length - 1 : 0), 0)
  };

  const filteredOrders = writerOrders.filter(order => {
    if (activeTab === "approved") return order.status === "approved" || order.status === "delivered";
    if (activeTab === "review") return order.status === "customer_review" || order.status === "script_submitted";
    if (activeTab === "progress") return ["script_in_progress", "accepted_by_writer", "assigned_to_writer"].includes(order.status);
    if (activeTab === "revision") return order.status === "revision_requested";
    return true;
  });

  return (
    <DashboardLayout title={`Writer Profile: ${writer.name}`} links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-8">
        {/* Back Link & Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin/writers">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{writer.name}</h2>
            <p className="text-sm text-muted-foreground">Detailed performance tracking and script history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold font-display flex-shrink-0">
                  {writer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">{writer.name}</h3>
                  <span className={cn(
                    "mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block",
                    writer.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground"
                  )}>
                    {writer.status === "active" ? "Active" : "Away"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-1">Email</p>
                    <p className="text-xs font-medium text-foreground break-all">{writer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-1">Phone</p>
                    <p className="text-xs font-medium text-foreground">{writer.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <Languages size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-1">Languages</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {writer.languages?.map(l => (
                        <span key={l} className="text-[8px] bg-primary/5 text-primary px-1.5 py-0.5 rounded border border-primary/10 font-bold uppercase">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-1">Location</p>
                    <p className="text-xs font-medium text-foreground">{(writer as any).address || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg shadow-primary/20">
              <h4 className="font-bold mb-4">Life-time Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/10">
                  <span className="text-sm opacity-80">Scripts Written</span>
                  <span className="text-xl font-bold">{stats.completed}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/10">
                  <span className="text-sm opacity-80">Avg. Revisions</span>
                  <span className="text-xl font-bold">
                    {stats.completed > 0 ? (stats.totalRevisions / stats.completed).toFixed(1) : "0.0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Acceptance Rate</span>
                  <span className="text-xl font-bold">
                    {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : "0"}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Script History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <FileText size={20} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={20} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Done</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Clock size={20} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                  <XCircle size={20} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>

            {/* Tabs Filter */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted/50 p-1 mb-6 w-full flex overflow-x-auto justify-start no-scrollbar h-auto min-h-[44px]">
                <TabsTrigger value="approved" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white whitespace-nowrap">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="review" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white whitespace-nowrap">
                  Review Pending
                </TabsTrigger>
                <TabsTrigger value="progress" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white whitespace-nowrap">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="revision" className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white whitespace-nowrap">
                  Revision Request
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Script History Table */}
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-muted/5 flex items-center justify-between">
                <h3 className="font-bold text-foreground">
                  {activeTab === "approved" ? "Approved Scripts" : 
                   activeTab === "review" ? "Pending Reviews" : 
                   activeTab === "progress" ? "Current Assignments" : 
                   "Requested Revisions"}
                </h3>
                <div className="text-xs text-muted-foreground font-medium">Showing {filteredOrders.length} entries</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 border-b">
                      <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Order & Client</th>
                      <th className="text-center p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Updates</th>
                      <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Script Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        const versionCount = order.scriptVersions?.length || 0;
                        const revisionCount = versionCount > 0 ? versionCount - 1 : 0;
                        
                        return (
                          <tr key={order.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground">{order.id}</span>
                                <span className="text-[11px] text-muted-foreground">{order.customerName} • {order.productType}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-bold">
                                  <RefreshCcw size={10} />
                                  {versionCount}
                                </div>
                                {revisionCount > 0 && (
                                  <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px] font-bold">
                                    <History size={10} />
                                    {revisionCount}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              {order.scriptContent ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-3 text-[10px] font-bold uppercase border border-primary/20 text-primary hover:bg-primary/5"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  View Script
                                </Button>
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">No Script</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-muted-foreground italic">
                          No history found for this category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Script Viewer Modal */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                  <DialogTitle className="flex items-center justify-between pr-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-primary tracking-widest mb-1">Script Preview</p>
                      <h3 className="font-display text-xl font-bold">Order #{selectedOrder?.id}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Order Context</p>
                      <div className="flex flex-col items-end gap-1.5 mt-1">
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border",
                          selectedOrder?.status === "approved" || selectedOrder?.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {selectedOrder ? statusLabels[selectedOrder.status] : ""}
                        </span>
                        <p className="text-[11px] font-bold text-foreground flex items-center gap-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          {selectedOrder?.createdAt}
                        </p>
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="p-8 overflow-y-auto flex-grow bg-muted/5">
                  <div className="bg-card border rounded-2xl p-8 shadow-sm relative">
                    {/* Decorative quotes */}
                    <div className="absolute top-4 left-4 text-primary/10 select-none"><ScrollText size={48} /></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dashed">
                        <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold uppercase">{selectedOrder?.letterType}</span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold uppercase">{selectedOrder?.tone}</span>
                      </div>
                      
                      <div className="font-serif text-lg leading-relaxed text-foreground whitespace-pre-wrap italic">
                        {selectedOrder?.scriptContent}
                      </div>
                    </div>
                  </div>

                  {selectedOrder?.revisionFeedback && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <History size={14} />
                        <p className="text-[11px] font-bold uppercase tracking-wider">Revision Request Details</p>
                      </div>
                      <p className="text-sm text-red-700 leading-relaxed italic">{selectedOrder.revisionFeedback}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t bg-muted/10 flex justify-end gap-3">
                   <Button variant="outline" onClick={() => setSelectedOrder(null)} className="font-bold">Close Preview</Button>
                   <Link to={`/admin/orders`}>
                     <Button className="bg-gradient-gold text-primary-foreground font-bold">Manage Order</Button>
                   </Link>
                </div>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
