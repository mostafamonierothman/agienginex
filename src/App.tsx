import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import AGIV5 from "./pages/AGIV5";
import ChatGPTImportPage from "./pages/ChatGPTImport";
import FunctionalAGIPage from "./pages/FunctionalAGI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agi-v5" element={<AGIV5 />} />
          <Route path="/chatgpt-import" element={<ChatGPTImportPage />} />
          <Route path="/functional-agi" element={<FunctionalAGIPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
