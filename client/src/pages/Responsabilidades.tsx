/**
 * Minhas Responsabilidades — Tarefas do usuário enviadas pela VPEX
 * Cada tarefa tem prazo máximo, status e impacto no score de crescimento.
 * Glass Cockpit Design | VPEX Hub
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Key,
  Send,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Star,
  Timer,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

/* ─── Data ─── */
interface Task {
  id: number;
  title: string;
  description: string;
  category: "acesso" | "documento" | "formulario" | "aprovacao";
  priority: "alta" | "média" | "baixa";
  deadline: string;
  daysLeft: number;
  status: "pendente" | "concluída" | "atrasada" | "em_andamento";
  scoreImpact: number;
  assignedBy: string;
}

const tasks: Task[] = [
  {
    id: 1,
    title: "Enviar acesso ao Google Analytics",
    description: "Compartilhe o acesso de leitura do Google Analytics da sua loja para que possamos configurar os relatórios automatizados.",
    category: "acesso",
    priority: "alta",
    deadline: "10/04/2026",
    daysLeft: 5,
    status: "pendente",
    scoreImpact: 15,
    assignedBy: "Lucas — Gestor de Tráfego",
  },
  {
    id: 2,
    title: "Preencher formulário de metas Q2",
    description: "Defina suas metas de faturamento, vendas e ticket médio para o segundo trimestre de 2026.",
    category: "formulario",
    priority: "alta",
    deadline: "08/04/2026",
    daysLeft: 3,
    status: "em_andamento",
    scoreImpact: 20,
    assignedBy: "VPEX Estratégia",
  },
  {
    id: 3,
    title: "Enviar contrato social atualizado",
    description: "Precisamos do contrato social atualizado para regularizar a documentação do projeto.",
    category: "documento",
    priority: "média",
    deadline: "15/04/2026",
    daysLeft: 10,
    status: "pendente",
    scoreImpact: 10,
    assignedBy: "VPEX Administrativo",
  },
  {
    id: 4,
    title: "Aprovar criativos da campanha Abril",
    description: "Revise e aprove os criativos (3 imagens + 2 vídeos) para a campanha de abril no Meta Ads.",
    category: "aprovacao",
    priority: "alta",
    deadline: "06/04/2026",
    daysLeft: 1,
    status: "pendente",
    scoreImpact: 25,
    assignedBy: "Ana — Designer VPEX",
  },
  {
    id: 5,
    title: "Enviar acesso ao Meta Business Suite",
    description: "Adicione suporte@vpex.com.br como administrador no Meta Business Suite.",
    category: "acesso",
    priority: "média",
    deadline: "01/04/2026",
    daysLeft: -4,
    status: "atrasada",
    scoreImpact: -10,
    assignedBy: "Lucas — Gestor de Tráfego",
  },
  {
    id: 6,
    title: "Enviar fotos dos produtos novos",
    description: "Envie as fotos em alta resolução dos 5 novos produtos para criação de anúncios.",
    category: "documento",
    priority: "baixa",
    deadline: "25/03/2026",
    daysLeft: 0,
    status: "concluída",
    scoreImpact: 10,
    assignedBy: "Ana — Designer VPEX",
  },
  {
    id: 7,
    title: "Preencher pesquisa de satisfação",
    description: "Responda a pesquisa mensal de satisfação com os serviços VPEX.",
    category: "formulario",
    priority: "baixa",
    deadline: "20/03/2026",
    daysLeft: 0,
    status: "concluída",
    scoreImpact: 5,
    assignedBy: "VPEX Sucesso do Cliente",
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  acesso: Key,
  documento: FileText,
  formulario: ClipboardCheck,
  aprovacao: CheckCircle2,
};

const categoryLabels: Record<string, string> = {
  acesso: "Acesso",
  documento: "Documento",
  formulario: "Formulário",
  aprovacao: "Aprovação",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pendente: { label: "Pendente", color: "text-vpex-yellow", bg: "bg-vpex-yellow/10" },
  em_andamento: { label: "Em andamento", color: "text-blue-400", bg: "bg-blue-400/10" },
  concluída: { label: "Concluída", color: "text-vpex-green", bg: "bg-vpex-green/10" },
  atrasada: { label: "Atrasada", color: "text-vpex-red", bg: "bg-vpex-red/10" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  alta: { label: "Alta", color: "text-vpex-red" },
  média: { label: "Média", color: "text-vpex-yellow" },
  baixa: { label: "Baixa", color: "text-muted-foreground" },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Responsabilidades() {
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [filter, setFilter] = useState<"todas" | "pendente" | "concluída" | "atrasada">("todas");

  const pendingTasks = tasks.filter((t) => t.status === "pendente" || t.status === "em_andamento");
  const completedTasks = tasks.filter((t) => t.status === "concluída");
  const overdueTasks = tasks.filter((t) => t.status === "atrasada");
  const totalScore = tasks.reduce((a, t) => a + (t.status === "concluída" ? t.scoreImpact : 0), 0);
  const maxScore = tasks.reduce((a, t) => a + Math.abs(t.scoreImpact), 0);
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  const filteredTasks = filter === "todas" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Minhas Responsabilidades</h2>
          <p className="text-sm text-muted-foreground">Tarefas enviadas pela VPEX para você ou sua equipe</p>
        </div>
      </motion.div>

      {/* Score + Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-vpex-green" />
            <span className="text-xs text-muted-foreground">Score de Engajamento</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-vpex-green">{totalScore} pts</p>
          <Progress value={scorePercent} className="h-1.5 mt-2 bg-muted [&>div]:bg-vpex-green" />
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Timer size={14} className="text-vpex-yellow" />
            <span className="text-xs text-muted-foreground">Pendentes</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-vpex-yellow">{pendingTasks.length}</p>
          <p className="text-[10px] text-muted-foreground">tarefas aguardando</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-vpex-green" />
            <span className="text-xs text-muted-foreground">Concluídas</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-vpex-green">{completedTasks.length}</p>
          <p className="text-[10px] text-muted-foreground">tarefas entregues</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-vpex-red" />
            <span className="text-xs text-muted-foreground">Atrasadas</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-vpex-red">{overdueTasks.length}</p>
          <p className="text-[10px] text-muted-foreground">impactam seu score</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex gap-2">
        {(["todas", "pendente", "concluída", "atrasada"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/20"
                : "bg-white/[0.03] text-muted-foreground border border-white/5 hover:text-foreground"
            }`}
          >
            {f === "todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Task List */}
      <motion.div variants={fadeUp} className="space-y-2">
        {filteredTasks.map((task) => {
          const isExpanded = expandedTask === task.id;
          const Icon = categoryIcons[task.category] || ClipboardCheck;
          const status = statusConfig[task.status];
          const priority = priorityConfig[task.priority];

          return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card overflow-hidden transition-colors ${
                task.status === "atrasada" ? "border-vpex-red/20" : ""
              }`}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.01] transition-colors"
                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  task.status === "concluída" ? "bg-vpex-green/10" : task.status === "atrasada" ? "bg-vpex-red/10" : "bg-white/[0.03]"
                }`}>
                  {task.status === "concluída" ? (
                    <CheckCircle2 size={16} className="text-vpex-green" />
                  ) : task.status === "atrasada" ? (
                    <XCircle size={16} className="text-vpex-red" />
                  ) : (
                    <Icon size={16} className="text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium truncate ${task.status === "concluída" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {task.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className={`${status.bg} ${status.color} px-1.5 py-0.5 rounded`}>{status.label}</span>
                    <span className={priority.color}>● {priority.label}</span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={8} />
                      {task.status === "atrasada" ? `${Math.abs(task.daysLeft)}d atrasada` :
                       task.status === "concluída" ? task.deadline :
                       `${task.daysLeft}d restantes`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className={`text-xs font-semibold font-[Sora] ${task.scoreImpact > 0 ? "text-vpex-green" : "text-vpex-red"}`}>
                      {task.scoreImpact > 0 ? "+" : ""}{task.scoreImpact} pts
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-white/5 mt-0">
                      <div className="pt-3 space-y-3">
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Send size={10} className="text-vpex-green" />
                            Enviada por: <strong className="text-foreground">{task.assignedBy}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp size={10} className="text-vpex-green" />
                            Impacto: <strong className={task.scoreImpact > 0 ? "text-vpex-green" : "text-vpex-red"}>{task.scoreImpact > 0 ? "+" : ""}{task.scoreImpact} pts no score</strong>
                          </span>
                        </div>
                        {task.status !== "concluída" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="gap-1.5 text-xs bg-vpex-green hover:bg-vpex-green/90 text-black"
                              onClick={() => toast.success("Tarefa concluída!", { description: `+${task.scoreImpact} pontos adicionados ao seu score.` })}
                            >
                              <CheckCircle2 size={12} /> Marcar como Concluída
                            </Button>
                            {(task.category === "documento" || task.category === "acesso") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs border-white/10 text-muted-foreground hover:text-foreground"
                                onClick={() => toast("Upload", { description: "Funcionalidade disponível quando o backend estiver ativo." })}
                              >
                                <Upload size={12} /> Enviar Arquivo
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
