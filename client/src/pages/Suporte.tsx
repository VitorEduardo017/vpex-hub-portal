/**
 * Suporte — Chat direto com a VPEX
 * Glass Cockpit Design | VPEX Hub
 */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  MessageCircle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Phone,
  Mail,
  Headphones,
  Bot,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── Data ─── */
interface Message {
  id: number;
  text: string;
  sender: "user" | "vpex" | "bot";
  time: string;
  read: boolean;
}

const initialMessages: Message[] = [
  { id: 1, text: "Olá! Bem-vindo ao suporte VPEX. Como posso ajudar?", sender: "bot", time: "09:00", read: true },
  { id: 2, text: "Preciso de ajuda com a configuração da campanha no Meta Ads", sender: "user", time: "09:02", read: true },
  { id: 3, text: "Claro! Vou transferir você para nosso especialista em tráfego pago. Um momento.", sender: "bot", time: "09:02", read: true },
  { id: 4, text: "Oi! Sou o Lucas, gestor de tráfego da VPEX. Vi que precisa de ajuda com Meta Ads. Pode me dar mais detalhes sobre a campanha?", sender: "vpex", time: "09:05", read: true },
];

const quickActions = [
  { label: "Dúvida sobre relatório", icon: HelpCircle },
  { label: "Problema técnico", icon: Headphones },
  { label: "Solicitar reunião", icon: Phone },
  { label: "Enviar documento", icon: Mail },
];

const tickets = [
  { id: "#2847", subject: "Ajuste na campanha Black Friday", status: "Em andamento", time: "Há 2h", priority: "alta" },
  { id: "#2843", subject: "Atualização do relatório mensal", status: "Resolvido", time: "Ontem", priority: "média" },
  { id: "#2839", subject: "Integração com WhatsApp API", status: "Resolvido", time: "3 dias", priority: "alta" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Suporte() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages([...messages, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Recebi sua mensagem! Nosso time vai analisar e responder em breve. Tempo médio de resposta: 15 minutos.",
          sender: "vpex",
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          read: false,
        },
      ]);
    }, 2000);
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Suporte VPEX</h2>
          <p className="text-sm text-muted-foreground">Fale diretamente com nosso time</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-vpex-green/5 border border-vpex-green/15">
          <motion.div
            className="w-2 h-2 rounded-full bg-vpex-green"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-vpex-green font-medium">Time online</span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chat Area */}
        <div className="lg:col-span-2 glass-card flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-vpex-green/10 border border-vpex-green/20 flex items-center justify-center">
              <Headphones size={14} className="text-vpex-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground font-[Sora]">Suporte VPEX</p>
              <p className="text-[10px] text-vpex-green">Online · Resposta em ~15min</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-end gap-2 max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === "user" ? "bg-vpex-green/10" : msg.sender === "bot" ? "bg-white/5" : "bg-blue-500/10"
                  }`}>
                    {msg.sender === "user" ? <User size={12} className="text-vpex-green" /> :
                     msg.sender === "bot" ? <Bot size={12} className="text-muted-foreground" /> :
                     <Headphones size={12} className="text-blue-400" />}
                  </div>
                  <div className={`rounded-xl px-3.5 py-2.5 ${
                    msg.sender === "user"
                      ? "bg-vpex-green/10 border border-vpex-green/15 text-foreground"
                      : "bg-white/[0.03] border border-white/5 text-foreground"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      {msg.time}
                      {msg.sender === "user" && msg.read && <CheckCircle2 size={8} className="text-vpex-green" />}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Headphones size={12} className="text-blue-400" />
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => setInput(action.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-xs text-muted-foreground hover:text-vpex-green hover:border-vpex-green/20 transition-colors whitespace-nowrap shrink-0"
                >
                  <Icon size={12} /> {action.label}
                </button>
              );
            })}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground"
                onClick={() => toast("Anexar arquivo", { description: "Funcionalidade disponível quando o backend estiver ativo." })}
              >
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-vpex-green/30"
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-vpex-green hover:bg-vpex-green/90 text-black font-medium px-4"
              >
                <Send size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar — Tickets */}
        <div className="glass-card p-5 h-[600px] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4 flex items-center gap-2">
            <MessageCircle size={14} className="text-vpex-green" />
            Meus Chamados
          </h3>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {tickets.map((ticket, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-vpex-green/15 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground">{ticket.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    ticket.status === "Resolvido"
                      ? "bg-vpex-green/10 text-vpex-green"
                      : "bg-vpex-yellow/10 text-vpex-yellow"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground mb-1 group-hover:text-vpex-green transition-colors">{ticket.subject}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock size={8} /> {ticket.time}
                  </span>
                  <ChevronRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Outros canais</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone size={12} className="text-vpex-green" />
              <span>(62) 99999-9999</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail size={12} className="text-vpex-green" />
              <span>suporte@vpex.com.br</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} className="text-vpex-green" />
              <span>Seg-Sex · 8h às 18h</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
