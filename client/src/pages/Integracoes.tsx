/**
 * Integrações — Central de Conexões
 * Glass Cockpit Design | VPEX Hub
 * Mostra plataformas ativas vs. disponíveis para integração.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  Check,
  ArrowRight,
  Search,
  RefreshCw,
  AlertTriangle,
  Zap,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

type IntegrationStatus = "connected" | "available" | "error";
type IntegrationCategory = "marketing" | "financeiro" | "automacao" | "crm" | "ecommerce" | "ia";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  icon: string;
  lastSync?: string;
  color: string;
}

const integrations: Integration[] = [
  // Marketing
  { id: "meta", name: "Meta Ads", description: "Facebook & Instagram Ads", category: "marketing", status: "connected", icon: "📘", lastSync: "Há 2 min", color: "#1877F2" },
  { id: "google", name: "Google Ads", description: "Search, Display & YouTube", category: "marketing", status: "connected", icon: "🔍", lastSync: "Há 5 min", color: "#4285F4" },
  { id: "tiktok", name: "TikTok Ads", description: "Anúncios no TikTok", category: "marketing", status: "available", icon: "🎵", color: "#000000" },
  { id: "analytics", name: "Google Analytics", description: "Métricas do site e landing pages", category: "marketing", status: "connected", icon: "📊", lastSync: "Há 10 min", color: "#E37400" },
  // Financeiro
  { id: "btg", name: "BTG Pactual", description: "Conta digital e extrato", category: "financeiro", status: "connected", icon: "🏦", lastSync: "Há 1h", color: "#003B71" },
  { id: "mercadopago", name: "Mercado Pago", description: "Pagamentos e cobranças", category: "financeiro", status: "available", icon: "💳", color: "#009EE3" },
  { id: "stone", name: "Stone", description: "Maquininha e conciliação", category: "financeiro", status: "available", icon: "💚", color: "#00A868" },
  { id: "nfe", name: "Nota Fiscal", description: "Emissão automática de NF-e", category: "financeiro", status: "available", icon: "🧾", color: "#6B7280" },
  // Automação
  { id: "sendpulse", name: "SendPulse", description: "WhatsApp API Oficial", category: "automacao", status: "connected", icon: "💬", lastSync: "Há 3 min", color: "#2FC86E" },
  { id: "n8n", name: "n8n", description: "Automações e workflows", category: "automacao", status: "connected", icon: "⚡", lastSync: "Ativo", color: "#FF6D5A" },
  { id: "zapier", name: "Zapier", description: "Conectar +5000 apps", category: "automacao", status: "available", icon: "🔗", color: "#FF4A00" },
  { id: "make", name: "Make (Integromat)", description: "Automações visuais", category: "automacao", status: "available", icon: "🔄", color: "#6D00CC" },
  // CRM
  { id: "rdstation", name: "RD Station", description: "CRM e funil de vendas", category: "crm", status: "available", icon: "🎯", color: "#0066FF" },
  { id: "hubspot", name: "HubSpot", description: "CRM completo", category: "crm", status: "available", icon: "🟠", color: "#FF7A59" },
  { id: "pipedrive", name: "Pipedrive", description: "Gestão de pipeline", category: "crm", status: "available", icon: "🟢", color: "#017737" },
  // E-commerce
  { id: "shopify", name: "Shopify", description: "Loja virtual", category: "ecommerce", status: "available", icon: "🛒", color: "#96BF48" },
  { id: "mercadolivre", name: "Mercado Livre", description: "Marketplace", category: "ecommerce", status: "available", icon: "🤝", color: "#FFE600" },
  { id: "nuvemshop", name: "Nuvemshop", description: "E-commerce brasileiro", category: "ecommerce", status: "available", icon: "☁️", color: "#2B35AF" },
  // IA
  { id: "openai", name: "OpenAI / ChatGPT", description: "IA para atendimento e análise", category: "ia", status: "available", icon: "🤖", color: "#10A37F" },
  { id: "gemini", name: "Google Gemini", description: "IA generativa do Google", category: "ia", status: "available", icon: "✨", color: "#4285F4" },
];

const categoryLabels: Record<IntegrationCategory, string> = {
  marketing: "Marketing & Tráfego",
  financeiro: "Financeiro & Pagamentos",
  automacao: "Automação & Workflows",
  crm: "CRM & Vendas",
  ecommerce: "E-commerce & Marketplace",
  ia: "Inteligência Artificial",
};

const categoryOrder: IntegrationCategory[] = ["marketing", "financeiro", "automacao", "crm", "ecommerce", "ia"];

export default function Integracoes() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "connected" | "available">("all");

  const filtered = integrations.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const availableCount = integrations.filter((i) => i.status === "available").length;

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      items: filtered.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[Sora]">Integrações</h2>
          <p className="text-sm text-muted-foreground mt-1">Conecte suas ferramentas e centralize tudo</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-vpex-green font-[Sora]">{connectedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Conectadas</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground font-[Sora]">{availableCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Disponíveis</p>
        </div>
        <div className="glass-card p-4 text-center hidden sm:block">
          <p className="text-2xl font-bold text-foreground font-[Sora]">{integrations.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar integração..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "connected", "available"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s
                  ? "bg-vpex-green text-black"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30"
              }`}
            >
              {s === "all" ? "Todas" : s === "connected" ? "Conectadas" : "Disponíveis"}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Integrations */}
      <div className="space-y-8">
        {grouped.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-[Sora]">
              {group.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {group.items.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Search size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhuma integração encontrada</p>
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const isConnected = integration.status === "connected";
  const isError = integration.status === "error";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card p-4 flex items-start gap-3 group ${
        isConnected ? "border-vpex-green/20" : ""
      }`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-lg shrink-0">
        {integration.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground truncate">{integration.name}</h4>
          {isConnected && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-vpex-green/10 border border-vpex-green/20">
              <Check size={10} className="text-vpex-green" />
              <span className="text-[10px] text-vpex-green font-medium">Ativa</span>
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-vpex-red/10 border border-vpex-red/20">
              <AlertTriangle size={10} className="text-vpex-red" />
              <span className="text-[10px] text-vpex-red font-medium">Erro</span>
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{integration.description}</p>
        {isConnected && integration.lastSync && (
          <p className="text-[10px] text-vpex-green/70 mt-1 flex items-center gap-1">
            <RefreshCw size={9} />
            Sincronizado: {integration.lastSync}
          </p>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {isConnected ? (
          <button
            onClick={() => toast("Configurações da integração", { description: `Gerenciar ${integration.name}` })}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <ExternalLink size={14} />
          </button>
        ) : (
          <button
            onClick={() => toast("Integração solicitada", { description: `A VPEX irá configurar ${integration.name} para você.` })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-vpex-green/10 text-vpex-green border border-vpex-green/20 hover:bg-vpex-green hover:text-black transition-all"
          >
            <Zap size={12} />
            Conectar
          </button>
        )}
      </div>
    </motion.div>
  );
}
