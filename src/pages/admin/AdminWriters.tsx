import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockWriters } from "@/lib/mockData";
import type { ScriptWriter } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    openNew();
  };

  const remove = (id: string) => {
    setWriters((prev) => prev.filter((w) => w.id !== id));
    toast.success("Writer removed");
  };

  return (
    <DashboardLayout title="Manage Script Writers" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-6">
        {/* Form */}
        <div className="bg-card rounded-xl border p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Plus size={18} />
             </div>
             <h3 className="font-display text-lg font-bold text-foreground">{editing ? "Update Writer Credentials" : "Onboard New Writer"}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
            <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Full Name</label><Input placeholder="John Doe" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="bg-muted/30 border-none h-11" /></div>
            <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Email Address</label><Input placeholder="john@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="bg-muted/30 border-none h-11" /></div>
            <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Phone Number</label><Input placeholder="9876543210" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="bg-muted/30 border-none h-11" /></div>
            <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Initial Password</label><Input placeholder="••••••••" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="bg-muted/30 border-none h-11" /></div>
            
            <div className="space-y-1.5 lg:col-span-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Secondary Phone</label><Input placeholder="Optional" value={form.phoneSecondary} onChange={(e) => setForm((f) => ({ ...f, phoneSecondary: e.target.value }))} className="bg-muted/30 border-none h-11" /></div>
            
            <div className="space-y-1.5 lg:col-span-2"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Languages (comma separated)</label><Input placeholder="English, Telugu, Hindi" value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} className="bg-muted/30 border-none h-11" /></div>
            
            <div className="space-y-1.5 lg:col-span-2"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Resident Address</label><Input placeholder="Enter residential address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="bg-muted/30 border-none h-11" /></div>

            <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Writer Status</label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as "active" | "inactive" }))}>
                <SelectTrigger className="bg-muted/30 border-none h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Receiving Jobs)</SelectItem>
                  <SelectItem value="inactive">Inactive (Skipped by Engine)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {showOtp && !editing && (
            <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-xl max-w-md animate-in fade-in slide-in-from-top-4">
              <h4 className="font-bold text-primary mb-1">Verify Writer Email</h4>
              <p className="text-xs text-muted-foreground mb-4">An OTP has been sent to <strong>{form.email}</strong>. Ask the writer for this code to complete their account setup.</p>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Enter Verification Code</label>
                <Input placeholder="e.g. 123456" value={otp} onChange={(e) => setOtp(e.target.value)} className="bg-white border-primary/20 h-11" />
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
            <Button onClick={save} className="bg-gradient-gold text-primary-foreground hover:opacity-90 h-11 flex-1 sm:flex-none px-8 font-bold shadow-lg shadow-primary/10">
              {editing ? "Save Changes" : showOtp ? "Verify OTP & Create Writer" : "Confirm Onboarding"}
            </Button>
            {editing && <Button variant="outline" onClick={openNew} className="h-11 flex-1 sm:flex-none px-6">Cancel Edit</Button>}
            {showOtp && !editing && <Button variant="ghost" onClick={() => setShowOtp(false)} className="h-11 flex-1 sm:flex-none px-6">Cancel</Button>}
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="block lg:hidden space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Writer Roster ({writers.length})</h3>
          </div>
          {writers.map((w) => (
            <div key={w.id} className="bg-card rounded-xl border p-4 shadow-sm relative overflow-hidden group">
              <div className={cn("absolute top-0 right-0 w-2 h-full", w.status === "active" ? "bg-green-500" : "bg-muted")} />
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {w.name.charAt(0)}
                   </div>
                   <div>
                      <h4 className="font-bold text-foreground">{w.name}</h4>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{w.email}</p>
                   </div>
                </div>
                <div className="flex gap-1">
                   <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(w)}><Pencil size={14} /></Button>
                   <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(w.id)}><Trash2 size={14} /></Button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Skills</p>
                    <div className="flex flex-wrap gap-1">
                       {w.languages?.map(l => (
                          <span key={l} className="text-[8px] bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.5 rounded font-bold uppercase">{l}</span>
                       ))}
                    </div>
                 </div>
                 <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border inline-block",
                      w.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground border-border"
                    )}>
                      {w.status === "active" ? "Online" : "Away"}
                    </span>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table: List */}
        <div className="hidden lg:block bg-card rounded-xl border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b bg-muted/5">
             <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active & Inactive Writers</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Writer Profile</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Languages</th>
                <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Availability</th>
                <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {writers.map((w) => (
                <tr key={w.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                       <span className="font-bold text-foreground">{w.name}</span>
                       <span className="text-[11px] text-muted-foreground">{w.email}</span>
                       <span className="text-[10px] text-primary/70 font-mono mt-0.5">{w.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {w.languages?.map(l => (
                           <span key={l} className="text-[9px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded font-bold uppercase">{l}</span>
                        ))}
                     </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border",
                      w.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground border-border"
                    )}>{w.status === "active" ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary" onClick={() => openEdit(w)}><Pencil size={14} /></Button>
                      <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => remove(w.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
