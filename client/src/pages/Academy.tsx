/**
 * VPEX Academy — Treinamentos em vídeo organizados por processos
 * Grid estilo Netflix, simples e visual.
 */
import { motion } from "framer-motion";
import {
  GraduationCap,
  Play,
  Clock,
  CheckCircle2,
  Star,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const cursos = [
  { title: "Vendas de Alta Performance", category: "Comercial", lessons: 8, completed: 8, duration: "2h 30min", required: true },
  { title: "Atendimento ao Cliente", category: "Comercial", lessons: 6, completed: 4, duration: "1h 45min", required: true },
  { title: "Gestão de Estoque", category: "Logística", lessons: 5, completed: 0, duration: "1h 20min", required: false },
  { title: "Marketing Digital Básico", category: "Marketing", lessons: 10, completed: 7, duration: "3h 15min", required: false },
  { title: "Processos de RH", category: "RH", lessons: 4, completed: 0, duration: "55min", required: false },
  { title: "Análise de Resultados", category: "Gestão", lessons: 6, completed: 2, duration: "2h", required: true },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Academy() {
  const totalLessons = cursos.reduce((a, c) => a + c.lessons, 0);
  const completedLessons = cursos.reduce((a, c) => a + c.completed, 0);
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">VPEX Academy</h2>
          <p className="text-sm text-muted-foreground">Treine sua equipe com processos de elite</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-vpex-green/30 text-vpex-green hover:bg-vpex-green/10"
          onClick={() => toast("Pedido de treinamento em breve", { description: "Esta funcionalidade será ativada em breve." })}
        >
          <MessageSquarePlus size={14} /> Pedir Treinamento
        </Button>
      </motion.div>

      {/* Progress Header */}
      <motion.div variants={fadeUp} className="glass-card p-5" style={{
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663454301404/dvSkMMek29E6ca8EKzCwY7/vpex-academy-visual-2wtqCCPxRFJW6Brjsa3bGT.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
        <div className="absolute inset-0 bg-black/70 rounded-[0.75rem]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap size={20} className="text-vpex-green" />
            <span className="text-sm font-semibold text-foreground font-[Sora]">Progresso Geral</span>
          </div>
          <div className="flex items-end gap-4 mb-3">
            <p className="text-4xl font-bold font-[Sora] text-vpex-green vpex-text-glow">{progressPercent}%</p>
            <p className="text-sm text-muted-foreground pb-1">{completedLessons} de {totalLessons} aulas concluídas</p>
          </div>
          <Progress value={progressPercent} className="h-2 bg-white/10 [&>div]:bg-vpex-green" />
        </div>
      </motion.div>

      {/* Course Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cursos.map((curso, i) => {
          const progress = curso.lessons > 0 ? Math.round((curso.completed / curso.lessons) * 100) : 0;
          const isComplete = progress === 100;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 flex flex-col justify-between group hover:scale-[1.01] transition-transform"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{curso.category}</span>
                  {curso.required && (
                    <span className="text-[10px] text-vpex-red bg-vpex-red/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Star size={8} /> Obrigatório
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-foreground font-[Sora] mb-2">{curso.title}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Play size={10} /> {curso.lessons} aulas</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {curso.duration}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{curso.completed}/{curso.lessons} concluídas</span>
                  {isComplete && <CheckCircle2 size={14} className="text-vpex-green" />}
                </div>
                <Progress value={progress} className="h-1.5 bg-muted [&>div]:bg-vpex-green" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
