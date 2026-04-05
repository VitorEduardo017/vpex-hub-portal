/**
 * Entregas VPEX — Histórico de Processos, Campanhas e Inteligência Digital
 */
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  Palette,
  Settings2,
} from "lucide-react";

const entregas = [
  { title: "Campanha Black Friday 2025", type: "Campanha", status: "Concluída", date: "Nov 2025", icon: Zap, description: "Meta Ads + Google Ads com ROAS de 4.2x" },
  { title: "Estrutura Digital Completa", type: "Processo", status: "Concluída", date: "Set 2025", icon: Settings2, description: "Landing pages, funis e automações configuradas" },
  { title: "Identidade Visual Atualizada", type: "Criativo", status: "Concluída", date: "Ago 2025", icon: Palette, description: "Novo logo, paleta de cores e templates de mídia" },
  { title: "Análise de Concorrência Q1", type: "Inteligência", status: "Em andamento", date: "Mar 2026", icon: BarChart3, description: "Mapeamento de preços e posicionamento digital" },
  { title: "Campanha Dia das Mães 2026", type: "Campanha", status: "Em andamento", date: "Abr 2026", icon: Zap, description: "Planejamento de mídia e criativos em produção" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Entregas() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">Entregas VPEX</h2>
        <p className="text-sm text-muted-foreground">Tudo que a VPEX construiu para o seu negócio</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-vpex-green">12</p>
          <p className="text-xs text-muted-foreground mt-1">Campanhas Feitas</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-foreground">8</p>
          <p className="text-xs text-muted-foreground mt-1">Processos Entregues</p>
        </div>
        <div className="glass-card p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold font-[Sora] text-vpex-yellow">2</p>
          <p className="text-xs text-muted-foreground mt-1">Em Andamento</p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={fadeUp} className="space-y-3">
        {entregas.map((item, i) => {
          const Icon = item.icon;
          const isActive = item.status === "Em andamento";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 flex items-start gap-4 ${isActive ? "border-vpex-green/20" : ""}`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${isActive ? "bg-vpex-green/15" : "bg-muted"}`}>
                <Icon size={20} className={isActive ? "text-vpex-green" : "text-muted-foreground"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive ? (
                      <Clock size={12} className="text-vpex-yellow" />
                    ) : (
                      <CheckCircle2 size={12} className="text-vpex-green" />
                    )}
                    <span className={`text-xs font-medium ${isActive ? "text-vpex-yellow" : "text-vpex-green"}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
