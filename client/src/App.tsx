import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout";
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
import Indicacao from "./pages/Indicacao";
import Responsabilidades from "./pages/Responsabilidades";
import Equipe from "./pages/Equipe";
import Suporte from "./pages/Suporte";
import Admin from "./pages/Admin";
import AdminPlaceholder from "./pages/AdminPlaceholder";

function DashboardRouter() {
  // make sure to consider if you need authentication for certain routes
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
        <Route path="/indicacao" component={Indicacao} />
        <Route path="/responsabilidades" component={Responsabilidades} />
        <Route path="/equipe" component={Equipe} />
        <Route path="/suporte" component={Suporte} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/admin/clientes" component={Admin} />
        <Route path="/admin/relatorios">{() => <AdminPlaceholder title="Relatórios Consolidados" />}</Route>
        <Route path="/admin/financeiro">{() => <AdminPlaceholder title="Financeiro & MRR" />}</Route>
        <Route path="/admin/tarefas">{() => <AdminPlaceholder title="Gestão de Tarefas" />}</Route>
        <Route path="/admin/campanhas">{() => <AdminPlaceholder title="Campanhas dos Clientes" />}</Route>
        <Route path="/admin/integracoes">{() => <AdminPlaceholder title="Integrações Globais" />}</Route>
        <Route path="/admin/alertas">{() => <AdminPlaceholder title="Central de Alertas" />}</Route>
        <Route path="/admin/configuracoes">{() => <AdminPlaceholder title="Configurações Admin" />}</Route>
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
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
            <Route path="/admin/:rest*" component={AdminRouter} />
            <Route path="/admin" component={AdminRouter} />
            <Route component={DashboardRouter} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
