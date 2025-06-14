
// Remove demo/landing from routes, home "/" IS the chat, always real data & chat-centric

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AGIengineXChat from "./pages/AGIengineXChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* "/" and "/agi-chat" are the same: always real-time chat */}
          <Route path="/" element={<AGIengineXChat />} />
          <Route path="/agi-chat" element={<AGIengineXChat />} />
          {/* Remove demo/landing */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
