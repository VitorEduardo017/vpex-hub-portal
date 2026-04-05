/**
 * Equipe — Multilogins e Controle de Acesso
 * Gerenciar funcionários, permissões e acessos ao VPEX Hub.
 * Glass Cockpit Design | VPEX Hub
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Shield,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Search,
  UserPlus,
  Crown,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── Data ─── */
interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "admin" | "gerente" | "operador" | "visualizador";
  status: "ativo" | "inativo" | "pendente";
  lastAccess: string;
  avatar: string;
  permissions: string[];
}

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  admin: { label: "Administrador", color: "text-vpex-green", bg: "bg-vpex-green/10", icon: Crown },
  gerente: { label: "Gerente", color: "text-blue-400", bg: "bg-blue-400/10", icon: Shield },
  operador: { label: "Operador", color: "text-vpex-yellow", bg: "bg-vpex-yellow/10", icon: Unlock },
  visualizador: { label: "Visualizador", color: "text-muted-foreground", bg: "bg-white/5", icon: Eye },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ativo: { label: "Ativo", color: "text-vpex-green", bg: "bg-vpex-green/10" },
  inativo: { label: "Inativo", color: "text-vpex-red", bg: "bg-vpex-red/10" },
  pendente: { label: "Convite pendente", color: "text-vpex-yellow", bg: "bg-vpex-yellow/10" },
};

const allPermissions = [
  { key: "dashboard", label: "Dashboard", desc: "Ver KPIs e gráficos" },
  { key: "relatorios", label: "Relatórios", desc: "Acessar relatórios de marketing e operação" },
  { key: "documentos", label: "Documentos", desc: "Ver e enviar documentos" },
  { key: "whatsapp", label: "WhatsApp", desc: "Disparar mensagens" },
  { key: "pedidos", label: "Pedidos", desc: "Criar e gerenciar pedidos" },
  { key: "financeiro", label: "Financeiro", desc: "Ver dados financeiros" },
  { key: "academy", label: "Academy", desc: "Acessar treinamentos" },
  { key: "configuracoes", label: "Configurações", desc: "Alterar configurações da empresa" },
];

const mockTeam: TeamMember[] = [
  {
    id: 1,
    name: "Você (Proprietário)",
    email: "proprietario@franquia.com.br",
    role: "admin",
    status: "ativo",
    lastAccess: "Agora",
    avatar: "V",
    permissions: allPermissions.map((p) => p.key),
  },
  {
    id: 2,
    name: "Maria Souza",
    email: "maria@franquia.com.br",
    role: "gerente",
    status: "ativo",
    lastAccess: "Hoje, 14:30",
    avatar: "MS",
    permissions: ["dashboard", "relatorios", "documentos", "pedidos", "academy"],
  },
  {
    id: 3,
    name: "João Silva",
    email: "joao@franquia.com.br",
    role: "operador",
    status: "ativo",
    lastAccess: "Ontem, 18:00",
    avatar: "JS",
    permissions: ["dashboard", "whatsapp", "pedidos", "academy"],
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@franquia.com.br",
    role: "visualizador",
    status: "pendente",
    lastAccess: "Nunca",
    avatar: "AC",
    permissions: ["dashboard", "relatorios"],
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Equipe() {
  const [team] = useState(mockTeam);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredTeam = team.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = team.filter((m) => m.status === "ativo").length;
  const pendingCount = team.filter((m) => m.status === "pendente").length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Equipe & Acessos</h2>
          <p className="text-sm text-muted-foreground">Gerencie quem pode acessar o VPEX Hub da sua empresa</p>
        </div>
        <Button
          className="gap-2 bg-vpex-green hover:bg-vpex-green/90 text-black font-medium"
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlus size={16} /> Convidar Membro
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-vpex-green" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-foreground">{team.length}</p>
          <p className="text-[10px] text-muted-foreground">membros cadastrados</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-vpex-green" />
            <span className="text-xs text-muted-foreground">Ativos</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-vpex-green">{activeCount}</p>
          <p className="text-[10px] text-muted-foreground">com acesso ativo</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-vpex-yellow" />
            <span className="text-xs text-muted-foreground">Pendentes</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-vpex-yellow">{pendingCount}</p>
          <p className="text-[10px] text-muted-foreground">aguardando aceite</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-blue-400" />
            <span className="text-xs text-muted-foreground">Perfis</span>
          </div>
          <p className="text-2xl font-bold font-[Sora] text-blue-400">4</p>
          <p className="text-[10px] text-muted-foreground">níveis de acesso</p>
        </div>
      </motion.div>

      {/* Roles Legend */}
      <motion.div variants={fadeUp} className="glass-card p-4">
        <h3 className="text-xs font-semibold text-foreground font-[Sora] mb-3 flex items-center gap-2">
          <Shield size={12} className="text-vpex-green" />
          Níveis de Acesso
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.entries(roleConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${config.bg}`}>
                  <Icon size={12} className={config.color} />
                </div>
                <div>
                  <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
                  <p className="text-[9px] text-muted-foreground">
                    {key === "admin" && "Acesso total"}
                    {key === "gerente" && "Sem configurações"}
                    {key === "operador" && "Operação diária"}
                    {key === "visualizador" && "Apenas leitura"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeUp} className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-vpex-green/30 transition-colors"
        />
      </motion.div>

      {/* Team List */}
      <motion.div variants={fadeUp} className="space-y-2">
        {filteredTeam.map((member) => {
          const isExpanded = expandedMember === member.id;
          const role = roleConfig[member.role];
          const status = statusConfig[member.status];
          const RoleIcon = role.icon;

          return (
            <motion.div
              key={member.id}
              layout
              className="glass-card overflow-hidden"
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.01] transition-colors"
                onClick={() => setExpandedMember(isExpanded ? null : member.id)}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm font-[Sora] ${
                  member.role === "admin" ? "bg-vpex-green/20 text-vpex-green border border-vpex-green/30" : "bg-white/5 text-muted-foreground border border-white/10"
                }`}>
                  {member.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${role.bg} ${role.color}`}>{role.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={8} /> {member.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={8} /> {member.lastAccess}
                    </span>
                  </div>
                </div>

                {/* Status + Expand */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.color} hidden sm:inline`}>
                    {status.label}
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                </div>
              </div>

              {/* Expanded Permissions */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-white/5">
                      <div className="pt-3">
                        <p className="text-xs font-semibold text-foreground font-[Sora] mb-2 flex items-center gap-1.5">
                          <Lock size={10} className="text-vpex-green" />
                          Permissões de Acesso
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
                          {allPermissions.map((perm) => {
                            const hasAccess = member.permissions.includes(perm.key);
                            return (
                              <div
                                key={perm.key}
                                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[10px] border transition-colors ${
                                  hasAccess
                                    ? "bg-vpex-green/[0.05] border-vpex-green/15 text-vpex-green"
                                    : "bg-white/[0.01] border-white/5 text-muted-foreground/50"
                                }`}
                              >
                                {hasAccess ? <Unlock size={10} /> : <Lock size={10} />}
                                <span className="font-medium">{perm.label}</span>
                              </div>
                            );
                          })}
                        </div>

                        {member.role !== "admin" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs border-white/10 text-muted-foreground hover:text-foreground"
                              onClick={() => toast("Editar permissões", { description: "Funcionalidade disponível quando o backend estiver ativo." })}
                            >
                              <Edit2 size={12} /> Editar Permissões
                            </Button>
                            {member.status === "ativo" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs border-vpex-red/20 text-vpex-red hover:bg-vpex-red/10"
                                onClick={() => toast("Desativar acesso", { description: `Acesso de ${member.name} seria desativado.` })}
                              >
                                <EyeOff size={12} /> Desativar
                              </Button>
                            ) : member.status === "pendente" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs border-vpex-yellow/20 text-vpex-yellow hover:bg-vpex-yellow/10"
                                onClick={() => toast("Reenviar convite", { description: `Convite reenviado para ${member.email}.` })}
                              >
                                <Mail size={12} /> Reenviar Convite
                              </Button>
                            ) : null}
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs border-vpex-red/20 text-vpex-red hover:bg-vpex-red/10"
                              onClick={() => toast("Remover membro", { description: `${member.name} seria removido da equipe.` })}
                            >
                              <Trash2 size={12} /> Remover
                            </Button>
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

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInviteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus size={18} className="text-vpex-green" />
                  <h3 className="text-lg font-semibold font-[Sora] text-foreground">Convidar Membro</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envie um convite por e-mail. O membro receberá um link para criar a conta e acessar o VPEX Hub com as permissões que você definir.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Nome completo</label>
                    <input
                      type="text"
                      placeholder="Ex: Maria Souza"
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-vpex-green/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">E-mail</label>
                    <input
                      type="email"
                      placeholder="email@empresa.com.br"
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-vpex-green/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Nível de acesso</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(roleConfig).filter(([k]) => k !== "admin").map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={key}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border border-white/10 hover:border-vpex-green/20 transition-colors text-left`}
                          >
                            <Icon size={14} className={config.color} />
                            <div>
                              <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 gap-2 bg-vpex-green hover:bg-vpex-green/90 text-black font-medium"
                    onClick={() => {
                      setShowInviteModal(false);
                      toast.success("Convite enviado!", { description: "O membro receberá um e-mail com o link de acesso." });
                    }}
                  >
                    <Mail size={14} /> Enviar Convite
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/10 text-muted-foreground"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
