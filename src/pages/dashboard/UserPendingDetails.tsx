import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { mockOrders } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const relations = ["Parent", "Sibling", "Partner", "Friend", "Colleague", "Other"];

export default function UserPendingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const order = mockOrders.find((o) => o.id === id);
  
  const [form, setForm] = useState({
    recipientName: order?.recipientName || "",
    recipientPhone: order?.recipientPhone || "",
    primaryContact: order?.primaryContact || "recipient",
    relation: order?.relation || "",
    messageContent: order?.messageContent || "",
    specialNotes: order?.specialNotes || ""
  });

  if (!order) return <p>Order not found.</p>;

  // If order already has details, redirect back
  if (order.messageContent && order.relation && order.recipientName) {
    return (
      <DashboardLayout title="Details Complete" links={userDashboardLinks} brandLabel="Customer Dashboard">
        <div className="text-center py-20 bg-card rounded-xl border">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Details Already Submitted</h2>
          <p className="text-muted-foreground mb-6">We have all the information needed for this order.</p>
          <Button onClick={() => navigate(`/dashboard/orders/${id}`)}>View Order Status</Button>
        </div>
      </DashboardLayout>
    );
  }

  const saveDetails = () => {
    if (!form.recipientName || !form.recipientPhone || !form.relation || !form.messageContent || !form.primaryContact) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    // Simulate API update
    toast.success("Order details updated successfully!");
    navigate(`/dashboard/orders/${id}`);
  };

  return (
    <DashboardLayout title="Mandatory Script Details" links={userDashboardLinks} brandLabel="Customer Dashboard">
      <div className="max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-4 mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>

        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mb-6">
          <h3 className="font-bold text-primary mb-1">Payment Verified!</h3>
          <p className="text-sm text-muted-foreground">Please provide the necessary recipient details and story below. This is the final step before our writers can begin crafting your custom letter.</p>
        </div>

        <div className="bg-card border rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Recipient Name</Label>
              <Input 
                value={form.recipientName} 
                onChange={(e) => setForm(f => ({ ...f, recipientName: e.target.value }))} 
                placeholder="Their name" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Recipient Phone (WhatsApp)</Label>
              <Input 
                value={form.recipientPhone} 
                onChange={(e) => setForm(f => ({ ...f, recipientPhone: e.target.value.replace(/[^\d+]/g, "") }))} 
                placeholder="Their number" 
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
            <Label className="text-sm font-bold text-primary flex items-center gap-2">
              <CheckCircle2 size={16} /> Primary Contact for Delivery
            </Label>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Who should our delivery partner contact for location details or calls?
            </p>
            <div className="flex gap-4 pt-1">
              <Button 
                type="button"
                variant={form.primaryContact === "sender" ? "default" : "outline"}
                className="flex-1 h-10 text-xs"
                onClick={() => setForm(f => ({ ...f, primaryContact: "sender" }))}
              >
                Me (Sender)
              </Button>
              <Button 
                type="button"
                variant={form.primaryContact === "recipient" ? "default" : "outline"}
                className="flex-1 h-10 text-xs"
                onClick={() => setForm(f => ({ ...f, primaryContact: "recipient" }))}
              >
                Them (Recipient)
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Relation</Label>
            <Select value={form.relation} onValueChange={(v) => setForm(f => ({ ...f, relation: v }))}>
              <SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger>
              <SelectContent>
                {relations.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Message Content / Story</Label>
            <Textarea 
              value={form.messageContent} 
              onChange={(e) => setForm(f => ({ ...f, messageContent: e.target.value }))} 
              placeholder="What would you like to say? Share the memories or specific things you want included." 
              rows={6} 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Special Notes (Optional)</Label>
            <Input 
              value={form.specialNotes} 
              onChange={(e) => setForm(f => ({ ...f, specialNotes: e.target.value }))} 
              placeholder="Any specific instructions for our writers?" 
            />
          </div>

          <div className="pt-6 border-t mt-8">
            <Button onClick={saveDetails} className="w-full bg-gradient-gold text-primary-foreground font-bold h-12 text-lg shadow-lg">
              Submit Details & Start Writing
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
