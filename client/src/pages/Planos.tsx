/**
 * Planos e Serviços — Central de Assinatura e Upsell
 * Glass Cockpit Design | VPEX Hub
 *
 * Mostra plano atual, serviços contratados, add-ons disponíveis e comparativo de planos.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  CheckCircle2,
  X,
  Zap,
  Shield,
  Rocket,
  Star,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Package,
  MessageCircle,
  BarChart3,
  Brain,
  Users,
  Megaphone,
  Truck,
  GraduationCap,
  Plug,
  Clock,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
interface ServiceItem {
  name: string;
  description: string;
  icon: React.ElementType;
  status: "active" | "addon" | "locked";
  usagePercent?: number;
  usageLabel?: string;
  price?: string;
}

interface PlanTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ElementType;
  color: string;
  popular?: boolean;
  current?: boolean;
  features: { text: string; included: boolean }[];
}

/* ─── Data ─── */
const currentPlan = {
  name: "Scale",
  renewDate: "05/05/2026",
  startDate: "05/11/2025",
  monthlyPrice: "R$ 2.490",
  status: "Ativo",
  daysRemaining: 30,
};

const activeServices: ServiceItem[] = [
  {
    name: "Gestão de Tráfego Pago",
    description: "Meta Ads + Google Ads — campanhas ativas e otimizadas",
    icon: Megaphone,
    status: "active",
    usagePercent: 85,
    usageLabel: "R$ 4.250 / R$ 5.000 de budget gerenciado",
  },
  {
    name: "CRM & Automações",
    description: "Funis de vendas, follow-up automático e lead scoring",
    icon: Users,
    status: "active",
    usagePercent: 62,
    usageLabel: "1.247 / 2.000 contatos ativos",
  },
  {
    name: "WhatsApp API Oficial",
    description: "Disparos em massa, chatbot e atendimento automatizado",
    icon: MessageCircle,
    status: "active",
    usagePercent: 45,
    usageLabel: "4.500 / 10.000 mensagens este mês",
  },
  {
    name: "Relatórios & BI",
    description: "Dashboards em tempo real e relatórios semanais",
    icon: BarChart3,
    status: "active",
    usagePercent: 100,
    usageLabel: "Acesso ilimitado",
  },
  {
    name: "VPEX Academy",
    description: "Treinamentos para equipe e processos documentados",
    icon: GraduationCap,
    status: "active",
    usagePercent: 78,
    usageLabel: "14 / 18 módulos concluídos",
  },
  {
    name: "Integrações Básicas",
    description: "Meta, Google, SendPulse e ERP conectados",
    icon: Plug,
    status: "active",
    usagePercent: 60,
    usageLabel: "6 / 10 integrações ativas",
  },
];

const addonServices: ServiceItem[] = [
  {
    name: "Inteligência Artificial Avançada",
    description: "Previsões de demanda, análise preditiva e recomendações automáticas",
    icon: Brain,
    status: "addon",
    price: "R$ 490/mês",
  },
  {
    name: "Gestão de Logística",
    description: "Rastreamento de entregas, otimização de rotas e gestão de estoque avançada",
    icon: Truck,
    status: "addon",
    price: "R$ 390/mês",
  },
  {
    name: "Consultoria Estratégica",
    description: "Reuniões semanais com estrategista VPEX dedicado ao seu negócio",
    icon: TrendingUp,
    status: "addon",
    price: "R$ 890/mês",
  },
  {
    name: "Criação de Conteúdo",
    description: "Posts, stories, reels e materiais gráficos profissionais",
    icon: Star,
    status: "addon",
    price: "R$ 690/mês",
  },
];

const planTiers: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 990",
    period: "/mês",
    description: "Para quem está começando a estruturar o digital",
    icon: Zap,
    color: "#60A5FA",
    features: [
      { text: "Gestão de 1 canal de tráfego", included: true },
      { text: "CRM básico (até 500 contatos)", included: true },
      { text: "Relatórios mensais", included: true },
      { text: "WhatsApp API (3.000 msg/mês)", included: true },
      { text: "VPEX Academy (módulos básicos)", included: true },
      { text: "Integrações avançadas", included: false },
      { text: "Inteligência de Dados", included: false },
      { text: "Crescimento Gamificado", included: false },
      { text: "Consultoria estratégica", included: false },
      { text: "Suporte prioritário 24/7", included: false },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: "R$ 2.490",
    period: "/mês",
    description: "Para quem quer escalar com dados e automação",
    icon: Rocket,
    color: "#39FF14",
    popular: true,
    current: true,
    features: [
      { text: "Gestão multi-canal (Meta + Google)", included: true },
      { text: "CRM completo (até 2.000 contatos)", included: true },
      { text: "Relatórios semanais + BI", included: true },
      { text: "WhatsApp API (10.000 msg/mês)", included: true },
      { text: "VPEX Academy completa", included: true },
      { text: "Integrações avançadas", included: true },
      { text: "Inteligência de Dados", included: true },
      { text: "Crescimento Gamificado", included: true },
      { text: "Consultoria estratégica", included: false },
      { text: "Suporte prioritário 24/7", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "R$ 4.990",
    period: "/mês",
    description: "Para operações multi-unidade e alta performance",
    icon: Crown,
    color: "#FBBF24",
    features: [
      { text: "Gestão multi-canal ilimitada", included: true },
      { text: "CRM ilimitado + lead scoring IA", included: true },
      { text: "Relatórios em tempo real + BI Pro", included: true },
      { text: "WhatsApp API ilimitado", included: true },
      { text: "VPEX Academy + treinamentos custom", included: true },
      { text: "Integrações ilimitadas", included: true },
      { text: "Inteligência de Dados + IA preditiva", included: true },
      { text: "Crescimento Gamificado + mentoria", included: true },
      { text: "Consultoria estratégica semanal", included: true },
      { text: "Suporte prioritário 24/7", included: true },
    ],
  },
];

/* ─── Helpers ─── */
function getUsageColor(percent: number) {
  if (percent >= 90) return "bg-vpex-red";
  if (percent >= 70) return "bg-vpex-yellow";
  return "bg-vpex-green";
}

function getUsageTextColor(percent: number) {
  if (percent >= 90) return "text-vpex-red";
  if (percent >= 70) return "text-vpex-yellow";
  return "text-vpex-green";
}

/* ─── Component ─── */
export default function Planos() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">Planos & Serviços</h2>
        <p className="text-sm text-muted-foreground mt-1">Gerencie sua assinatura e descubra como escalar ainda mais</p>
      </div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-vpex-green/20 bg-gradient-to-br from-vpex-green/5 via-card to-card"
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-vpex-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Plan Info */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-vpex-green/10 border-2 border-vpex-green/30 flex items-center justify-center vpex-glow"
              >
                <Rocket size={24} className="text-vpex-green" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-[Sora] text-foreground">Plano {currentPlan.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-vpex-green/10 border border-vpex-green/20 text-[10px] font-medium text-vpex-green">
                    {currentPlan.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Assinatura desde {currentPlan.startDate}
                </p>
              </div>
            </div>

            {/* Price & Renewal */}
            <div className="text-right">
              <p className="text-2xl font-bold font-[Sora] text-vpex-green">{currentPlan.monthlyPrice}<span className="text-sm text-muted-foreground font-normal">/mês</span></p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <Calendar size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Renova em {currentPlan.renewDate}</span>
                <span className="text-[10px] text-vpex-yellow font-medium ml-1">({currentPlan.daysRemaining} dias)</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={() => toast("Fatura disponível", { description: "Sua última fatura foi enviada por e-mail." })}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
            >
              <CreditCard size={14} />
              Ver Faturas
            </button>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vpex-green/10 border border-vpex-green/20 text-xs font-medium text-vpex-green hover:bg-vpex-green hover:text-black transition-all"
            >
              <ArrowUpRight size={14} />
              {showComparison ? "Ocultar Planos" : "Comparar Planos"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Plan Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planTiers.map((plan, i) => {
                const Icon = plan.icon;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`relative glass-card p-5 flex flex-col ${
                      plan.current
                        ? "border-vpex-green/30 shadow-[0_0_20px_rgba(57,255,20,0.08)]"
                        : "border-border"
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-vpex-green text-black text-[10px] font-bold uppercase tracking-wider">
                          Seu Plano
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-4 pt-2">
                      <div
                        className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${plan.color}15`, border: `1px solid ${plan.color}30` }}
                      >
                        <Icon size={22} style={{ color: plan.color }} />
                      </div>
                      <h4 className="text-lg font-bold font-[Sora] text-foreground">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold font-[Sora]" style={{ color: plan.color }}>{plan.price}</span>
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-2 mb-4">
                      {plan.features.map((feature, fi) => (
                        <div key={fi} className="flex items-start gap-2">
                          {feature.included ? (
                            <CheckCircle2 size={14} className="text-vpex-green shrink-0 mt-0.5" />
                          ) : (
                            <X size={14} className="text-muted-foreground/40 shrink-0 mt-0.5" />
                          )}
                          <span className={`text-xs ${feature.included ? "text-foreground" : "text-muted-foreground/50"}`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {plan.current ? (
                      <div className="text-center py-2.5 rounded-lg bg-vpex-green/10 border border-vpex-green/20 text-xs font-medium text-vpex-green">
                        Plano Atual
                      </div>
                    ) : (
                      <button
                        onClick={() => toast("Upgrade solicitado", { description: `Entraremos em contato para migrar para o plano ${plan.name}.` })}
                        className="w-full py-2.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: `${plan.color}15`,
                          border: `1px solid ${plan.color}30`,
                          color: plan.color,
                        }}
                      >
                        {plan.id === "starter" ? "Fazer Downgrade" : "Fazer Upgrade"}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-[Sora] text-foreground flex items-center gap-2">
            <Package size={18} className="text-vpex-green" />
            Serviços Ativos
          </h3>
          <span className="text-xs text-muted-foreground">{activeServices.length} serviços inclusos no seu plano</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="glass-card p-4 group hover:border-vpex-green/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vpex-green/10 border border-vpex-green/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-vpex-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{service.name}</h4>
                      <CheckCircle2 size={12} className="text-vpex-green shrink-0" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{service.description}</p>

                    {/* Usage Bar */}
                    {service.usagePercent !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground">{service.usageLabel}</span>
                          <span className={`text-[10px] font-medium ${getUsageTextColor(service.usagePercent)}`}>
                            {service.usagePercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(service.usagePercent, 100)}%` }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${getUsageColor(service.usagePercent)}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add-on Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-[Sora] text-foreground flex items-center gap-2">
            <Sparkles size={18} className="text-vpex-yellow" />
            Potencialize seu Plano
          </h3>
          <span className="text-xs text-muted-foreground">Add-ons disponíveis para o plano {currentPlan.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addonServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.2, duration: 0.35 }}
                className="glass-card p-4 border-dashed group hover:border-vpex-yellow/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vpex-yellow/10 border border-vpex-yellow/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-vpex-yellow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{service.name}</h4>
                      <span className="text-xs font-bold text-vpex-yellow shrink-0">{service.price}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{service.description}</p>

                    <button
                      onClick={() => toast("Solicitação enviada", { description: `Entraremos em contato para ativar ${service.name}.` })}
                      className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vpex-yellow/10 border border-vpex-yellow/20 text-[10px] font-medium text-vpex-yellow hover:bg-vpex-yellow hover:text-black transition-all"
                    >
                      <Zap size={10} />
                      Adicionar ao Plano
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
          <Clock size={14} className="text-muted-foreground" />
          Histórico de Faturas
        </h3>
        <div className="space-y-2">
          {[
            { date: "05/03/2026", value: "R$ 2.490,00", status: "Pago", method: "Cartão •••• 4832" },
            { date: "05/02/2026", value: "R$ 2.490,00", status: "Pago", method: "Cartão •••• 4832" },
            { date: "05/01/2026", value: "R$ 2.490,00", status: "Pago", method: "Cartão •••• 4832" },
            { date: "05/12/2025", value: "R$ 2.490,00", status: "Pago", method: "Pix" },
            { date: "05/11/2025", value: "R$ 2.490,00", status: "Pago", method: "Pix" },
          ].map((invoice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border hover:border-vpex-green/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-vpex-green/10 flex items-center justify-center">
                  <CreditCard size={14} className="text-vpex-green" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{invoice.value}</p>
                  <p className="text-[10px] text-muted-foreground">{invoice.date} — {invoice.method}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-vpex-green/10 border border-vpex-green/20 text-[9px] font-medium text-vpex-green">
                  {invoice.status}
                </span>
                <button
                  onClick={() => toast("Download iniciado", { description: "Sua fatura está sendo baixada." })}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 text-center border-dashed"
      >
        <Shield size={28} className="mx-auto text-vpex-green mb-3" />
        <h4 className="text-sm font-semibold font-[Sora] text-foreground">Precisa de algo personalizado?</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          Montamos planos sob medida para operações com necessidades específicas. Fale com nosso time comercial.
        </p>
        <button
          onClick={() => toast("Contato solicitado", { description: "Um consultor VPEX entrará em contato em até 24h." })}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-vpex-green text-black text-xs font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all"
        >
          <MessageCircle size={14} />
          Falar com Consultor
        </button>
      </motion.div>
    </div>
  );
}
