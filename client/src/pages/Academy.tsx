/**
 * VPEX Academy — Treinamentos com player de vídeo, progresso e certificados
 * Glass Cockpit Design | VPEX Hub
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Play,
  Clock,
  CheckCircle2,
  Star,
  MessageSquarePlus,
  Award,
  X,
  ChevronRight,
  Lock,
  Download,
  BookOpen,
  Users,
  Pause,
  SkipForward,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

/* ─── Data ─── */
interface Lesson {
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
}

interface Course {
  title: string;
  category: string;
  lessons: Lesson[];
  duration: string;
  required: boolean;
  instructor: string;
  description: string;
  certificateAvailable: boolean;
}

const cursos: Course[] = [
  {
    title: "Vendas de Alta Performance",
    category: "Comercial",
    duration: "2h 30min",
    required: true,
    instructor: "VPEX Academy",
    description: "Domine as técnicas de vendas que geram resultados consistentes para franquias.",
    certificateAvailable: true,
    lessons: [
      { title: "Introdução ao Método VPEX", duration: "15:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Rapport e Conexão Inicial", duration: "20:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Identificando Dores do Cliente", duration: "18:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Apresentação de Valor", duration: "22:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Tratamento de Objeções", duration: "25:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Técnicas de Fechamento", duration: "20:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Pós-venda e Retenção", duration: "15:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Métricas de Vendas", duration: "15:00", completed: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
  },
  {
    title: "Atendimento ao Cliente",
    category: "Comercial",
    duration: "1h 45min",
    required: true,
    instructor: "VPEX Academy",
    description: "Transforme cada atendimento em uma experiência que fideliza.",
    certificateAvailable: true,
    lessons: [
      { title: "Padrão de Atendimento VPEX", duration: "18:00", completed: true, videoUrl: "" },
      { title: "Comunicação Empática", duration: "20:00", completed: true, videoUrl: "" },
      { title: "Resolução de Conflitos", duration: "22:00", completed: true, videoUrl: "" },
      { title: "Atendimento via WhatsApp", duration: "15:00", completed: true, videoUrl: "" },
      { title: "Script de Atendimento", duration: "15:00", completed: false, videoUrl: "" },
      { title: "Métricas de Satisfação", duration: "15:00", completed: false, videoUrl: "" },
    ],
  },
  {
    title: "Gestão de Estoque",
    category: "Logística",
    duration: "1h 20min",
    required: false,
    instructor: "VPEX Academy",
    description: "Controle seu estoque para nunca perder vendas por ruptura.",
    certificateAvailable: false,
    lessons: [
      { title: "Fundamentos de Estoque", duration: "16:00", completed: false, videoUrl: "" },
      { title: "Curva ABC", duration: "18:00", completed: false, videoUrl: "" },
      { title: "Inventário Rotativo", duration: "15:00", completed: false, videoUrl: "" },
      { title: "Prevenção de Ruptura", duration: "16:00", completed: false, videoUrl: "" },
      { title: "Indicadores de Estoque", duration: "15:00", completed: false, videoUrl: "" },
    ],
  },
  {
    title: "Marketing Digital Básico",
    category: "Marketing",
    duration: "3h 15min",
    required: false,
    instructor: "VPEX Academy",
    description: "Entenda os fundamentos do marketing digital para sua franquia.",
    certificateAvailable: true,
    lessons: [
      { title: "Funil de Vendas Digital", duration: "20:00", completed: true, videoUrl: "" },
      { title: "Tráfego Pago: Meta Ads", duration: "25:00", completed: true, videoUrl: "" },
      { title: "Tráfego Pago: Google Ads", duration: "22:00", completed: true, videoUrl: "" },
      { title: "Landing Pages que Convertem", duration: "18:00", completed: true, videoUrl: "" },
      { title: "Copywriting Básico", duration: "20:00", completed: true, videoUrl: "" },
      { title: "Métricas de Marketing", duration: "18:00", completed: true, videoUrl: "" },
      { title: "Remarketing e Retargeting", duration: "15:00", completed: true, videoUrl: "" },
      { title: "Conteúdo para Redes Sociais", duration: "15:00", completed: false, videoUrl: "" },
      { title: "E-mail Marketing", duration: "12:00", completed: false, videoUrl: "" },
      { title: "Automação de Marketing", duration: "20:00", completed: false, videoUrl: "" },
    ],
  },
  {
    title: "Processos de RH",
    category: "RH",
    duration: "55min",
    required: false,
    instructor: "VPEX Academy",
    description: "Estruture os processos de RH da sua operação.",
    certificateAvailable: false,
    lessons: [
      { title: "Recrutamento Eficiente", duration: "15:00", completed: false, videoUrl: "" },
      { title: "Onboarding de Equipe", duration: "12:00", completed: false, videoUrl: "" },
      { title: "Avaliação de Desempenho", duration: "15:00", completed: false, videoUrl: "" },
      { title: "Cultura e Engajamento", duration: "13:00", completed: false, videoUrl: "" },
    ],
  },
  {
    title: "Análise de Resultados",
    category: "Gestão",
    duration: "2h",
    required: true,
    instructor: "VPEX Academy",
    description: "Aprenda a ler os números do seu negócio e tomar decisões com dados.",
    certificateAvailable: true,
    lessons: [
      { title: "DRE Simplificado", duration: "20:00", completed: true, videoUrl: "" },
      { title: "Margem e CMV", duration: "22:00", completed: true, videoUrl: "" },
      { title: "Break-even Point", duration: "18:00", completed: false, videoUrl: "" },
      { title: "KPIs Essenciais", duration: "20:00", completed: false, videoUrl: "" },
      { title: "Dashboards e Relatórios", duration: "20:00", completed: false, videoUrl: "" },
      { title: "Plano de Ação com Dados", duration: "20:00", completed: false, videoUrl: "" },
    ],
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Academy() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [showCertificate, setShowCertificate] = useState<Course | null>(null);

  const totalLessons = cursos.reduce((a, c) => a + c.lessons.length, 0);
  const completedLessons = cursos.reduce((a, c) => a + c.lessons.filter((l) => l.completed).length, 0);
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  const completedCourses = cursos.filter((c) => c.lessons.every((l) => l.completed)).length;

  return (
    <>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-[Sora] text-foreground">VPEX Academy</h2>
            <p className="text-sm text-muted-foreground">Treine sua equipe com processos de elite</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 border-vpex-green/30 text-vpex-green hover:bg-vpex-green/10"
              onClick={() => toast("Pedido enviado", { description: "Nosso time vai criar um treinamento personalizado para sua equipe." })}
            >
              <MessageSquarePlus size={14} /> Pedir Treinamento
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-vpex-green" />
              <span className="text-xs text-muted-foreground">Cursos</span>
            </div>
            <p className="text-2xl font-bold font-[Sora] text-foreground">{cursos.length}</p>
            <p className="text-[10px] text-muted-foreground">{completedCourses} concluídos</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Play size={14} className="text-vpex-green" />
              <span className="text-xs text-muted-foreground">Aulas</span>
            </div>
            <p className="text-2xl font-bold font-[Sora] text-foreground">{completedLessons}/{totalLessons}</p>
            <p className="text-[10px] text-muted-foreground">aulas concluídas</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} className="text-vpex-green" />
              <span className="text-xs text-muted-foreground">Certificados</span>
            </div>
            <p className="text-2xl font-bold font-[Sora] text-foreground">{completedCourses}</p>
            <p className="text-[10px] text-muted-foreground">disponíveis para download</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={14} className="text-vpex-green" />
              <span className="text-xs text-muted-foreground">Progresso</span>
            </div>
            <p className="text-2xl font-bold font-[Sora] text-vpex-green">{progressPercent}%</p>
            <Progress value={progressPercent} className="h-1.5 mt-1 bg-muted [&>div]:bg-vpex-green" />
          </div>
        </motion.div>

        {/* Course Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cursos.map((curso, i) => {
            const completed = curso.lessons.filter((l) => l.completed).length;
            const total = curso.lessons.length;
            const progress = Math.round((completed / total) * 100);
            const isComplete = progress === 100;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 flex flex-col justify-between group hover:scale-[1.01] transition-all cursor-pointer hover:border-vpex-green/20"
                onClick={() => { setSelectedCourse(curso); setActiveLesson(0); }}
              >
                <div>
                  {/* Thumbnail / Preview */}
                  <div className="relative rounded-lg bg-black/40 h-32 mb-3 flex items-center justify-center overflow-hidden group/thumb">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <motion.div
                      className="relative z-10 w-12 h-12 rounded-full bg-vpex-green/20 border border-vpex-green/40 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play size={20} className="text-vpex-green ml-0.5" />
                    </motion.div>
                    {isComplete && (
                      <div className="absolute top-2 right-2 z-10 bg-vpex-green/20 border border-vpex-green/30 rounded-full p-1">
                        <CheckCircle2 size={14} className="text-vpex-green" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 z-10 flex gap-1.5">
                      <span className="text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">{curso.category}</span>
                      {curso.required && (
                        <span className="text-[10px] text-vpex-red bg-vpex-red/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Star size={8} /> Obrigatório
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-foreground font-[Sora] mb-1 group-hover:text-vpex-green transition-colors">{curso.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{curso.description}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Play size={10} /> {total} aulas</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {curso.duration}</span>
                    {curso.certificateAvailable && (
                      <span className="flex items-center gap-1 text-vpex-green"><Award size={10} /> Certificado</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">{completed}/{total} concluídas</span>
                    <span className="text-xs font-medium text-vpex-green">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-muted [&>div]:bg-vpex-green" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ─── Video Player Modal ─── */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0d0d0d] border border-white/10 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Player Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-semibold text-foreground font-[Sora]">{selectedCourse.title}</h3>
                  <p className="text-xs text-muted-foreground">{selectedCourse.instructor} · {selectedCourse.lessons.length} aulas</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCourse.certificateAvailable && selectedCourse.lessons.every((l) => l.completed) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs border-vpex-green/30 text-vpex-green hover:bg-vpex-green/10"
                      onClick={() => setShowCertificate(selectedCourse)}
                    >
                      <Award size={12} /> Certificado
                    </Button>
                  )}
                  <button onClick={() => setSelectedCourse(null)} className="p-1.5 rounded-md hover:bg-white/5">
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Video Area */}
                <div className="flex-1 flex flex-col">
                  <div className="relative bg-black aspect-video w-full">
                    {/* Simulated Video Player */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black">
                      <div className="text-center">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-vpex-green/20 border-2 border-vpex-green/40 flex items-center justify-center mx-auto mb-3 cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toast("Player de vídeo", { description: "O player será conectado ao seu servidor de vídeos quando o backend estiver ativo." })}
                        >
                          <Play size={24} className="text-vpex-green ml-1" />
                        </motion.div>
                        <p className="text-sm text-foreground font-[Sora]">{selectedCourse.lessons[activeLesson]?.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{selectedCourse.lessons[activeLesson]?.duration}</p>
                      </div>
                    </div>
                    {/* Player Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                      <div className="w-full h-1 bg-white/10 rounded-full mb-2 cursor-pointer">
                        <div className="h-full w-1/3 bg-vpex-green rounded-full" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="text-white/80 hover:text-white"><Pause size={16} /></button>
                          <button
                            className="text-white/80 hover:text-white"
                            onClick={() => {
                              if (activeLesson < selectedCourse.lessons.length - 1) setActiveLesson(activeLesson + 1);
                            }}
                          >
                            <SkipForward size={16} />
                          </button>
                          <button className="text-white/80 hover:text-white"><Volume2 size={16} /></button>
                          <span className="text-xs text-white/50">05:23 / {selectedCourse.lessons[activeLesson]?.duration}</span>
                        </div>
                        <span className="text-xs text-white/50">Aula {activeLesson + 1} de {selectedCourse.lessons.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Description */}
                  <div className="p-4 border-t border-white/5">
                    <h4 className="text-sm font-semibold text-foreground font-[Sora] mb-1">
                      {selectedCourse.lessons[activeLesson]?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{selectedCourse.description}</p>
                  </div>
                </div>

                {/* Lesson List Sidebar */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 overflow-y-auto max-h-[40vh] lg:max-h-none">
                  <div className="p-3 border-b border-white/5">
                    <p className="text-xs font-semibold text-foreground font-[Sora]">Conteúdo do Curso</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {selectedCourse.lessons.filter((l) => l.completed).length}/{selectedCourse.lessons.length} aulas concluídas
                    </p>
                  </div>
                  {selectedCourse.lessons.map((lesson, li) => (
                    <div
                      key={li}
                      onClick={() => setActiveLesson(li)}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer border-b border-white/5 transition-colors ${
                        li === activeLesson ? "bg-vpex-green/5 border-l-2 border-l-vpex-green" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="shrink-0">
                        {lesson.completed ? (
                          <CheckCircle2 size={16} className="text-vpex-green" />
                        ) : li === activeLesson ? (
                          <div className="w-4 h-4 rounded-full border-2 border-vpex-green flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-vpex-green" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${li === activeLesson ? "text-vpex-green font-medium" : "text-foreground"}`}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{lesson.duration}</p>
                      </div>
                      {li === activeLesson && <ChevronRight size={12} className="text-vpex-green shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Certificate Modal ─── */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCertificate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0d0d0d] border border-vpex-green/20 rounded-xl w-full max-w-lg p-8 text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-vpex-green/[0.06] rounded-full blur-[80px]" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-vpex-green/10 border-2 border-vpex-green/30 flex items-center justify-center mx-auto mb-4"
                >
                  <Award size={36} className="text-vpex-green" />
                </motion.div>

                <h3 className="text-lg font-bold font-[Sora] text-foreground mb-1">Certificado de Conclusão</h3>
                <p className="text-xs text-muted-foreground mb-6">VPEX Academy · Programa de Treinamento</p>

                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6 mb-6">
                  <p className="text-xs text-muted-foreground mb-2">Certificamos que</p>
                  <p className="text-lg font-bold font-[Sora] text-vpex-green mb-3">Nome do Franqueado</p>
                  <p className="text-xs text-muted-foreground mb-1">concluiu com êxito o curso</p>
                  <p className="text-sm font-semibold text-foreground font-[Sora] mb-3">"{showCertificate.title}"</p>
                  <p className="text-xs text-muted-foreground">
                    {showCertificate.lessons.length} aulas · {showCertificate.duration} · {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    className="gap-2 border-vpex-green/30 text-vpex-green hover:bg-vpex-green/10"
                    onClick={() => toast("Download iniciado", { description: "O certificado será baixado em PDF." })}
                  >
                    <Download size={14} /> Baixar PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 border-white/10 text-muted-foreground hover:bg-white/5"
                    onClick={() => setShowCertificate(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
