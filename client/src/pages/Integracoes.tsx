/**
 * Integrações — Central de Conexões + Fontes de Dados
 * Glass Cockpit Design | VPEX Hub
 * Plataformas ativas/disponíveis + opções de banco de dados, API, Webhook, Sheets, Excel.
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
  Database,
  Globe,
  Webhook,
  FileSpreadsheet,
  Table2,
  Plus,
  X,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Link2,
  Server,
  Cloud,
  Upload,
  CheckCircle2,
  Clock,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

type IntegrationStatus = "connected" | "available" | "error";
type IntegrationCategory = "marketing" | "financeiro" | "automacao" | "crm" | "ecommerce" | "ia";
type DataSourceType = "api" | "webhook" | "sheets" | "excel" | "database";
type DataSourceStatus = "active" | "inactive" | "error" | "syncing";

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

interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  lastSync?: string;
  records?: number;
  url?: string;
}

const integrations: Integration[] = [
  { id: "meta", name: "Meta Ads", description: "Facebook & Instagram Ads", category: "marketing", status: "connected", icon: "📘", lastSync: "Há 2 min", color: "#1877F2" },
  { id: "google", name: "Google Ads", description: "Search, Display & YouTube", category: "marketing", status: "connected", icon: "🔍", lastSync: "Há 5 min", color: "#4285F4" },
  { id: "tiktok", name: "TikTok Ads", description: "Anúncios no TikTok", category: "marketing", status: "available", icon: "🎵", color: "#000000" },
  { id: "analytics", name: "Google Analytics", description: "Métricas do site e landing pages", category: "marketing", status: "connected", icon: "📊", lastSync: "Há 10 min", color: "#E37400" },
  { id: "btg", name: "BTG Pactual", description: "Conta digital e extrato", category: "financeiro", status: "connected", icon: "🏦", lastSync: "Há 1h", color: "#003B71" },
  { id: "mercadopago", name: "Mercado Pago", description: "Pagamentos e cobranças", category: "financeiro", status: "available", icon: "💳", color: "#009EE3" },
  { id: "stone", name: "Stone", description: "Maquininha e conciliação", category: "financeiro", status: "available", icon: "💚", color: "#00A868" },
  { id: "nfe", name: "Nota Fiscal", description: "Emissão automática de NF-e", category: "financeiro", status: "available", icon: "🧾", color: "#6B7280" },
  { id: "sendpulse", name: "SendPulse", description: "WhatsApp API Oficial", category: "automacao", status: "connected", icon: "💬", lastSync: "Há 3 min", color: "#2FC86E" },
  { id: "n8n", name: "n8n", description: "Automações e workflows", category: "automacao", status: "connected", icon: "⚡", lastSync: "Ativo", color: "#FF6D5A" },
  { id: "zapier", name: "Zapier", description: "Conectar +5000 apps", category: "automacao", status: "available", icon: "🔗", color: "#FF4A00" },
  { id: "make", name: "Make (Integromat)", description: "Automações visuais", category: "automacao", status: "available", icon: "🔄", color: "#6D00CC" },
  { id: "rdstation", name: "RD Station", description: "CRM e funil de vendas", category: "crm", status: "available", icon: "🎯", color: "#0066FF" },
  { id: "hubspot", name: "HubSpot", description: "CRM completo", category: "crm", status: "available", icon: "🟠", color: "#FF7A59" },
  { id: "pipedrive", name: "Pipedrive", description: "Gestão de pipeline", category: "crm", status: "available", icon: "🟢", color: "#017737" },
  { id: "shopify", name: "Shopify", description: "Loja virtual", category: "ecommerce", status: "available", icon: "🛒", color: "#96BF48" },
  { id: "mercadolivre", name: "Mercado Livre", description: "Marketplace", category: "ecommerce", status: "available", icon: "🤝", color: "#FFE600" },
  { id: "nuvemshop", name: "Nuvemshop", description: "E-commerce brasileiro", category: "ecommerce", status: "available", icon: "☁️", color: "#2B35AF" },
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

const dataSourceTypeConfig: Record<DataSourceType, { label: string; icon: React.ElementType; color: string; description: string }> = {
  api: { label: "API REST", icon: Globe, color: "#3B82F6", description: "Conecte via endpoint REST com autenticação por token" },
  webhook: { label: "Webhook", icon: Webhook, color: "#8B5CF6", description: "Receba dados em tempo real via URL de callback" },
  sheets: { label: "Google Sheets", icon: FileSpreadsheet, color: "#34A853", description: "Sincronize dados diretamente de planilhas Google" },
  excel: { label: "Excel / CSV", icon: Table2, color: "#217346", description: "Importe dados de arquivos Excel (.xlsx) ou CSV" },
  database: { label: "Banco de Dados", icon: Database, color: "#F59E0B", description: "Conecte MySQL, PostgreSQL, MongoDB ou Firebase" },
};

const mockDataSources: DataSource[] = [
  { id: "ds1", name: "Planilha de Vendas Q1", type: "sheets", status: "active", lastSync: "Há 15 min", records: 1247, url: "https://docs.google.com/spreadsheets/d/..." },
  { id: "ds2", name: "API ERP Totvs", type: "api", status: "active", lastSync: "Há 5 min", records: 8340, url: "https://api.erp.com/v2" },
  { id: "ds3", name: "Webhook Pedidos Shopify", type: "webhook", status: "active", lastSync: "Tempo real", records: 523 },
];

type MainTab = "plataformas" | "dados";

export default function Integracoes() {
  const [mainTab, setMainTab] = useState<MainTab>("plataformas");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "connected" | "available">("all");
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<DataSourceType | null>(null);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [showWebhookUrl, setShowWebhookUrl] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const webhookUrl = "https://vpex-hub.com/api/webhook/abc123xyz";

  const filtered = integrations.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const availableCount = integrations.filter((i) => i.status === "available").length;
  const activeDataSources = dataSources.filter((d) => d.status === "active").length;

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      items: filtered.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  const handleAddDataSource = () => {
    if (!addType || !newSourceName) return;
    const newSource: DataSource = {
      id: `ds${Date.now()}`,
      name: newSourceName,
      type: addType,
      status: "syncing",
      lastSync: "Sincronizando...",
      records: 0,
      url: newSourceUrl || undefined,
    };
    setDataSources([newSource, ...dataSources]);
    setShowAddModal(false);
    setAddType(null);
    setNewSourceName("");
    setNewSourceUrl("");
    setUploadedFile(null);
    toast.success("Fonte de dados adicionada", { description: `${newSourceName} está sendo sincronizada.` });
    setTimeout(() => {
      setDataSources((prev) =>
        prev.map((d) => (d.id === newSource.id ? { ...d, status: "active" as DataSourceStatus, lastSync: "Agora", records: Math.floor(Math.random() * 500) + 100 } : d))
      );
    }, 3000);
  };

  const handleRemoveDataSource = (id: string) => {
    setDataSources((prev) => prev.filter((d) => d.id !== id));
    toast("Fonte removida", { description: "A conexão foi desativada com sucesso." });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[Sora]">Integrações</h2>
          <p className="text-sm text-muted-foreground mt-1">Conecte ferramentas e fontes de dados ao seu Hub</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-card border border-border">
        {([
          { id: "plataformas" as MainTab, label: "Plataformas", icon: Plug, count: integrations.length },
          { id: "dados" as MainTab, label: "Fontes de Dados", icon: Database, count: dataSources.length },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mainTab === tab.id
                ? "bg-vpex-green text-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              mainTab === tab.id ? "bg-black/20 text-black" : "bg-border text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {mainTab === "plataformas" ? (
          <motion.div
            key="plataformas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="dados"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Data Sources Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-vpex-green font-[Sora]">{activeDataSources}</p>
                <p className="text-xs text-muted-foreground mt-1">Ativas</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground font-[Sora]">{dataSources.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground font-[Sora]">
                  {dataSources.reduce((a, d) => a + (d.records || 0), 0).toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Registros</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-vpex-green font-[Sora]">5</p>
                <p className="text-xs text-muted-foreground mt-1">Tipos Suportados</p>
              </div>
            </div>

            {/* Add Data Source Options */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-[Sora]">
                Adicionar Fonte de Dados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {(Object.keys(dataSourceTypeConfig) as DataSourceType[]).map((type) => {
                  const config = dataSourceTypeConfig[type];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setAddType(type); setShowAddModal(true); }}
                      className="glass-card p-4 text-left hover:border-vpex-green/30 transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
                      >
                        <Icon size={20} style={{ color: config.color }} />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">{config.label}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{config.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-vpex-green text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={12} />
                        Adicionar
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Active Data Sources */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-[Sora]">
                Fontes Conectadas
              </h3>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {dataSources.map((source) => {
                    const config = dataSourceTypeConfig[source.type];
                    const Icon = config.icon;
                    const statusConfig = {
                      active: { label: "Ativa", color: "text-vpex-green", bg: "bg-vpex-green/10", border: "border-vpex-green/20", icon: CheckCircle2 },
                      inactive: { label: "Inativa", color: "text-muted-foreground", bg: "bg-muted/10", border: "border-border", icon: Clock },
                      error: { label: "Erro", color: "text-vpex-red", bg: "bg-vpex-red/10", border: "border-vpex-red/20", icon: AlertTriangle },
                      syncing: { label: "Sincronizando", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: RefreshCw },
                    };
                    const sc = statusConfig[source.status];
                    const StatusIcon = sc.icon;

                    return (
                      <motion.div
                        key={source.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
                          >
                            <Icon size={18} style={{ color: config.color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-foreground truncate">{source.name}</h4>
                              <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.border} border`}>
                                <StatusIcon size={10} className={`${sc.color} ${source.status === "syncing" ? "animate-spin" : ""}`} />
                                <span className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[11px] text-muted-foreground">{config.label}</span>
                              {source.lastSync && (
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <RefreshCw size={9} />
                                  {source.lastSync}
                                </span>
                              )}
                              {source.records !== undefined && (
                                <span className="text-[11px] text-muted-foreground">
                                  {source.records.toLocaleString("pt-BR")} registros
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toast("Sincronizando...", { description: `Atualizando dados de ${source.name}` })}
                            className="p-2 rounded-lg text-muted-foreground hover:text-vpex-green hover:bg-vpex-green/10 transition-colors"
                            title="Sincronizar agora"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            onClick={() => toast("Configurações", { description: `Gerenciar ${source.name}` })}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            title="Configurações"
                          >
                            <Settings size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveDataSource(source.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-vpex-red hover:bg-vpex-red/10 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remover"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {dataSources.length === 0 && (
                  <div className="glass-card p-12 text-center">
                    <Database size={40} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">Nenhuma fonte de dados conectada</p>
                    <p className="text-xs text-muted-foreground mt-1">Use os botões acima para adicionar sua primeira fonte</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Data Source Modal */}
      <AnimatePresence>
        {showAddModal && addType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowAddModal(false); setAddType(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-lg"
            >
              {(() => {
                const config = dataSourceTypeConfig[addType];
                const Icon = config.icon;
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
                        >
                          <Icon size={20} style={{ color: config.color }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground font-[Sora]">Adicionar {config.label}</h3>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setShowAddModal(false); setAddType(null); }}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome da Conexão</label>
                        <input
                          type="text"
                          placeholder={`Ex: ${addType === "sheets" ? "Planilha de Vendas 2024" : addType === "api" ? "API do ERP" : addType === "webhook" ? "Webhook Pedidos" : addType === "excel" ? "Relatório Mensal" : "PostgreSQL Produção"}`}
                          value={newSourceName}
                          onChange={(e) => setNewSourceName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40"
                        />
                      </div>

                      {/* Type-specific fields */}
                      {addType === "api" && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">URL do Endpoint</label>
                            <input
                              type="text"
                              placeholder="https://api.exemplo.com/v2/dados"
                              value={newSourceUrl}
                              onChange={(e) => setNewSourceUrl(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Token de Autenticação</label>
                            <input
                              type="password"
                              placeholder="Bearer sk-..."
                              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Método HTTP</label>
                            <div className="flex gap-2">
                              {["GET", "POST"].map((m) => (
                                <button key={m} className="px-4 py-2 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all">
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Frequência de Sincronização</label>
                            <div className="flex gap-2 flex-wrap">
                              {["5 min", "15 min", "1 hora", "6 horas", "Diário"].map((f) => (
                                <button key={f} className="px-3 py-2 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all">
                                  {f}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {addType === "webhook" && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sua URL de Webhook (copie e cole no sistema externo)</label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <input
                                type={showWebhookUrl ? "text" : "password"}
                                value={webhookUrl}
                                readOnly
                                className="w-full px-4 py-2.5 pr-20 rounded-lg bg-card border border-border text-sm text-foreground font-mono focus:outline-none"
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                <button
                                  onClick={() => setShowWebhookUrl(!showWebhookUrl)}
                                  className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showWebhookUrl ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button
                                  onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success("URL copiada!"); }}
                                  className="p-1.5 rounded text-muted-foreground hover:text-vpex-green transition-colors"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-2">
                            Cole esta URL no sistema que enviará os dados. Os dados recebidos serão processados automaticamente.
                          </p>
                        </div>
                      )}

                      {addType === "sheets" && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">URL da Planilha Google</label>
                            <input
                              type="text"
                              placeholder="https://docs.google.com/spreadsheets/d/..."
                              value={newSourceUrl}
                              onChange={(e) => setNewSourceUrl(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome da Aba</label>
                            <input
                              type="text"
                              placeholder="Aba1 (padrão: primeira aba)"
                              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Frequência de Sincronização</label>
                            <div className="flex gap-2 flex-wrap">
                              {["15 min", "1 hora", "6 horas", "Diário"].map((f) => (
                                <button key={f} className="px-3 py-2 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all">
                                  {f}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {addType === "excel" && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Arquivo Excel ou CSV</label>
                            <div
                              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-vpex-green/40 transition-colors cursor-pointer"
                              onClick={() => { setUploadedFile("relatorio_vendas_2024.xlsx"); toast.success("Arquivo carregado!"); }}
                            >
                              {uploadedFile ? (
                                <div className="flex items-center justify-center gap-3">
                                  <CheckCircle2 size={20} className="text-vpex-green" />
                                  <span className="text-sm text-foreground font-medium">{uploadedFile}</span>
                                  <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} className="text-muted-foreground hover:text-vpex-red">
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <Upload size={28} className="mx-auto text-muted-foreground mb-2" />
                                  <p className="text-sm text-muted-foreground">Arraste o arquivo aqui ou clique para selecionar</p>
                                  <p className="text-[11px] text-muted-foreground mt-1">Formatos: .xlsx, .xls, .csv (máx. 50MB)</p>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Atualização Automática</label>
                            <p className="text-[11px] text-muted-foreground">Para atualização automática, use Google Sheets. Arquivos Excel são importações únicas que podem ser atualizadas manualmente.</p>
                          </div>
                        </>
                      )}

                      {addType === "database" && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipo de Banco</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { name: "PostgreSQL", icon: "🐘" },
                                { name: "MySQL", icon: "🐬" },
                                { name: "MongoDB", icon: "🍃" },
                                { name: "Firebase", icon: "🔥" },
                              ].map((db) => (
                                <button
                                  key={db.name}
                                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-vpex-green/30 transition-all"
                                >
                                  <span>{db.icon}</span>
                                  {db.name}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">String de Conexão</label>
                            <input
                              type="password"
                              placeholder="postgresql://user:pass@host:5432/dbname"
                              value={newSourceUrl}
                              onChange={(e) => setNewSourceUrl(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-vpex-green/40"
                            />
                          </div>
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-vpex-green/5 border border-vpex-green/10">
                            <Server size={14} className="text-vpex-green mt-0.5 shrink-0" />
                            <p className="text-[11px] text-muted-foreground">
                              A conexão é criptografada (SSL/TLS). Seus dados são lidos em modo somente-leitura por padrão.
                            </p>
                          </div>
                        </>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => { setShowAddModal(false); setAddType(null); setNewSourceName(""); setNewSourceUrl(""); setUploadedFile(null); }}
                          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleAddDataSource}
                          disabled={!newSourceName}
                          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-vpex-green text-black hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Plus size={14} />
                          Conectar
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
      className={`glass-card p-4 flex items-start gap-3 group ${isConnected ? "border-vpex-green/20" : ""}`}
    >
      <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-lg shrink-0">
        {integration.icon}
      </div>
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
