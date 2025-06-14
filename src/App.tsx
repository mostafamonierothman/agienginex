import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import AGIV5 from "./pages/AGIV5";
import ChatGPTImportPage from "./pages/ChatGPTImport";
import FunctionalAGIPage from "./pages/FunctionalAGI";
import AGIengineXChat from "./pages/AGIengineXChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect "/" to the chat page */}
          <Route path="/" element={<AGIengineXChat />} />
          {/* Keep original landing page accessible at /landing */}
          <Route path="/landing" element={<Index />} />
          <Route path="/agi-v5" element={<AGIV5 />} />
          <Route path="/chatgpt-import" element={<ChatGPTImportPage />} />
          <Route path="/functional-agi" element={<FunctionalAGIPage />} />
          <Route path="/agi-chat" element={<AGIengineXChat />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
