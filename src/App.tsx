import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CoverageAnalysis from "./pages/CoverageAnalysis";
import Accessibility from "./pages/Accessibility";
import ServiceGap from "./pages/ServiceGap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/coverage" element={<CoverageAnalysis />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/service-gap" element={<ServiceGap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
