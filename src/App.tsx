
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Index from "./pages/Index";
import CandidateOnboarding from "./pages/CandidateOnboarding";
import InterviewerOnboarding from "./pages/InterviewerOnboarding";
import CodeEditor from "./pages/CodeEditor";
import InterviewSchedule from "./pages/InterviewSchedule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/candidate" element={<CandidateOnboarding />} />
            <Route path="/interviewer" element={<InterviewerOnboarding />} />
            <Route path="/editor" element={<CodeEditor />} />
            <Route path="/schedule" element={<InterviewSchedule />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
