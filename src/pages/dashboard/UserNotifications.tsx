import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { mockNotifications } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { FileText, Truck, MessageSquare, Bell, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const iconMap: Record<string, typeof FileText> = {
  script: FileText,
  delivery: Truck,
  feedback: MessageSquare,
  assignment: FileText,
  revision: MessageSquare,
  approval: Bell,
};

export default function UserNotifications() {
  const [notifications, setNotifications] = useState(
    mockNotifications.filter((n) => n.targetRole === "user")
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared.");
  };

  return (
    <DashboardLayout title="Notifications" links={userDashboardLinks} brandLabel="User Dashboard">
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
            <p className="text-muted-foreground">All caught up! No new notifications.</p>
          </div>
        )}
        {notifications.map((n) => {
          const Icon = iconMap[n.type] ?? Bell;
          return (
            <div 
              key={n.id} 
              onClick={() => markAsRead(n.id)}
              className={cn(
                "bg-card rounded-xl border p-5 flex gap-4 items-start cursor-pointer transition-all hover:shadow-md",
                !n.read ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10" : "opacity-70"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground text-sm truncate">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{n.createdAt}</p>
                  {!n.read && <span className="text-[10px] font-bold text-primary flex items-center gap-1"><CheckCheck size={12} /> New</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}