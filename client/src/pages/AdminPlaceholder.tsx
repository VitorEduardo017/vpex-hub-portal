/**
 * AdminPlaceholder — Páginas em construção do painel admin
 */
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-vpex-red/10 border border-vpex-red/20 flex items-center justify-center mx-auto mb-4">
          <Construction size={28} className="text-vpex-red" />
        </div>
        <h3 className="text-lg font-bold text-foreground font-[Sora] mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Esta seção do painel administrativo está em desenvolvimento. Em breve você terá acesso completo a esta funcionalidade.
        </p>
      </motion.div>
    </div>
  );
}
