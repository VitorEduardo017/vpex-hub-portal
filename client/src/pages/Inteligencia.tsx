/**
 * Inteligência de Dados — Raio-X Completo do Negócio
 * Glass Cockpit Design | VPEX Hub
 *
 * Análises divididas por área: Comercial, RH, Logística e Marketing.
 * KPIs com semáforos, gráficos de tendência e insights acionáveis.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  Megaphone,
  ShoppingCart,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  DollarSign,
  UserCheck,
  Clock,
  Package,
  Star,
  Zap,
  Eye,
  MousePointer,
  Percent,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

/* ─── Types ─── */
type AreaTab = "comercial" | "rh" | "logistica" | "marketing";

interface KPI {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  status: "green" | "yellow" | "red";
  icon: React.ElementType;
}

interface Insight {
  type: "success" | "warning" | "danger";
  text: string;
  action?: string;
}

/* ─── Data ─── */
const areaConfig: Record<AreaTab, { label: string; icon: React.ElementType; color: string }> = {
  comercial: { label: "Comercial", icon: ShoppingCart, color: "#39FF14" },
  rh: { label: "RH", icon: Users, color: "#60A5FA" },
  logistica: { label: "Logística", icon: Truck, color: "#FBBF24" },
  marketing: { label: "Marketing", icon: Megaphone, color: "#A855F7" },
};

/* ── Comercial ── */
const comercialKPIs: KPI[] = [
  { label: "Vendas do Mês", value: "R$ 156k", change: 12.5, changeLabel: "vs. mês anterior", status: "green", icon: DollarSign },
  { label: "Ticket Médio", value: "R$ 142", change: -8, changeLabel: "vs. mês anterior", status: "red", icon: ShoppingCart },
  { label: "Taxa de Conversão", value: "4,2%", change: 0.8, changeLabel: "vs. mês anterior", status: "green", icon: Target },
  { label: "Clientes Ativos", value: "1.247", change: 5.3, changeLabel: "vs. mês anterior", status: "green", icon: UserCheck },
];

const comercialTrend = [
  { month: "Out", vendas: 118, meta: 130 },
  { month: "Nov", vendas: 132, meta: 140 },
  { month: "Dez", vendas: 148, meta: 150 },
  { month: "Jan", vendas: 125, meta: 155 },
  { month: "Fev", vendas: 138, meta: 160 },
  { month: "Mar", vendas: 156, meta: 165 },
];

const comercialByChannel = [
  { name: "Loja Física", value: 45, color: "#39FF14" },
  { name: "E-commerce", value: 28, color: "#60A5FA" },
  { name: "WhatsApp", value: 18, color: "#FBBF24" },
  { name: "Marketplace", value: 9, color: "#A855F7" },
];

const comercialInsights: Insight[] = [
  { type: "warning", text: "Ticket médio caiu 8% — considere revisar o mix de produtos ou criar combos.", action: "Analisar mix" },
  { type: "success", text: "Taxa de conversão subiu 0,8pp — o novo script de vendas está funcionando." },
  { type: "danger", text: "15% dos clientes ativos não compraram nos últimos 60 dias.", action: "Ver lista" },
];

/* ── RH ── */
const rhKPIs: KPI[] = [
  { label: "Colaboradores", value: "12", change: 0, changeLabel: "estável", status: "green", icon: Users },
  { label: "Turnover", value: "8,3%", change: -2.1, changeLabel: "vs. trimestre anterior", status: "green", icon: TrendingDown },
  { label: "Treinamentos Concl.", value: "78%", change: 15, changeLabel: "vs. mês anterior", status: "yellow", icon: Star },
  { label: "Satisfação (eNPS)", value: "72", change: 5, changeLabel: "vs. pesquisa anterior", status: "green", icon: UserCheck },
];

const rhByDepartment = [
  { dept: "Vendas", count: 5, trained: 4 },
  { dept: "Estoque", count: 3, trained: 2 },
  { dept: "Admin", count: 2, trained: 2 },
  { dept: "Marketing", count: 2, trained: 1 },
];

const rhTurnoverTrend = [
  { quarter: "Q1 2025", rate: 15 },
  { quarter: "Q2 2025", rate: 12 },
  { quarter: "Q3 2025", rate: 10.5 },
  { quarter: "Q4 2025", rate: 10.4 },
  { quarter: "Q1 2026", rate: 8.3 },
];

const rhInsights: Insight[] = [
  { type: "success", text: "Turnover caiu 2,1pp — as ações de retenção estão dando resultado." },
  { type: "warning", text: "22% da equipe ainda não concluiu os treinamentos obrigatórios.", action: "Ver pendentes" },
  { type: "success", text: "eNPS de 72 está acima da média do setor (65)." },
];

/* ── Logística ── */
const logisticaKPIs: KPI[] = [
  { label: "Pedidos no Prazo", value: "94,2%", change: 1.8, changeLabel: "vs. mês anterior", status: "green", icon: CheckCircle2 },
  { label: "Tempo Médio Entrega", value: "2,4 dias", change: -0.3, changeLabel: "vs. mês anterior", status: "green", icon: Clock },
  { label: "Itens em Estoque", value: "847", change: -5, changeLabel: "vs. mês anterior", status: "yellow", icon: Package },
  { label: "Ruptura de Estoque", value: "3 itens", change: 2, changeLabel: "novos esta semana", status: "red", icon: AlertTriangle },
];

const logisticaDeliveryTrend = [
  { month: "Out", prazo: 89, atraso: 11 },
  { month: "Nov", prazo: 91, atraso: 9 },
  { month: "Dez", prazo: 87, atraso: 13 },
  { month: "Jan", prazo: 90, atraso: 10 },
  { month: "Fev", prazo: 92.4, atraso: 7.6 },
  { month: "Mar", prazo: 94.2, atraso: 5.8 },
];

const logisticaStockDistribution = [
  { name: "Estoque Ideal", value: 62, color: "#39FF14" },
  { name: "Estoque Baixo", value: 25, color: "#FBBF24" },
  { name: "Sem Estoque", value: 8, color: "#EF4444" },
  { name: "Excesso", value: 5, color: "#60A5FA" },
];

const logisticaInsights: Insight[] = [
  { type: "danger", text: "3 itens em ruptura de estoque — risco de perda de venda.", action: "Ver itens" },
  { type: "success", text: "Entregas no prazo subiram para 94,2% — melhor marca dos últimos 6 meses." },
  { type: "warning", text: "25% dos itens estão com estoque abaixo do mínimo recomendado.", action: "Reabastecer" },
];

/* ── Marketing ── */
const marketingKPIs: KPI[] = [
  { label: "Leads Gerados", value: "342", change: 18, changeLabel: "vs. mês anterior", status: "green", icon: Target },
  { label: "CPL Médio", value: "R$ 12,40", change: -15, changeLabel: "vs. mês anterior", status: "green", icon: DollarSign },
  { label: "ROAS", value: "3,8x", change: 0.4, changeLabel: "vs. mês anterior", status: "green", icon: TrendingUp },
  { label: "CTR Médio", value: "2,1%", change: -0.3, changeLabel: "vs. mês anterior", status: "yellow", icon: MousePointer },
];

const marketingChannelPerformance = [
  { channel: "Meta Ads", leads: 180, cpl: 10.5, roas: 4.2, spend: 1890 },
  { channel: "Google Ads", leads: 95, cpl: 15.8, roas: 3.1, spend: 1501 },
  { channel: "TikTok Ads", leads: 42, cpl: 8.2, roas: 2.8, spend: 344 },
  { channel: "Orgânico", leads: 25, cpl: 0, roas: 0, spend: 0 },
];

const marketingFunnelData = [
  { stage: "Impressões", value: 48500 },
  { stage: "Cliques", value: 2420 },
  { stage: "Leads", value: 342 },
  { stage: "Oportunidades", value: 89 },
  { stage: "Vendas", value: 34 },
];

const marketingRadar = [
  { metric: "Alcance", value: 78 },
  { metric: "Engajamento", value: 65 },
  { metric: "Conversão", value: 72 },
  { metric: "Retenção", value: 58 },
  { metric: "Branding", value: 82 },
  { metric: "ROI", value: 70 },
];

const marketingInsights: Insight[] = [
  { type: "success", text: "CPL caiu 15% — a otimização de criativos está gerando resultado." },
  { type: "warning", text: "CTR caiu 0,3pp — considere testar novos criativos ou segmentações.", action: "Ver criativos" },
  { type: "success", text: "ROAS de 3,8x está acima da meta de 3,5x." },
];

/* ─── Helpers ─── */
function getStatusColor(status: string) {
  switch (status) {
    case "green": return "text-vpex-green";
    case "yellow": return "text-vpex-yellow";
    case "red": return "text-vpex-red";
    default: return "text-muted-foreground";
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case "green": return "bg-vpex-green/10 border-vpex-green/20";
    case "yellow": return "bg-vpex-yellow/10 border-vpex-yellow/20";
    case "red": return "bg-vpex-red/10 border-vpex-red/20";
    default: return "bg-muted/10 border-border";
  }
}

function getInsightStyle(type: string) {
  switch (type) {
    case "success": return "bg-vpex-green/8 border-vpex-green/15 text-vpex-green";
    case "warning": return "bg-vpex-yellow/8 border-vpex-yellow/15 text-vpex-yellow";
    case "danger": return "bg-vpex-red/8 border-vpex-red/15 text-vpex-red";
    default: return "bg-muted/10 border-border text-muted-foreground";
  }
}

function getInsightIcon(type: string) {
  switch (type) {
    case "success": return CheckCircle2;
    case "warning": return AlertTriangle;
    case "danger": return AlertTriangle;
    default: return Lightbulb;
  }
}

const customTooltipStyle = {
  backgroundColor: "rgba(10, 10, 10, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#fff",
};

/* ─── Sub-Components ─── */
function KPICard({ kpi, delay }: { kpi: KPI; delay: number }) {
  const Icon = kpi.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-card p-4 border ${getStatusBg(kpi.status)}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStatusBg(kpi.status)}`}>
          <Icon size={14} className={getStatusColor(kpi.status)} />
        </div>
      </div>
      <p className="text-xl font-bold font-[Sora] text-foreground">{kpi.value}</p>
      <div className="flex items-center gap-1 mt-1">
        {kpi.change > 0 ? (
          <ArrowUpRight size={12} className="text-vpex-green" />
        ) : kpi.change < 0 ? (
          <ArrowDownRight size={12} className="text-vpex-red" />
        ) : (
          <Minus size={12} className="text-muted-foreground" />
        )}
        <span className={`text-[10px] font-medium ${
          kpi.change > 0 ? "text-vpex-green" : kpi.change < 0 ? "text-vpex-red" : "text-muted-foreground"
        }`}>
          {kpi.change > 0 ? "+" : ""}{kpi.change}%
        </span>
        <span className="text-[10px] text-muted-foreground">{kpi.changeLabel}</span>
      </div>
    </motion.div>
  );
}

function InsightCard({ insight, delay }: { insight: Insight; delay: number }) {
  const Icon = getInsightIcon(insight.type);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`flex items-start gap-3 p-3 rounded-lg border ${getInsightStyle(insight.type)}`}
    >
      <Icon size={14} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-relaxed">{insight.text}</p>
      </div>
      {insight.action && (
        <button className="shrink-0 text-[10px] font-medium underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity">
          {insight.action}
        </button>
      )}
    </motion.div>
  );
}

/* ─── Area Panels ─── */
function ComercialPanel() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {comercialKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vendas vs Meta */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <BarChart3 size={14} className="text-vpex-green" /> Vendas vs. Meta (R$ mil)
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comercialTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="vendas" fill="#39FF14" radius={[4, 4, 0, 0]} name="Vendas" />
                <Bar dataKey="meta" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Meta" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendas por Canal */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <PieChart size={14} className="text-vpex-green" /> Vendas por Canal
          </h4>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={comercialByChannel}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {comercialByChannel.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {comercialByChannel.map((ch) => (
                <div key={ch.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className="text-xs text-muted-foreground">{ch.name}</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{ch.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-4">
        <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-vpex-yellow" /> Insights Inteligentes
        </h4>
        <div className="space-y-2">
          {comercialInsights.map((ins, i) => (
            <InsightCard key={i} insight={ins} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RHPanel() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {rhKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Equipe por Departamento */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <Users size={14} className="text-blue-400" /> Equipe por Departamento
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rhByDepartment} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#60A5FA" radius={[0, 4, 4, 0]} name="Total" />
                <Bar dataKey="trained" fill="#39FF14" radius={[0, 4, 4, 0]} name="Treinados" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Turnover Trend */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <Activity size={14} className="text-blue-400" /> Evolução do Turnover (%)
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rhTurnoverTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} domain={[0, 20]} />
                <Tooltip contentStyle={customTooltipStyle} />
                <defs>
                  <linearGradient id="turnoverGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="rate" stroke="#60A5FA" fill="url(#turnoverGrad)" strokeWidth={2} name="Turnover %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-4">
        <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-vpex-yellow" /> Insights Inteligentes
        </h4>
        <div className="space-y-2">
          {rhInsights.map((ins, i) => (
            <InsightCard key={i} insight={ins} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LogisticaPanel() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {logisticaKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Entregas no Prazo */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <BarChart3 size={14} className="text-vpex-yellow" /> Entregas no Prazo vs. Atraso (%)
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logisticaDeliveryTrend} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="prazo" fill="#39FF14" radius={[4, 4, 0, 0]} name="No Prazo" stackId="delivery" />
                <Bar dataKey="atraso" fill="#EF4444" radius={[4, 4, 0, 0]} name="Atraso" stackId="delivery" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição de Estoque */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <PieChart size={14} className="text-vpex-yellow" /> Saúde do Estoque
          </h4>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={logisticaStockDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {logisticaStockDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {logisticaStockDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-4">
        <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-vpex-yellow" /> Insights Inteligentes
        </h4>
        <div className="space-y-2">
          {logisticaInsights.map((ins, i) => (
            <InsightCard key={i} insight={ins} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketingPanel() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {marketingKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance por Canal */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <BarChart3 size={14} className="text-purple-400" /> Performance por Canal
          </h4>
          <div className="space-y-3">
            {marketingChannelPerformance.map((ch, i) => (
              <motion.div
                key={ch.channel}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-muted/20 border border-border"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">{ch.channel}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {ch.spend > 0 ? `R$ ${ch.spend.toLocaleString("pt-BR")} investido` : "Orgânico"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground">Leads</p>
                    <p className="text-sm font-semibold text-foreground">{ch.leads}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">CPL</p>
                    <p className="text-sm font-semibold text-foreground">
                      {ch.cpl > 0 ? `R$ ${ch.cpl.toFixed(1)}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">ROAS</p>
                    <p className={`text-sm font-semibold ${ch.roas >= 3.5 ? "text-vpex-green" : ch.roas > 0 ? "text-vpex-yellow" : "text-muted-foreground"}`}>
                      {ch.roas > 0 ? `${ch.roas}x` : "—"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Radar de Maturidade */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <Activity size={14} className="text-purple-400" /> Radar de Maturidade Digital
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={marketingRadar} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#888" }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#A855F7"
                  fill="#A855F7"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Funil de Conversão */}
      <div className="glass-card p-4">
        <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
          <Target size={14} className="text-purple-400" /> Funil de Conversão
        </h4>
        <div className="flex items-end gap-1 h-28">
          {marketingFunnelData.map((stage, i) => {
            const maxVal = marketingFunnelData[0].value;
            const heightPercent = Math.max((stage.value / maxVal) * 100, 8);
            const conversionRate = i > 0
              ? ((stage.value / marketingFunnelData[i - 1].value) * 100).toFixed(1)
              : "100";
            return (
              <motion.div
                key={stage.stage}
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex-1 flex flex-col items-center justify-end"
              >
                <p className="text-[9px] text-vpex-green font-medium mb-1">{conversionRate}%</p>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${heightPercent}%`,
                    minHeight: "8px",
                    background: `linear-gradient(180deg, rgba(168, 85, 247, ${0.6 - i * 0.1}) 0%, rgba(168, 85, 247, ${0.2 - i * 0.03}) 100%)`,
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                  }}
                />
                <p className="text-[9px] text-muted-foreground mt-1.5 text-center leading-tight">{stage.stage}</p>
                <p className="text-[10px] font-medium text-foreground">{stage.value.toLocaleString("pt-BR")}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-4">
        <h4 className="text-xs font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-vpex-yellow" /> Insights Inteligentes
        </h4>
        <div className="space-y-2">
          {marketingInsights.map((ins, i) => (
            <InsightCard key={i} insight={ins} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Inteligencia() {
  const [activeArea, setActiveArea] = useState<AreaTab>("comercial");

  const panels: Record<AreaTab, React.ReactNode> = {
    comercial: <ComercialPanel />,
    rh: <RHPanel />,
    logistica: <LogisticaPanel />,
    marketing: <MarketingPanel />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">Inteligência de Dados</h2>
        <p className="text-sm text-muted-foreground mt-1">Raio-X completo do seu negócio — cada número conta uma história</p>
      </div>

      {/* Area Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(areaConfig) as AreaTab[]).map((area) => {
          const config = areaConfig[area];
          const Icon = config.icon;
          const isActive = activeArea === area;

          return (
            <button
              key={area}
              onClick={() => setActiveArea(area)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "text-black"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-opacity-50"
              }`}
              style={isActive ? { backgroundColor: config.color } : undefined}
            >
              <Icon size={14} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Active Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeArea}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {panels[activeArea]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
