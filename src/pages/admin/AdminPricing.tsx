import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminPricing() {
  const [earlyCharge, setEarlyCharge] = useState(100);
  const [pincodes, setPincodes] = useState([
    { prefix: "500", charge: 50 },
    { prefix: "600", charge: 70 },
  ]);

  const updatePincode = (idx: number, field: "prefix" | "charge", value: string) => {
    setPincodes((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: field === "charge" ? Number(value) : value } : p));
  };

  const addPincode = () => setPincodes((p) => [...p, { prefix: "", charge: 0 }]);
  const removePincode = (idx: number) => setPincodes((p) => p.filter((_, i) => i !== idx));

  return (
    <DashboardLayout title="Pricing Configuration" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-6 max-w-lg">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Early Delivery Charge</h3>
          <p className="text-sm text-muted-foreground mb-3">Extra charge when delivery date is less than 4 weeks away</p>
          <div className="flex items-center gap-3">
            <Label>₹</Label>
            <Input type="number" value={earlyCharge} onChange={(e) => setEarlyCharge(Number(e.target.value))} className="w-32" />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4 md:p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Pincode-based Delivery</h3>
          <div className="space-y-4">
            {pincodes.map((p, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 group p-2 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                <div className="flex items-center gap-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground">Zip</Label>
                   <Input placeholder="Prefix" value={p.prefix} onChange={(e) => updatePincode(i, "prefix", e.target.value)} className="w-16 h-8 text-xs bg-muted/50 border-none" />
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-muted-foreground text-xs">→ ₹</span>
                   <Input type="number" value={p.charge} onChange={(e) => updatePincode(i, "charge", e.target.value)} className="w-20 h-8 text-xs bg-muted/50 border-none font-bold text-primary" />
                </div>
                <Button variant="ghost" size="sm" onClick={() => removePincode(i)} className="text-destructive h-8 w-8 p-0 ml-auto md:ml-0">
                  ✕
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addPincode} className="w-full sm:w-auto h-9 text-xs font-bold border-dashed">+ Add Pincode Rule</Button>
          </div>
        </div>

        <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90"
          onClick={() => toast.success("Pricing saved! (Demo)")}>
          Save Configuration
        </Button>
      </div>
    </DashboardLayout>
  );
}
