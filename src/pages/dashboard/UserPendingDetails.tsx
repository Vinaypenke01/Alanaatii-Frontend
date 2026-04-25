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
  
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    "How did you meet?",
    "What is your favorite memory together?",
    "What do you love most about them?"
  ];

  if (!order) return <p>Order not found.</p>;

  // If order already has questionnaire details, redirect back
  if (order.userAnswers && order.userAnswers.length > 0) {
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
    // Check if all questions are answered
    if (questions.some(q => !answers[q] || answers[q].trim() === "")) {
      toast.error("Please answer all questions so we can personalize your letter.");
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
          <h3 className="font-bold text-primary mb-1">Relationship Questionnaire</h3>
          <p className="text-sm text-muted-foreground">Please answer these questions to help our writers deeply personalize the letter. This is the final step before writing begins.</p>
        </div>

        <div className="bg-card border rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="space-y-2">
                <Label className="text-sm font-bold">{idx + 1}. {q}</Label>
                <Textarea 
                  value={answers[q] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [q]: e.target.value }))}
                  placeholder="Your answer..."
                  rows={3}
                />
              </div>
            ))}
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
