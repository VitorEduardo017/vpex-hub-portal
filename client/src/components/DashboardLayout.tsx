/**
 * DashboardLayout — Glass Cockpit Design
 * Sidebar colapsável com 4 grupos simplificados para usuários não-tech.
 * Header com perfil, notificações e status do plano.
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
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

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
    ],
  },
  {
    title: "Operação",
    items: [
      { label: "WhatsApp", icon: MessageCircle, path: "/whatsapp" },
      { label: "Pedidos", icon: ShoppingCart, path: "/pedidos" },
    ],
  },
  {
    title: "Estratégia",
    items: [
      { label: "Academy", icon: GraduationCap, path: "/academy" },
      { label: "Crescimento", icon: Rocket, path: "/crescimento" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = navGroups
    .flatMap((g) => g.items)
    .find((i) => i.path === location);

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
          {/* Mobile Close */}
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
        <div className="border-t border-sidebar-border p-3 space-y-2">
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
          {/* Collapse Toggle (desktop only) */}
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
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md shrink-0">
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
            <button
              onClick={() => toast("Notificações em breve", { description: "Esta funcionalidade será ativada em breve." })}
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-vpex-green" />
            </button>
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
