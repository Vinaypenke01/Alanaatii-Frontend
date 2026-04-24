import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { writerLinks, CURRENT_WRITER_ID } from "./WriterDashboard";
import { getWriterById } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck, Lock } from "lucide-react";

export default function WriterProfile() {
  const writer = getWriterById(CURRENT_WRITER_ID);
  
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const initiatePasswordUpdate = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    
    // Simulate sending OTP to registered email
    setShowOtp(true);
    toast.info(`Verification OTP sent to ${writer?.email}`);
  };

  const verifyAndUpdate = () => {
    if (otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    
    toast.success("Identity verified! Password updated successfully.");
    setShowOtp(false);
    setOtp("");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  if (!writer) return <p>Loading...</p>;

  return (
    <DashboardLayout title="Profile & Security" links={writerLinks} brandLabel="Script Writer">
      <div className="space-y-6 max-w-3xl">
        
        {/* Personal Details */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Full Name</p>
              <p className="font-medium">{writer.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Registered Email</p>
              <p className="font-medium">{writer.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Languages</p>
              <div className="flex gap-2 mt-1">
                {writer.languages?.map(l => (
                  <span key={l} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{l}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Account Status</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                {writer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Security / Password Update */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-6 py-4 flex items-center gap-2 border-b">
            <ShieldCheck size={18} className="text-primary" />
            <h3 className="font-display text-lg font-bold text-foreground">Security Settings</h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
              <Input type="password" value={passwords.current} onChange={(e) => setPasswords(p => ({...p, current: e.target.value}))} className="max-w-md bg-muted/20" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                <Input type="password" value={passwords.new} onChange={(e) => setPasswords(p => ({...p, new: e.target.value}))} className="bg-muted/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords(p => ({...p, confirm: e.target.value}))} className="bg-muted/20" />
              </div>
            </div>

            {!showOtp ? (
              <Button onClick={initiatePasswordUpdate} className="mt-4 flex items-center gap-2" variant="default">
                <Lock size={16} /> Update Password
              </Button>
            ) : (
              <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-xl max-w-md animate-in fade-in slide-in-from-top-4">
                <h4 className="font-bold text-primary mb-1">Verify Your Identity</h4>
                <p className="text-xs text-muted-foreground mb-4">An OTP has been sent to <strong>{writer.email}</strong> to authorize this password change.</p>
                <div className="space-y-3">
                  <Input placeholder="Enter OTP (e.g. 123456)" value={otp} onChange={(e) => setOtp(e.target.value)} className="bg-white border-primary/20 h-11" />
                  <div className="flex gap-2">
                    <Button onClick={verifyAndUpdate} className="flex-1 bg-gradient-gold text-primary-foreground font-bold shadow-md hover:opacity-90">Verify & Save</Button>
                    <Button variant="outline" onClick={() => setShowOtp(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
