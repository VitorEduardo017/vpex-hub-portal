/**
 * Configurações — Central de Personalização
 * Glass Cockpit Design | VPEX Hub
 *
 * Abas: Empresa, Notificações, Preferências, Segurança.
 * Foco em simplicidade para usuários não-tech.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Bell,
  Palette,
  ShieldCheck,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Clock,
  MessageCircle,
  BarChart3,
  AlertTriangle,
  Rocket,
  CreditCard,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
type TabId = "empresa" | "notificacoes" | "preferencias" | "seguranca";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "preferencias", label: "Preferências", icon: Palette },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck },
];

/* ─── Toggle Component ─── */
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-vpex-green" : "bg-muted/40"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-4 h-4 rounded-full ${
          enabled ? "bg-black" : "bg-muted-foreground"
        }`}
      />
    </button>
  );
}

/* ─── Input Field ─── */
function InputField({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <Icon size={12} />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-vpex-green/40 focus:ring-1 focus:ring-vpex-green/20 transition-all"
      />
      {hint && (
        <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
          <Info size={10} />
          {hint}
        </p>
      )}
    </div>
  );
}

/* ─── Notification Row ─── */
function NotificationRow({
  icon: Icon,
  title,
  description,
  channels,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  channels: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
    onEmail: (v: boolean) => void;
    onWhatsapp: (v: boolean) => void;
    onPush: (v: boolean) => void;
  };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg bg-muted/10 border border-border hover:border-vpex-green/15 transition-colors">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-vpex-green/10 border border-vpex-green/20 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-vpex-green" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-5 ml-12 sm:ml-0">
        <div className="flex flex-col items-center gap-1">
          <Toggle enabled={channels.email} onChange={channels.onEmail} />
          <span className="text-[9px] text-muted-foreground">E-mail</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Toggle enabled={channels.whatsapp} onChange={channels.onWhatsapp} />
          <span className="text-[9px] text-muted-foreground">WhatsApp</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Toggle enabled={channels.push} onChange={channels.onPush} />
          <span className="text-[9px] text-muted-foreground">Push</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState<TabId>("empresa");

  /* Empresa State */
  const [empresa, setEmpresa] = useState({
    nome: "Cacau Show — Anápolis Centro",
    cnpj: "12.345.678/0001-90",
    razaoSocial: "Cacau Show Franquias LTDA",
    email: "contato@cacaushow-anapolis.com.br",
    telefone: "(62) 99999-8888",
    endereco: "Av. Brasil, 1234 — Centro, Anápolis/GO",
    site: "www.cacaushow-anapolis.com.br",
    segmento: "Franquia — Alimentação",
  });

  /* Notificações State */
  const [notifs, setNotifs] = useState({
    relatorios: { email: true, whatsapp: true, push: false },
    alertas: { email: true, whatsapp: true, push: true },
    campanhas: { email: true, whatsapp: false, push: false },
    financeiro: { email: true, whatsapp: true, push: true },
    crescimento: { email: false, whatsapp: true, push: false },
    academy: { email: true, whatsapp: false, push: false },
  });

  /* Preferências State */
  const [prefs, setPrefs] = useState({
    idioma: "pt-BR",
    fuso: "America/Sao_Paulo",
    moeda: "BRL",
    formatoData: "DD/MM/AAAA",
    dashboardInicial: "visao-geral",
    compactMode: false,
    animacoes: true,
    somNotificacao: true,
  });

  /* Segurança State */
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  const handleSave = () => {
    toast.success("Configurações salvas", {
      description: "Suas alterações foram aplicadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Configurações</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personalize o portal de acordo com as necessidades do seu negócio
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-vpex-green text-black text-xs font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all self-start sm:self-auto"
        >
          <Save size={14} />
          Salvar Alterações
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/15 border border-border overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                isActive
                  ? "text-vpex-green"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="config-tab"
                  className="absolute inset-0 rounded-lg bg-vpex-green/10 border border-vpex-green/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={14} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* ═══ EMPRESA ═══ */}
        {activeTab === "empresa" && (
          <div className="space-y-5">
            {/* Logo & Identity */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
                <Building2 size={14} className="text-vpex-green" />
                Identidade da Empresa
              </h3>
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Logo Upload */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-2xl bg-muted/20 border-2 border-dashed border-border flex items-center justify-center hover:border-vpex-green/30 transition-colors cursor-pointer group">
                    <div className="text-center">
                      <Upload size={20} className="mx-auto text-muted-foreground group-hover:text-vpex-green transition-colors" />
                      <span className="text-[9px] text-muted-foreground mt-1 block">Logo</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toast("Upload em breve", { description: "Funcionalidade será ativada com o backend." })}
                    className="text-[10px] text-vpex-green hover:underline"
                  >
                    Alterar logo
                  </button>
                </div>

                {/* Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Nome Fantasia"
                    value={empresa.nome}
                    onChange={(v) => setEmpresa({ ...empresa, nome: v })}
                    icon={Building2}
                    placeholder="Nome da empresa"
                  />
                  <InputField
                    label="CNPJ"
                    value={empresa.cnpj}
                    onChange={(v) => setEmpresa({ ...empresa, cnpj: v })}
                    icon={FileText}
                    placeholder="00.000.000/0000-00"
                  />
                  <InputField
                    label="Razão Social"
                    value={empresa.razaoSocial}
                    onChange={(v) => setEmpresa({ ...empresa, razaoSocial: v })}
                    icon={FileText}
                    placeholder="Razão social completa"
                  />
                  <InputField
                    label="Segmento"
                    value={empresa.segmento}
                    onChange={(v) => setEmpresa({ ...empresa, segmento: v })}
                    icon={Building2}
                    placeholder="Ex: Franquia — Alimentação"
                    hint="Usado para personalizar insights e benchmarks"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
                <Phone size={14} className="text-vpex-green" />
                Informações de Contato
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="E-mail Principal"
                  value={empresa.email}
                  onChange={(v) => setEmpresa({ ...empresa, email: v })}
                  icon={Mail}
                  type="email"
                  placeholder="contato@empresa.com.br"
                />
                <InputField
                  label="Telefone / WhatsApp"
                  value={empresa.telefone}
                  onChange={(v) => setEmpresa({ ...empresa, telefone: v })}
                  icon={Phone}
                  placeholder="(00) 00000-0000"
                />
                <InputField
                  label="Endereço"
                  value={empresa.endereco}
                  onChange={(v) => setEmpresa({ ...empresa, endereco: v })}
                  icon={MapPin}
                  placeholder="Rua, número — Bairro, Cidade/UF"
                />
                <InputField
                  label="Website"
                  value={empresa.site}
                  onChange={(v) => setEmpresa({ ...empresa, site: v })}
                  icon={Globe}
                  placeholder="www.empresa.com.br"
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══ NOTIFICAÇÕES ═══ */}
        {activeTab === "notificacoes" && (
          <div className="space-y-5">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2">
                  <Bell size={14} className="text-vpex-green" />
                  Central de Notificações
                </h3>
                <p className="text-[10px] text-muted-foreground">Escolha como e quando ser notificado</p>
              </div>

              {/* Header Labels */}
              <div className="hidden sm:flex items-center justify-end gap-4 sm:gap-5 mb-3 pr-4">
                <div className="flex items-center gap-4 sm:gap-5">
                  <span className="text-[9px] text-muted-foreground font-medium w-11 text-center">E-mail</span>
                  <span className="text-[9px] text-muted-foreground font-medium w-11 text-center">WhatsApp</span>
                  <span className="text-[9px] text-muted-foreground font-medium w-11 text-center">Push</span>
                </div>
              </div>

              <div className="space-y-2">
                <NotificationRow
                  icon={BarChart3}
                  title="Relatórios Semanais"
                  description="Receba o resumo semanal de performance do seu negócio"
                  channels={{
                    ...notifs.relatorios,
                    onEmail: (v) => setNotifs({ ...notifs, relatorios: { ...notifs.relatorios, email: v } }),
                    onWhatsapp: (v) => setNotifs({ ...notifs, relatorios: { ...notifs.relatorios, whatsapp: v } }),
                    onPush: (v) => setNotifs({ ...notifs, relatorios: { ...notifs.relatorios, push: v } }),
                  }}
                />
                <NotificationRow
                  icon={AlertTriangle}
                  title="Alertas Críticos"
                  description="Ruptura de estoque, meta em risco, CMV acima do ideal"
                  channels={{
                    ...notifs.alertas,
                    onEmail: (v) => setNotifs({ ...notifs, alertas: { ...notifs.alertas, email: v } }),
                    onWhatsapp: (v) => setNotifs({ ...notifs, alertas: { ...notifs.alertas, whatsapp: v } }),
                    onPush: (v) => setNotifs({ ...notifs, alertas: { ...notifs.alertas, push: v } }),
                  }}
                />
                <NotificationRow
                  icon={Rocket}
                  title="Campanhas & Tráfego"
                  description="Atualizações sobre performance de campanhas e anúncios"
                  channels={{
                    ...notifs.campanhas,
                    onEmail: (v) => setNotifs({ ...notifs, campanhas: { ...notifs.campanhas, email: v } }),
                    onWhatsapp: (v) => setNotifs({ ...notifs, campanhas: { ...notifs.campanhas, whatsapp: v } }),
                    onPush: (v) => setNotifs({ ...notifs, campanhas: { ...notifs.campanhas, push: v } }),
                  }}
                />
                <NotificationRow
                  icon={CreditCard}
                  title="Financeiro & Faturas"
                  description="Cobranças, vencimentos e movimentações financeiras"
                  channels={{
                    ...notifs.financeiro,
                    onEmail: (v) => setNotifs({ ...notifs, financeiro: { ...notifs.financeiro, email: v } }),
                    onWhatsapp: (v) => setNotifs({ ...notifs, financeiro: { ...notifs.financeiro, whatsapp: v } }),
                    onPush: (v) => setNotifs({ ...notifs, financeiro: { ...notifs.financeiro, push: v } }),
                  }}
                />
                <NotificationRow
                  icon={Rocket}
                  title="Crescimento & Metas"
                  description="Checkpoints atingidos, metas batidas e recálculos de rota"
                  channels={{
                    ...notifs.crescimento,
                    onEmail: (v) => setNotifs({ ...notifs, crescimento: { ...notifs.crescimento, email: v } }),
                    onWhatsapp: (v) => setNotifs({ ...notifs, crescimento: { ...notifs.crescimento, whatsapp: v } }),
                    onPush: (v) => setNotifs({ ...notifs, crescimento: { ...notifs.crescimento, push: v } }),
                  }}
                />
                <NotificationRow
                  icon={MessageCircle}
                  title="VPEX Academy"
                  description="Novos treinamentos, certificações e prazos de conclusão"
                  channels={{
                    ...notifs.academy,
                    onEmail: (v) => setNotifs({ ...notifs, academy: { ...notifs.academy, email: v } }),
                    onWhatsapp: (v) => setNotifs({ ...notifs, academy: { ...notifs.academy, whatsapp: v } }),
                    onPush: (v) => setNotifs({ ...notifs, academy: { ...notifs.academy, push: v } }),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══ PREFERÊNCIAS ═══ */}
        {activeTab === "preferencias" && (
          <div className="space-y-5">
            {/* Regional */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
                <Globe size={14} className="text-vpex-green" />
                Configurações Regionais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Idioma */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Globe size={12} />
                    Idioma
                  </label>
                  <select
                    value={prefs.idioma}
                    onChange={(e) => setPrefs({ ...prefs, idioma: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground focus:outline-none focus:border-vpex-green/40 transition-all"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                {/* Fuso */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock size={12} />
                    Fuso Horário
                  </label>
                  <select
                    value={prefs.fuso}
                    onChange={(e) => setPrefs({ ...prefs, fuso: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground focus:outline-none focus:border-vpex-green/40 transition-all"
                  >
                    <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                    <option value="America/Manaus">Manaus (GMT-4)</option>
                    <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
                  </select>
                </div>

                {/* Moeda */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <CreditCard size={12} />
                    Moeda
                  </label>
                  <select
                    value={prefs.moeda}
                    onChange={(e) => setPrefs({ ...prefs, moeda: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground focus:outline-none focus:border-vpex-green/40 transition-all"
                  >
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dólar (US$)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                {/* Formato Data */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock size={12} />
                    Formato de Data
                  </label>
                  <select
                    value={prefs.formatoData}
                    onChange={(e) => setPrefs({ ...prefs, formatoData: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground focus:outline-none focus:border-vpex-green/40 transition-all"
                  >
                    <option value="DD/MM/AAAA">DD/MM/AAAA</option>
                    <option value="MM/DD/AAAA">MM/DD/AAAA</option>
                    <option value="AAAA-MM-DD">AAAA-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Portal Preferences */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
                <Palette size={14} className="text-vpex-green" />
                Experiência do Portal
              </h3>
              <div className="space-y-4">
                {/* Dashboard Inicial */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Página inicial ao fazer login
                  </label>
                  <select
                    value={prefs.dashboardInicial}
                    onChange={(e) => setPrefs({ ...prefs, dashboardInicial: e.target.value })}
                    className="w-full sm:w-64 px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground focus:outline-none focus:border-vpex-green/40 transition-all"
                  >
                    <option value="visao-geral">Dashboard — Visão Geral</option>
                    <option value="relatorios">Relatórios</option>
                    <option value="crescimento">Crescimento Gamificado</option>
                    <option value="whatsapp">WhatsApp API</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Modo Compacto</p>
                      <p className="text-[11px] text-muted-foreground">Reduz espaçamento para mostrar mais informações na tela</p>
                    </div>
                    <Toggle
                      enabled={prefs.compactMode}
                      onChange={(v) => setPrefs({ ...prefs, compactMode: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Animações</p>
                      <p className="text-[11px] text-muted-foreground">Transições suaves entre páginas e elementos</p>
                    </div>
                    <Toggle
                      enabled={prefs.animacoes}
                      onChange={(v) => setPrefs({ ...prefs, animacoes: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Som de Notificação</p>
                      <p className="text-[11px] text-muted-foreground">Reproduzir som ao receber alertas no portal</p>
                    </div>
                    <Toggle
                      enabled={prefs.somNotificacao}
                      onChange={(v) => setPrefs({ ...prefs, somNotificacao: v })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SEGURANÇA ═══ */}
        {activeTab === "seguranca" && (
          <div className="space-y-5">
            {/* Password */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
                <Key size={14} className="text-vpex-green" />
                Alterar Senha
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Senha Atual</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 pr-10 rounded-lg bg-muted/15 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-vpex-green/40 transition-all"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Nova Senha</label>
                  <input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-vpex-green/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    placeholder="Repita a nova senha"
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-vpex-green/40 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => toast.success("Senha alterada", { description: "Sua senha foi atualizada com sucesso." })}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-vpex-green/10 border border-vpex-green/20 text-xs font-medium text-vpex-green hover:bg-vpex-green hover:text-black transition-all"
              >
                <Save size={12} />
                Atualizar Senha
              </button>
            </div>

            {/* Two-Factor */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
                <Smartphone size={14} className="text-vpex-green" />
                Autenticação em Dois Fatores (2FA)
              </h3>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/10 border border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFactor ? "bg-vpex-green/10 border border-vpex-green/20" : "bg-muted/20 border border-border"}`}>
                    <ShieldCheck size={18} className={twoFactor ? "text-vpex-green" : "text-muted-foreground"} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {twoFactor ? "2FA Ativado" : "2FA Desativado"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {twoFactor
                        ? "Sua conta está protegida com verificação em duas etapas"
                        : "Ative para adicionar uma camada extra de segurança"}
                    </p>
                  </div>
                </div>
                <Toggle enabled={twoFactor} onChange={setTwoFactor} />
              </div>
              {twoFactor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 p-3 rounded-lg bg-vpex-green/5 border border-vpex-green/10"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-vpex-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-vpex-green font-medium">Verificação ativa via WhatsApp</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Código de verificação enviado para (62) •••••-8888 a cada novo login
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Session */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2 mb-4">
                <Clock size={14} className="text-vpex-green" />
                Sessão & Dispositivos
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Tempo de inatividade para logout automático
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground focus:outline-none focus:border-vpex-green/40 transition-all"
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="120">2 horas</option>
                    <option value="never">Nunca desconectar</option>
                  </select>
                </div>

                {/* Active Sessions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Dispositivos conectados</p>
                  {[
                    { device: "Chrome — Windows 11", location: "Anápolis, GO", current: true, lastActive: "Agora" },
                    { device: "Safari — iPhone 15", location: "Anápolis, GO", current: false, lastActive: "Há 2 horas" },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${session.current ? "bg-vpex-green/10" : "bg-muted/20"}`}>
                          <Smartphone size={14} className={session.current ? "text-vpex-green" : "text-muted-foreground"} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                            {session.device}
                            {session.current && (
                              <span className="px-1.5 py-0.5 rounded bg-vpex-green/10 text-[8px] text-vpex-green font-bold">ATUAL</span>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{session.location} — {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => toast("Sessão encerrada", { description: `Dispositivo ${session.device} desconectado.` })}
                          className="text-[10px] text-vpex-red hover:underline"
                        >
                          Desconectar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
