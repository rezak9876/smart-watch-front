import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./lib/i18n";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import OTP from "./pages/OTP";
import WatchPairing from "./pages/WatchPairing";
import WatchOwnerInfo from "./pages/WatchOwnerInfo";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Caregivers from "./pages/Caregivers";
import Medications from "./pages/Medications";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set initial direction based on language
    document.dir = "rtl";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/watch-pairing" element={<WatchPairing />} />
            <Route path="/watch-owner-info" element={<WatchOwnerInfo />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/caregivers" element={<Caregivers />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chat/:caregiverId" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
