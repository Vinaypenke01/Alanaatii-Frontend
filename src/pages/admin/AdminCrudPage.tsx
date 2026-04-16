import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminLinks } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ImagePlus, ArrowLeft } from "lucide-react";

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
  showBackCatalog?: boolean;
}

export function AdminCrudPage({ 
  pageTitle, 
  initialItems, 
  hasDescription = true,
  showBackCatalog = false
}: AdminCrudPageProps) {
  const navigate = useNavigate();
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
        <div className="flex flex-col gap-2 mb-2">
          {showBackCatalog && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/admin/catalog")}
              className="w-fit h-7 text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 -ml-2"
            >
              <ArrowLeft size={14} /> Back to Catalog Hub
            </Button>
          )}
          {/* Mobile-friendly Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{pageTitle}</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAdd} className="w-full sm:w-auto bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-md">
                  <Plus size={16} className="mr-1" /> Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit" : "Add"} Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2 pb-2">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Image</Label>
                    <div
                      className="mt-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {form.image ? (
                        <div className="relative w-full">
                          <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                            <span className="text-white text-xs font-bold">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImagePlus size={32} className="text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Click to upload image</span>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs font-bold">Title</Label><Input value={form.title} placeholder="Enter item title" onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-bold">Price (₹)</Label><Input type="number" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                  {hasDescription && <div className="space-y-1.5"><Label className="text-xs font-bold">Description</Label><Input placeholder="Brief description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>}
                  <Button onClick={save} className="w-full h-12 bg-gradient-gold text-primary-foreground hover:opacity-90 font-bold mt-2">
                    {editing ? "Save Changes" : "Add Item"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mobile-Responsive View: Cards on Small Screens, Table on Large Screens */}
        <div className="block md:hidden space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-xl border p-4 shadow-sm flex gap-4 items-center">
              <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden border">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlus size={20} className="text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">{item.title}</h3>
                <p className="text-primary font-bold">₹{item.price}</p>
                {hasDescription && item.description && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 italic">{item.description}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)} className="h-8 w-8 p-0">
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="h-8 w-8 p-0 text-destructive">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-dashed">
              No items found. Click 'Add New' to begin.
            </div>
          )}
        </div>

        {/* Desktop Table: Hidden on Mobile */}
        <div className="hidden md:block bg-card rounded-xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Image</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Title</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Price</th>
                  {hasDescription && <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Description</th>}
                  <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover border" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border">
                          <ImagePlus size={16} className="text-muted-foreground/30" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-foreground">{item.title}</td>
                    <td className="p-4 text-primary font-bold">₹{item.price}</td>
                    {hasDescription && <td className="p-4 text-muted-foreground hidden lg:table-cell italic">{item.description}</td>}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)} className="hover:bg-primary/10 hover:text-primary">
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </div>
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