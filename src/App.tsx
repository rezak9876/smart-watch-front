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
import WatchPairingConfirm from "./pages/WatchPairingConfirm";
import WatchOwnerInfo from "./pages/WatchOwnerInfo";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Caregivers from "./pages/Caregivers";
import CaregiverCreate from "./pages/CaregiverCreate";
import CaregiverEdit from "./pages/CaregiverEdit";
import Medications from "./pages/Medications";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
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
            <Route path="/watch-pairing-confirm" element={<WatchPairingConfirm />} />
            <Route path="/watch-owner-info" element={<WatchOwnerInfo />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/caregivers" element={<Caregivers />} />
            <Route path="/caregivers/create" element={<CaregiverCreate />} />
            <Route path="/caregivers/edit/:id" element={<CaregiverEdit />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chat/:caregiverId" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
