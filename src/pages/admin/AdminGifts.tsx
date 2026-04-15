import { AdminCrudPage } from "./AdminCrudPage";
import { mockAdminGifts } from "@/lib/mockData";
export default function AdminGifts() {
  return <AdminCrudPage pageTitle="Manage Gifts" initialItems={mockAdminGifts} />;
}
