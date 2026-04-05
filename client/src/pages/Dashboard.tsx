/**
 * Dashboard — Painel de Guerra do Franqueado
 * Glass Cockpit Design | VPEX Hub
 * KPIs: Faturamento vs Meta, Ticket Médio, CMV, Break-even, Margem Líquida.
 * Semáforos neon (Verde/Amarelo/Vermelho) para decisão em 3 segundos.
 */
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  ArrowUpRight,
  Activity,
  Calendar,
  Zap,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Percent,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
} from "recharts";

/* ─── Data ─── */
const weeklyData = [
  { name: "Seg", faturamento: 12400, meta: 14000, leads: 18 },
  { name: "Ter", faturamento: 15800, meta: 14000, leads: 24 },
  { name: "Qua", faturamento: 13200, meta: 14000, leads: 15 },
  { name: "Qui", faturamento: 18600, meta: 14000, leads: 32 },
  { name: "Sex", faturamento: 16400, meta: 14000, leads: 28 },
  { name: "Sáb", faturamento: 22100, meta: 14000, leads: 42 },
  { name: "Dom", faturamento: 8900, meta: 14000, leads: 12 },
];

const monthlyChannels = [
  { name: "Loja Física", valor: 98000 },
  { name: "E-commerce", valor: 32000 },
  { name: "WhatsApp", valor: 18000 },
  { name: "Marketplace", valor: 8000 },
];

const activities = [
  { text: "Meta diária batida: R$ 22.100 no sábado", time: "Há 1h", icon: CheckCircle2, color: "text-vpex-green" },
  { text: "Estoque baixo: Kit Presente Dia das Mães", time: "Há 3h", icon: AlertTriangle, color: "text-vpex-yellow" },
  { text: "Nova campanha Meta Ads ativada", time: "Há 5h", icon: Zap, color: "text-vpex-green" },
  { text: "Relatório semanal disponível", time: "Há 8h", icon: Activity, color: "text-muted-foreground" },
  { text: "12 novos leads capturados via landing page", time: "Ontem", icon: ArrowUpRight, color: "text-vpex-green" },
];

const alerts = [
  { text: "CMV acima de 40% — revisar fornecedores", severity: "warning" as const },
  { text: "Break-even atingido no dia 18 — dentro do prazo", severity: "success" as const },
  { text: "Ticket Médio caiu 8% vs. mês anterior", severity: "danger" as const },
];

/* ─── Helpers ─── */
type Severity = "success" | "warning" | "danger";

function getSemaphoreColor(severity: Severity) {
  switch (severity) {
    case "success": return "text-vpex-green bg-vpex-green/10 border-vpex-green/20";
    case "warning": return "text-vpex-yellow bg-vpex-yellow/10 border-vpex-yellow/20";
    case "danger": return "text-vpex-red bg-vpex-red/10 border-vpex-red/20";
  }
}

function getSemaphoreIcon(severity: Severity) {
  switch (severity) {
    case "success": return CheckCircle2;
    case "warning": return AlertTriangle;
    case "danger": return TrendingDown;
  }
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/* ─── Component ─── */
export default function Dashboard() {
  const faturamentoMes = 156000;
  const metaMes = 200000;
  const metaPct = Math.round((faturamentoMes / metaMes) * 100);
  const diasRestantes = 12;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta</p>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">
          Painel do Negócio
        </h2>
      </motion.div>

      {/* Hero KPI — Faturamento vs Meta */}
      <motion.div variants={fadeUp} className="glass-card p-5 border-vpex-green/15">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-vpex-green" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faturamento vs. Meta Mensal</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-[Sora] text-foreground">R$ {(faturamentoMes / 1000).toFixed(0)}k</span>
              <span className="text-lg text-muted-foreground font-[Sora]">/ R$ {(metaMes / 1000).toFixed(0)}k</span>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold font-[Sora] ${metaPct >= 70 ? "text-vpex-green" : metaPct >= 50 ? "text-vpex-yellow" : "text-vpex-red"}`}>
              {metaPct}%
            </p>
            <p className="text-xs text-muted-foreground">{diasRestantes} dias restantes</p>
          </div>
        </div>
        <Progress value={metaPct} className="mt-4 h-3 bg-muted [&>div]:bg-vpex-green [&>div]:rounded-full" />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">Faltam R$ {((metaMes - faturamentoMes) / 1000).toFixed(0)}k para bater</span>
          <span className="text-[10px] text-muted-foreground">Média necessária: R$ {((metaMes - faturamentoMes) / diasRestantes / 1000).toFixed(1)}k/dia</span>
        </div>
      </motion.div>

      {/* KPI Grid — 5 métricas de guerra */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Vendas Hoje */}
        <KpiCard
          label="Vendas Hoje"
          value="R$ 8.420"
          change={12.5}
          changeLabel="vs. ontem"
          icon={DollarSign}
          severity="success"
        />
        {/* Ticket Médio */}
        <KpiCard
          label="Ticket Médio"
          value="R$ 142"
          change={-8}
          changeLabel="vs. mês anterior"
          icon={ShoppingCart}
          severity="danger"
        />
        {/* CMV */}
        <KpiCard
          label="CMV"
          value="42%"
          change={3.2}
          changeLabel="acima do ideal (38%)"
          icon={Percent}
          severity="warning"
        />
        {/* Margem Líquida */}
        <KpiCard
          label="Margem Líquida"
          value="18,5%"
          change={1.2}
          changeLabel="vs. mês anterior"
          icon={TrendingUp}
          severity="success"
        />
        {/* Break-even */}
        <KpiCard
          label="Break-even"
          value="Dia 18"
          change={0}
          changeLabel="dentro do prazo"
          icon={Target}
          severity="success"
          hideChange
        />
      </motion.div>

      {/* Alertas Inteligentes */}
      <motion.div variants={fadeUp} className="space-y-2">
        {alerts.map((alert, i) => {
          const Icon = getSemaphoreIcon(alert.severity);
          const colorClass = getSemaphoreColor(alert.severity);
          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colorClass}`}>
              <Icon size={16} />
              <span className="text-sm">{alert.text}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Faturamento Semanal */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Faturamento vs. Meta Diária
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="dashGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#39FF14" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#39FF14" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: "8px", color: "#e5e5e5", fontSize: "13px" }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                />
                <Area type="monotone" dataKey="faturamento" stroke="#39FF14" strokeWidth={2} fill="url(#dashGreenGrad)" name="Faturamento" />
                <Area type="monotone" dataKey="meta" stroke="#737373" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Meta" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Canais de Venda */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Faturamento por Canal
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChannels} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#a3a3a3", fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: "8px", color: "#e5e5e5", fontSize: "13px" }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                />
                <Bar dataKey="valor" fill="#39FF14" radius={[0, 4, 4, 0]} name="Faturamento" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Quick Stats + Activities */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Operational Stats */}
        <div className="glass-card p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Operação Hoje
          </h3>
          <div className="space-y-4">
            <StatRow label="Clientes atendidos" value="48" icon={Users} />
            <StatRow label="Leads novos" value="12" icon={ArrowUpRight} />
            <StatRow label="Pedidos em aberto" value="3" icon={Clock} />
            <StatRow label="Campanhas ativas" value="5" icon={Zap} />
            <StatRow label="Treinamentos pendentes" value="2" icon={BarChart3} />
          </div>
        </div>

        {/* Activities */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
                    <Icon size={14} className={act.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground leading-snug">{act.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Sub-components ─── */
function KpiCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  severity,
  hideChange = false,
}: {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  severity: Severity;
  hideChange?: boolean;
}) {
  const isPositive = change >= 0;
  const borderColor = severity === "success" ? "border-vpex-green/15" : severity === "warning" ? "border-vpex-yellow/15" : "border-vpex-red/15";

  return (
    <div className={`glass-card p-4 ${borderColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className={`p-1.5 rounded-md ${getSemaphoreColor(severity)}`}>
          <Icon size={14} />
        </div>
      </div>
      <p className="text-xl font-bold font-[Sora] text-foreground">{value}</p>
      {!hideChange ? (
        <div className="flex items-center gap-1 mt-1.5">
          {isPositive ? <TrendingUp size={11} className="text-vpex-green" /> : <TrendingDown size={11} className="text-vpex-red" />}
          <span className={`text-[11px] font-medium ${isPositive ? "text-vpex-green" : "text-vpex-red"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
          <span className="text-[10px] text-muted-foreground ml-0.5">{changeLabel}</span>
        </div>
      ) : (
        <p className="text-[11px] text-vpex-green mt-1.5 flex items-center gap-1">
          <CheckCircle2 size={11} />
          {changeLabel}
        </p>
      )}
    </div>
  );
}

function StatRow({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon size={14} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
