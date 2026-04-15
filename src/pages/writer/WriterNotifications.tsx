import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { writerLinks } from "./WriterDashboard";
import { mockNotifications } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { FileText, RotateCcw, CheckCircle, Bell, Trash2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const iconMap = {
  assignment: FileText,
  revision: RotateCcw,
  approval: CheckCircle,
} as const;

export default function WriterNotifications() {
  const [notifications, setNotifications] = useState(
    mockNotifications.filter((n) => n.targetRole === "writer")
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared.");
  };

  return (
    <DashboardLayout title="Notifications" links={writerLinks} brandLabel="Script Writer">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground">{notifications.length} notifications</h2>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs gap-2 text-muted-foreground hover:text-destructive">
            <Trash2 size={14} /> Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed">
            <Bell size={40} className="mx-auto text-muted mb-3 opacity-20" />
            <p className="text-muted-foreground">All caught up!</p>
          </div>
        )}
        {notifications.map((n) => {
          const IconComp = iconMap[n.type as keyof typeof iconMap] || FileText;
          return (
            <div 
              key={n.id} 
              onClick={() => markAsRead(n.id)}
              className={cn(
                "bg-card rounded-xl border p-5 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md",
                !n.read ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10" : "opacity-70"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <IconComp size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground text-sm">{n.title}</p>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{n.createdAt}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                {!n.read && (
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1"><CheckCheck size={12} /> New</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
