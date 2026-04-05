/**
 * Pedidos — Solicitação rápida de novos serviços, produtos ou suporte à VPEX
 */
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const pedidos = [
  { title: "Campanha Dia das Mães", type: "Campanha", status: "Em Produção", date: "01/04/2026", priority: "Alta" },
  { title: "Novo Funil de Vendas", type: "Automação", status: "Aguardando Aprovação", date: "28/03/2026", priority: "Média" },
  { title: "Criativos para Instagram", type: "Design", status: "Concluído", date: "20/03/2026", priority: "Normal" },
  { title: "Integração com ERP", type: "Tecnologia", status: "Em Análise", date: "15/03/2026", priority: "Alta" },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  "Em Produção": { icon: Clock, color: "text-vpex-yellow", bg: "bg-vpex-yellow/10" },
  "Aguardando Aprovação": { icon: AlertCircle, color: "text-vpex-yellow", bg: "bg-vpex-yellow/10" },
  "Concluído": { icon: CheckCircle2, color: "text-vpex-green", bg: "bg-vpex-green/10" },
  "Em Análise": { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Pedidos() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Área de Pedidos</h2>
          <p className="text-sm text-muted-foreground">Solicite serviços e acompanhe o andamento</p>
        </div>
        <Button
          className="gap-2 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold"
          onClick={() => toast("Novo pedido em breve", { description: "Esta funcionalidade será ativada em breve." })}
        >
          <Plus size={14} /> Novo Pedido
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-vpex-yellow">3</p>
          <p className="text-xs text-muted-foreground mt-1">Em Andamento</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-vpex-green">18</p>
          <p className="text-xs text-muted-foreground mt-1">Concluídos</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-[Sora] text-foreground">21</p>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </div>
      </motion.div>

      {/* Pedidos List */}
      <motion.div variants={fadeUp} className="space-y-3">
        {pedidos.map((pedido, i) => {
          const config = statusConfig[pedido.status] || statusConfig["Em Análise"];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-2.5 rounded-lg bg-muted shrink-0">
                  <Package size={20} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{pedido.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{pedido.type}</span>
                    <span className="text-[10px] text-muted-foreground">{pedido.date}</span>
                    {pedido.priority === "Alta" && (
                      <span className="text-[10px] text-vpex-red bg-vpex-red/10 px-2 py-0.5 rounded-full font-medium">Prioridade Alta</span>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} shrink-0`}>
                <StatusIcon size={12} className={config.color} />
                <span className={`text-xs font-medium ${config.color}`}>{pedido.status}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
