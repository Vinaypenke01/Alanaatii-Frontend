import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, MapPin, Gift, User, Mail, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAddress } from "@/lib/mockData";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    birthday: "1995-05-15",
    anniversary: "2021-12-10",
  });

  const [addresses, setAddresses] = useState<UserAddress[]>([
    { id: "addr-1", label: "Home", receiverName: "John Doe", phone: "9876543210", address: "123, Rose Street, Jubilee Hills", city: "Hyderabad", pincode: "500033", isPrimary: true },
    { id: "addr-2", label: "Office", receiverName: "John Doe", phone: "9876543211", address: "Tech Hub, Tower A, Kondapur", city: "Hyderabad", pincode: "500084", isPrimary: false },
  ]);

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const setPrimary = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isPrimary: a.id === id })));
    toast.success("Primary address updated");
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.error("Address removed");
  };

  return (
    <DashboardLayout title="Profile Settings" links={userDashboardLinks} brandLabel="User Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Personal Details */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Personal Information</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10 h-11 bg-muted/30 border-none" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10 h-11 bg-muted/30 border-none" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} type="email" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <CalendarIcon size={12} /> Birthday
                  </Label>
                  <Input type="date" className="h-11 bg-muted/30 border-none px-4" value={profile.birthday} onChange={(e) => setProfile({ ...profile, birthday: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <CalendarIcon size={12} /> Anniversary
                  </Label>
                  <Input type="date" className="h-11 bg-muted/30 border-none px-4" value={profile.anniversary} onChange={(e) => setProfile({ ...profile, anniversary: e.target.value })} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic px-1 pt-1 opacity-70">
                ⭐ We'll use these dates to send you exclusive luxury gifting reminders and anniversary surprises.
              </p>
            </div>

            <Button className="w-full bg-gradient-gold text-primary-foreground font-bold h-12 shadow-lg shadow-primary/10 hover:opacity-90"
              onClick={() => toast.success("Profile updated! Data saved securely.")}>
              Save Profile Changes
            </Button>
          </div>
        </div>

        {/* Address Management */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">Saved Addresses</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-bold gap-1 h-8 hover:bg-primary/5" onClick={() => toast("Add address popup would appear")}>
                <Plus size={14} /> Add New
              </Button>
            </div>

            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className={cn(
                  "relative p-5 rounded-xl border transition-all hover:border-primary/30 group",
                  addr.isPrimary ? "bg-primary/5 border-primary/20 " : "bg-card hover:bg-muted/30"
                )}>
                  {addr.isPrimary && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest bg-white px-2 py-0.5 rounded-full shadow-sm border border-primary/10">
                       <CheckCircle2 size={10} /> Primary
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-tighter">{addr.label}</span>
                      <h4 className="font-bold text-sm text-foreground">{addr.receiverName}</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground leading-relaxed">{addr.address}</p>
                      <p className="text-xs text-muted-foreground">{addr.city}, {addr.pincode}</p>
                    </div>
                    <div className="flex items-center gap-4 pt-3 mt-1 border-t border-border/5">
                      {!addr.isPrimary && (
                        <button onClick={() => setPrimary(addr.id)} className="text-[10px] font-bold text-primary hover:underline">Set as Primary</button>
                      )}
                      <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Edit</button>
                      <button onClick={() => removeAddress(addr.id)} className="text-[10px] font-bold text-destructive/70 hover:text-destructive">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
