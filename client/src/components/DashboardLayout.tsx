/**
 * DashboardLayout — Glass Cockpit Design
 * Sidebar colapsável com grupos simplificados para usuários não-tech.
 * Header com notificações em tempo real, perfil e status do plano.
 */
import { useState, type ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Plug,
  Package,
  MessageCircle,
  ShoppingCart,
  GraduationCap,
  Rocket,
  Brain,
  Crown,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
  Gift,
  ClipboardCheck,
  Users,
  Headphones,
  AlertTriangle,
  TrendingUp,
  Target,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Meu Negócio",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/" },
      { label: "Relatórios", icon: BarChart3, path: "/relatorios" },
    ],
  },
  {
    title: "Gestão VPEX",
    items: [
      { label: "Documentos", icon: FolderOpen, path: "/documentos" },
      { label: "Entregas", icon: Package, path: "/entregas" },
      { label: "Integrações", icon: Plug, path: "/integracoes" },
      { label: "Planos", icon: Crown, path: "/planos" },
    ],
  },
  {
    title: "Operação",
    items: [
      { label: "WhatsApp", icon: MessageCircle, path: "/whatsapp" },
      { label: "Pedidos", icon: ShoppingCart, path: "/pedidos" },
      { label: "Tarefas", icon: ClipboardCheck, path: "/responsabilidades" },
    ],
  },
  {
    title: "Estratégia",
    items: [
      { label: "Academy", icon: GraduationCap, path: "/academy" },
      { label: "Crescimento", icon: Rocket, path: "/crescimento" },
      { label: "Inteligência", icon: Brain, path: "/inteligencia" },
      { label: "Indicação", icon: Gift, path: "/indicacao" },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { label: "Suporte", icon: Headphones, path: "/suporte" },
  { label: "Equipe", icon: Users, path: "/equipe" },
  { label: "Configurações", icon: Settings, path: "/configuracoes" },
];

/* ─── Notifications Data ─── */
interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "alerta" | "meta" | "entrega" | "campanha" | "sistema";
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, title: "CMV acima de 40%", description: "Revise seus fornecedores para manter a margem saudável.", time: "Agora", type: "alerta", read: false },
  { id: 2, title: "Meta semanal atingida!", description: "Você bateu 105% da meta de vendas desta semana.", time: "2h atrás", type: "meta", read: false },
  { id: 3, title: "Relatório mensal pronto", description: "O relatório de março está disponível para download.", time: "5h atrás", type: "entrega", read: false },
  { id: 4, title: "Campanha Meta Ads pausada", description: "Orçamento diário atingido na campanha 'Promoção Abril'.", time: "Ontem", type: "campanha", read: true },
  { id: 5, title: "Nova tarefa da VPEX", description: "Envie o acesso ao Google Analytics até 10/04.", time: "Ontem", type: "sistema", read: true },
  { id: 6, title: "Estoque baixo: Produto X", description: "Apenas 12 unidades restantes. Risco de ruptura.", time: "2 dias", type: "alerta", read: true },
];

const notifIcons: Record<string, React.ElementType> = {
  alerta: AlertTriangle,
  meta: TrendingUp,
  entrega: Package,
  campanha: Target,
  sistema: ClipboardCheck,
};

const notifColors: Record<string, string> = {
  alerta: "text-vpex-red",
  meta: "text-vpex-green",
  entrega: "text-blue-400",
  campanha: "text-vpex-yellow",
  sistema: "text-purple-400",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentPage = [...navGroups.flatMap((g) => g.items), ...bottomNavItems, { label: "Perfil", icon: User, path: "/perfil" }]
    .find((i) => i.path === location);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          bg-sidebar border-r border-sidebar-border
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:w-[72px]" : "lg:w-[260px]"}
          ${mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-vpex-green flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-black font-[Sora]">V</span>
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-semibold text-foreground font-[Sora] whitespace-nowrap"
              >
                VPEX Hub
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        onClick={() => setMobileOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200 group relative
                          ${isActive
                            ? "bg-sidebar-accent text-vpex-green"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                          }
                          ${collapsed ? "justify-center" : ""}
                        `}
                      >
                        <Icon
                          size={20}
                          className={`shrink-0 ${isActive ? "text-vpex-green" : "text-muted-foreground group-hover:text-foreground"}`}
                        />
                        {!collapsed && (
                          <span className="text-sm font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-vpex-green"
                          />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group relative
                    ${isActive
                      ? "bg-sidebar-accent text-vpex-green"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 ${isActive ? "text-vpex-green" : "text-muted-foreground group-hover:text-foreground"}`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-vpex-green"
                    />
                  )}
                </div>
              </Link>
            );
          })}
          <Link href="/perfil">
            <div
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground
                transition-all duration-200
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <div className="w-8 h-8 rounded-full bg-vpex-green/20 border border-vpex-green/30 flex items-center justify-center shrink-0">
                <User size={16} className="text-vpex-green" />
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate">Meu Perfil</p>
                  <p className="text-xs text-muted-foreground truncate">Plano Scale</p>
                </div>
              )}
            </div>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md shrink-0 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground font-[Sora]">
                {currentPage?.label || "VPEX Hub"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-vpex-green text-black text-[10px] font-bold flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-[#0d0d0d] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Bell size={14} className="text-vpex-green" />
                          <span className="text-sm font-semibold text-foreground font-[Sora]">Notificações</span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] bg-vpex-green/10 text-vpex-green px-2 py-0.5 rounded-full">{unreadCount} novas</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[10px] text-vpex-green hover:underline"
                          >
                            Marcar todas como lidas
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => {
                          const Icon = notifIcons[notif.type] || Bell;
                          const color = notifColors[notif.type] || "text-muted-foreground";
                          return (
                            <div
                              key={notif.id}
                              className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                                !notif.read ? "bg-vpex-green/[0.02]" : ""
                              }`}
                              onClick={() => {
                                setNotifications((prev) =>
                                  prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                                );
                              }}
                            >
                              <div className={`w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 ${color}`}>
                                <Icon size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-medium text-foreground truncate">{notif.title}</p>
                                  {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-vpex-green shrink-0" />}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{notif.description}</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2.5 border-t border-white/5 text-center">
                        <button
                          onClick={() => setNotifOpen(false)}
                          className="text-xs text-vpex-green hover:underline"
                        >
                          Ver todas as notificações
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-vpex-green/10 border border-vpex-green/20">
              <div className="w-1.5 h-1.5 rounded-full bg-vpex-green animate-pulse" />
              <span className="text-xs font-medium text-vpex-green">Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
