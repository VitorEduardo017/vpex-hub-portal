/**
 * WhatsApp API — Disparos em Massa, Gestor de Listas e Pedidos de Leads
 */
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Users,
  Plus,
  ListChecks,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const listas = [
  { name: "Clientes Ativos", leads: 842, source: "CRM", lastUsed: "Há 3 dias" },
  { name: "Leads Black Friday", leads: 1.240, source: "Campanha", lastUsed: "Nov 2025" },
  { name: "Prospects Quentes", leads: 156, source: "Upload Manual", lastUsed: "Hoje" },
  { name: "Base Reengajamento", leads: 2.100, source: "VPEX", lastUsed: "Há 1 semana" },
];

const disparosRecentes = [
  { message: "Promoção Dia das Mães", sent: 842, delivered: 821, read: 634, date: "02/04/2026" },
  { message: "Lembrete de Agendamento", sent: 156, delivered: 152, read: 128, date: "28/03/2026" },
  { message: "Pesquisa de Satisfação", sent: 1240, delivered: 1198, read: 890, date: "15/03/2026" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function WhatsApp() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">WhatsApp API</h2>
          <p className="text-sm text-muted-foreground">Disparos em massa via API Oficial</p>
        </div>
        <Button
          className="gap-2 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold"
          onClick={() => toast("Novo disparo em breve", { description: "Esta funcionalidade será ativada em breve." })}
        >
          <Send size={14} /> Novo Disparo
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-vpex-green">2.238</p>
          <p className="text-xs text-muted-foreground mt-1">Mensagens Enviadas</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-foreground">97,2%</p>
          <p className="text-xs text-muted-foreground mt-1">Taxa de Entrega</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-vpex-green">74,8%</p>
          <p className="text-xs text-muted-foreground mt-1">Taxa de Leitura</p>
        </div>
      </motion.div>

      {/* Listas */}
      <motion.div variants={fadeUp} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground font-[Sora] flex items-center gap-2">
            <ListChecks size={16} className="text-vpex-green" /> Minhas Listas
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border text-xs"
              onClick={() => toast("Upload de lista em breve")}
            >
              <Plus size={12} /> Importar Lista
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
          {listas.map((lista, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-vpex-green shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{lista.name}</p>
                  <p className="text-xs text-muted-foreground">{lista.source} · {lista.lastUsed}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">{lista.leads.toLocaleString("pt-BR")}</span>
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
                <th className="text-right pb-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {disparosRecentes.map((d, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-foreground font-medium">{d.message}</td>
                  <td className="py-3 text-center text-muted-foreground">{d.sent.toLocaleString("pt-BR")}</td>
                  <td className="py-3 text-center text-foreground">{d.delivered.toLocaleString("pt-BR")}</td>
                  <td className="py-3 text-center text-vpex-green font-medium">{d.read.toLocaleString("pt-BR")}</td>
                  <td className="py-3 text-right text-muted-foreground">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
