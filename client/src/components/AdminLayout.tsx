/**
 * AdminLayout — VPEX Command Center
 * Layout exclusivo para o painel administrativo da VPEX.
 * Sidebar vermelha/neon para diferenciar do portal do cliente.
 */
import { useState, type ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  UserPlus,
  FileText,
  Zap,
  Target,
  DollarSign,
  AlertTriangle,
  Activity,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const adminNavItems: NavItem[] = [
  { label: "Visão Geral", icon: LayoutDashboard, path: "/admin" },
  { label: "Clientes", icon: Users, path: "/admin/clientes" },
  { label: "Relatórios", icon: BarChart3, path: "/admin/relatorios" },
  { label: "Financeiro", icon: DollarSign, path: "/admin/financeiro" },
  { label: "Tarefas", icon: FileText, path: "/admin/tarefas" },
  { label: "Campanhas", icon: Target, path: "/admin/campanhas" },
  { label: "Integrações", icon: Zap, path: "/admin/integracoes" },
  { label: "Alertas", icon: AlertTriangle, path: "/admin/alertas" },
];

const adminBottomItems: NavItem[] = [
  { label: "Configurações", icon: Settings, path: "/admin/configuracoes" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allItems = [...adminNavItems, ...adminBottomItems];
  const currentPage = allItems.find((i) => i.path === location) || adminNavItems[0];

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
          bg-[#0a0a0a] border-r border-vpex-red/10
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:w-[72px]" : "lg:w-[260px]"}
          ${mobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-vpex-red/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-vpex-red/20 border border-vpex-red/30 flex items-center justify-center shrink-0">
              <Shield size={16} className="text-vpex-red" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-sm font-bold text-foreground font-[Sora]">VPEX Admin</span>
                <span className="text-[10px] text-vpex-red font-medium">Comando Central</span>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {adminNavItems.map((item) => {
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
                      ? "bg-vpex-red/10 text-vpex-red"
                      : "text-sidebar-foreground hover:bg-white/[0.03] hover:text-foreground"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 ${isActive ? "text-vpex-red" : "text-muted-foreground group-hover:text-foreground"}`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="admin-sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-vpex-red"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-vpex-red/10 p-3 space-y-1">
          {adminBottomItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group
                    ${isActive ? "bg-vpex-red/10 text-vpex-red" : "text-sidebar-foreground hover:bg-white/[0.03] hover:text-foreground"}
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon size={20} className={`shrink-0 ${isActive ? "text-vpex-red" : "text-muted-foreground group-hover:text-foreground"}`} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
          <Link href="/">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-white/[0.03] hover:text-foreground transition-all ${collapsed ? "justify-center" : ""}`}>
              <LogOut size={20} className="shrink-0 text-muted-foreground" />
              {!collapsed && <span className="text-sm font-medium">Voltar ao Hub</span>}
            </div>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 lg:h-16 border-b border-vpex-red/10 flex items-center justify-between px-3 lg:px-6 bg-background/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground p-1.5 -ml-1"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-base lg:text-lg font-semibold text-foreground font-[Sora] truncate">
                {currentPage?.label || "Admin"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-vpex-red/10 border border-vpex-red/20">
              <Shield size={12} className="text-vpex-red" />
              <span className="text-xs font-medium text-vpex-red">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
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
