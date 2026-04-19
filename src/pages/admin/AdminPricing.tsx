import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminPricing() {
  const [dayRules, setDayRules] = useState([
    { days: 7, charge: 500 },
    { days: 14, charge: 300 },
    { days: 30, charge: 100 },
  ]);
  const [pincodes, setPincodes] = useState([
    { prefix: "500", charge: 50 },
    { prefix: "600", charge: 70 },
  ]);

  const updateDayRule = (idx: number, field: "days" | "charge", value: string) => {
    setDayRules((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: Number(value) } : r));
  };

  const addDayRule = () => setDayRules((r) => [...r, { days: 0, charge: 0 }]);
  const removeDayRule = (idx: number) => setDayRules((r) => r.filter((_, i) => i !== idx));

  const updatePincode = (idx: number, field: "prefix" | "charge", value: string) => {
    setPincodes((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: field === "charge" ? Number(value) : value } : p));
  };

  const addPincode = () => setPincodes((p) => [...p, { prefix: "", charge: 0 }]);
  const removePincode = (idx: number) => setPincodes((p) => p.filter((_, i) => i !== idx));

  return (
    <DashboardLayout title="Pricing Configuration" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Day-based Early Delivery Charges */}
          <div className="bg-card rounded-xl border p-4 md:p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-display text-lg font-bold text-foreground mb-1">Early Delivery Thresholds</h3>
            <p className="text-sm text-muted-foreground mb-6">Define extra charges based on how soon the delivery is requested.</p>
            
            <div className="space-y-4 flex-grow">
              {dayRules.map((r, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-all group">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Within</Label>
                    <div className="flex items-center gap-1.5">
                      <Input 
                        type="number" 
                        value={r.days} 
                        onChange={(e) => updateDayRule(i, "days", e.target.value)} 
                        className="w-16 h-9 text-center font-bold bg-background" 
                      />
                      <span className="text-xs font-semibold">Days</span>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block h-4 w-px bg-border mx-2" />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs font-medium">Extra Charge:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-bold">₹</span>
                      <Input 
                        type="number" 
                        value={r.charge} 
                        onChange={(e) => updateDayRule(i, "charge", e.target.value)} 
                        className="w-24 h-9 font-bold text-primary bg-background" 
                      />
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeDayRule(i)} 
                    className="text-destructive h-9 w-9 p-0 ml-auto hover:bg-destructive/10"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-dashed">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addDayRule} 
                className="w-full h-10 text-xs font-bold border-dashed hover:border-primary hover:text-primary transition-all"
              >
                + Add Day-Based Threshold
              </Button>
            </div>
          </div>

          {/* Pincode Charges */}
          <div className="bg-card rounded-xl border p-4 md:p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-display text-lg font-bold text-foreground mb-1">Pincode-based Delivery</h3>
            <p className="text-sm text-muted-foreground mb-6">Regional delivery surcharges based on zip code prefixes.</p>
            
            <div className="space-y-3 flex-grow">
              {pincodes.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-all group">
                  <div className="flex items-center gap-2">
                     <Label className="text-[10px] font-bold uppercase text-muted-foreground">Zip Prefix</Label>
                     <Input 
                      placeholder="e.g. 500" 
                      value={p.prefix} 
                      onChange={(e) => updatePincode(i, "prefix", e.target.value)} 
                      className="w-20 h-9 text-center font-mono bg-background" 
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-muted-foreground text-xs">→</span>
                     <span className="text-primary font-bold">₹</span>
                     <Input 
                      type="number" 
                      value={p.charge} 
                      onChange={(e) => updatePincode(i, "charge", e.target.value)} 
                      className="w-24 h-9 font-bold text-primary bg-background" 
                     />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removePincode(i)} 
                    className="text-destructive h-9 w-9 p-0 ml-auto hover:bg-destructive/10"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-dashed">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addPincode} 
                className="w-full h-10 text-xs font-bold border-dashed hover:border-primary hover:text-primary transition-all"
              >
                + Add Pincode Surcharge
              </Button>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-gold text-primary-foreground font-bold py-8 text-xl hover:opacity-90 shadow-lg"
          onClick={() => toast.success("Pricing configuration saved successfully!")}
        >
          Save Global Strategy
        </Button>
      </div>
    </DashboardLayout>
  );
}
