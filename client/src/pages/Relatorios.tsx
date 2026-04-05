/**
 * Relatórios — Central de Inteligência
 * Glass Cockpit Design | VPEX Hub
 * Filtros por fonte, período, comparação. Métricas editáveis. Drill-down por campanha.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  MousePointer,
  Target,
  Megaphone,
  ShoppingCart,
  MessageCircle,
  Building2,
  Calendar,
  ArrowLeftRight,
  X,
  Image,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

/* ─── Types ─── */
type ReportSource = "meta" | "google" | "tiktok" | "chatbot" | "ecommerce" | "banco" | "geral";
type Period = "hoje" | "7d" | "30d" | "90d" | "12m" | "custom";

interface MetricConfig {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  visible: boolean;
  priority: number;
}

interface Campaign {
  id: string;
  name: string;
  source: ReportSource;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  cpl: number;
  roas: number;
  creative: string;
}

/* ─── Mock Data ─── */
const sourceLabels: Record<ReportSource, { label: string; icon: React.ElementType; color: string }> = {
  geral: { label: "Visão Geral", icon: BarChart3, color: "#39FF14" },
  meta: { label: "Meta Ads", icon: Megaphone, color: "#1877F2" },
  google: { label: "Google Ads", icon: Target, color: "#4285F4" },
  tiktok: { label: "TikTok Ads", icon: Megaphone, color: "#FF0050" },
  chatbot: { label: "Chatbot / WhatsApp", icon: MessageCircle, color: "#25D366" },
  ecommerce: { label: "E-commerce", icon: ShoppingCart, color: "#FF9900" },
  banco: { label: "Financeiro / Banco", icon: Building2, color: "#003B71" },
};

const periodLabels: Record<Period, string> = {
  hoje: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
  "12m": "Últimos 12 meses",
  custom: "Personalizado",
};

const defaultMetrics: MetricConfig[] = [
  { id: "investimento", label: "Investimento", value: "R$ 23.450", change: 8, icon: DollarSign, visible: true, priority: 1 },
  { id: "cpl", label: "Custo por Lead", value: "R$ 12,50", change: -15, icon: Users, visible: true, priority: 2 },
  { id: "leads", label: "Total de Leads", value: "1.876", change: 22, icon: Target, visible: true, priority: 3 },
  { id: "roas", label: "ROAS", value: "3,5x", change: 0.3, icon: TrendingUp, visible: true, priority: 4 },
  { id: "ctr", label: "CTR", value: "2,8%", change: 0.4, icon: MousePointer, visible: true, priority: 5 },
  { id: "conversoes", label: "Conversões", value: "312", change: 18, icon: ShoppingCart, visible: true, priority: 6 },
  { id: "impressoes", label: "Impressões", value: "85.000", change: 14.6, icon: Eye, visible: false, priority: 7 },
  { id: "cliques", label: "Cliques", value: "12.400", change: 14.8, icon: MousePointer, visible: false, priority: 8 },
];

const performanceData = [
  { name: "Sem 1", investimento: 4200, leads: 320, vendas: 48 },
  { name: "Sem 2", investimento: 5100, leads: 410, vendas: 62 },
  { name: "Sem 3", investimento: 6800, leads: 520, vendas: 78 },
  { name: "Sem 4", investimento: 7350, leads: 626, vendas: 124 },
];

const channelData = [
  { name: "Meta Ads", value: 45, color: "#1877F2" },
  { name: "Google Ads", value: 30, color: "#4285F4" },
  { name: "TikTok", value: 15, color: "#FF0050" },
  { name: "Orgânico", value: 10, color: "#39FF14" },
];

const campaigns: Campaign[] = [
  { id: "1", name: "Dia das Mães 2026", source: "meta", status: "active", budget: 5000, spent: 3200, impressions: 42000, clicks: 1680, leads: 256, cpl: 12.5, roas: 4.2, creative: "Carrossel 5 imagens" },
  { id: "2", name: "Remarketing Carrinho", source: "meta", status: "active", budget: 2000, spent: 1450, impressions: 18000, clicks: 720, leads: 98, cpl: 14.8, roas: 3.8, creative: "Vídeo 15s" },
  { id: "3", name: "Busca Genérica - Perfumes", source: "google", status: "active", budget: 3000, spent: 2800, impressions: 25000, clicks: 1250, leads: 180, cpl: 15.5, roas: 3.2, creative: "Texto responsivo" },
  { id: "4", name: "Shopping - Kits Presente", source: "google", status: "paused", budget: 1500, spent: 1500, impressions: 12000, clicks: 480, leads: 72, cpl: 20.8, roas: 2.1, creative: "Shopping Ads" },
  { id: "5", name: "Trend Maquiagem", source: "tiktok", status: "active", budget: 2500, spent: 1800, impressions: 95000, clicks: 3800, leads: 145, cpl: 12.4, roas: 2.8, creative: "UGC 30s" },
  { id: "6", name: "Promo Black Friday", source: "meta", status: "completed", budget: 8000, spent: 8000, impressions: 120000, clicks: 6000, leads: 890, cpl: 9.0, roas: 5.1, creative: "Coleção + Vídeo" },
];

/* ─── Component ─── */
export default function Relatorios() {
  const [source, setSource] = useState<ReportSource>("geral");
  const [period, setPeriod] = useState<Period>("30d");
  const [compareMode, setCompareMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [metrics, setMetrics] = useState<MetricConfig[]>(defaultMetrics);
  const [editingMetrics, setEditingMetrics] = useState(false);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

  const visibleMetrics = metrics.filter((m) => m.visible).sort((a, b) => a.priority - b.priority);

  const toggleMetric = (id: string) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m))
    );
  };

  const moveMetric = (id: string, direction: "up" | "down") => {
    setMetrics((prev) => {
      const sorted = [...prev].sort((a, b) => a.priority - b.priority);
      const idx = sorted.findIndex((m) => m.id === id);
      if (direction === "up" && idx > 0) {
        const temp = sorted[idx].priority;
        sorted[idx].priority = sorted[idx - 1].priority;
        sorted[idx - 1].priority = temp;
      } else if (direction === "down" && idx < sorted.length - 1) {
        const temp = sorted[idx].priority;
        sorted[idx].priority = sorted[idx + 1].priority;
        sorted[idx + 1].priority = temp;
      }
      return [...sorted];
    });
  };

  const filteredCampaigns = source === "geral" ? campaigns : campaigns.filter((c) => c.source === source);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[Sora]">Relatórios</h2>
          <p className="text-sm text-muted-foreground mt-1">Inteligência consolidada do seu negócio</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
              showFilters ? "bg-vpex-green text-black" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30"
            }`}
          >
            <Filter size={14} />
            Filtros
          </button>
          <button
            onClick={() => toast("Exportando relatório...", { description: "O download será iniciado em instantes." })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
          >
            <Download size={14} />
            Exportar
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-4">
              {/* Source Selector */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Relatório de:</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(sourceLabels) as ReportSource[]).map((s) => {
                    const { label, color } = sourceLabels[s];
                    const isActive = source === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSource(s)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "text-white border"
                            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-white/20"
                        }`}
                        style={isActive ? { backgroundColor: `${color}20`, borderColor: `${color}60`, color } : {}}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Period + Compare */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Período:</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(periodLabels) as Period[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          period === p
                            ? "bg-vpex-green text-black"
                            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30"
                        }`}
                      >
                        {periodLabels[p]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Comparar:</p>
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      compareMode
                        ? "bg-vpex-green text-black"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30"
                    }`}
                  >
                    <ArrowLeftRight size={14} />
                    {compareMode ? "Comparando período anterior" : "Comparar com período anterior"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Filtros ativos:</span>
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border text-xs text-foreground">
          {sourceLabels[source].label}
          {source !== "geral" && (
            <button onClick={() => setSource("geral")} className="ml-1 text-muted-foreground hover:text-foreground">
              <X size={10} />
            </button>
          )}
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border text-xs text-foreground">
          <Calendar size={10} />
          {periodLabels[period]}
        </span>
        {compareMode && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-vpex-green/10 border border-vpex-green/20 text-xs text-vpex-green">
            <ArrowLeftRight size={10} />
            Comparando
          </span>
        )}
      </div>

      {/* Metrics Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-[Sora]">Métricas Essenciais</h3>
        <button
          onClick={() => setEditingMetrics(!editingMetrics)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            editingMetrics
              ? "bg-vpex-green text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GripVertical size={12} />
          {editingMetrics ? "Concluir" : "Editar métricas"}
        </button>
      </div>

      {/* Editing Panel */}
      <AnimatePresence>
        {editingMetrics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Reordene ou ative/desative as métricas que deseja ver:</p>
              {[...metrics].sort((a, b) => a.priority - b.priority).map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                      m.visible ? "bg-card border-vpex-green/20" : "bg-card/50 border-border opacity-60"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveMetric(m.id, "up")} className="text-muted-foreground hover:text-foreground"><ChevronUp size={12} /></button>
                      <button onClick={() => moveMetric(m.id, "down")} className="text-muted-foreground hover:text-foreground"><ChevronDown size={12} /></button>
                    </div>
                    <Icon size={16} className={m.visible ? "text-vpex-green" : "text-muted-foreground"} />
                    <span className="text-sm text-foreground flex-1">{m.label}</span>
                    <button
                      onClick={() => toggleMetric(m.id)}
                      className={`p-1.5 rounded-lg transition-colors ${m.visible ? "text-vpex-green hover:bg-vpex-green/10" : "text-muted-foreground hover:bg-accent"}`}
                    >
                      {m.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visible Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {visibleMetrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          return (
            <motion.div
              key={metric.id}
              layout
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <Icon size={16} className="text-vpex-green" />
              </div>
              <p className="text-xl font-bold text-foreground font-[Sora]">{metric.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${isPositive ? "text-vpex-green" : "text-vpex-red"}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? "+" : ""}{metric.change}%
                <span className="text-muted-foreground ml-1">vs. anterior</span>
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-[Sora]">Performance por Semana</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#999" }}
                />
                <Area type="monotone" dataKey="leads" stroke="#39FF14" fill="url(#gradLeads)" strokeWidth={2} name="Leads" />
                <Area type="monotone" dataKey="vendas" stroke="#4285F4" fill="url(#gradVendas)" strokeWidth={2} name="Vendas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-[Sora]">Distribuição por Canal</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {channelData.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className="text-muted-foreground">{ch.name}</span>
                </div>
                <span className="text-foreground font-medium">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground font-[Sora]">
            Campanhas {source !== "geral" ? `— ${sourceLabels[source].label}` : ""}
          </h3>
          <span className="text-xs text-muted-foreground">{filteredCampaigns.length} campanhas</span>
        </div>

        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[1fr_100px_100px_80px_80px_80px_80px] gap-3 px-5 py-3 border-b border-border text-xs text-muted-foreground font-medium">
          <span>Campanha</span>
          <span className="text-right">Orçamento</span>
          <span className="text-right">Gasto</span>
          <span className="text-right">Leads</span>
          <span className="text-right">CPL</span>
          <span className="text-right">ROAS</span>
          <span className="text-right">Status</span>
        </div>

        {/* Table Rows */}
        {filteredCampaigns.map((campaign) => {
          const isExpanded = expandedCampaign === campaign.id;
          const sourceInfo = sourceLabels[campaign.source];
          const budgetPct = Math.round((campaign.spent / campaign.budget) * 100);

          return (
            <div key={campaign.id} className="border-b border-border last:border-0">
              <button
                onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                className="w-full grid grid-cols-1 lg:grid-cols-[1fr_100px_100px_80px_80px_80px_80px] gap-3 px-5 py-4 text-left hover:bg-accent/30 transition-colors"
              >
                {/* Campaign Name */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${sourceInfo.color}15` }}>
                    <Megaphone size={14} style={{ color: sourceInfo.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                    <p className="text-[10px] text-muted-foreground">{sourceInfo.label}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-muted-foreground ml-auto lg:hidden" /> : <ChevronDown size={14} className="text-muted-foreground ml-auto lg:hidden" />}
                </div>

                {/* Desktop columns */}
                <p className="text-sm text-foreground text-right hidden lg:block">R$ {campaign.budget.toLocaleString()}</p>
                <div className="text-right hidden lg:block">
                  <p className="text-sm text-foreground">R$ {campaign.spent.toLocaleString()}</p>
                  <div className="w-full h-1 rounded-full bg-border mt-1">
                    <div className="h-full rounded-full bg-vpex-green" style={{ width: `${Math.min(budgetPct, 100)}%` }} />
                  </div>
                </div>
                <p className="text-sm text-foreground text-right hidden lg:block">{campaign.leads.toLocaleString()}</p>
                <p className="text-sm text-foreground text-right hidden lg:block">R$ {campaign.cpl.toFixed(2)}</p>
                <p className={`text-sm font-medium text-right hidden lg:block ${campaign.roas >= 3 ? "text-vpex-green" : campaign.roas >= 2 ? "text-vpex-yellow" : "text-vpex-red"}`}>
                  {campaign.roas}x
                </p>
                <div className="text-right hidden lg:block">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    campaign.status === "active" ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/20" :
                    campaign.status === "paused" ? "bg-vpex-yellow/10 text-vpex-yellow border border-vpex-yellow/20" :
                    "bg-muted text-muted-foreground border border-border"
                  }`}>
                    {campaign.status === "active" ? "Ativa" : campaign.status === "paused" ? "Pausada" : "Concluída"}
                  </span>
                </div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      <DetailItem label="Impressões" value={campaign.impressions.toLocaleString()} />
                      <DetailItem label="Cliques" value={campaign.clicks.toLocaleString()} />
                      <DetailItem label="CTR" value={`${((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%`} />
                      <DetailItem label="Orçamento Usado" value={`${budgetPct}%`} />
                      <DetailItem label="Custo por Lead" value={`R$ ${campaign.cpl.toFixed(2)}`} />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Criativo</p>
                        <div className="flex items-center gap-1.5">
                          <Image size={12} className="text-vpex-green" />
                          <p className="text-sm text-foreground">{campaign.creative}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
