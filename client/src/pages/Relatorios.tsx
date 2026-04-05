/**
 * Relatórios — Marketing + Operação consolidados
 * KPIs de ROI, CPL, Funil de Vendas e Performance de Equipe.
 */
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  MousePointerClick,
  DollarSign,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

const channelData = [
  { name: "Meta Ads", investido: 12000, retorno: 36000 },
  { name: "Google Ads", investido: 8000, retorno: 22000 },
  { name: "TikTok", investido: 3000, retorno: 7500 },
  { name: "Orgânico", investido: 0, retorno: 15000 },
];

const funnelData = [
  { name: "Impressões", value: 85000, color: "#39FF14" },
  { name: "Cliques", value: 12400, color: "#2bcc10" },
  { name: "Leads", value: 1840, color: "#1f990c" },
  { name: "Vendas", value: 312, color: "#146608" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Relatorios() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Relatórios</h2>
          <p className="text-sm text-muted-foreground">Marketing e Operação consolidados</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border"
            onClick={() => toast("Filtros em breve", { description: "Esta funcionalidade será ativada em breve." })}
          >
            <Filter size={14} /> Filtrar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border"
            onClick={() => toast("Exportação em breve", { description: "Esta funcionalidade será ativada em breve." })}
          >
            <Download size={14} /> Exportar
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Investimento", value: "R$ 23.000", icon: DollarSign, change: "+8%", positive: true },
          { label: "Custo por Lead", value: "R$ 12,50", icon: MousePointerClick, change: "-15%", positive: true },
          { label: "Total de Leads", value: "1.840", icon: Users, change: "+22%", positive: true },
          { label: "ROAS", value: "3,5x", icon: TrendingUp, change: "+0,3x", positive: true },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <Icon size={16} className="text-vpex-green" />
              </div>
              <p className="text-xl font-bold font-[Sora] text-foreground">{kpi.value}</p>
              <span className={`text-xs font-medium ${kpi.positive ? "text-vpex-green" : "text-vpex-red"}`}>
                {kpi.change}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Charts */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar Chart */}
        <div className="glass-card p-5 lg:col-span-3">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Investimento vs. Retorno por Canal
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: "8px", color: "#e5e5e5", fontSize: "13px" }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                />
                <Bar dataKey="investido" fill="#737373" radius={[4, 4, 0, 0]} name="Investido" />
                <Bar dataKey="retorno" fill="#39FF14" radius={[4, 4, 0, 0]} name="Retorno" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4">
            Funil de Conversão
          </h3>
          <div className="space-y-3">
            {funnelData.map((step, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{step.name}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {step.value.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(step.value / funnelData[0].value) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" as const }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                </div>
                {i < funnelData.length - 1 && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Taxa: {((funnelData[i + 1].value / step.value) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
