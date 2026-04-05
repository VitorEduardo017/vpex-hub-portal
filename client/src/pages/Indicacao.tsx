/**
 * Indicação — Programa de Indicação VPEX
 * Link único, créditos, regras e histórico.
 * Glass Cockpit Design | VPEX Hub
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Copy,
  CheckCircle2,
  Users,
  DollarSign,
  Clock,
  Share2,
  TrendingUp,
  Shield,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── Data ─── */
const referralLink = "https://vpex.com.br/indicar/FRANQ-2847";

const creditBalance = 450;
const creditLimit = 500;

const benefitTable = [
  {
    type: "Contratos de Serviço",
    tag: "High Ticket",
    benefit: "1 mensalidade grátis",
    detail: "Aplicada no mês 3 ou 4 (após fidelidade mínima)",
    activation: "2ª cobrança do indicado confirmada",
    limit: "2 indicações/mês",
    color: "text-vpex-green",
    bgColor: "bg-vpex-green/10",
  },
  {
    type: "Projetos Pontuais",
    tag: "Projeto Único",
    benefit: "10% de crédito",
    detail: "Sobre o valor do projeto do indicado — usado em futuras contratações",
    activation: "50% de entrada paga pelo indicado",
    limit: "Validade: 6 meses",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    type: "Ferramentas / Cursos",
    tag: "Produto Digital",
    benefit: "15% do valor em crédito",
    detail: "Crédito em conta ou desconto direto na renovação",
    activation: "Compra realizada pelo indicado",
    limit: "Acumula até R$ 500",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
];

const rules = [
  { text: "Crédito não é transferível — fica vinculado ao seu CPF/CNPJ", allowed: true },
  { text: "Indicação não se aplica a leads já em prospecção ativa (janela de 30 dias)", allowed: true },
  { text: "Cliente indicado precisa ser novo — nunca ter tido contrato com a VPEX", allowed: true },
  { text: "Crédito caduca se você cancelar o próprio contrato antes de usar", allowed: true },
  { text: "Sem cashback em dinheiro vivo — apenas crédito em serviços VPEX", allowed: false },
  { text: "Sem stacking — não acumula com outras promoções ou descontos", allowed: false },
];

const referralHistory = [
  { name: "Carlos M.", type: "Contrato", value: "R$ 1.500", status: "Crédito ativo", date: "15/03/2026", credit: "1 mensalidade" },
  { name: "Ana P.", type: "Projeto", value: "R$ 3.000", status: "Aguardando pagamento", date: "22/03/2026", credit: "R$ 300" },
  { name: "Roberto S.", type: "Curso", value: "R$ 297", status: "Crédito ativo", date: "01/04/2026", credit: "R$ 44,55" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Indicacao() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copiado!", { description: "Compartilhe com quem pode se beneficiar da VPEX." });
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Programa de Indicação</h2>
          <p className="text-sm text-muted-foreground">Indique e ganhe créditos nos seus serviços VPEX</p>
        </div>
      </motion.div>

      {/* Hero Card — Link + Créditos */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Link de Indicação */}
        <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-vpex-green/[0.04] rounded-full blur-[60px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={18} className="text-vpex-green" />
              <span className="text-sm font-semibold text-foreground font-[Sora]">Seu Link Exclusivo</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Compartilhe este link. Quando o indicado fechar contrato e pagar, você ganha crédito automaticamente.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground font-mono truncate">
                {referralLink}
              </div>
              <Button
                onClick={copyLink}
                className={`shrink-0 gap-2 ${copied ? "bg-vpex-green text-black" : "bg-vpex-green/10 text-vpex-green border border-vpex-green/20 hover:bg-vpex-green/20"}`}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs border-white/10 text-muted-foreground hover:text-vpex-green hover:border-vpex-green/20"
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(`Conheça a VPEX Solutions! ${referralLink}`)}`, "_blank");
                }}
              >
                <Share2 size={12} /> WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs border-white/10 text-muted-foreground hover:text-vpex-green hover:border-vpex-green/20"
                onClick={() => toast("Compartilhar", { description: "Link pronto para compartilhar nas redes sociais." })}
              >
                <ExternalLink size={12} /> Redes Sociais
              </Button>
            </div>
          </div>
        </div>

        {/* Créditos Acumulados */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-vpex-green" />
              <span className="text-sm font-semibold text-foreground font-[Sora]">Seus Créditos</span>
            </div>
            <p className="text-3xl font-bold font-[Sora] text-vpex-green vpex-text-glow mb-1">R$ {creditBalance}</p>
            <p className="text-xs text-muted-foreground mb-3">de R$ {creditLimit} (teto acumulável)</p>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(creditBalance / creditLimit) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-vpex-green rounded-full"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp size={12} className="text-vpex-green" />
            <span>3 indicações realizadas</span>
          </div>
        </div>
      </motion.div>

      {/* Tabela de Benefícios */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-3 flex items-center gap-2">
          <Gift size={14} className="text-vpex-green" />
          Como Funciona
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {benefitTable.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.bgColor} ${item.color}`}>
                  {item.tag}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground font-[Sora] mb-1">{item.type}</h4>
              <p className={`text-lg font-bold font-[Sora] ${item.color} mb-2`}>{item.benefit}</p>
              <p className="text-xs text-muted-foreground mb-3">{item.detail}</p>
              <div className="space-y-1.5 text-[10px] text-muted-foreground">
                <div className="flex items-start gap-1.5">
                  <Clock size={10} className="mt-0.5 shrink-0 text-vpex-green" />
                  <span><strong className="text-foreground">Ativa quando:</strong> {item.activation}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Shield size={10} className="mt-0.5 shrink-0 text-vpex-yellow" />
                  <span><strong className="text-foreground">Limite:</strong> {item.limit}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Regras de Proteção */}
      <motion.div variants={fadeUp} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-3 flex items-center gap-2">
          <Shield size={14} className="text-vpex-green" />
          Regras do Programa
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              {rule.allowed ? (
                <CheckCircle2 size={14} className="text-vpex-green shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={14} className="text-vpex-red shrink-0 mt-0.5" />
              )}
              <span className="text-muted-foreground">{rule.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Histórico de Indicações */}
      <motion.div variants={fadeUp} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground font-[Sora] mb-4 flex items-center gap-2">
          <Users size={14} className="text-vpex-green" />
          Histórico de Indicações
        </h3>
        <div className="space-y-2">
          {referralHistory.map((ref, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-vpex-green/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vpex-green/10 border border-vpex-green/20 flex items-center justify-center">
                  <Users size={14} className="text-vpex-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{ref.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ref.type} · {ref.value} · {ref.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-vpex-green font-[Sora]">{ref.credit}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  ref.status === "Crédito ativo" ? "bg-vpex-green/10 text-vpex-green" : "bg-vpex-yellow/10 text-vpex-yellow"
                }`}>
                  {ref.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
