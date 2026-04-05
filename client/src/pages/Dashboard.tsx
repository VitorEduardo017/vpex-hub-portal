/**
 * Dashboard — "Visão Batimento Cardíaco"
 * 3 métricas gigantes: Vendas do Dia, Meta Mensal, Lucro Estimado.
 * Gráfico de performance e atividades recentes.
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Seg", vendas: 4200, meta: 5000 },
  { name: "Ter", vendas: 5800, meta: 5000 },
  { name: "Qua", vendas: 4900, meta: 5000 },
  { name: "Qui", vendas: 7200, meta: 5000 },
  { name: "Sex", vendas: 6100, meta: 5000 },
  { name: "Sáb", vendas: 8400, meta: 5000 },
  { name: "Dom", vendas: 3200, meta: 5000 },
];

const activities = [
  { text: "Nova campanha Meta Ads ativada", time: "Há 2h", icon: Zap, color: "text-vpex-green" },
  { text: "Relatório semanal disponível", time: "Há 5h", icon: Activity, color: "text-vpex-yellow" },
  { text: "3 novos leads capturados", time: "Há 8h", icon: ArrowUpRight, color: "text-vpex-green" },
  { text: "Treinamento de vendas concluído", time: "Ontem", icon: Calendar, color: "text-muted-foreground" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Dashboard() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta</p>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">
          Visão Geral do Negócio
        </h2>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Vendas do Dia */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Vendas do Dia</span>
            <div className="p-2 rounded-lg bg-vpex-green/10">
              <DollarSign size={18} className="text-vpex-green" />
            </div>
          </div>
          <p className="text-3xl font-bold font-[Sora] text-foreground">
            R$ 8.420
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp size={14} className="text-vpex-green" />
            <span className="text-xs text-vpex-green font-medium">+12,5%</span>
            <span className="text-xs text-muted-foreground">vs. ontem</span>
          </div>
        </div>

        {/* Meta Mensal */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Meta Mensal</span>
            <div className="p-2 rounded-lg bg-vpex-yellow/10">
              <Target size={18} className="text-vpex-yellow" />
            </div>
          </div>
          <p className="text-3xl font-bold font-[Sora] text-foreground">
            68%
          </p>
          <Progress value={68} className="mt-3 h-2 bg-muted [&>div]:bg-vpex-green" />
          <p className="text-xs text-muted-foreground mt-2">R$ 136.000 de R$ 200.000</p>
        </div>

        {/* Lucro Estimado */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Lucro Estimado</span>
            <div className="p-2 rounded-lg bg-vpex-green/10">
              <TrendingUp size={18} className="text-vpex-green" />
            </div>
          </div>
          <p className="text-3xl font-bold font-[Sora] text-foreground">
            R$ 42.800
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingDown size={14} className="text-vpex-red" />
            <span className="text-xs text-vpex-red font-medium">-3,2%</span>
            <span className="text-xs text-muted-foreground">vs. mês anterior</span>
          </div>
        </div>
      </motion.div>

      {/* Chart + Activities */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Performance Semanal
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#39FF14" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#39FF14" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#737373", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#737373", fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(20,20,20,0.95)",
                    border: "1px solid rgba(57,255,20,0.2)",
                    borderRadius: "8px",
                    color: "#e5e5e5",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#39FF14"
                  strokeWidth={2}
                  fill="url(#greenGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  stroke="#737373"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activities */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
                    <Icon size={14} className={act.color} />
                  </div>
                  <div className="min-w-0">
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
