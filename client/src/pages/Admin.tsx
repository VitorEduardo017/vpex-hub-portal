/**
 * Admin Panel — VPEX Command Center
 * Glass Cockpit Design | VPEX Hub
 * Painel master com acesso total a todas as contas dos clientes.
 * Visão 360° de todos os franqueados, métricas globais e capacidade de entrar em qualquer conta.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Activity,
  Zap,
  Crown,
  Star,
  MoreHorizontal,
  ExternalLink,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  PieChart,
  Target,
  Rocket,
  MessageCircle,
  FileText,
  Settings,
  LogIn,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
interface Client {
  id: string;
  name: string;
  company: string;
  segment: "franquia" | "ecommerce" | "industria" | "loja" | "consultoria" | "digital";
  plan: "starter" | "scale" | "enterprise";
  status: "ativo" | "inadimplente" | "pausado" | "onboarding";
  mrr: number;
  healthScore: number;
  lastAccess: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  joinDate: string;
  tasksCompleted: number;
  tasksPending: number;
  integrations: number;
  teamSize: number;
  logoEmoji: string;
  franchise?: string;
  stores?: number;
}

/* ─── Mock Data ─── */
const clients: Client[] = [
  {
    id: "1", name: "Carlos Mendes", company: "Boticário Anápolis Centro", segment: "franquia",
    plan: "enterprise", status: "ativo", mrr: 4500, healthScore: 92, lastAccess: "Há 2h",
    city: "Anápolis", state: "GO", phone: "(62) 99999-1234", email: "carlos@boticario-anapolis.com",
    joinDate: "Jan 2025", tasksCompleted: 45, tasksPending: 3, integrations: 8, teamSize: 12,
    logoEmoji: "🌸", franchise: "O Boticário", stores: 3,
  },
  {
    id: "2", name: "Ana Paula Souza", company: "Cacau Show Shopping", segment: "franquia",
    plan: "scale", status: "ativo", mrr: 2800, healthScore: 78, lastAccess: "Há 5h",
    city: "Goiânia", state: "GO", phone: "(62) 98888-5678", email: "ana@cacaushow-goiania.com",
    joinDate: "Mar 2025", tasksCompleted: 28, tasksPending: 7, integrations: 5, teamSize: 6,
    logoEmoji: "🍫", franchise: "Cacau Show", stores: 2,
  },
  {
    id: "3", name: "Roberto Lima", company: "TechStore Brasil", segment: "ecommerce",
    plan: "scale", status: "ativo", mrr: 3200, healthScore: 85, lastAccess: "Há 1h",
    city: "São Paulo", state: "SP", phone: "(11) 97777-9012", email: "roberto@techstore.com.br",
    joinDate: "Fev 2025", tasksCompleted: 38, tasksPending: 2, integrations: 12, teamSize: 8,
    logoEmoji: "💻",
  },
  {
    id: "4", name: "Fernanda Costa", company: "Bella Moda Feminina", segment: "loja",
    plan: "starter", status: "inadimplente", mrr: 990, healthScore: 42, lastAccess: "Há 15 dias",
    city: "Uberlândia", state: "MG", phone: "(34) 96666-3456", email: "fernanda@bellamoda.com",
    joinDate: "Dez 2024", tasksCompleted: 12, tasksPending: 15, integrations: 2, teamSize: 3,
    logoEmoji: "👗",
  },
  {
    id: "5", name: "Marcos Oliveira", company: "Indústria AgroTech", segment: "industria",
    plan: "enterprise", status: "ativo", mrr: 6800, healthScore: 88, lastAccess: "Há 30min",
    city: "Ribeirão Preto", state: "SP", phone: "(16) 95555-7890", email: "marcos@agrotech.ind.br",
    joinDate: "Nov 2024", tasksCompleted: 62, tasksPending: 4, integrations: 15, teamSize: 25,
    logoEmoji: "🌾", stores: 1,
  },
  {
    id: "6", name: "Juliana Martins", company: "JM Consultoria Digital", segment: "consultoria",
    plan: "scale", status: "ativo", mrr: 2200, healthScore: 71, lastAccess: "Há 3h",
    city: "Brasília", state: "DF", phone: "(61) 94444-1234", email: "juliana@jmconsultoria.com",
    joinDate: "Abr 2025", tasksCompleted: 18, tasksPending: 5, integrations: 6, teamSize: 4,
    logoEmoji: "📈",
  },
  {
    id: "7", name: "Pedro Santos", company: "Boticário Goiânia Shopping", segment: "franquia",
    plan: "enterprise", status: "pausado", mrr: 0, healthScore: 55, lastAccess: "Há 30 dias",
    city: "Goiânia", state: "GO", phone: "(62) 93333-5678", email: "pedro@boticario-goiania.com",
    joinDate: "Set 2024", tasksCompleted: 50, tasksPending: 0, integrations: 4, teamSize: 8,
    logoEmoji: "🌸", franchise: "O Boticário", stores: 1,
  },
  {
    id: "8", name: "Camila Rodrigues", company: "Cacau Show Anápolis", segment: "franquia",
    plan: "starter", status: "onboarding", mrr: 990, healthScore: 30, lastAccess: "Hoje",
    city: "Anápolis", state: "GO", phone: "(62) 92222-9012", email: "camila@cacaushow-anapolis.com",
    joinDate: "Abr 2026", tasksCompleted: 2, tasksPending: 12, integrations: 0, teamSize: 4,
    logoEmoji: "🍫", franchise: "Cacau Show", stores: 1,
  },
  {
    id: "9", name: "Lucas Ferreira", company: "Digital Growth Agency", segment: "digital",
    plan: "scale", status: "ativo", mrr: 1800, healthScore: 82, lastAccess: "Há 4h",
    city: "Curitiba", state: "PR", phone: "(41) 91111-3456", email: "lucas@digitalgrowth.com.br",
    joinDate: "Jan 2026", tasksCompleted: 22, tasksPending: 3, integrations: 9, teamSize: 5,
    logoEmoji: "🚀",
  },
  {
    id: "10", name: "Mariana Alves", company: "Boticário Brasília Asa Norte", segment: "franquia",
    plan: "scale", status: "ativo", mrr: 3500, healthScore: 90, lastAccess: "Há 1h",
    city: "Brasília", state: "DF", phone: "(61) 90000-7890", email: "mariana@boticario-brasilia.com",
    joinDate: "Jun 2025", tasksCompleted: 40, tasksPending: 1, integrations: 10, teamSize: 9,
    logoEmoji: "🌸", franchise: "O Boticário", stores: 2,
  },
];

const segmentLabels: Record<string, string> = {
  franquia: "Franquia", ecommerce: "E-commerce", industria: "Indústria",
  loja: "Loja", consultoria: "Consultoria", digital: "Digital",
};

const planLabels: Record<string, { label: string; color: string }> = {
  starter: { label: "Starter", color: "text-muted-foreground" },
  scale: { label: "Scale", color: "text-vpex-green" },
  enterprise: { label: "Enterprise", color: "text-vpex-yellow" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  ativo: { label: "Ativo", color: "text-vpex-green", bg: "bg-vpex-green/10 border-vpex-green/20", icon: CheckCircle2 },
  inadimplente: { label: "Inadimplente", color: "text-vpex-red", bg: "bg-vpex-red/10 border-vpex-red/20", icon: AlertTriangle },
  pausado: { label: "Pausado", color: "text-vpex-yellow", bg: "bg-vpex-yellow/10 border-vpex-yellow/20", icon: Clock },
  onboarding: { label: "Onboarding", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", icon: Rocket },
};

function getHealthColor(score: number) {
  if (score >= 80) return "text-vpex-green";
  if (score >= 60) return "text-vpex-yellow";
  return "text-vpex-red";
}

function getHealthBg(score: number) {
  if (score >= 80) return "bg-vpex-green";
  if (score >= 60) return "bg-vpex-yellow";
  return "bg-vpex-red";
}

/* ─── AnimatedCounter ─── */
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useState(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  });
  return <span>{prefix}{display.toLocaleString("pt-BR")}{suffix}</span>;
}

export default function Admin() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSegment, setFilterSegment] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"healthScore" | "mrr" | "name" | "lastAccess">("healthScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  /* ─── Computed ─── */
  const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0);
  const activeClients = clients.filter((c) => c.status === "ativo").length;
  const avgHealth = Math.round(clients.reduce((sum, c) => sum + c.healthScore, 0) / clients.length);
  const atRiskClients = clients.filter((c) => c.healthScore < 60).length;

  const filtered = clients
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchSegment = filterSegment === "all" || c.segment === filterSegment;
      const matchPlan = filterPlan === "all" || c.plan === filterPlan;
      return matchSearch && matchStatus && matchSegment && matchPlan;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
      if (sortBy === "mrr") return (a.mrr - b.mrr) * dir;
      if (sortBy === "healthScore") return (a.healthScore - b.healthScore) * dir;
      return 0;
    });

  function toggleSort(field: typeof sortBy) {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vpex-red/10 border border-vpex-red/20 flex items-center justify-center">
            <Shield size={20} className="text-vpex-red" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-[Sora]">Painel Admin</h2>
            <p className="text-sm text-muted-foreground">Comando Central VPEX — Acesso total</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast("Relatório gerado", { description: "Download do relatório consolidado iniciado." })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
          >
            <Download size={14} />
            Exportar
          </button>
          <button
            onClick={() => toast("Dados atualizados", { description: "Todas as métricas foram sincronizadas." })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vpex-green text-black text-sm font-medium hover:bg-vpex-green/90 transition-all"
          >
            <RefreshCw size={14} />
            Sincronizar
          </button>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "MRR Total", value: `R$ ${totalMRR.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-vpex-green", change: "+12%", up: true },
          { label: "Clientes Ativos", value: `${activeClients}/${clients.length}`, icon: Users, color: "text-blue-400", change: "+2", up: true },
          { label: "Health Score Médio", value: `${avgHealth}/100`, icon: Activity, color: avgHealth >= 70 ? "text-vpex-green" : "text-vpex-yellow", change: "+3pts", up: true },
          { label: "Em Risco", value: `${atRiskClients}`, icon: AlertTriangle, color: "text-vpex-red", change: atRiskClients > 0 ? "Atenção" : "OK", up: false },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <kpi.icon size={18} className={kpi.color} />
              <span className={`text-[10px] font-medium flex items-center gap-0.5 ${kpi.up ? "text-vpex-green" : "text-vpex-red"}`}>
                {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {kpi.change}
              </span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground font-[Sora]">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {/* By Plan */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown size={14} className="text-vpex-yellow" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Por Plano</span>
          </div>
          <div className="space-y-2">
            {(["starter", "scale", "enterprise"] as const).map((plan) => {
              const count = clients.filter((c) => c.plan === plan).length;
              const pct = Math.round((count / clients.length) * 100);
              return (
                <div key={plan} className="flex items-center gap-3">
                  <span className={`text-xs font-medium w-20 ${planLabels[plan].color}`}>{planLabels[plan].label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${plan === "enterprise" ? "bg-vpex-yellow" : plan === "scale" ? "bg-vpex-green" : "bg-muted-foreground"}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Status */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-vpex-green" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Por Status</span>
          </div>
          <div className="space-y-2">
            {(["ativo", "onboarding", "inadimplente", "pausado"] as const).map((status) => {
              const count = clients.filter((c) => c.status === status).length;
              const cfg = statusConfig[status];
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`text-xs font-medium w-24 ${cfg.color}`}>{cfg.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / clients.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className={`h-full rounded-full ${status === "ativo" ? "bg-vpex-green" : status === "onboarding" ? "bg-blue-400" : status === "inadimplente" ? "bg-vpex-red" : "bg-vpex-yellow"}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Segment */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <PieChart size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Por Segmento</span>
          </div>
          <div className="space-y-2">
            {Object.entries(segmentLabels).map(([key, label]) => {
              const count = clients.filter((c) => c.segment === key).length;
              if (count === 0) return null;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-24 text-foreground">{label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / clients.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="h-full rounded-full bg-blue-400"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cliente, empresa ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              showFilters ? "bg-vpex-green text-black" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter size={14} />
            Filtros
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <div className="flex gap-2">
            {(["healthScore", "mrr", "name"] as const).map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  sortBy === field ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/20" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {field === "healthScore" ? "Saúde" : field === "mrr" ? "MRR" : "Nome"}
                {sortBy === field && (sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-4 glass-card">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
                  <div className="flex gap-1.5">
                    {["all", "ativo", "inadimplente", "pausado", "onboarding"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                          filterStatus === s ? "bg-vpex-green text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s === "all" ? "Todos" : statusConfig[s]?.label || s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Segmento</p>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => setFilterSegment("all")}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                        filterSegment === "all" ? "bg-vpex-green text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"
                      }`}
                    >Todos</button>
                    {Object.entries(segmentLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setFilterSegment(key)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                          filterSegment === key ? "bg-vpex-green text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"
                        }`}
                      >{label}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Plano</p>
                  <div className="flex gap-1.5">
                    {["all", "starter", "scale", "enterprise"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilterPlan(p)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                          filterPlan === p ? "bg-vpex-green text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p === "all" ? "Todos" : planLabels[p]?.label || p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Exibindo <span className="text-foreground font-medium">{filtered.length}</span> de {clients.length} clientes
        </p>
      </div>

      {/* Client List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((client, i) => {
            const isExpanded = expandedClient === client.id;
            const stCfg = statusConfig[client.status];
            const StIcon = stCfg.icon;

            return (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card overflow-hidden"
              >
                {/* Main Row */}
                <div
                  className="flex items-center gap-3 lg:gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-card border border-border flex items-center justify-center text-xl shrink-0">
                    {client.logoEmoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-foreground truncate">{client.company}</h4>
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${stCfg.bg} ${stCfg.color}`}>
                        <StIcon size={10} />
                        {stCfg.label}
                      </span>
                      <span className={`text-[10px] font-medium ${planLabels[client.plan].color}`}>
                        {planLabels[client.plan].label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {client.name} · {segmentLabels[client.segment]} · {client.city}/{client.state}
                    </p>
                  </div>

                  {/* Health Score */}
                  <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
                    <div className="relative w-10 h-10">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15" fill="none"
                          stroke={client.healthScore >= 80 ? "#39FF14" : client.healthScore >= 60 ? "#FFD700" : "#FF4444"}
                          strokeWidth="3" strokeDasharray={`${(client.healthScore / 100) * 94.2} 94.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${getHealthColor(client.healthScore)}`}>
                        {client.healthScore}
                      </span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">Saúde</span>
                  </div>

                  {/* MRR */}
                  <div className="hidden lg:flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-foreground font-[Sora]">
                      R$ {client.mrr.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">MRR</span>
                  </div>

                  {/* Last Access */}
                  <div className="hidden lg:flex flex-col items-end shrink-0">
                    <span className="text-xs text-foreground">{client.lastAccess}</span>
                    <span className="text-[10px] text-muted-foreground">Último acesso</span>
                  </div>

                  {/* Expand */}
                  <div className="shrink-0">
                    {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 p-4 space-y-4">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                          {[
                            { label: "MRR", value: `R$ ${client.mrr.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-vpex-green" },
                            { label: "Saúde", value: `${client.healthScore}/100`, icon: Activity, color: getHealthColor(client.healthScore) },
                            { label: "Tarefas OK", value: `${client.tasksCompleted}`, icon: CheckCircle2, color: "text-vpex-green" },
                            { label: "Pendentes", value: `${client.tasksPending}`, icon: Clock, color: client.tasksPending > 5 ? "text-vpex-red" : "text-vpex-yellow" },
                            { label: "Integrações", value: `${client.integrations}`, icon: Zap, color: "text-blue-400" },
                            { label: "Equipe", value: `${client.teamSize}`, icon: Users, color: "text-purple-400" },
                          ].map((stat) => (
                            <div key={stat.label} className="bg-white/[0.02] rounded-lg p-3 border border-white/5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <stat.icon size={12} className={stat.color} />
                                <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                              </div>
                              <p className="text-sm font-bold text-foreground">{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail size={12} className="text-vpex-green shrink-0" />
                            <span className="truncate">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone size={12} className="text-vpex-green shrink-0" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin size={12} className="text-vpex-green shrink-0" />
                            <span>{client.city}, {client.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar size={12} className="text-vpex-green shrink-0" />
                            <span>Cliente desde {client.joinDate}</span>
                          </div>
                          {client.franchise && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Building2 size={12} className="text-vpex-yellow shrink-0" />
                              <span>Franquia: {client.franchise}</span>
                            </div>
                          )}
                          {client.stores && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Building2 size={12} className="text-blue-400 shrink-0" />
                              <span>{client.stores} {client.stores > 1 ? "lojas" : "loja"}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={(e) => { e.stopPropagation(); toast("Acessando conta", { description: `Entrando na conta de ${client.company}...` }); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vpex-green text-black text-xs font-medium hover:bg-vpex-green/90 transition-all"
                          >
                            <LogIn size={14} />
                            Acessar Conta
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toast("Relatório aberto", { description: `Visualizando relatórios de ${client.company}` }); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
                          >
                            <BarChart3 size={14} />
                            Ver Relatórios
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toast("Chat aberto", { description: `Iniciando conversa com ${client.name}` }); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
                          >
                            <MessageCircle size={14} />
                            Enviar Mensagem
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toast("Tarefas abertas", { description: `Gerenciando tarefas de ${client.company}` }); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
                          >
                            <FileText size={14} />
                            Tarefas
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toast("Configurações abertas", { description: `Editando conta de ${client.company}` }); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
                          >
                            <Settings size={14} />
                            Editar Conta
                          </button>
                          {client.status === "ativo" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toast("Conta pausada", { description: `A conta de ${client.company} foi pausada.` }); }}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-vpex-red/20 text-xs text-vpex-red hover:bg-vpex-red/10 transition-all ml-auto"
                            >
                              <UserX size={14} />
                              Pausar
                            </button>
                          )}
                          {client.status === "pausado" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toast("Conta reativada", { description: `A conta de ${client.company} foi reativada.` }); }}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-vpex-green/20 text-xs text-vpex-green hover:bg-vpex-green/10 transition-all ml-auto"
                            >
                              <UserCheck size={14} />
                              Reativar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Users size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum cliente encontrado com os filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
