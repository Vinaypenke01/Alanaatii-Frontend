import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OrderFlow from "./pages/OrderFlow";
import UserDashboard from "./pages/dashboard/UserDashboard";
import UserOrders from "./pages/dashboard/UserOrders";
import UserOrderDetail from "./pages/dashboard/UserOrderDetail";
import UserScripts from "./pages/dashboard/UserScripts";
import UserProfile from "./pages/dashboard/UserProfile";
import UserNotifications from "./pages/dashboard/UserNotifications";
import WriterDashboard from "./pages/writer/WriterDashboard";
import WriterRequests from "./pages/writer/WriterRequests";
import WriterEditor from "./pages/writer/WriterEditor";
import WriterRevisions from "./pages/writer/WriterRevisions";
import WriterNotifications from "./pages/writer/WriterNotifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminScriptPackages from "./pages/admin/AdminScriptPackages";
import AdminLetterPapers from "./pages/admin/AdminLetterPapers";
import AdminLetters from "./pages/admin/AdminLetters";
import AdminTextStyles from "./pages/admin/AdminTextStyles";
import AdminBoxes from "./pages/admin/AdminBoxes";
import AdminGifts from "./pages/admin/AdminGifts";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminWriters from "./pages/admin/AdminWriters";
import AdminScripts from "./pages/admin/AdminScripts";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminRefunds from "./pages/admin/AdminRefunds";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import WriterProfile from "./pages/writer/WriterProfile";
import ProductDetail from "./pages/ProductDetail";
import UserPendingDetails from "./pages/dashboard/UserPendingDetails";
import UserRequiredDetailsList from "./pages/dashboard/UserRequiredDetailsList";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import SubmitReview from "./pages/SubmitReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/order" element={<OrderFlow />} />
          <Route path="/submit-review" element={<SubmitReview />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/orders" element={<UserOrders />} />
          <Route path="/dashboard/orders/:orderId" element={<UserOrderDetail />} />
          <Route path="/dashboard/details/:id" element={<UserPendingDetails />} />
          <Route path="/dashboard/required-details" element={<UserRequiredDetailsList />} />
          <Route path="/dashboard/scripts" element={<UserScripts />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/dashboard/notifications" element={<UserNotifications />} />

          {/* Script Writer */}
          <Route path="/writer" element={<WriterDashboard />} />
          <Route path="/writer/profile" element={<WriterProfile />} />
          <Route path="/writer/requests" element={<WriterRequests />} />
          <Route path="/writer/editor" element={<WriterEditor />} />
          <Route path="/writer/revisions" element={<WriterRevisions />} />
          <Route path="/writer/notifications" element={<WriterNotifications />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/catalog" element={<AdminCatalog />} />
          <Route path="/admin/script-packages" element={<AdminScriptPackages />} />
          <Route path="/admin/letter-papers" element={<AdminLetterPapers />} />
          <Route path="/admin/letters" element={<AdminLetters />} />
          <Route path="/admin/text-styles" element={<AdminTextStyles />} />
          <Route path="/admin/boxes" element={<AdminBoxes />} />
          <Route path="/admin/gifts" element={<AdminGifts />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/writers" element={<AdminWriters />} />
          <Route path="/admin/scripts" element={<AdminScripts />} />
          <Route path="/admin/pricing" element={<AdminPricing />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/refunds" element={<AdminRefunds />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
