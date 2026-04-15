import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockCoupons } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discount: "" });

  const add = () => {
    if (!form.code || !form.discount) { toast.error("Fill all fields"); return; }
    setCoupons((p) => [...p, { id: `c-${Date.now()}`, code: form.code.toUpperCase(), discount: Number(form.discount), active: true }]);
    setOpen(false);
    toast.success("Coupon created!");
  };

  const toggle = (id: string) => {
    setCoupons((p) => p.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <DashboardLayout title="Coupon Management" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl font-bold text-foreground">Coupons</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90"><Plus size={16} className="mr-1" /> Create</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. LOVE20" /></div>
                <div><Label>Discount %</Label><Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
                <Button onClick={add} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">Create Coupon</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Code</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Discount</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Active</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-4 font-mono font-semibold text-foreground">{c.code}</td>
                  <td className="p-4 text-primary font-semibold">{c.discount}%</td>
                  <td className="p-4"><Switch checked={c.active} onCheckedChange={() => toggle(c.id)} /></td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setCoupons((p) => p.filter((x) => x.id !== c.id)); toast.success("Deleted!"); }}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
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
