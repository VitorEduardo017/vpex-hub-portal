/**
 * Crescimento Gamificado — Roadmap 6 meses a 5 anos, Checkpoints e Recalcular Rota
 */
import { motion } from "framer-motion";
import {
  Rocket,
  Trophy,
  Target,
  RefreshCcw,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const milestones = [
  { title: "Fundação Digital", description: "Presença online estruturada", status: "completed", date: "Jul 2025" },
  { title: "Primeiros 100 Leads", description: "Base de leads qualificados", status: "completed", date: "Set 2025" },
  { title: "Faturamento R$ 100k/mês", description: "Meta de receita mensal", status: "completed", date: "Dez 2025" },
  { title: "Equipe Treinada", description: "100% dos treinamentos obrigatórios", status: "current", date: "Abr 2026" },
  { title: "2ª Unidade", description: "Expansão para nova loja", status: "locked", date: "Ago 2026" },
  { title: "Faturamento R$ 500k/mês", description: "Escala de operação", status: "locked", date: "Jun 2027" },
];

const badges = [
  { title: "Primeiros 100 Leads", icon: Users2Icon, earned: true },
  { title: "Faturamento Recorde", icon: TrendingUp, earned: true },
  { title: "Equipe Treinada", icon: Award, earned: false },
  { title: "Expansão Territorial", icon: Rocket, earned: false },
];

const adjustments = [
  { text: "Ajuste de preço no catálogo principal", date: "Jan 2026" },
  { text: "Troca de canal: TikTok → Meta Ads", date: "Mar 2026" },
];

function Users2Icon(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return <Zap {...props} />;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Crescimento() {
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const totalCount = milestones.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">Crescimento</h2>
        <p className="text-sm text-muted-foreground">Sua jornada de 6 meses a 5 anos</p>
      </motion.div>

      {/* Hero Card */}
      <motion.div variants={fadeUp} className="glass-card p-6 relative overflow-hidden" style={{
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663454301404/dvSkMMek29E6ca8EKzCwY7/vpex-growth-visual-YHn9kqCoyQcruXrzepm2bp.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="absolute inset-0 bg-black/75 rounded-[0.75rem]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Rocket size={18} className="text-vpex-green" />
            <span className="text-xs font-medium text-vpex-green uppercase tracking-wider">Nível de Maturidade</span>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <p className="text-4xl font-bold font-[Sora] text-foreground">Nível 3</p>
            <p className="text-sm text-muted-foreground pb-1">Crescimento Acelerado</p>
          </div>
          <Progress value={progressPercent} className="h-2.5 bg-white/10 [&>div]:bg-vpex-green" />
          <p className="text-xs text-muted-foreground mt-2">{completedCount} de {totalCount} marcos alcançados ({progressPercent}%)</p>
        </div>
      </motion.div>

      {/* Roadmap */}
      <motion.div variants={fadeUp} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-5">
          <Target size={16} className="text-vpex-green" /> Roadmap Estratégico
        </h3>
        <div className="space-y-1">
          {milestones.map((m, i) => {
            const isCompleted = m.status === "completed";
            const isCurrent = m.status === "current";
            const isLocked = m.status === "locked";
            return (
              <div key={i} className="flex items-start gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted ? "bg-vpex-green/20" : isCurrent ? "bg-vpex-green/10 ring-2 ring-vpex-green/40" : "bg-muted"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-vpex-green" />
                    ) : isCurrent ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Zap size={14} className="text-vpex-green" />
                      </motion.div>
                    ) : (
                      <Lock size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className={`w-0.5 h-12 ${isCompleted ? "bg-vpex-green/30" : "bg-border"}`} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6 min-w-0">
                  <p className={`text-sm font-semibold ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                  <span className={`text-[10px] mt-1 inline-block ${
                    isCompleted ? "text-vpex-green" : isCurrent ? "text-vpex-yellow" : "text-muted-foreground"
                  }`}>{m.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Badges */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-vpex-green" /> Conquistas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className={`p-3 rounded-lg text-center ${badge.earned ? "bg-vpex-green/10 border border-vpex-green/20" : "bg-muted/50 opacity-50"}`}>
                  <Icon size={20} className={`mx-auto mb-1.5 ${badge.earned ? "text-vpex-green" : "text-muted-foreground"}`} />
                  <p className={`text-xs font-medium ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}>{badge.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recalcular Rota */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <RefreshCcw size={16} className="text-vpex-yellow" /> Ajustes de Rota
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Nada sai perfeito! O sucesso está na capacidade de ajuste rápido.
          </p>
          <div className="space-y-2 mb-4">
            {adjustments.map((adj, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                <RefreshCcw size={12} className="text-vpex-yellow shrink-0" />
                <div>
                  <p className="text-xs text-foreground">{adj.text}</p>
                  <p className="text-[10px] text-muted-foreground">{adj.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-vpex-yellow/30 text-vpex-yellow hover:bg-vpex-yellow/10"
            onClick={() => toast("Recalcular rota em breve", { description: "Esta funcionalidade será ativada em breve." })}
          >
            <RefreshCcw size={14} /> Recalcular Rota
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
