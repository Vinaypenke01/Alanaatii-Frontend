import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockInquiries } from "@/lib/mockData";
import type { SupportInquiry } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Search, Mail, MessageSquare, CheckCircle2, Clock, Reply, Filter, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function AdminSupport() {
  const [inquiries, setInquiries] = useState<SupportInquiry[]>(mockInquiries);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SupportInquiry["status"] | "all">("all");

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(search.toLowerCase()) || 
                         inq.email.toLowerCase().includes(search.toLowerCase()) ||
                         inq.message.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || inq.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (id: string, newStatus: SupportInquiry["status"]) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    toast.success(`Inquiry status updated to ${newStatus}`);
  };

  const statusIcons = {
    new: <Clock className="text-orange-500" size={14} />,
    read: <CheckCircle2 className="text-blue-500" size={14} />,
    responded: <CheckCircle2 className="text-green-500" size={14} />
  };

  const statusColors = {
    new: "bg-orange-100 text-orange-700 border-orange-200",
    read: "bg-blue-100 text-blue-700 border-blue-200",
    responded: "bg-green-100 text-green-700 border-green-200"
  };

  return (
    <DashboardLayout title="Support Inquiries" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by name, email or message..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card border-border/50"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={16} className="text-muted-foreground mr-1" />
            <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50 w-full md:w-auto">
              {(["all", "new", "read", "responded"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold uppercase tracking-tighter rounded-md transition-all flex-1 md:flex-none",
                    filter === f ? "bg-card text-primary shadow-sm ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inquiry List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredInquiries.length === 0 ? (
            <div className="bg-card border rounded-xl p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Search size={32} />
              </div>
              <p className="text-muted-foreground">No inquiries found matching your filters.</p>
            </div>
          ) : (
            filteredInquiries.map((inq) => (
              <div key={inq.id} className={cn(
                "group bg-card rounded-xl border transition-all hover:shadow-lg hover:border-primary/20 p-5 md:p-6",
                inq.status === "new" && "border-l-4 border-l-orange-500 bg-orange-50/10"
              )}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    {/* Meta info */}
                    <div className="flex items-start justify-between md:justify-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                          {inq.name}
                          <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border", statusColors[inq.status])}>
                            {inq.status}
                          </span>
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                            <Mail size={14} /> {inq.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} /> {format(new Date(inq.createdAt), "PPP p")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50 relative">
                       <MessageSquare size={16} className="absolute -top-2 -left-2 text-primary bg-background p-0.5 rounded border shadow-sm" />
                       <p className="text-sm text-foreground leading-relaxed italic">
                        "{inq.message}"
                       </p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 text-xs font-bold gap-2 flex-1 md:flex-none border-primary/20 text-primary hover:bg-primary hover:text-white"
                      onClick={() => window.location.href = `mailto:${inq.email}?subject=Response to Alanaatii Inquiry`}
                    >
                      <Reply size={14} /> Reply 
                    </Button>
                    
                    {inq.status !== "responded" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 text-xs font-bold gap-2 flex-1 md:flex-none text-muted-foreground hover:bg-muted"
                        onClick={() => handleStatusChange(inq.id, inq.status === "new" ? "read" : "responded")}
                      >
                         <CheckCircle2 size={14} /> {inq.status === "new" ? "Mark as Read" : "Mark as Responded"}
                      </Button>
                    )}
                    
                    <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-10 w-10 text-muted-foreground hover:text-destructive transition-colors hidden md:flex"
                       onClick={() => {
                         setInquiries(prev => prev.filter(p => p.id !== inq.id));
                         toast.error("Inquiry archived.");
                       }}
                    >
                       <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
