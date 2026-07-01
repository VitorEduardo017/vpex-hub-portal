import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  ExternalLink,
  GraduationCap,
  Package,
  PackageOpen,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

/* ─── Helpers ─── */
const typeConfig = {
  ebook: {
    label: "E-book",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  mentoria: {
    label: "Mentoria",
    icon: GraduationCap,
    color: "text-vpex-green",
    bg: "bg-vpex-green/10",
    border: "border-vpex-green/20",
  },
  servico: {
    label: "Serviço",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  ferramenta: {
    label: "Ferramenta",
    icon: Package,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
} as const;

type ProductType = keyof typeof typeConfig;

const statusLabel: Record<string, { label: string; color: string }> = {
  paid: { label: "Pago", color: "text-vpex-green bg-vpex-green/10 border-vpex-green/20" },
  pending: { label: "Aguardando pagamento", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  cancelled: { label: "Cancelado", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  refunded: { label: "Reembolsado", color: "text-white/40 bg-white/5 border-white/10" },
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ─── Empty state ─── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6">
        <PackageOpen size={32} className="text-white/20" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum produto ainda</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Você ainda não adquiriu nenhum produto VPEX. Explore nosso catálogo e comece hoje.
      </p>
      <Link href="/checkout">
        <Button className="bg-vpex-green text-black font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] gap-2">
          <ShoppingBag size={14} />
          Ver catálogo de produtos
        </Button>
      </Link>
    </div>
  );
}

/* ─── Product Card ─── */
function ProductCard({
  purchase,
  product,
}: {
  purchase: {
    id: number;
    status: string;
    amountCents: number;
    paymentMethod: string;
    paymentUrl: string | null;
    createdAt: Date;
    paidAt: Date | null;
    expiresAt: Date | null;
  };
  product: {
    id: number;
    name: string;
    description: string | null;
    type: string;
    contentUrl: string | null;
  };
}) {
  const cfg = typeConfig[product.type as ProductType] ?? typeConfig.ferramenta;
  const Icon = cfg.icon;
  const st = statusLabel[purchase.status] ?? statusLabel.pending;
  const isPaid = purchase.status === "paid";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-5 rounded-2xl border ${cfg.border} ${cfg.bg} flex flex-col gap-4`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl border ${cfg.border} bg-white/5 flex items-center justify-center shrink-0`}>
          <Icon size={20} className={cfg.color} />
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${st.color}`}>
          {st.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div>
          <p className="text-xs font-bold text-foreground">{formatPrice(purchase.amountCents)}</p>
          <p className="text-[10px] text-muted-foreground">
            {new Date(purchase.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isPaid && purchase.paymentUrl && (
            <a href={purchase.paymentUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-amber-400/30 text-amber-400 hover:bg-amber-400/10">
                <ExternalLink size={12} />
                Pagar
              </Button>
            </a>
          )}
          {isPaid && product.contentUrl && (
            <a href={product.contentUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="text-xs gap-1.5 bg-vpex-green text-black font-bold hover:shadow-[0_0_16px_rgba(57,255,20,0.3)]">
                <Download size={12} />
                Acessar
              </Button>
            </a>
          )}
          {isPaid && !product.contentUrl && (
            <span className="text-[11px] text-vpex-green font-medium">✓ Ativo</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function MeusProdutos() {
  const [activeTab, setActiveTab] = useState<"todos" | ProductType>("todos");
  const { data: compras, isLoading } = trpc.produtos.minhasCompras.useQuery();

  const tabs: { key: "todos" | ProductType; label: string; icon: React.ElementType }[] = [
    { key: "todos", label: "Todos", icon: Package },
    { key: "ebook", label: "E-books", icon: BookOpen },
    { key: "mentoria", label: "Mentorias", icon: GraduationCap },
    { key: "servico", label: "Serviços", icon: Wrench },
    { key: "ferramenta", label: "Ferramentas", icon: Package },
  ];

  const filtered = compras?.filter(
    (c) => activeTab === "todos" || c.product.type === activeTab
  ) ?? [];

  const paidCount = compras?.filter((c) => c.purchase.status === "paid").length ?? 0;
  const pendingCount = compras?.filter((c) => c.purchase.status === "pending").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-[Sora] text-foreground">Meus Produtos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Todos os e-books, mentorias, serviços e ferramentas que você adquiriu da VPEX.
          </p>
        </div>
        <Link href="/checkout">
          <Button className="gap-2 bg-vpex-green text-black font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            <ShoppingBag size={14} />
            Adquirir mais
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      {compras && compras.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
            <div className="text-2xl font-black text-foreground font-[Sora]">{compras.length}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Total de produtos</div>
          </div>
          <div className="p-4 rounded-xl border border-vpex-green/20 bg-vpex-green/5 text-center">
            <div className="text-2xl font-black text-vpex-green font-[Sora]">{paidCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Ativos / pagos</div>
          </div>
          <div className="p-4 rounded-xl border border-amber-400/20 bg-amber-400/5 text-center">
            <div className="text-2xl font-black text-amber-400 font-[Sora]">{pendingCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Aguardando pagamento</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-vpex-green/15 text-vpex-green border border-vpex-green/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((item) => (
            <ProductCard
              key={item.purchase.id}
              purchase={item.purchase}
              product={item.product}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
