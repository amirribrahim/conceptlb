import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ForSale from "./pages/ForSale";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import ProjectsDetails from "./pages/ProjectsDetails";
import Admin from "./pages/Admin";
import Preloader from "./components/Preloader";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
    const [loading, setLoading] = useState(true);

    // ✅ Vite environment variables
    const isDevelopment = import.meta.env.VITE_ENVIRONMENT === "development";

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Preloader />;

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/ForSale" element={<ForSale />} />
                        <Route path="/Projects" element={<Projects />} />
                        <Route path="/Contact" element={<Contact />} />
                        <Route path="/projects/:id" element={<ProjectsDetails />} />
                        <Route path="*" element={<NotFound />} />

                        {/* 👇 Admin route only in development */}
                        {isDevelopment && <Route path="/Admin" element={<Admin />} />}
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
