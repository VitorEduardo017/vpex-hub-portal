/**
 * Documentos — Cofre de Logins & Repositório de Arquivos
 * Gestão de documentos empresariais e senhas de portais/contas.
 */
import { motion } from "framer-motion";
import {
  FileText,
  Lock,
  Upload,
  Search,
  Eye,
  FolderOpen,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const documents = [
  { name: "Contrato Social.pdf", type: "PDF", date: "12/03/2026", size: "2.4 MB", category: "Jurídico" },
  { name: "Alvará de Funcionamento.pdf", type: "PDF", date: "05/01/2026", size: "1.1 MB", category: "Licenças" },
  { name: "Balanço Patrimonial 2025.xlsx", type: "Excel", date: "28/02/2026", size: "890 KB", category: "Financeiro" },
  { name: "Manual da Franquia.pdf", type: "PDF", date: "15/11/2025", size: "15.2 MB", category: "Operacional" },
];

const logins = [
  { platform: "Meta Business", user: "empresa@email.com", status: "Ativo" },
  { platform: "Google Ads", user: "ads@empresa.com", status: "Ativo" },
  { platform: "RD Station", user: "marketing@empresa.com", status: "Ativo" },
  { platform: "Portal Franqueadora", user: "franquia_042", status: "Ativo" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Documentos() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold font-[Sora] text-foreground">Documentos & Logins</h2>
        <p className="text-sm text-muted-foreground">Seu cofre digital centralizado</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Tabs defaultValue="documentos" className="w-full">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="documentos" className="gap-2 data-[state=active]:bg-vpex-green/10 data-[state=active]:text-vpex-green">
              <FolderOpen size={14} /> Documentos
            </TabsTrigger>
            <TabsTrigger value="logins" className="gap-2 data-[state=active]:bg-vpex-green/10 data-[state=active]:text-vpex-green">
              <Shield size={14} /> Cofre VPEX
            </TabsTrigger>
          </TabsList>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar documento..." className="pl-9 bg-muted/30 border-border" />
              </div>
              <Button
                className="gap-2 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold"
                onClick={() => toast("Upload em breve", { description: "Esta funcionalidade será ativada em breve." })}
              >
                <Upload size={14} /> Enviar Arquivo
              </Button>
            </div>
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-vpex-green/10 shrink-0">
                      <FileText size={18} className="text-vpex-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.category} · {doc.size} · {doc.date}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-border"
                    onClick={() => toast("Visualização em breve")}
                  >
                    <Eye size={14} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Logins Tab */}
          <TabsContent value="logins" className="mt-4 space-y-4">
            <div className="glass-card p-4 flex items-center gap-3 border-vpex-green/20">
              <Lock size={18} className="text-vpex-green shrink-0" />
              <p className="text-sm text-muted-foreground">
                Logins gerenciados pela VPEX. Suas credenciais estão seguras e criptografadas.
              </p>
            </div>
            <div className="space-y-2">
              {logins.map((login, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Shield size={18} className="text-vpex-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{login.platform}</p>
                      <p className="text-xs text-muted-foreground">{login.user}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-vpex-green bg-vpex-green/10 px-2.5 py-1 rounded-full">
                    {login.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
