import { AdminCrudPage } from "./AdminCrudPage";
import { mockAdminTextStyles } from "@/lib/mockData";
export default function AdminTextStyles() {
  return <AdminCrudPage pageTitle="Manage Text Styles" initialItems={mockAdminTextStyles.map(t => ({ ...t, description: "" }))} hasDescription={false} showBackCatalog={true} />;
}
