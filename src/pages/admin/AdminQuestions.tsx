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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ relation: "", question: "" });

  const add = () => {
    if (!form.relation || !form.question) { toast.error("Fill all fields"); return; }
    setQuestions((p) => [...p, { id: `q-${Date.now()}`, ...form }]);
    setOpen(false);
    toast.success("Question added!");
  };

  return (
    <DashboardLayout title="Manage Questions" links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl font-bold text-foreground">Questions by Relation</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90"><Plus size={16} className="mr-1" /> Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Question</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Relation</Label>
                  <Select value={form.relation} onValueChange={(v) => setForm({ ...form, relation: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{relations.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Question</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
                <Button onClick={add} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {relations.map((r) => {
          const qs = questions.filter((q) => q.relation === r);
          if (qs.length === 0) return null;
          return (
            <div key={r} className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-foreground mb-3">{r}</h3>
              <div className="space-y-2">
                {qs.map((q) => (
                  <div key={q.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                    <span className="text-muted-foreground">{q.question}</span>
                    <Button variant="ghost" size="sm" onClick={() => { setQuestions((p) => p.filter((x) => x.id !== q.id)); toast.success("Deleted!"); }}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
