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

        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Pincode-based Delivery</h3>
          <div className="space-y-3">
            {pincodes.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input placeholder="Prefix" value={p.prefix} onChange={(e) => updatePincode(i, "prefix", e.target.value)} className="w-24" />
                <span className="text-muted-foreground">→ ₹</span>
                <Input type="number" value={p.charge} onChange={(e) => updatePincode(i, "charge", e.target.value)} className="w-24" />
                <Button variant="ghost" size="sm" onClick={() => removePincode(i)} className="text-destructive">✕</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addPincode}>+ Add Pincode Rule</Button>
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
