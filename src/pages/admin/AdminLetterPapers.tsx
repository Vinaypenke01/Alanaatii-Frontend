import { AdminCrudPage } from "./AdminCrudPage";
import { mockAdminLetterPapers } from "@/lib/mockData";
export default function AdminLetterPapers() {
  return <AdminCrudPage pageTitle="Manage Letter Papers" initialItems={mockAdminLetterPapers} />;
}
