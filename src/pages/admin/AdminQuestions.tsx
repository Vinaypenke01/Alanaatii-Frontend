import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { mockAdminQuestions } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { relations } from "@/lib/data";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState(mockAdminQuestions);
  const [relationsList, setRelationsList] = useState([...relations]);
  const [open, setOpen] = useState(false);
  const [isNewRelation, setIsNewRelation] = useState(false);
  const [form, setForm] = useState({ relation: "", question: "" });

  const add = () => {
    if (!form.relation || !form.question) { toast.error("Fill all fields"); return; }
    
    // If it's a completely new relation name, add it to our display list
    if (isNewRelation && !relationsList.includes(form.relation as any)) {
      setRelationsList((prev) => [...prev, form.relation as any]);
    }

    setQuestions((p) => [...p, { id: `q-${Date.now()}`, ...form }]);
    setOpen(false);
    setForm({ relation: "", question: "" });
    setIsNewRelation(false);
    toast.success("Question added!");
  };

  return (
    <DashboardLayout title="Manage Questions" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Questions by Relation</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage mandatory questionnaire items for different relationship types.</p>
          </div>
          
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) setIsNewRelation(false); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-md">
                <Plus size={16} className="mr-2" /> Add New Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Relation Type</Label>
                    <button 
                      type="button"
                      onClick={() => { setIsNewRelation(!isNewRelation); setForm({ ...form, relation: "" }); }}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      {isNewRelation ? "← Select Existing" : "+ Create New Category"}
                    </button>
                  </div>
                  
                  {isNewRelation ? (
                    <Input 
                      placeholder="e.g. Teacher, Colleague..." 
                      value={form.relation} 
                      onChange={(e) => setForm({ ...form, relation: e.target.value })} 
                      className="h-10 bg-muted/30 focus-visible:ring-primary/20"
                    />
                  ) : (
                    <Select value={form.relation} onValueChange={(v) => setForm({ ...form, relation: v })}>
                      <SelectTrigger className="h-10 bg-muted/30 border-none">
                        <SelectValue placeholder="Choose relationship..." />
                      </SelectTrigger>
                      <SelectContent>
                        {relationsList.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question Text</Label>
                  <Input 
                    placeholder="Enter the mandatory question..." 
                    value={form.question} 
                    onChange={(e) => setForm({ ...form, question: e.target.value })} 
                    className="h-10 bg-muted/30 focus-visible:ring-primary/20"
                  />
                  <p className="text-[10px] text-muted-foreground italic">This question will be shown during the order flow for this relation.</p>
                </div>

                <Button onClick={add} className="w-full bg-gradient-gold text-primary-foreground font-bold h-12 text-lg shadow-lg">
                  Submit Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relationsList.map((r) => {
            const qs = questions.filter((q) => q.relation === r);
            if (qs.length === 0) return null;
            return (
              <div key={r} className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {r}
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {qs.length} {qs.length === 1 ? 'Question' : 'Questions'}
                  </span>
                </div>
                <div className="space-y-3">
                  {qs.map((q) => (
                    <div key={q.id} className="flex justify-between items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors group/item">
                      <span className="text-sm text-foreground/80 leading-relaxed font-medium">{q.question}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setQuestions((p) => p.filter((x) => x.id !== q.id)); toast.success("Deleted!"); }}
                        className="h-8 w-8 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-destructive/10"
                      >
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
