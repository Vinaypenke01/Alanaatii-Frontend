import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    address: "123, Rose Street, Hyderabad",
  });

  return (
    <DashboardLayout title="Profile" links={userDashboardLinks} brandLabel="User Dashboard">
      <div className="max-w-lg">
        <div className="bg-card rounded-xl border p-6 space-y-5">
          <h2 className="font-display text-xl font-bold text-foreground">Your Profile</h2>
          <div>
            <Label>Name</Label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} type="email" />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
          </div>
          <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            onClick={() => toast.success("Profile updated! (Demo)")}>
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
