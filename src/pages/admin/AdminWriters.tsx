import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockWriters, mockOrders, type ScriptWriter } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";


/**
 * **A. Writer Creator & Onboarding**
 * - **Where**: `AdminWriters.tsx`
 * - **What**: The interface for adding new professional writers to the Alanaatii ecosystem. This is where the Admin **provisions account logins**.
 * - **Logic**: 
 *     - **Credential Setup**: Admins set the initial Email and **Secure Password** for the writer.
 *     - **Active/Inactive Toggle**: This is a "Safety Switch". When an admin sets a writer to `inactive`, the **Auto-Assignment Engine** automatically skips them, preventing jobs from being assigned to writers on leave.
 * - **Connections**: Once a writer is created with these credentials, they can log in to the **Writer Dashboard** to access their assigned scripts. Each Writer created here receives a unique `id` (e.g., `w4`).
 */
export default function AdminWriters() {
  const [writers, setWriters] = useState<ScriptWriter[]>(mockWriters);
  const [editing, setEditing] = useState<ScriptWriter | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    phone: "", 
    phoneSecondary: "",
    address: "",
    languages: "", 
    status: "active" as "active" | "inactive" 
  });

  const getWriterStats = (writerId: string) => {
    const writerOrders = mockOrders.filter(o => o.assignedWriterId === writerId);
    return {
      assigned: writerOrders.length,
      completed: writerOrders.filter(o => o.status === "approved" || o.status === "delivered").length,
      pending: writerOrders.filter(o => o.status === "script_in_progress" || o.status === "accepted_by_writer" || o.status === "assigned_to_writer").length,
      rejected: writerOrders.filter(o => o.status === "assignment_rejected").length
    };
  };

  const openNew = () => {
    setEditing(null);
    setForm({ 
      name: "", 
      email: "", 
      password: "", 
      phone: "", 
      phoneSecondary: "",
      address: "",
      languages: "", 
      status: "active" 
    });
    setShowOtp(false);
    setOtp("");
    setIsModalOpen(true);
  };

  const openEdit = (w: ScriptWriter) => {
    setEditing(w);
    setShowOtp(false);
    setOtp("");
    setForm({ 
      name: w.name, 
      email: w.email, 
      password: w.password || "", 
      phone: w.phone || "", 
      phoneSecondary: (w as any).phoneSecondary || "",
      address: (w as any).address || "",
      languages: w.languages?.join(", ") || "", 
      status: w.status 
    });
    setIsModalOpen(true);
  };

  const save = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    
    // OTP Flow for new writers
    if (!editing && !showOtp) {
      setShowOtp(true);
      toast.info(`Verification OTP sent to ${form.email}`);
      return;
    }

    if (!editing && showOtp && otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    const writerData: Partial<ScriptWriter> = {
      ...form,
      languages: form.languages.split(",").map(l => l.trim()).filter(l => l !== "")
    };

    if (editing) {
      setWriters((prev) => prev.map((w) => w.id === editing.id ? { ...w, ...writerData } as ScriptWriter : w));
      toast.success("Writer updated");
    } else {
      setWriters((prev) => [...prev, { id: `w${Date.now()}`, ...writerData } as ScriptWriter]);
      toast.success("Writer verified and onboarded successfully!");
    }
    setIsModalOpen(false);
  };

  const remove = (id: string) => {
    setWriters((prev) => prev.filter((w) => w.id !== id));
    toast.success("Writer removed");
  };

  return (
    <DashboardLayout title="Manage Script Writers" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-8">
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Writers Roster</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage and track your script writers' performance</p>
          </div>
          <Button onClick={openNew} className="bg-gradient-gold text-primary-foreground font-bold shadow-lg shadow-primary/20 h-12 px-6">
            <Plus size={18} className="mr-2" /> Add New Writer
          </Button>
        </div>

        {/* Modal Form */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold">
                {editing ? "Update Writer Profile" : "Onboard New Writer"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Full Name</label><Input placeholder="John Doe" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Email Address</label><Input placeholder="john@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-11" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Phone Number</label><Input placeholder="9876543210" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-11" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Initial Password</label><Input placeholder="••••••••" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="h-11" /></div>
                
                <div className="space-y-1.5 lg:col-span-2"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Languages (comma separated)</label><Input placeholder="English, Telugu, Hindi" value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} className="h-11" /></div>
                
                <div className="space-y-1.5 lg:col-span-2"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Resident Address</label><Input placeholder="Enter residential address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="h-11" /></div>

                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Writer Status</label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as "active" | "inactive" }))}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active (Receiving Jobs)</SelectItem>
                      <SelectItem value="inactive">Inactive (On Leave)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showOtp && !editing && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-bold text-primary mb-1">Verify Writer Email</h4>
                  <p className="text-xs text-muted-foreground mb-3">An OTP has been sent to <strong>{form.email}</strong>.</p>
                  <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="h-11 border-primary/20" />
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none">Cancel</Button>
              <Button onClick={save} className="bg-gradient-gold text-primary-foreground font-bold flex-1 sm:flex-none px-8">
                {editing ? "Save Changes" : showOtp ? "Verify & Create" : "Onboard Writer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Writer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {writers.map((w) => {
            const stats = getWriterStats(w.id);
            return (
              <div key={w.id} className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                {/* Status Header */}
                <div className={cn(
                  "h-1.5 w-full",
                  w.status === "active" ? "bg-green-500" : "bg-muted-foreground/30"
                )} />
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-display group-hover:scale-105 transition-transform">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{w.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            w.status === "active" ? "bg-green-500" : "bg-muted-foreground"
                          )} />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {w.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(w)}><Pencil size={14} /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(w.id)}><Trash2 size={14} /></Button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Assigned</p>
                        <p className="font-bold text-lg leading-none">{stats.assigned}</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Done</p>
                        <p className="font-bold text-lg leading-none">{stats.completed}</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Pending</p>
                        <p className="font-bold text-lg leading-none">{stats.pending}</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
                        <XCircle size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Rejected</p>
                        <p className="font-bold text-lg leading-none">{stats.rejected}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {w.languages?.map(l => (
                      <span key={l} className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-full font-bold uppercase">{l}</span>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-muted/5 border-t mt-auto">
                  <Link to={`/admin/writer-profile/${w.id}`} className="block">
                    <Button variant="outline" className="w-full font-bold text-primary border-primary/20 hover:bg-primary/5">
                      <Eye size={16} className="mr-2" /> View Detailed Profile
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
