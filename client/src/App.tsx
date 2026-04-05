import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Relatorios from "./pages/Relatorios";
import Documentos from "./pages/Documentos";
import Entregas from "./pages/Entregas";
import WhatsApp from "./pages/WhatsApp";
import Pedidos from "./pages/Pedidos";
import Academy from "./pages/Academy";
import Crescimento from "./pages/Crescimento";
import Perfil from "./pages/Perfil";
import Integracoes from "./pages/Integracoes";
import Inteligencia from "./pages/Inteligencia";
import Planos from "./pages/Planos";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";

function DashboardRouter() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/relatorios" component={Relatorios} />
        <Route path="/documentos" component={Documentos} />
        <Route path="/entregas" component={Entregas} />
        <Route path="/whatsapp" component={WhatsApp} />
        <Route path="/pedidos" component={Pedidos} />
        <Route path="/academy" component={Academy} />
        <Route path="/crescimento" component={Crescimento} />
        <Route path="/integracoes" component={Integracoes} />
        <Route path="/inteligencia" component={Inteligencia} />
        <Route path="/planos" component={Planos} />
        <Route path="/configuracoes" component={Configuracoes} />
        <Route path="/perfil" component={Perfil} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/onboarding" component={Onboarding} />
            <Route component={DashboardRouter} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
