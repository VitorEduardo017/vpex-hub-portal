import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import { DashboardLayoutSkeleton } from "./components/DashboardLayoutSkeleton";
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
import LandingPage from "./pages/LandingPage";
import MeusProdutos from "./pages/MeusProdutos";
import Checkout from "./pages/Checkout";
import Onboarding from "./pages/Onboarding";
import Indicacao from "./pages/Indicacao";
import Responsabilidades from "./pages/Responsabilidades";
import Equipe from "./pages/Equipe";
import Suporte from "./pages/Suporte";
import Admin from "./pages/Admin";
import AdminPlaceholder from "./pages/AdminPlaceholder";
import { trpc } from "./lib/trpc";

/* ─── Auth Guard ─── */
function ProtectedRouter() {
  const [, navigate] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
  });

  if (isLoading) return <DashboardLayoutSkeleton />;

  if (!user) {
    navigate("/entrar");
    return null;
  }

  return <DashboardRouter />;
}

/* ─── Hub Router (authenticated) ─── */
function DashboardRouter() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/painel" component={Dashboard} />
        <Route path="/meus-produtos" component={MeusProdutos} />
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

/* ─── Admin Router ─── */
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

/* ─── Root ─── */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Switch>
            {/* Public */}
            <Route path="/" component={LandingPage} />
            <Route path="/entrar" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/onboarding" component={Onboarding} />

            {/* Admin */}
            <Route path="/admin/:rest*" component={AdminRouter} />
            <Route path="/admin" component={AdminRouter} />

            {/* Protected hub — all /painel/* + /meus-produtos + legacy routes */}
            <Route component={ProtectedRouter} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
