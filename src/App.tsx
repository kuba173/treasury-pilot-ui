import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import InvoiceInbox from "./pages/InvoiceInbox";
import PaymentExecution from "./pages/PaymentExecution";
import PolicyEngine from "./pages/PolicyEngine";
import VendorProfile from "./pages/VendorProfile";
import AlertsCenter from "./pages/AlertsCenter";
import ApprovalQueue from "./pages/ApprovalQueue";
import AuditTrail from "./pages/AuditTrail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices" element={<InvoiceInbox />} />
              <Route path="/payments" element={<PaymentExecution />} />
              <Route path="/approvals" element={<ApprovalQueue />} />
              <Route path="/alerts" element={<AlertsCenter />} />
              <Route path="/vendors" element={<VendorProfile />} />
              <Route path="/audit" element={<AuditTrail />} />
              <Route path="/policy" element={<PolicyEngine />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
