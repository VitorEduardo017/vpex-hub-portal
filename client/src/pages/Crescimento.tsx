/**
 * Crescimento Gamificado — "O Jogo do Seu Negócio"
 * Glass Cockpit Design | VPEX Hub
 *
 * Roadmap visual com checkpoints animados, sistema de XP/Nível,
 * conquistas com efeitos de desbloqueio, projeções e recalcular rota.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  ChevronDown,
  ChevronUp,
  Flag,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Shield,
  Crown,
  Flame,
  Eye,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

/* ─── Types ─── */
type MilestoneStatus = "completed" | "current" | "locked";
type PlanHorizon = "6m" | "1a" | "3a" | "5a";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  date: string;
  xp: number;
  category: string;
  details?: string;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  earnedDate?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
}

interface RouteAdjustment {
  id: string;
  text: string;
  reason: string;
  date: string;
  impact: "positive" | "neutral" | "negative";
}

/* ─── Data ─── */
const horizonLabels: Record<PlanHorizon, string> = {
  "6m": "6 Meses",
  "1a": "1 Ano",
  "3a": "3 Anos",
  "5a": "5 Anos",
};

const milestones: Milestone[] = [
  {
    id: "m1",
    title: "Fundação Digital",
    description: "Presença online estruturada e profissional",
    status: "completed",
    date: "Jul 2025",
    xp: 200,
    category: "Estrutura",
    details: "Site, redes sociais, Google Meu Negócio e identidade visual concluídos.",
  },
  {
    id: "m2",
    title: "Primeiros 100 Leads",
    description: "Base de leads qualificados construída",
    status: "completed",
    date: "Set 2025",
    xp: 350,
    category: "Marketing",
    details: "Campanha de captação via Meta Ads + Landing Page com taxa de conversão de 8,2%.",
  },
  {
    id: "m3",
    title: "Faturamento R$ 100k/mês",
    description: "Meta de receita mensal atingida",
    status: "completed",
    date: "Dez 2025",
    xp: 500,
    category: "Financeiro",
    details: "Faturamento consolidado de R$ 112.400 em dezembro. ROAS médio de 3,8x.",
  },
  {
    id: "m4",
    title: "Equipe 100% Treinada",
    description: "Todos os treinamentos obrigatórios concluídos",
    status: "current",
    date: "Abr 2026",
    xp: 400,
    category: "Pessoas",
    details: "78% concluído. Faltam 2 módulos: Atendimento Premium e Gestão de Estoque.",
  },
  {
    id: "m5",
    title: "Ticket Médio R$ 180",
    description: "Elevar o ticket médio em 30%",
    status: "locked",
    date: "Jun 2026",
    xp: 450,
    category: "Comercial",
  },
  {
    id: "m6",
    title: "2ª Unidade Inaugurada",
    description: "Expansão territorial para nova loja",
    status: "locked",
    date: "Dez 2026",
    xp: 800,
    category: "Expansão",
  },
  {
    id: "m7",
    title: "Faturamento R$ 500k/mês",
    description: "Escala de operação multi-unidade",
    status: "locked",
    date: "Jun 2027",
    xp: 1000,
    category: "Financeiro",
  },
  {
    id: "m8",
    title: "Referência Regional",
    description: "Top 3 franqueados da região Centro-Oeste",
    status: "locked",
    date: "Dez 2028",
    xp: 1500,
    category: "Reconhecimento",
  },
];

const badges: Badge[] = [
  { id: "b1", title: "Primeiro Passo", description: "Completou a fundação digital", icon: Flag, earned: true, earnedDate: "Jul 2025", rarity: "common", xp: 100 },
  { id: "b2", title: "Caçador de Leads", description: "Conquistou 100 leads qualificados", icon: Target, earned: true, earnedDate: "Set 2025", rarity: "common", xp: 150 },
  { id: "b3", title: "Faturamento Recorde", description: "Ultrapassou R$ 100k/mês", icon: TrendingUp, earned: true, earnedDate: "Dez 2025", rarity: "rare", xp: 300 },
  { id: "b4", title: "Mestre do ROAS", description: "ROAS acima de 4x por 3 meses", icon: Flame, earned: true, earnedDate: "Mar 2026", rarity: "rare", xp: 250 },
  { id: "b5", title: "Líder de Equipe", description: "100% da equipe treinada", icon: Shield, earned: false, rarity: "epic", xp: 400 },
  { id: "b6", title: "Expansionista", description: "Abriu a 2ª unidade", icon: Rocket, earned: false, rarity: "epic", xp: 500 },
  { id: "b7", title: "Meio Milhão", description: "Faturamento de R$ 500k/mês", icon: Crown, earned: false, rarity: "legendary", xp: 800 },
  { id: "b8", title: "Lenda Regional", description: "Top 3 da região Centro-Oeste", icon: Star, earned: false, rarity: "legendary", xp: 1000 },
];

const adjustments: RouteAdjustment[] = [
  { id: "a1", text: "Ajuste de preço no catálogo principal", reason: "Margem abaixo do ideal (32%). Reajuste de 12% aplicado.", date: "Jan 2026", impact: "positive" },
  { id: "a2", text: "Troca de canal: TikTok → Meta Ads", reason: "CPL no TikTok 3x maior que Meta para o público 35+.", date: "Mar 2026", impact: "positive" },
  { id: "a3", text: "Meta de equipe adiada em 30 dias", reason: "Contratação de novo vendedor atrasou o cronograma.", date: "Fev 2026", impact: "neutral" },
];

/* ─── Helpers ─── */
const rarityConfig = {
  common: { label: "Comum", color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border", glow: "" },
  rare: { label: "Raro", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-[0_0_12px_rgba(59,130,246,0.15)]" },
  epic: { label: "Épico", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "shadow-[0_0_12px_rgba(168,85,247,0.15)]" },
  legendary: { label: "Lendário", color: "text-vpex-yellow", bg: "bg-vpex-yellow/10", border: "border-vpex-yellow/20", glow: "shadow-[0_0_16px_rgba(255,200,0,0.2)]" },
};

function getImpactColor(impact: string) {
  switch (impact) {
    case "positive": return "text-vpex-green bg-vpex-green/10 border-vpex-green/20";
    case "negative": return "text-vpex-red bg-vpex-red/10 border-vpex-red/20";
    default: return "text-vpex-yellow bg-vpex-yellow/10 border-vpex-yellow/20";
  }
}

/* ─── Component ─── */
export default function Crescimento() {
  const [selectedHorizon, setSelectedHorizon] = useState<PlanHorizon>("1a");
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [celebratingBadge, setCelebratingBadge] = useState<string | null>(null);

  const completedMilestones = milestones.filter((m) => m.status === "completed");
  const totalXP = completedMilestones.reduce((acc, m) => acc + m.xp, 0) + badges.filter((b) => b.earned).reduce((acc, b) => acc + b.xp, 0);
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const xpToNext = 500;
  const progressPercent = Math.round((completedMilestones.length / milestones.length) * 100);

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);
  const displayBadges = showAllBadges ? badges : earnedBadges;

  const handleBadgeClick = (badge: Badge) => {
    if (badge.earned) {
      setCelebratingBadge(badge.id);
      setTimeout(() => setCelebratingBadge(null), 2000);
    } else {
      toast("Conquista bloqueada", { description: badge.description });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">Crescimento</h2>
        <p className="text-sm text-muted-foreground mt-1">O jogo do seu negócio — cada meta batida é uma vitória</p>
      </div>

      {/* Hero: Level + XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden rounded-[0.75rem]">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-vpex-green/30"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Level Info */}
            <div className="flex items-center gap-4">
              {/* Level Badge */}
              <motion.div
                className="relative"
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-16 h-16 rounded-2xl bg-vpex-green/10 border-2 border-vpex-green/30 flex items-center justify-center vpex-glow">
                  <div className="text-center">
                    <p className="text-2xl font-bold font-[Sora] text-vpex-green vpex-text-glow">{currentLevel}</p>
                  </div>
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-vpex-green flex items-center justify-center"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={10} className="text-black" />
                </motion.div>
              </motion.div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold font-[Sora] text-foreground">Nível {currentLevel}</p>
                  <span className="px-2 py-0.5 rounded-full bg-vpex-green/10 border border-vpex-green/20 text-[10px] font-medium text-vpex-green">
                    Crescimento Acelerado
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{totalXP} XP total — {earnedBadges.length} conquistas desbloqueadas</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xl font-bold font-[Sora] text-vpex-green">{completedMilestones.length}</p>
                <p className="text-[10px] text-muted-foreground">Marcos</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold font-[Sora] text-foreground">{milestones.length - completedMilestones.length}</p>
                <p className="text-[10px] text-muted-foreground">Restantes</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold font-[Sora] text-vpex-yellow">{adjustments.length}</p>
                <p className="text-[10px] text-muted-foreground">Ajustes</p>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">XP para o próximo nível</span>
              <span className="text-xs font-medium text-vpex-green">{xpInLevel} / {xpToNext} XP</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #39FF14 0%, #2bcc10 50%, #39FF14 100%)",
                  backgroundSize: "200% 100%",
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(xpInLevel / xpToNext) * 100}%`,
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  width: { duration: 1.2, ease: "easeOut" },
                  backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                }}
              />
              {/* Shine effect */}
              <motion.div
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ left: ["-10%", "110%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Horizon Selector */}
      <div className="flex gap-2">
        {(Object.keys(horizonLabels) as PlanHorizon[]).map((h) => (
          <button
            key={h}
            onClick={() => setSelectedHorizon(h)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              selectedHorizon === h
                ? "bg-vpex-green text-black"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30"
            }`}
          >
            {horizonLabels[h]}
          </button>
        ))}
      </div>

      {/* Roadmap Timeline */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-6">
          <MapPin size={16} className="text-vpex-green" /> Roadmap Estratégico
        </h3>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />
          <motion.div
            className="absolute left-[19px] top-0 w-0.5 bg-vpex-green"
            initial={{ height: 0 }}
            animate={{ height: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />

          <div className="space-y-1">
            {milestones.map((m, i) => {
              const isCompleted = m.status === "completed";
              const isCurrent = m.status === "current";
              const isLocked = m.status === "locked";
              const isExpanded = expandedMilestone === m.id;

              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <button
                    onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                    className="w-full flex items-start gap-4 text-left group"
                  >
                    {/* Checkpoint Node */}
                    <div className="relative z-10 shrink-0">
                      <motion.div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-vpex-green/20 border-2 border-vpex-green/40 shadow-[0_0_12px_rgba(57,255,20,0.2)]"
                            : isCurrent
                            ? "bg-vpex-green/10 border-2 border-vpex-green/30"
                            : "bg-muted border-2 border-border"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, delay: i * 0.1 }}
                          >
                            <CheckCircle2 size={18} className="text-vpex-green" />
                          </motion.div>
                        ) : isCurrent ? (
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                          >
                            <Zap size={16} className="text-vpex-green" />
                          </motion.div>
                        ) : (
                          <Lock size={14} className="text-muted-foreground" />
                        )}
                      </motion.div>

                      {/* Pulse ring for current */}
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-xl border-2 border-vpex-green/30"
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-6 min-w-0 ${isLocked ? "opacity-50" : ""}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                          {m.title}
                        </p>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                          isCompleted ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/20" :
                          isCurrent ? "bg-vpex-yellow/10 text-vpex-yellow border border-vpex-yellow/20" :
                          "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {isCompleted ? "Concluído" : isCurrent ? "Em andamento" : "Bloqueado"}
                        </span>
                        <span className="text-[10px] text-vpex-green font-medium">+{m.xp} XP</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar size={9} /> {m.date}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">{m.category}</span>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && m.details && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
                              <p className="text-xs text-foreground leading-relaxed">{m.details}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Expand icon */}
                    {m.details && (
                      <div className="shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp size={14} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Conquistas + Recalcular Rota */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conquistas / Badges */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2">
              <Trophy size={16} className="text-vpex-green" /> Conquistas
            </h3>
            <button
              onClick={() => setShowAllBadges(!showAllBadges)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye size={12} />
              {showAllBadges ? "Só desbloqueadas" : "Ver todas"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {displayBadges.map((badge) => {
                const Icon = badge.icon;
                const config = rarityConfig[badge.rarity];
                const isCelebrating = celebratingBadge === badge.id;

                return (
                  <motion.button
                    key={badge.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: badge.earned ? 1.03 : 1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBadgeClick(badge)}
                    className={`relative p-3 rounded-xl text-center border transition-all ${
                      badge.earned
                        ? `${config.bg} ${config.border} ${config.glow}`
                        : "bg-muted/20 border-border opacity-40 grayscale"
                    }`}
                  >
                    {/* Celebration particles */}
                    <AnimatePresence>
                      {isCelebrating && (
                        <>
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={`particle-${i}`}
                              className="absolute w-1.5 h-1.5 rounded-full bg-vpex-green"
                              style={{ left: "50%", top: "50%" }}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                              animate={{
                                x: Math.cos((i * Math.PI * 2) / 8) * 40,
                                y: Math.sin((i * Math.PI * 2) / 8) * 40,
                                opacity: 0,
                                scale: 0,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    {/* Rarity indicator */}
                    <span className={`absolute top-1.5 right-1.5 text-[8px] font-bold uppercase tracking-wider ${config.color}`}>
                      {config.label}
                    </span>

                    <motion.div
                      animate={isCelebrating ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon size={24} className={`mx-auto mb-2 ${badge.earned ? config.color : "text-muted-foreground"}`} />
                    </motion.div>
                    <p className={`text-xs font-semibold ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}>
                      {badge.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</p>
                    {badge.earned && badge.earnedDate && (
                      <p className="text-[9px] text-vpex-green mt-1 font-medium">Desbloqueado em {badge.earnedDate}</p>
                    )}
                    {!badge.earned && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Lock size={8} className="text-muted-foreground" />
                        <span className="text-[9px] text-muted-foreground">+{badge.xp} XP</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Recalcular Rota */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-2">
            <RefreshCcw size={16} className="text-vpex-yellow" /> Ajustes de Rota
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Nada sai perfeito. O sucesso está na velocidade do ajuste.
          </p>

          <div className="space-y-3 mb-4">
            {adjustments.map((adj, i) => (
              <motion.div
                key={adj.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border ${getImpactColor(adj.impact)}`}
              >
                <div className="flex items-start gap-2.5">
                  <RefreshCcw size={13} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">{adj.text}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">{adj.reason}</p>
                    <p className="text-[9px] opacity-50 mt-1">{adj.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => toast("Recalcular Rota", { description: "A VPEX irá analisar seu plano e sugerir ajustes estratégicos." })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-vpex-yellow/10 text-vpex-yellow border border-vpex-yellow/20 hover:bg-vpex-yellow hover:text-black transition-all"
          >
            <RefreshCcw size={14} />
            Solicitar Recálculo de Rota
          </button>

          {/* Projeção */}
          <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Projeção Atual</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Meta Anual</span>
                <span className="text-xs font-medium text-foreground">R$ 2.4M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ritmo Atual</span>
                <span className="text-xs font-medium text-vpex-green">R$ 1.87M (78%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Previsão</span>
                <span className="text-xs font-medium text-vpex-yellow">R$ 2.2M (92%)</span>
              </div>
              <Progress value={78} className="h-1.5 bg-muted [&>div]:bg-vpex-green [&>div]:rounded-full mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
