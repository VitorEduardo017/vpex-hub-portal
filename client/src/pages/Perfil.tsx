/**
 * Perfil do Usuário — Centro de controle pessoal
 * Dados Pessoais, Segurança, Notificações e Plano.
 */
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Bell,
  Crown,
  Mail,
  Phone,
  Building2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Perfil() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-vpex-green/20 border-2 border-vpex-green/40 flex items-center justify-center shrink-0">
          <User size={28} className="text-vpex-green" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold font-[Sora] text-foreground">João Silva</h2>
          <p className="text-sm text-muted-foreground">Proprietário · Franquia Boticário #042</p>
          <div className="flex items-center gap-2 mt-2">
            <Crown size={12} className="text-vpex-green" />
            <span className="text-xs font-medium text-vpex-green bg-vpex-green/10 px-2.5 py-0.5 rounded-full">
              Plano Scale
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="dados" className="gap-2 data-[state=active]:bg-vpex-green/10 data-[state=active]:text-vpex-green">
              <User size={14} /> Dados
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2 data-[state=active]:bg-vpex-green/10 data-[state=active]:text-vpex-green">
              <Shield size={14} /> Segurança
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="gap-2 data-[state=active]:bg-vpex-green/10 data-[state=active]:text-vpex-green">
              <Bell size={14} /> Alertas
            </TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="dados" className="mt-4 space-y-4">
            <div className="glass-card p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Nome Completo</label>
                  <Input defaultValue="João Silva" className="bg-muted/30 border-border" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Empresa</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input defaultValue="Franquia Boticário #042" className="pl-9 bg-muted/30 border-border" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input defaultValue="joao@franquia042.com.br" className="pl-9 bg-muted/30 border-border" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Telefone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input defaultValue="(62) 99999-0042" className="pl-9 bg-muted/30 border-border" />
                  </div>
                </div>
              </div>
              <Button
                className="bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold"
                onClick={() => toast("Dados salvos com sucesso!", { description: "Suas informações foram atualizadas." })}
              >
                Salvar Alterações
              </Button>
            </div>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="seguranca" className="mt-4 space-y-4">
            <div className="glass-card p-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Senha Atual</label>
                <Input type="password" placeholder="••••••••" className="bg-muted/30 border-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Nova Senha</label>
                  <Input type="password" placeholder="••••••••" className="bg-muted/30 border-border" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Confirmar Nova Senha</label>
                  <Input type="password" placeholder="••••••••" className="bg-muted/30 border-border" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Autenticação 2FA</p>
                  <p className="text-xs text-muted-foreground">Camada extra de segurança</p>
                </div>
                <Switch />
              </div>
              <Button
                className="bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold"
                onClick={() => toast("Senha atualizada!", { description: "Sua senha foi alterada com sucesso." })}
              >
                Atualizar Senha
              </Button>
            </div>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" className="mt-4 space-y-4">
            <div className="glass-card p-5 space-y-3">
              {[
                { label: "Alertas de WhatsApp", desc: "Notificações de disparos e respostas", defaultChecked: true },
                { label: "Relatórios Semanais", desc: "Resumo de marketing por e-mail", defaultChecked: true },
                { label: "Alertas de Estoque", desc: "Itens com estoque baixo", defaultChecked: false },
                { label: "Novos Treinamentos", desc: "Quando a VPEX publicar novos cursos", defaultChecked: true },
                { label: "Metas e Conquistas", desc: "Checkpoints alcançados no crescimento", defaultChecked: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Logout */}
      <motion.div variants={fadeUp}>
        <Button
          variant="outline"
          className="gap-2 border-vpex-red/30 text-vpex-red hover:bg-vpex-red/10"
          onClick={() => toast("Logout em breve", { description: "Esta funcionalidade será ativada em breve." })}
        >
          <LogOut size={14} /> Sair da Conta
        </Button>
      </motion.div>
    </motion.div>
  );
}
