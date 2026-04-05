/**
 * Dashboard — Painel de Guerra do Franqueado
 * Glass Cockpit Design | VPEX Hub
 *
 * KPIs com contadores animados, semáforos neon e micro-animações.
 * Faturamento vs Meta, Ticket Médio, CMV, Break-even, Margem Líquida.
 */
import { useState, useEffect, useRef } from "react";
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
  Sparkles,
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

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(target: number, duration: number = 1.5, delay: number = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        // Cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) {
          ref.current = requestAnimationFrame(animate);
        }
      };
      ref.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration, delay]);

  return value;
}

/* ─── Animated Progress ─── */
function AnimatedProgress({ value, delay = 0 }: { value: number; delay?: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrent(value);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div className="relative h-3 rounded-full bg-muted overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: "linear-gradient(90deg, #39FF14 0%, #2bcc10 50%, #39FF14 100%)",
          backgroundSize: "200% 100%",
        }}
        initial={{ width: "0%" }}
        animate={{
          width: `${current}%`,
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          width: { duration: 1.5, ease: "easeOut" },
          backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
        }}
      />
      {/* Glow effect at the tip */}
      <motion.div
        className="absolute top-0 bottom-0 w-4 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(57,255,20,0.6) 0%, transparent 70%)",
          right: `${100 - current}%`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

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
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

/* ─── Component ─── */
export default function Dashboard() {
  const faturamentoMes = 156000;
  const metaMes = 200000;
  const metaPct = Math.round((faturamentoMes / metaMes) * 100);
  const diasRestantes = 12;
  const faltam = metaMes - faturamentoMes;

  const animatedFaturamento = useAnimatedCounter(156, 1.8, 0.3);
  const animatedPct = useAnimatedCounter(metaPct, 1.5, 0.5);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome with pulse */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Bem-vindo de volta</p>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">
            Painel do Negócio
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-vpex-green/5 border border-vpex-green/15"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-vpex-green"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-vpex-green font-medium">Dados atualizados</span>
        </motion.div>
      </motion.div>

      {/* Hero KPI — Faturamento vs Meta */}
      <motion.div variants={fadeUp} className="glass-card p-5 border-vpex-green/15 relative overflow-hidden">
        {/* Subtle animated glow */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-vpex-green/[0.04] blur-[60px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-vpex-green" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faturamento vs. Meta Mensal</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-[Sora] text-foreground">
                R$ {animatedFaturamento}k
              </span>
              <span className="text-lg text-muted-foreground font-[Sora]">/ R$ {(metaMes / 1000).toFixed(0)}k</span>
            </div>
          </div>
          <div className="text-right">
            <motion.p
              className={`text-3xl font-bold font-[Sora] ${metaPct >= 70 ? "text-vpex-green" : metaPct >= 50 ? "text-vpex-yellow" : "text-vpex-red"}`}
            >
              {animatedPct}%
            </motion.p>
            <p className="text-xs text-muted-foreground">{diasRestantes} dias restantes</p>
          </div>
        </div>
        <div className="mt-4 relative z-10">
          <AnimatedProgress value={metaPct} delay={0.3} />
        </div>
        <div className="flex justify-between mt-2 relative z-10">
          <span className="text-[10px] text-muted-foreground">Faltam R$ {(faltam / 1000).toFixed(0)}k para bater</span>
          <span className="text-[10px] text-muted-foreground">Média necessária: R$ {(faltam / diasRestantes / 1000).toFixed(1)}k/dia</span>
        </div>
      </motion.div>

      {/* KPI Grid — 5 métricas de guerra */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard
          label="Vendas Hoje"
          numericValue={8420}
          prefix="R$ "
          suffix=""
          formatFn={(v) => v.toLocaleString("pt-BR")}
          change={12.5}
          changeLabel="vs. ontem"
          icon={DollarSign}
          severity="success"
          delay={0.1}
        />
        <KpiCard
          label="Ticket Médio"
          numericValue={142}
          prefix="R$ "
          suffix=""
          change={-8}
          changeLabel="vs. mês anterior"
          icon={ShoppingCart}
          severity="danger"
          delay={0.2}
        />
        <KpiCard
          label="CMV"
          numericValue={42}
          prefix=""
          suffix="%"
          change={3.2}
          changeLabel="acima do ideal (38%)"
          icon={Percent}
          severity="warning"
          delay={0.3}
        />
        <KpiCard
          label="Margem Líquida"
          numericValue={18.5}
          prefix=""
          suffix="%"
          change={1.2}
          changeLabel="vs. mês anterior"
          icon={TrendingUp}
          severity="success"
          delay={0.4}
          decimals={1}
        />
        <KpiCard
          label="Break-even"
          numericValue={18}
          prefix="Dia "
          suffix=""
          change={0}
          changeLabel="dentro do prazo"
          icon={Target}
          severity="success"
          hideChange
          delay={0.5}
        />
      </motion.div>

      {/* Alertas Inteligentes */}
      <motion.div variants={fadeUp} className="space-y-2">
        {alerts.map((alert, i) => {
          const Icon = getSemaphoreIcon(alert.severity);
          const colorClass = getSemaphoreColor(alert.severity);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colorClass}`}
            >
              <motion.div
                animate={alert.severity === "danger" ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Icon size={16} />
              </motion.div>
              <span className="text-sm">{alert.text}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Faturamento Semanal */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-vpex-green" />
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
                <Area type="monotone" dataKey="faturamento" stroke="#39FF14" strokeWidth={2} fill="url(#dashGreenGrad)" name="Faturamento" animationDuration={1500} />
                <Area type="monotone" dataKey="meta" stroke="#737373" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Meta" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Canais de Venda */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4 flex items-center gap-2">
            <ShoppingCart size={14} className="text-vpex-green" />
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
                <Bar dataKey="valor" fill="#39FF14" radius={[0, 4, 4, 0]} name="Faturamento" animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Quick Stats + Activities */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Operational Stats */}
        <div className="glass-card p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4 flex items-center gap-2">
            <Activity size={14} className="text-vpex-green" />
            Operação Hoje
          </h3>
          <div className="space-y-4">
            <AnimatedStatRow label="Clientes atendidos" value={48} icon={Users} delay={0.6} />
            <AnimatedStatRow label="Leads novos" value={12} icon={ArrowUpRight} delay={0.7} highlight />
            <AnimatedStatRow label="Pedidos em aberto" value={3} icon={Clock} delay={0.8} />
            <AnimatedStatRow label="Campanhas ativas" value={5} icon={Zap} delay={0.9} />
            <AnimatedStatRow label="Treinamentos pendentes" value={2} icon={BarChart3} delay={1.0} />
          </div>
        </div>

        {/* Activities */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-vpex-green" />
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.1, duration: 0.3 }}
                  className="flex items-start gap-3 group"
                >
                  <motion.div
                    className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon size={14} className={act.color} />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground leading-snug group-hover:text-vpex-green transition-colors">{act.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                  </div>
                </motion.div>
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
  numericValue,
  prefix = "",
  suffix = "",
  formatFn,
  change,
  changeLabel,
  icon: Icon,
  severity,
  hideChange = false,
  delay = 0,
  decimals = 0,
}: {
  label: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  formatFn?: (v: number) => string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  severity: Severity;
  hideChange?: boolean;
  delay?: number;
  decimals?: number;
}) {
  const animatedValue = useAnimatedCounter(Math.round(numericValue * (decimals ? 10 : 1)), 1.2, delay);
  const displayValue = decimals ? (animatedValue / 10).toFixed(decimals) : (formatFn ? formatFn(animatedValue) : animatedValue.toString());
  const isPositive = change >= 0;
  const borderColor = severity === "success" ? "border-vpex-green/15" : severity === "warning" ? "border-vpex-yellow/15" : "border-vpex-red/15";

  return (
    <motion.div
      className={`glass-card p-4 ${borderColor} group relative overflow-hidden`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        severity === "success" ? "bg-vpex-green/[0.03]" : severity === "warning" ? "bg-vpex-yellow/[0.03]" : "bg-vpex-red/[0.03]"
      }`} />

      <div className="flex items-center justify-between mb-2 relative z-10">
        <span className="text-xs text-muted-foreground">{label}</span>
        <motion.div
          className={`p-1.5 rounded-md ${getSemaphoreColor(severity)}`}
          whileHover={{ rotate: 10 }}
        >
          <Icon size={14} />
        </motion.div>
      </div>
      <p className="text-xl font-bold font-[Sora] text-foreground relative z-10">
        {prefix}{displayValue}{suffix}
      </p>
      {!hideChange ? (
        <div className="flex items-center gap-1 mt-1.5 relative z-10">
          {isPositive ? <TrendingUp size={11} className="text-vpex-green" /> : <TrendingDown size={11} className="text-vpex-red" />}
          <span className={`text-[11px] font-medium ${isPositive ? "text-vpex-green" : "text-vpex-red"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
          <span className="text-[10px] text-muted-foreground ml-0.5">{changeLabel}</span>
        </div>
      ) : (
        <p className="text-[11px] text-vpex-green mt-1.5 flex items-center gap-1 relative z-10">
          <CheckCircle2 size={11} />
          {changeLabel}
        </p>
      )}
    </motion.div>
  );
}

function AnimatedStatRow({ label, value, icon: Icon, delay = 0, highlight = false }: {
  label: string;
  value: number;
  icon: React.ElementType;
  delay?: number;
  highlight?: boolean;
}) {
  const animatedValue = useAnimatedCounter(value, 1, delay);

  return (
    <motion.div
      className="flex items-center justify-between group"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={14} className={`${highlight ? "text-vpex-green" : "text-muted-foreground"} group-hover:text-vpex-green transition-colors`} />
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${highlight ? "text-vpex-green" : "text-foreground"}`}>
        {animatedValue}
      </span>
    </motion.div>
  );
}
