import { AdminCrudPage } from "./AdminCrudPage";
import { mockAdminScriptPackages } from "@/lib/mockData";
export default function AdminScriptPackages() {
  return <AdminCrudPage pageTitle="Manage Script Packages" initialItems={mockAdminScriptPackages} showBackCatalog={true} />;
}
