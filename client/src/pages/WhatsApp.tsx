/**
 * WhatsApp API — Disparos em Massa com Wizard Simplificado
 * Glass Cockpit Design | VPEX Hub
 *
 * Wizard de 3 steps para novo disparo (não-tech friendly).
 * Gestor de listas, histórico de disparos e pedidos à VPEX.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Users,
  Plus,
  ListChecks,
  ArrowUpRight,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  Image,
  Clock,
  Zap,
  Eye,
  Smile,
  AlertCircle,
  Search,
  MoreHorizontal,
  Trash2,
  Copy,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── Data ─── */
const listas = [
  { name: "Clientes Ativos", leads: 842, source: "CRM", lastUsed: "Há 3 dias", selected: false },
  { name: "Leads Black Friday", leads: 1240, source: "Campanha", lastUsed: "Nov 2025", selected: false },
  { name: "Prospects Quentes", leads: 156, source: "Upload Manual", lastUsed: "Hoje", selected: false },
  { name: "Base Reengajamento", leads: 2100, source: "VPEX", lastUsed: "Há 1 semana", selected: false },
  { name: "Novos Cadastros", leads: 320, source: "Landing Page", lastUsed: "Há 2 dias", selected: false },
];

const disparosRecentes = [
  { message: "Promoção Dia das Mães", sent: 842, delivered: 821, read: 634, replied: 89, date: "02/04/2026", status: "concluido" },
  { message: "Lembrete de Agendamento", sent: 156, delivered: 152, read: 128, replied: 42, date: "28/03/2026", status: "concluido" },
  { message: "Pesquisa de Satisfação", sent: 1240, delivered: 1198, read: 890, replied: 234, date: "15/03/2026", status: "concluido" },
  { message: "Reativação de Inativos", sent: 500, delivered: 0, read: 0, replied: 0, date: "05/04/2026", status: "agendado" },
];

const templates = [
  { name: "Promoção Simples", preview: "Olá {{nome}}! 🎉 Temos uma oferta especial para você...", category: "Promoção" },
  { name: "Lembrete de Visita", preview: "Oi {{nome}}, sentimos sua falta! Que tal passar na loja...", category: "Reengajamento" },
  { name: "Pesquisa NPS", preview: "{{nome}}, de 0 a 10, o quanto você recomendaria...", category: "Pesquisa" },
  { name: "Boas-vindas", preview: "Bem-vindo(a) {{nome}}! 🎊 Estamos felizes em ter você...", category: "Onboarding" },
  { name: "Aniversário", preview: "Feliz aniversário, {{nome}}! 🎂 Preparamos um presente...", category: "Relacionamento" },
  { name: "Mensagem Personalizada", preview: "Escreva sua própria mensagem...", category: "Personalizado" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ─── Animated Counter ─── */
function AnimatedNumber({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);
  return <>{display.toLocaleString("pt-BR")}</>;
}

/* ─── Wizard Component ─── */
function DisparoWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [scheduleType, setScheduleType] = useState<"agora" | "agendar">("agora");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const totalLeads = selectedLists.reduce((acc, idx) => acc + listas[idx].leads, 0);

  const toggleList = (idx: number) => {
    setSelectedLists((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const canAdvance = () => {
    if (step === 1) return selectedLists.length > 0;
    if (step === 2) return selectedTemplate !== null;
    return true;
  };

  const handleSend = () => {
    toast.success("Disparo criado com sucesso!", {
      description: scheduleType === "agora"
        ? `${totalLeads.toLocaleString("pt-BR")} mensagens serão enviadas agora.`
        : `Agendado para ${scheduleDate} às ${scheduleTime}.`,
    });
    onClose();
  };

  const steps = [
    { num: 1, label: "Selecionar Lista", icon: Users },
    { num: 2, label: "Criar Mensagem", icon: MessageCircle },
    { num: 3, label: "Revisar e Enviar", icon: Send },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h3 className="text-lg font-bold font-[Sora] text-white">Novo Disparo</h3>
            <p className="text-xs text-white/40 mt-0.5">3 passos simples para enviar sua mensagem</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDone
                          ? "bg-vpex-green text-black"
                          : isActive
                          ? "bg-vpex-green/20 text-vpex-green border border-vpex-green/40"
                          : "bg-white/5 text-white/20 border border-white/10"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${
                        isActive ? "text-vpex-green" : isDone ? "text-white/60" : "text-white/20"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-3">
                      <div className="h-px bg-white/10 relative">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-vpex-green"
                          initial={{ width: "0%" }}
                          animate={{ width: isDone ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Lists */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white font-[Sora]">Para quem você quer enviar?</h4>
                  <p className="text-xs text-white/40 mt-1">Selecione uma ou mais listas de contatos</p>
                </div>
                <div className="space-y-2">
                  {listas.map((lista, i) => {
                    const isSelected = selectedLists.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleList(i)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 text-left ${
                          isSelected
                            ? "border-vpex-green/40 bg-vpex-green/5"
                            : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-vpex-green bg-vpex-green"
                                : "border-white/20"
                            }`}
                          >
                            {isSelected && <CheckCircle2 size={12} className="text-black" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{lista.name}</p>
                            <p className="text-[11px] text-white/30">{lista.source} · {lista.lastUsed}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? "text-vpex-green" : "text-white/50"}`}>
                          {lista.leads.toLocaleString("pt-BR")}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedLists.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-vpex-green/5 border border-vpex-green/15"
                  >
                    <Users size={14} className="text-vpex-green shrink-0" />
                    <span className="text-xs text-white/60">
                      Total: <span className="font-bold text-vpex-green">{totalLeads.toLocaleString("pt-BR")}</span> contatos selecionados
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Create Message */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white font-[Sora]">O que você quer dizer?</h4>
                  <p className="text-xs text-white/40 mt-1">Escolha um modelo pronto ou escreva sua mensagem</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((tmpl, i) => {
                    const isSelected = selectedTemplate === i;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedTemplate(i);
                          if (tmpl.category !== "Personalizado") {
                            setCustomMessage(tmpl.preview);
                          } else {
                            setCustomMessage("");
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                          isSelected
                            ? "border-vpex-green/40 bg-vpex-green/5"
                            : "border-white/5 bg-white/[0.02] hover:border-white/15"
                        }`}
                      >
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? "text-vpex-green" : "text-white/30"}`}>
                          {tmpl.category}
                        </span>
                        <p className={`text-xs mt-1 ${isSelected ? "text-white" : "text-white/50"}`}>
                          {tmpl.name}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {selectedTemplate !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-medium text-white/50">Pré-visualização da mensagem</label>
                    <div className="relative">
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-vpex-green/40 focus:ring-1 focus:ring-vpex-green/15 transition-all resize-none"
                        placeholder="Escreva sua mensagem aqui..."
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => toast("Emoji picker em breve")}
                          className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/5 transition-colors"
                        >
                          <Smile size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast("Upload de imagem em breve")}
                          className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/5 transition-colors"
                        >
                          <Image size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast("Anexar arquivo em breve")}
                          className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/5 transition-colors"
                        >
                          <FileText size={16} />
                        </button>
                        <div className="flex-1" />
                        <span className="text-[11px] text-white/20">{customMessage.length} caracteres</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: Review & Send */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white font-[Sora]">Tudo certo! Revise e envie</h4>
                  <p className="text-xs text-white/40 mt-1">Confira os detalhes antes de disparar</p>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Destinatários</span>
                      <span className="text-sm font-bold text-vpex-green">{totalLeads.toLocaleString("pt-BR")} contatos</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLists.map((idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-vpex-green/10 text-[11px] text-vpex-green border border-vpex-green/20">
                          {listas[idx].name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-white/40">Mensagem</span>
                    <div className="mt-2 p-3 rounded-lg bg-[#0a3a0a]/30 border-l-2 border-vpex-green/40">
                      <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                        {customMessage || "Nenhuma mensagem definida"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <span className="text-xs text-white/40">Quando enviar?</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setScheduleType("agora")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        scheduleType === "agora"
                          ? "border-vpex-green/40 bg-vpex-green/5 text-vpex-green"
                          : "border-white/5 text-white/40 hover:border-white/15"
                      }`}
                    >
                      <Zap size={14} />
                      <span className="text-sm font-medium">Agora</span>
                    </button>
                    <button
                      onClick={() => setScheduleType("agendar")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        scheduleType === "agendar"
                          ? "border-vpex-green/40 bg-vpex-green/5 text-vpex-green"
                          : "border-white/5 text-white/40 hover:border-white/15"
                      }`}
                    >
                      <Clock size={14} />
                      <span className="text-sm font-medium">Agendar</span>
                    </button>
                  </div>
                  {scheduleType === "agendar" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-2 gap-2"
                    >
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-vpex-green/40"
                      />
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-vpex-green/40"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Cost estimate */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-vpex-green/5 border border-vpex-green/15">
                  <AlertCircle size={14} className="text-vpex-green shrink-0" />
                  <span className="text-xs text-white/50">
                    Custo estimado: <span className="font-bold text-vpex-green">R$ {(totalLeads * 0.08).toFixed(2).replace(".", ",")}</span> ({totalLeads.toLocaleString("pt-BR")} msgs × R$ 0,08)
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-white/5">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={14} />
            {step > 1 ? "Voltar" : "Cancelar"}
          </button>
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className="gap-1.5 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold disabled:opacity-30"
            >
              Próximo <ChevronRight size={14} />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              className="gap-1.5 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold"
            >
              <Send size={14} /> {scheduleType === "agora" ? "Enviar Agora" : "Agendar Envio"}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function WhatsApp() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredListas = listas.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-[Sora] text-foreground">WhatsApp API</h2>
            <p className="text-sm text-muted-foreground">Disparos em massa via API Oficial</p>
          </div>
          <Button
            className="gap-2 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold hover:shadow-[0_0_20px_rgba(57,255,20,0.25)] transition-all"
            onClick={() => setWizardOpen(true)}
          >
            <Send size={14} /> Novo Disparo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Mensagens Enviadas", value: 2238, color: "text-vpex-green" },
            { label: "Taxa de Entrega", value: 97.2, suffix: "%", color: "text-foreground" },
            { label: "Taxa de Leitura", value: 74.8, suffix: "%", color: "text-vpex-green" },
            { label: "Taxa de Resposta", value: 18.5, suffix: "%", color: "text-vpex-yellow" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <p className={`text-2xl font-bold font-[Sora] ${stat.color}`}>
                {stat.suffix ? `${stat.value}${stat.suffix}` : <AnimatedNumber value={stat.value} />}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Listas */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2">
              <ListChecks size={16} className="text-vpex-green" /> Minhas Listas
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar lista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-muted/30 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-vpex-green/30 w-40"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-border text-xs"
                onClick={() => toast("Upload de lista em breve")}
              >
                <Upload size={12} /> Importar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-border text-xs"
                onClick={() => toast("Pedido de lista em breve")}
              >
                <ArrowUpRight size={12} /> Pedir à VPEX
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {filteredListas.map((lista, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-vpex-green shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{lista.name}</p>
                    <p className="text-xs text-muted-foreground">{lista.source} · {lista.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{lista.leads.toLocaleString("pt-BR")}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => toast("Duplicar lista em breve")}
                      className="p-1 rounded text-muted-foreground hover:text-foreground"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={() => toast("Excluir lista em breve")}
                      className="p-1 rounded text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disparos Recentes */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2 mb-4">
            <MessageCircle size={16} className="text-vpex-green" /> Disparos Recentes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left pb-3 font-medium">Mensagem</th>
                  <th className="text-center pb-3 font-medium">Enviadas</th>
                  <th className="text-center pb-3 font-medium">Entregues</th>
                  <th className="text-center pb-3 font-medium">Lidas</th>
                  <th className="text-center pb-3 font-medium">Respostas</th>
                  <th className="text-center pb-3 font-medium">Status</th>
                  <th className="text-right pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {disparosRecentes.map((d, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 text-foreground font-medium">{d.message}</td>
                    <td className="py-3 text-center text-muted-foreground">{d.sent.toLocaleString("pt-BR")}</td>
                    <td className="py-3 text-center text-foreground">{d.delivered.toLocaleString("pt-BR")}</td>
                    <td className="py-3 text-center text-vpex-green font-medium">{d.read.toLocaleString("pt-BR")}</td>
                    <td className="py-3 text-center text-vpex-yellow font-medium">{d.replied.toLocaleString("pt-BR")}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        d.status === "concluido"
                          ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/20"
                          : "bg-vpex-yellow/10 text-vpex-yellow border border-vpex-yellow/20"
                      }`}>
                        {d.status === "concluido" ? "Concluído" : "Agendado"}
                      </span>
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{d.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Wizard Modal */}
      <AnimatePresence>
        {wizardOpen && <DisparoWizard onClose={() => setWizardOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
