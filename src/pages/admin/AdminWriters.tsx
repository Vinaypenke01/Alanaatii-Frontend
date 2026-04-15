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
  const [form, setForm] = useState({ name: "", email: "", password: "", status: "active" as "active" | "inactive" });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", password: "", status: "active" });
  };

  const openEdit = (w: ScriptWriter) => {
    setEditing(w);
    setForm({ name: w.name, email: w.email, password: w.password || "", status: w.status });
  };

  const save = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    if (editing) {
      setWriters((prev) => prev.map((w) => w.id === editing.id ? { ...w, ...form } : w));
      toast.success("Writer updated");
    } else {
      setWriters((prev) => [...prev, { id: `w${Date.now()}`, ...form }]);
      toast.success("Writer added");
    }
    setForm({ name: "", email: "", password: "", status: "active" });
    setEditing(null);
  };

  const remove = (id: string) => {
    setWriters((prev) => prev.filter((w) => w.id !== id));
    toast.success("Writer removed");
  };

  return (
    <DashboardLayout title="Manage Script Writers" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-6">
        {/* Form */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">{editing ? "Edit Writer" : "Add Writer"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Input 
              placeholder="Initial Password" 
              type="password"
              value={form.password} 
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} 
            />
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as "active" | "inactive" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={save} className="bg-gradient-gold text-primary-foreground hover:opacity-90">
              <Plus size={16} /> {editing ? "Update" : "Add Writer"}
            </Button>
            {editing && <Button variant="outline" onClick={openNew}>Cancel</Button>}
          </div>
        </div>

        {/* List */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {writers.map((w) => (
                <tr key={w.id} className="border-b last:border-0">
                  <td className="p-4 font-medium text-foreground">{w.name}</td>
                  <td className="p-4 text-muted-foreground">{w.email}</td>
                  <td className="p-4">
                    <span className={cn(
                      "text-xs px-2.5 py-1 rounded-full font-medium",
                      w.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    )}>{w.status === "active" ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(w)}><Pencil size={14} /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(w.id)}><Trash2 size={14} className="text-destructive" /></Button>
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
