import { AdminCrudPage } from "./AdminCrudPage";
import { mockAdminBoxes } from "@/lib/mockData";
export default function AdminBoxes() {
  return <AdminCrudPage pageTitle="Manage Boxes" initialItems={mockAdminBoxes} showBackCatalog={true} />;
}
