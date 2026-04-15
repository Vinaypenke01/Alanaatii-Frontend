import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";

interface CrudItem {
  id: string;
  title: string;
  price: number;
  description?: string;
  image?: string;
}

interface AdminCrudPageProps {
  pageTitle: string;
  initialItems: CrudItem[];
  hasDescription?: boolean;
}

export function AdminCrudPage({ pageTitle, initialItems, hasDescription = true }: AdminCrudPageProps) {
  const [items, setItems] = useState<CrudItem[]>(initialItems);
  const [editing, setEditing] = useState<CrudItem | null>(null);
  const [form, setForm] = useState({ title: "", price: "", description: "", image: "" });
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", price: "", description: "", image: "" });
    setOpen(true);
  };

  const openEdit = (item: CrudItem) => {
    setEditing(item);
    setForm({ title: item.title, price: String(item.price), description: item.description ?? "", image: item.image ?? "" });
    setOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!form.title || !form.price) { toast.error("Please fill required fields"); return; }
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, title: form.title, price: Number(form.price), description: form.description, image: form.image || i.image } : i));
      toast.success("Updated!");
    } else {
      setItems((prev) => [...prev, { id: `new-${Date.now()}`, title: form.title, price: Number(form.price), description: form.description, image: form.image }]);
      toast.success("Added!");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted!");
  };

  return (
    <DashboardLayout title={pageTitle} links={adminLinks} brandLabel="Admin Panel">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl font-bold text-foreground">{pageTitle}</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="bg-gradient-gold text-primary-foreground hover:opacity-90">
                <Plus size={16} className="mr-1" /> Add New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit" : "Add"} Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Product Image</Label>
                  <div
                    className="mt-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                    ) : (
                      <>
                        <ImagePlus size={32} className="text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                </div>
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                {hasDescription && <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>}
                <Button onClick={save} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
                  {editing ? "Save Changes" : "Add Item"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Image</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                {hasDescription && <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Description</th>}
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-4">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-md object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                        <ImagePlus size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-foreground">{item.title}</td>
                  <td className="p-4 text-primary font-semibold">₹{item.price}</td>
                  {hasDescription && <td className="p-4 text-muted-foreground hidden sm:table-cell">{item.description}</td>}
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(item.id)}><Trash2 size={14} className="text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}