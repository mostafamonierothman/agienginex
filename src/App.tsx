
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import AGIV4 from "./pages/AGIV4";
import AGIV5 from "./pages/AGIV5";
import AGIProPlatform from "./pages/AGIProPlatform";
import AgentManager from "./pages/AgentManager";
import LeadDashboard from "./pages/LeadDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agi-v4" element={<AGIV4 />} />
          <Route path="/agi-v5" element={<AGIV5 />} />
          <Route path="/agi-pro" element={<AGIProPlatform />} />
          <Route path="/agent-manager" element={<AgentManager />} />
          <Route path="/leads" element={<LeadDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
