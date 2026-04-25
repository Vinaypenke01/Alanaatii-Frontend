import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Settings, Mail, Phone, IndianRupee, ShieldAlert } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    upiId: "alanaatii@okhdfcbank",
    supportEmail: "support@alanaatii.com",
    supportPhone: "+91 98765 43210",
    maintenanceMode: false,
    autoAssignWriters: true,
  });

  const [saving, setSaving] = useState(false);

  const saveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Global site settings updated successfully");
    }, 800);
  };

  return (
    <DashboardLayout title="Global Site Settings" links={adminLinks} brandLabel="Admin Panel">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Platform Configuration</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage core contact details and system toggles.</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="bg-gradient-gold text-primary-foreground font-bold shadow-lg shadow-primary/20">
          <Save size={16} className="mr-2" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contact & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/10 flex items-center gap-2">
              <IndianRupee size={18} className="text-primary" />
              <h3 className="font-bold text-foreground">Payment Configuration</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Master UPI ID</Label>
                <Input 
                  value={settings.upiId} 
                  onChange={(e) => setSettings(s => ({...s, upiId: e.target.value}))} 
                  className="font-mono bg-muted/30"
                />
                <p className="text-[11px] text-muted-foreground">This UPI ID is displayed on the manual payment checkout screen.</p>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/10 flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              <h3 className="font-bold text-foreground">Public Contact Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Support Email</Label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    type="email"
                    value={settings.supportEmail} 
                    onChange={(e) => setSettings(s => ({...s, supportEmail: e.target.value}))} 
                    className="pl-9 bg-muted/30"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">WhatsApp Number</Label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    value={settings.supportPhone} 
                    onChange={(e) => setSettings(s => ({...s, supportPhone: e.target.value}))} 
                    className="pl-9 bg-muted/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Toggles */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/10 flex items-center gap-2">
              <Settings size={18} className="text-primary" />
              <h3 className="font-bold text-foreground">System Toggles</h3>
            </div>
            
            <div className="p-6 space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="font-bold text-foreground flex items-center gap-2">
                    <ShieldAlert size={14} className="text-destructive" /> Maintenance Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">Take the public website offline for updates.</p>
                </div>
                <Switch 
                  checked={settings.maintenanceMode} 
                  onCheckedChange={(v) => setSettings(s => ({...s, maintenanceMode: v}))} 
                  className="data-[state=checked]:bg-destructive"
                />
              </div>

              <div className="border-t pt-6 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="font-bold text-foreground">Auto-Assign Writers</Label>
                  <p className="text-xs text-muted-foreground">Automatically route new orders to active writers based on language.</p>
                </div>
                <Switch 
                  checked={settings.autoAssignWriters} 
                  onCheckedChange={(v) => setSettings(s => ({...s, autoAssignWriters: v}))} 
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
}
