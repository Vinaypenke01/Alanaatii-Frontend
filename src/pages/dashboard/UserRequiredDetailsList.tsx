import { DashboardLayout } from "@/components/DashboardLayout";
import { userDashboardLinks } from "./UserDashboard";
import { mockOrders, productTypeLabels } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, FileSignature } from "lucide-react";

export default function UserRequiredDetailsList() {
  // Filter orders that need script details
  const pendingOrders = mockOrders.filter(
    (order) => (!order.userAnswers || order.userAnswers.length === 0) && order.productType !== "letterPaper"
  );

  return (
    <DashboardLayout title="Required Details" links={userDashboardLinks} brandLabel="Customer Dashboard">
      <div className="max-w-4xl space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Pending Action</h2>
          <p className="text-muted-foreground">Select an order below to complete the mandatory script details.</p>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <FileSignature size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
            <p className="text-muted-foreground mb-6">You don't have any orders waiting on script details right now.</p>
            <Link to="/products" className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium">
              Start a New Order
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{productTypeLabels[order.productType]} • {order.createdAt}</p>
                  </div>
                  <AlertCircle className="text-orange-500" size={24} />
                </div>
                
                <div className="bg-orange-50 text-orange-800 text-sm p-3 rounded-lg mb-6">
                  This order cannot be assigned to a writer until the recipient details and story are provided.
                </div>

                <Link 
                  to={`/dashboard/details/${order.id}`}
                  className="flex items-center justify-center w-full py-2.5 bg-gradient-gold text-primary-foreground font-bold rounded-lg shadow-sm group-hover:opacity-90 transition-opacity"
                >
                  Fill Script Details <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
