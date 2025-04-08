
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NovaAnalise from "./pages/NovaAnalise";
import PropertyReportPage from "./pages/PropertyReportPage";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";
import ComoFunciona from "./pages/ComoFunciona";
import Precos from "./pages/Precos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import ImoveisCaixa from "./pages/ImoveisCaixa";
import PropertyDetails from "./pages/PropertyDetails";
import Conteudos from "./pages/Conteudos";
import ConteudoDetalhe from "./pages/ConteudoDetalhe";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Assessoria from "./pages/Assessoria";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/nova-analise" element={
              <ProtectedRoute>
                <NovaAnalise />
              </ProtectedRoute>
            } />
            <Route path="/relatorio/:id" element={
              <ProtectedRoute>
                <PropertyReportPage />
              </ProtectedRoute>
            } />
            <Route path="/imoveis-caixa" element={<ImoveisCaixa />} />
            <Route path="/imoveis-caixa/:id" element={<PropertyDetails />} />
            <Route path="/conteudos" element={<Conteudos />} />
            <Route path="/conteudos/:type/:id" element={<ConteudoDetalhe />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/precos" element={<Precos />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/assessoria" element={<Assessoria />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
