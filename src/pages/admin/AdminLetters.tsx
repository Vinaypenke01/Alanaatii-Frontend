import { AdminCrudPage } from "./AdminCrudPage";
import { mockAdminLetters } from "@/lib/mockData";
export default function AdminLetters() {
  return <AdminCrudPage pageTitle="Manage Letters" initialItems={mockAdminLetters} />;
}
