/**
 * Documentos — Cofre de Logins & Repositório de Arquivos
 * Drag-and-drop upload, organização por pastas, preview de arquivos.
 * Design: Glass Cockpit · Minimalismo de Guerra · Não-Tech Friendly
 */
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Lock,
  Upload,
  Search,
  Eye,
  FolderOpen,
  Shield,
  Plus,
  Folder,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  Download,
  Trash2,
  ChevronRight,
  X,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  MoreVertical,
  Copy,
  EyeOff,
  ExternalLink,
  Grid3X3,
  List,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
interface DocFile {
  id: number;
  name: string;
  type: "pdf" | "excel" | "image" | "doc" | "other";
  size: string;
  date: string;
  category: string;
  folderId: number | null;
}

interface DocFolder {
  id: number;
  name: string;
  color: string;
  count: number;
}

/* ─── Data ─── */
const folders: DocFolder[] = [
  { id: 1, name: "Jurídico", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", count: 4 },
  { id: 2, name: "Financeiro", color: "text-vpex-green bg-vpex-green/10 border-vpex-green/20", count: 6 },
  { id: 3, name: "Operacional", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", count: 3 },
  { id: 4, name: "Licenças", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", count: 2 },
  { id: 5, name: "Marketing", color: "text-pink-400 bg-pink-400/10 border-pink-400/20", count: 5 },
  { id: 6, name: "RH", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20", count: 3 },
];

const allFiles: DocFile[] = [
  { id: 1, name: "Contrato Social.pdf", type: "pdf", date: "12/03/2026", size: "2.4 MB", category: "Jurídico", folderId: 1 },
  { id: 2, name: "Procuração VPEX.pdf", type: "pdf", date: "10/03/2026", size: "540 KB", category: "Jurídico", folderId: 1 },
  { id: 3, name: "Aditivo Contratual.pdf", type: "pdf", date: "05/02/2026", size: "1.2 MB", category: "Jurídico", folderId: 1 },
  { id: 4, name: "Termo de Confidencialidade.pdf", type: "pdf", date: "01/02/2026", size: "380 KB", category: "Jurídico", folderId: 1 },
  { id: 5, name: "Balanço Patrimonial 2025.xlsx", type: "excel", date: "28/02/2026", size: "890 KB", category: "Financeiro", folderId: 2 },
  { id: 6, name: "DRE Mensal - Março.xlsx", type: "excel", date: "01/04/2026", size: "1.1 MB", category: "Financeiro", folderId: 2 },
  { id: 7, name: "Fluxo de Caixa Q1.xlsx", type: "excel", date: "15/03/2026", size: "720 KB", category: "Financeiro", folderId: 2 },
  { id: 8, name: "Notas Fiscais - Mar.zip", type: "other", date: "31/03/2026", size: "45 MB", category: "Financeiro", folderId: 2 },
  { id: 9, name: "Guia DARF.pdf", type: "pdf", date: "20/03/2026", size: "210 KB", category: "Financeiro", folderId: 2 },
  { id: 10, name: "Comprovante Simples Nacional.pdf", type: "pdf", date: "10/01/2026", size: "180 KB", category: "Financeiro", folderId: 2 },
  { id: 11, name: "Manual da Franquia.pdf", type: "pdf", date: "15/11/2025", size: "15.2 MB", category: "Operacional", folderId: 3 },
  { id: 12, name: "Checklist Abertura.pdf", type: "pdf", date: "01/12/2025", size: "3.1 MB", category: "Operacional", folderId: 3 },
  { id: 13, name: "Padrão Visual Loja.pdf", type: "pdf", date: "20/10/2025", size: "8.5 MB", category: "Operacional", folderId: 3 },
  { id: 14, name: "Alvará de Funcionamento.pdf", type: "pdf", date: "05/01/2026", size: "1.1 MB", category: "Licenças", folderId: 4 },
  { id: 15, name: "Licença Sanitária.pdf", type: "pdf", date: "10/01/2026", size: "650 KB", category: "Licenças", folderId: 4 },
  { id: 16, name: "Brandbook Oficial.pdf", type: "pdf", date: "01/01/2026", size: "22 MB", category: "Marketing", folderId: 5 },
  { id: 17, name: "Banco de Imagens Q1.zip", type: "image", date: "15/03/2026", size: "120 MB", category: "Marketing", folderId: 5 },
  { id: 18, name: "Calendário Editorial.xlsx", type: "excel", date: "01/03/2026", size: "450 KB", category: "Marketing", folderId: 5 },
  { id: 19, name: "Relatório de Mídia - Mar.pdf", type: "pdf", date: "31/03/2026", size: "3.8 MB", category: "Marketing", folderId: 5 },
  { id: 20, name: "Guia de Tom de Voz.pdf", type: "pdf", date: "10/02/2026", size: "1.5 MB", category: "Marketing", folderId: 5 },
  { id: 21, name: "Folha de Pagamento - Mar.xlsx", type: "excel", date: "05/04/2026", size: "320 KB", category: "RH", folderId: 6 },
  { id: 22, name: "Contratos CLT.zip", type: "other", date: "01/03/2026", size: "8.2 MB", category: "RH", folderId: 6 },
  { id: 23, name: "Organograma.pdf", type: "pdf", date: "15/02/2026", size: "280 KB", category: "RH", folderId: 6 },
];

const logins = [
  { id: 1, platform: "Meta Business", user: "empresa@email.com", password: "••••••••••", status: "Ativo", lastUpdate: "01/04/2026", managedBy: "VPEX" },
  { id: 2, platform: "Google Ads", user: "ads@empresa.com", password: "••••••••••", status: "Ativo", lastUpdate: "28/03/2026", managedBy: "VPEX" },
  { id: 3, platform: "RD Station", user: "marketing@empresa.com", password: "••••••••••", status: "Ativo", lastUpdate: "15/03/2026", managedBy: "VPEX" },
  { id: 4, platform: "Portal Franqueadora", user: "franquia_042", password: "••••••••••", status: "Ativo", lastUpdate: "10/03/2026", managedBy: "Cliente" },
  { id: 5, platform: "Google Analytics", user: "analytics@empresa.com", password: "••••••••••", status: "Ativo", lastUpdate: "20/03/2026", managedBy: "VPEX" },
  { id: 6, platform: "Hotmart", user: "cursos@empresa.com", password: "••••••••••", status: "Inativo", lastUpdate: "01/01/2026", managedBy: "Cliente" },
];

const fileIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  image: ImageIcon,
  doc: FileText,
  other: File,
};

const fileColors: Record<string, string> = {
  pdf: "text-red-400 bg-red-400/10",
  excel: "text-green-400 bg-green-400/10",
  image: "text-blue-400 bg-blue-400/10",
  doc: "text-blue-400 bg-blue-400/10",
  other: "text-muted-foreground bg-muted/10",
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function Documentos() {
  const [activeTab, setActiveTab] = useState<"documentos" | "logins">("documentos");
  const [search, setSearch] = useState("");
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showLoginDetail, setShowLoginDetail] = useState<number | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFolderData = folders.find((f) => f.id === currentFolder);
  const filteredFiles = allFiles.filter((f) => {
    const matchFolder = currentFolder ? f.folderId === currentFolder : true;
    const matchSearch = search ? f.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchFolder && matchSearch;
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(files.map((f) => f.name));
      setShowUploadModal(true);
    }
  }, []);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(files.map((f) => f.name));
      setShowUploadModal(true);
    }
  }, []);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold font-[Sora] text-foreground">Documentos & Logins</h2>
          <p className="text-sm text-muted-foreground">Seu cofre digital centralizado</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("documentos")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "documentos"
                ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/30"
                : "bg-muted/10 text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            <FolderOpen size={14} /> Documentos
          </button>
          <button
            onClick={() => setActiveTab("logins")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "logins"
                ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/30"
                : "bg-muted/10 text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            <Shield size={14} /> Cofre VPEX
          </button>
        </div>
      </motion.div>

      {/* ═══ DOCUMENTOS TAB ═══ */}
      {activeTab === "documentos" && (
        <motion.div variants={fadeUp} className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileSelect}
            className={`relative glass-card p-6 lg:p-8 border-2 border-dashed cursor-pointer transition-all text-center ${
              isDragging
                ? "border-vpex-green bg-vpex-green/[0.03] scale-[1.01]"
                : "border-border hover:border-vpex-green/30 hover:bg-muted/5"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <UploadCloud size={36} className={`mx-auto mb-3 ${isDragging ? "text-vpex-green animate-bounce" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium text-foreground">
              {isDragging ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para enviar"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, Excel, Imagens, ZIP — até 50 MB por arquivo</p>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-xl border-2 border-vpex-green bg-vpex-green/5 pointer-events-none"
              />
            )}
          </div>

          {/* Search + Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar documento..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-vpex-green/40 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
              >
                {viewMode === "grid" ? <List size={16} /> : <Grid3X3 size={16} />}
              </button>
              <button
                onClick={() => setShowNewFolder(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
              >
                <Plus size={14} /> Nova Pasta
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          {currentFolder && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <button onClick={() => setCurrentFolder(null)} className="hover:text-vpex-green transition-colors flex items-center gap-1">
                <ArrowLeft size={12} /> Todas as Pastas
              </button>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{currentFolderData?.name}</span>
            </div>
          )}

          {/* Folders Grid */}
          {!currentFolder && !search && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {folders.map((folder) => (
                <motion.button
                  key={folder.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentFolder(folder.id)}
                  className={`p-3 lg:p-4 rounded-xl border text-left transition-all hover:shadow-lg ${folder.color}`}
                >
                  <Folder size={22} className="mb-2" />
                  <p className="text-xs font-semibold text-foreground truncate">{folder.name}</p>
                  <p className="text-[10px] text-muted-foreground">{folder.count} arquivos</p>
                </motion.button>
              ))}
            </div>
          )}

          {/* Files List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" : "space-y-1.5"}>
            {filteredFiles.map((file) => {
              const Icon = fileIcons[file.type] || File;
              const colorClass = fileColors[file.type] || fileColors.other;
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass-card p-3 flex items-center justify-between group hover:border-vpex-green/20 transition-all ${
                    viewMode === "grid" ? "flex-col items-start gap-3" : ""
                  }`}
                >
                  <div className={`flex items-center gap-3 min-w-0 ${viewMode === "grid" ? "w-full" : ""}`}>
                    <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {file.category} · {file.size} · {file.date}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${viewMode === "grid" ? "w-full justify-end" : ""}`}>
                    <button
                      onClick={() => toast("Preview em breve", { description: `Visualizando ${file.name}` })}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => toast.success("Download iniciado", { description: file.name })}
                      className="p-2 rounded-lg text-muted-foreground hover:text-vpex-green hover:bg-vpex-green/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => toast("Excluir", { description: `Tem certeza que deseja excluir ${file.name}?` })}
                      className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Nenhum documento encontrado</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Tente outra busca ou envie um novo arquivo</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ═══ LOGINS TAB ═══ */}
      {activeTab === "logins" && (
        <motion.div variants={fadeUp} className="space-y-4">
          {/* Security Banner */}
          <div className="glass-card p-4 flex items-center gap-3 border-vpex-green/20">
            <div className="p-2 rounded-lg bg-vpex-green/10 shrink-0">
              <Lock size={18} className="text-vpex-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Cofre Criptografado</p>
              <p className="text-xs text-muted-foreground">
                Logins gerenciados pela VPEX. Credenciais protegidas com criptografia AES-256.
              </p>
            </div>
          </div>

          {/* Logins List */}
          <div className="space-y-2">
            {logins.map((login) => (
              <motion.div
                key={login.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`glass-card p-4 transition-all ${
                  showLoginDetail === login.id ? "border-vpex-green/20" : "hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${login.status === "Ativo" ? "bg-vpex-green/10" : "bg-muted/20"}`}>
                      <Shield size={18} className={login.status === "Ativo" ? "text-vpex-green" : "text-muted-foreground"} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{login.platform}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          login.managedBy === "VPEX"
                            ? "bg-vpex-green/10 text-vpex-green border border-vpex-green/20"
                            : "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                        }`}>
                          {login.managedBy}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{login.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                      login.status === "Ativo"
                        ? "bg-vpex-green/10 text-vpex-green"
                        : "bg-amber-400/10 text-amber-400"
                    }`}>
                      {login.status}
                    </span>
                    <button
                      onClick={() => setShowLoginDetail(showLoginDetail === login.id ? null : login.id)}
                      className="p-1.5 rounded-lg hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {showLoginDetail === login.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-border overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground">Usuário</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-foreground">{login.user}</p>
                            <button
                              onClick={() => { navigator.clipboard.writeText(login.user); toast.success("Usuário copiado"); }}
                              className="p-1 rounded hover:bg-muted/20 text-muted-foreground hover:text-foreground"
                            >
                              <Copy size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground">Senha</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-foreground font-mono">{login.password}</p>
                            <button
                              onClick={() => toast("Solicitar senha", { description: "Solicite à VPEX para visualizar a senha." })}
                              className="p-1 rounded hover:bg-muted/20 text-muted-foreground hover:text-foreground"
                            >
                              <EyeOff size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground">Última Atualização</p>
                          <p className="text-xs font-medium text-foreground">{login.lastUpdate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground">Gerenciado por</p>
                          <p className="text-xs font-medium text-foreground">{login.managedBy}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => toast("Acessar plataforma", { description: `Abrindo ${login.platform}...` })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-medium text-muted-foreground hover:text-vpex-green hover:border-vpex-green/30 transition-all"
                        >
                          <ExternalLink size={10} /> Acessar
                        </button>
                        <button
                          onClick={() => toast("Solicitar alteração", { description: "Um chamado será aberto para a VPEX." })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
                        >
                          <Lock size={10} /> Solicitar Alteração
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ UPLOAD MODAL ═══ */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2">
                  <Upload size={14} className="text-vpex-green" /> Upload de Arquivos
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-lg hover:bg-muted/20 text-muted-foreground">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2">
                {uploadedFiles.map((name, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border">
                    <CheckCircle2 size={16} className="text-vpex-green shrink-0" />
                    <p className="text-xs font-medium text-foreground truncate flex-1">{name}</p>
                    <p className="text-[10px] text-muted-foreground shrink-0">Pronto</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Salvar na pasta:</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground focus:outline-none focus:border-vpex-green/40">
                  <option value="">Raiz (sem pasta)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    toast.success(`${uploadedFiles.length} arquivo(s) enviado(s)`, {
                      description: "Seus documentos foram salvos com sucesso.",
                    });
                    setUploadedFiles([]);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-vpex-green text-black text-xs font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all"
                >
                  Enviar {uploadedFiles.length} arquivo(s)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ NEW FOLDER MODAL ═══ */}
      <AnimatePresence>
        {showNewFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewFolder(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-card border border-border p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold font-[Sora] text-foreground flex items-center gap-2">
                  <Folder size={14} className="text-vpex-green" /> Nova Pasta
                </h3>
                <button onClick={() => setShowNewFolder(false)} className="p-1 rounded-lg hover:bg-muted/20 text-muted-foreground">
                  <X size={14} />
                </button>
              </div>
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nome da pasta..."
                className="w-full px-3 py-2.5 rounded-lg bg-muted/15 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-vpex-green/40"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewFolder(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!newFolderName.trim()) { toast.error("Digite um nome para a pasta"); return; }
                    toast.success(`Pasta "${newFolderName}" criada`);
                    setNewFolderName("");
                    setShowNewFolder(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-vpex-green text-black text-xs font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all"
                >
                  Criar Pasta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
