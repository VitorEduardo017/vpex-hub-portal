import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Loader2,
  Package,
  QrCode,
  Receipt,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ─── Types ─── */
type PaymentMethod = "pix" | "boleto" | "credit_card";

const typeConfig = {
  ebook: { label: "E-book", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  mentoria: { label: "Mentoria", icon: GraduationCap, color: "text-vpex-green", bg: "bg-vpex-green/10", border: "border-vpex-green/20" },
  servico: { label: "Serviço", icon: Wrench, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  ferramenta: { label: "Ferramenta", icon: Package, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
} as const;
type ProductType = keyof typeof typeConfig;

const paymentMethods = [
  { key: "pix" as const, label: "PIX", desc: "Aprovação imediata · Até 24h para expirar", icon: QrCode },
  { key: "boleto" as const, label: "Boleto", desc: "Vencimento em 1 dia útil", icon: Receipt },
  { key: "credit_card" as const, label: "Cartão de Crédito", desc: "Em até 12x", icon: CreditCard },
];

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ─── Product Card in catalog ─── */
function CatalogCard({
  product,
  onSelect,
}: {
  product: { id: number; name: string; description: string | null; type: string; priceCents: number; featured: boolean };
  onSelect: () => void;
}) {
  const cfg = typeConfig[product.type as ProductType] ?? typeConfig.ferramenta;
  const Icon = cfg.icon;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`p-5 rounded-2xl border ${cfg.border} ${cfg.bg} flex flex-col gap-4 cursor-pointer transition-shadow hover:shadow-lg relative`}
      onClick={onSelect}
    >
      {product.featured && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-vpex-green/20 text-vpex-green border border-vpex-green/30">
            <Star size={9} fill="currentColor" />
            Destaque
          </span>
        </div>
      )}

      <div className={`w-11 h-11 rounded-xl border ${cfg.border} bg-white/5 flex items-center justify-center`}>
        <Icon size={20} className={cfg.color} />
      </div>

      <div className="flex-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
        <h3 className="text-sm font-semibold text-foreground leading-snug mt-0.5 mb-1 pr-14">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-sm font-black text-foreground">{formatPrice(product.priceCents)}</span>
        <Button size="sm" className="text-xs gap-1.5 bg-vpex-green text-black font-bold hover:shadow-[0_0_16px_rgba(57,255,20,0.3)]">
          Comprar
          <ChevronRight size={12} />
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Checkout Modal / Panel ─── */
function CheckoutPanel({
  product: p,
  onClose,
}: {
  product: { id: number; name: string; description: string | null; type: string; priceCents: number };
  onClose: () => void;
}) {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"method" | "details" | "payment" | "success">("method");
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [phone, setPhone] = useState("");

  const cfg = typeConfig[p.type as ProductType] ?? typeConfig.ferramenta;

  const { data: me } = trpc.auth.me.useQuery(undefined, { retry: false });
  const isLoggedIn = !!me;

  const comprarMutation = trpc.produtos.comprar.useMutation({
    onSuccess: (data) => {
      if (data.message) {
        alert(data.message);
        return;
      }
      setResult(data);
      setStep("success");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const [result, setResult] = useState<{
    purchaseId: number;
    status: string;
    paymentUrl: string | null;
    pixQrCode: string | null;
    pixCopyPaste: string | null;
    message: string | null;
  } | null>(null);

  function handleConfirm() {
    if (!isLoggedIn) {
      navigate("/entrar");
      return;
    }
    comprarMutation.mutate({
      productId: p.id,
      paymentMethod: method,
      cpfCnpj: cpfCnpj || undefined,
      phone: phone || undefined,
    });
    setStep("payment");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl border ${cfg.border} ${cfg.bg} flex items-center justify-center`}>
              <cfg.icon size={16} className={cfg.color} />
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</p>
              <h3 className="text-sm font-semibold text-foreground leading-tight">{p.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Price banner */}
        <div className="px-5 py-3 border-b border-white/5 bg-vpex-green/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Valor total</span>
            <span className="text-xl font-black text-vpex-green">{formatPrice(p.priceCents)}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="p-5 space-y-4">
          {/* Step: method selection */}
          {(step === "method" || step === "details") && (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Forma de pagamento</p>
              <div className="space-y-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.key}
                    onClick={() => setMethod(pm.key)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                      method === pm.key
                        ? "border-vpex-green/40 bg-vpex-green/10 text-foreground"
                        : "border-white/5 bg-white/[0.02] text-muted-foreground hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <pm.icon size={18} className={method === pm.key ? "text-vpex-green" : ""} />
                    <div>
                      <p className="text-xs font-semibold">{pm.label}</p>
                      <p className="text-[10px] opacity-60">{pm.desc}</p>
                    </div>
                    {method === pm.key && (
                      <CheckCircle2 size={16} className="text-vpex-green ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              {/* Optional fields */}
              <div className="space-y-3 pt-1">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5">CPF/CNPJ (opcional)</Label>
                  <Input
                    placeholder="000.000.000-00"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="h-9 text-sm bg-white/[0.03] border-white/5"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5">WhatsApp (opcional)</Label>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-sm bg-white/[0.03] border-white/5"
                  />
                </div>
              </div>

              {!isLoggedIn && (
                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-400">
                  Você precisará fazer login antes de confirmar o pagamento.
                </div>
              )}

              <Button
                className="w-full bg-vpex-green text-black font-black gap-2 hover:shadow-[0_0_20px_rgba(57,255,20,0.35)]"
                onClick={handleConfirm}
              >
                {isLoggedIn ? "Confirmar compra" : "Entrar e comprar"}
                <ChevronRight size={14} />
              </Button>
            </>
          )}

          {/* Step: payment processing */}
          {step === "payment" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader2 size={32} className="text-vpex-green animate-spin" />
              <p className="text-sm font-semibold text-foreground">Processando pagamento…</p>
              <p className="text-xs text-muted-foreground text-center">Estamos criando seu pedido no Asaas. Aguarde um instante.</p>
            </div>
          )}

          {/* Step: success */}
          {step === "success" && result && (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-vpex-green/15 border border-vpex-green/30 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-vpex-green" />
                </div>
                <div className="text-center">
                  <h4 className="text-base font-bold text-foreground">Pedido criado!</h4>
                  <p className="text-xs text-muted-foreground mt-1">Complete o pagamento para liberar o acesso.</p>
                </div>
              </div>

              {/* PIX */}
              {method === "pix" && result.pixCopyPaste && (
                <div className="space-y-3">
                  {result.pixQrCode && (
                    <div className="flex justify-center">
                      <img
                        src={`data:image/png;base64,${result.pixQrCode}`}
                        alt="QR Code PIX"
                        className="w-48 h-48 rounded-xl border border-white/5"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5">PIX Copia e Cola</p>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={result.pixCopyPaste}
                        className="text-[10px] bg-white/[0.02] border-white/5 flex-1 font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 text-xs border-vpex-green/30 text-vpex-green"
                        onClick={() => navigator.clipboard.writeText(result.pixCopyPaste!)}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Boleto */}
              {method === "boleto" && result.paymentUrl && (
                <a href={result.paymentUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2 bg-vpex-green text-black font-bold">
                    <Receipt size={14} />
                    Ver boleto bancário
                  </Button>
                </a>
              )}

              {/* Card */}
              {method === "credit_card" && result.paymentUrl && (
                <a href={result.paymentUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2 bg-vpex-green text-black font-bold">
                    <CreditCard size={14} />
                    Inserir dados do cartão
                  </Button>
                </a>
              )}

              <Link href="/meus-produtos">
                <Button variant="outline" className="w-full gap-2 border-white/10 text-sm">
                  Ver meus produtos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
type FilterType = "todos" | ProductType;

export default function Checkout() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [selected, setSelected] = useState<null | {
    id: number;
    name: string;
    description: string | null;
    type: string;
    priceCents: number;
    featured: boolean;
  }>(null);

  const { data: products, isLoading } = trpc.produtos.listar.useQuery();

  const filters: { key: FilterType; label: string; icon: React.ElementType }[] = [
    { key: "todos", label: "Todos", icon: Package },
    { key: "ebook", label: "E-books", icon: BookOpen },
    { key: "mentoria", label: "Mentorias", icon: GraduationCap },
    { key: "servico", label: "Serviços", icon: Wrench },
    { key: "ferramenta", label: "Ferramentas", icon: Package },
  ];

  const filtered = (products ?? []).filter(
    (p) => activeFilter === "todos" || p.type === activeFilter
  );

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-[#080808] text-foreground">
      {/* Minimal nav */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <span className="text-lg font-black tracking-tight font-[Sora]">
              VPEX<span className="text-vpex-green">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/meus-produtos">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1.5">
                <Package size={13} />
                Meus produtos
              </Button>
            </Link>
            <Link href="/painel">
              <Button size="sm" className="text-xs bg-vpex-green text-black font-bold gap-1.5">
                Entrar no Hub
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-vpex-green/30 bg-vpex-green/10 text-vpex-green text-xs font-semibold mb-4">
            <Star size={11} fill="currentColor" />
            Catálogo VPEX
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-[Sora] mb-3 text-foreground leading-tight">
            Escolha sua solução<br />
            <span className="text-vpex-green">e comece hoje</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            E-books, mentorias, serviços e ferramentas para digitalizar e escalar sua operação nos marketplaces.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5">
            {filters.map((f) => {
              const Icon = f.icon;
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-vpex-green/20 text-vpex-green border border-vpex-green/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon size={12} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-52 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Star size={12} className="text-vpex-green" fill="currentColor" />
                  Destaques
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {featured.map((p) => (
                    <CatalogCard key={p.id} product={p} onSelect={() => setSelected(p)} />
                  ))}
                </div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="space-y-4">
                {featured.length > 0 && (
                  <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Mais produtos
                  </h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {rest.map((p) => (
                    <CatalogCard key={p.id} product={p} onSelect={() => setSelected(p)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Back link */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1.5">
              <ArrowLeft size={12} />
              Voltar para o site
            </Button>
          </Link>
        </div>
      </div>

      {/* Checkout panel overlay */}
      <AnimatePresence>
        {selected && (
          <CheckoutPanel product={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
