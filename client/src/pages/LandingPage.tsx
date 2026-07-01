import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers,
  LogIn,
  Package,
  Rocket,
  ShoppingBag,
  Sprout,
  Star,
  Store,
  TrendingUp,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

/* ─── Floating Particles ─── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-vpex-green/10"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
          animate={{
            y: [0, -(Math.random() * 80 + 40)],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 7,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

/* ─── Section wrapper com fade-in ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Marketplace Logos ─── */
const marketplaces = [
  { name: "Mercado Livre", color: "#FFE600", bg: "#3483FA", emoji: "🛒" },
  { name: "Shopee", color: "#fff", bg: "#EE4D2D", emoji: "🛍️" },
  { name: "TikTok Shop", color: "#fff", bg: "#000000", emoji: "🎵" },
  { name: "Amazon", color: "#FF9900", bg: "#131921", emoji: "📦" },
  { name: "Magalu", color: "#fff", bg: "#0066CC", emoji: "🏪" },
];

/* ─── Segments ─── */
const segments = [
  {
    icon: Store,
    label: "Varejo",
    tagline: "Sua loja nos maiores marketplaces",
    desc: "Configure e gerencie suas operações no Mercado Livre, Shopee e TikTok Live Shop com suporte especializado.",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    tags: ["Mercado Livre", "Shopee", "TikTok Shop"],
  },
  {
    icon: Sprout,
    label: "Agro",
    tagline: "Do campo ao consumidor final",
    desc: "Digitalize a cadeia do agronegócio, abra canais D2C e venda para o Brasil inteiro sem sair da fazenda.",
    color: "from-green-500/20 to-green-600/5",
    border: "border-green-500/20",
    iconColor: "text-green-400",
    tags: ["E-commerce B2B", "Canal próprio", "Marketplaces"],
  },
  {
    icon: Layers,
    label: "Indústria",
    tagline: "Canal digital direto ao cliente",
    desc: "Monte seu canal D2C, elimine intermediários e amplie sua margem com presença digital estratégica.",
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    tags: ["D2C", "Pedidos digitais", "Gestão de canal"],
  },
  {
    icon: TrendingUp,
    label: "Franquias",
    tagline: "Expansão e gestão digital da rede",
    desc: "KPIs em tempo real, treinamento da equipe e presença digital coordenada para toda a sua rede.",
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    tags: ["KPIs & Relatórios", "Academia", "Multi-unidades"],
  },
];

/* ─── Products ─── */
const productTypes = [
  {
    icon: BookOpen,
    label: "E-books",
    desc: "Guias práticos para dominar os marketplaces, montar seu funil e escalar vendas com método.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    example: "Como vender no ML do zero ao R$ 50k/mês",
  },
  {
    icon: GraduationCap,
    label: "Mentorias",
    desc: "Sessões 1:1 ou em grupo com especialistas VPEX. Diagnóstico, estratégia e acompanhamento.",
    color: "text-vpex-green",
    bg: "bg-vpex-green/10",
    border: "border-vpex-green/20",
    example: "Mentoria de Marketplace — 4 sessões",
  },
  {
    icon: Wrench,
    label: "Serviços",
    desc: "Setup completo da sua operação digital. Criamos, configuramos e gerenciamos por você.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    example: "Setup Completo Mercado Livre",
  },
  {
    icon: Package,
    label: "Ferramentas",
    desc: "Acesso ao Hub VPEX e ferramentas proprietárias com dashboards, automações e inteligência de dados.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    example: "Hub VPEX — Painel de Gestão Completo",
  },
];

/* ─── Steps ─── */
const steps = [
  { n: "01", icon: ShoppingBag, title: "Escolha seu produto", desc: "Navegue pelo catálogo e selecione o e-book, mentoria ou serviço que resolve sua necessidade." },
  { n: "02", icon: Zap, title: "Pagamento em segundos", desc: "PIX, boleto ou cartão via Asaas. Aprovação instantânea, sem burocracia." },
  { n: "03", icon: Rocket, title: "Acesse e escale", desc: "Entre no Hub VPEX, acesse seus produtos e comece a digitalizar seu negócio imediatamente." },
];

/* ─── Stats ─── */
const stats = [
  { value: 500, suffix: "+", label: "Clientes atendidos" },
  { value: 50, suffix: "M+", label: "Em vendas geradas (R$)" },
  { value: 4, suffix: "", label: "Segmentos de mercado" },
  { value: 98, suffix: "%", label: "Satisfação dos clientes" },
];

/* ─── Testimonials ─── */
const testimonials = [
  {
    name: "Carlos Mendes",
    role: "Dono de Loja • Varejo",
    text: "Em 3 meses com a VPEX, minha loja no Mercado Livre saiu de R$ 8k para R$ 47k/mês. Método testado e aplicado.",
    stars: 5,
    avatar: "CM",
  },
  {
    name: "Ana Rodrigues",
    role: "Produtora Rural • Agro",
    text: "A VPEX me ajudou a criar minha loja online e hoje vendo para todo o Brasil. Não preciso de intermediários.",
    stars: 5,
    avatar: "AR",
  },
  {
    name: "Roberto Lima",
    role: "Franqueado • Franquias",
    text: "Saí de 12 clientes/mês para 40+ com as campanhas locais da VPEX. Vale cada centavo do investimento.",
    stars: 5,
    avatar: "RL",
  },
];

/* ══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(57,255,20,1) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ══════ NAVBAR ══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-vpex-green flex items-center justify-center">
              <span className="text-sm font-bold text-black font-[Sora]">V</span>
            </div>
            <div>
              <span className="text-base font-bold text-white font-[Sora]">VPEX Hub</span>
              <span className="hidden sm:block text-[9px] text-vpex-green/60 font-medium uppercase tracking-[0.2em] leading-none">
                Soluções Digitais
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <a href="#segmentos" className="hover:text-white transition-colors">Segmentos</a>
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/checkout">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-vpex-green/30 text-vpex-green text-sm font-medium hover:bg-vpex-green/10 transition-all">
                Ver produtos
              </button>
            </Link>
            <Link href="/entrar">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vpex-green text-black text-sm font-bold font-[Sora] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all">
                <LogIn size={14} />
                <span>Acessar Hub</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <FloatingParticles />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(57,255,20,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(57,255,20,0.04) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-vpex-green/20 bg-vpex-green/5 mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-vpex-green animate-pulse" />
              <span className="text-xs font-medium text-vpex-green uppercase tracking-[0.15em]">
                Plataforma de Digitalização Empresarial
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-[Sora] leading-[1.05] tracking-tight mb-6">
              Seu negócio no{" "}
              <span className="relative">
                <span className="text-vpex-green">digital.</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-px bg-vpex-green/40"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </span>
              <br />
              Venda mais no{" "}
              <span className="text-white/40">ML, Shopee</span>
              <br />
              <span className="text-white/40">e TikTok Shop.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mb-10">
              Soluções completas para <strong className="text-white/80">varejo, agro, indústria e franquias</strong> que
              querem crescer nos marketplaces — com método, suporte e ferramentas proprietárias.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl bg-vpex-green text-black font-bold font-[Sora] text-base hover:shadow-[0_0_40px_rgba(57,255,20,0.4)] transition-all group"
                >
                  Ver todas as soluções
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/entrar">
                <button className="flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-medium transition-colors group">
                  Já sou cliente — Acessar Hub
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Marketplace pills */}
            <div className="flex flex-wrap items-center gap-3 mt-12">
              <span className="text-xs text-white/30 font-medium">Vendemos em:</span>
              {marketplaces.map((m) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + marketplaces.indexOf(m) * 0.08 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/60"
                >
                  <span>{m.emoji}</span>
                  {m.name}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + stats.indexOf(s) * 0.1 }}
                className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <div className="text-3xl font-black text-vpex-green font-[Sora]">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SEGMENTOS ══════ */}
      <Section id="segmentos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs text-vpex-green font-bold uppercase tracking-[0.2em] mb-3">Para quem é</p>
          <h2 className="text-4xl sm:text-5xl font-black font-[Sora] tracking-tight">
            Seu segmento, nossa especialidade
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            Não somos uma solução genérica. Cada segmento tem sua estratégia, seus marketplaces e seus desafios.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {segments.map((seg, i) => {
            const Icon = seg.icon;
            const isHovered = hoveredSegment === i;
            return (
              <motion.div
                key={seg.label}
                onHoverStart={() => setHoveredSegment(i)}
                onHoverEnd={() => setHoveredSegment(null)}
                whileHover={{ y: -4 }}
                className={`relative p-7 rounded-2xl border ${seg.border} bg-gradient-to-br ${seg.color} cursor-default overflow-hidden transition-all duration-300`}
              >
                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="absolute inset-0 bg-white/[0.02]"
                />
                <div className={`w-12 h-12 rounded-xl bg-white/5 border ${seg.border} flex items-center justify-center mb-5`}>
                  <Icon size={22} className={seg.iconColor} />
                </div>
                <h3 className="text-xl font-bold font-[Sora] text-white mb-1">{seg.label}</h3>
                <p className="text-sm font-medium text-white/60 mb-3">{seg.tagline}</p>
                <p className="text-sm text-white/40 leading-relaxed mb-5">{seg.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {seg.tags.map((t) => (
                    <span key={t} className={`text-[11px] px-2.5 py-1 rounded-full border ${seg.border} ${seg.iconColor} bg-white/[0.03]`}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ══════ SOLUÇÕES ══════ */}
      <Section id="solucoes" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-vpex-green font-bold uppercase tracking-[0.2em] mb-3">O que oferecemos</p>
            <h2 className="text-4xl sm:text-5xl font-black font-[Sora] tracking-tight">
              Nossas soluções
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Do conteúdo educacional ao serviço completo de operação. Escolha o que faz sentido para o seu momento.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productTypes.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.label}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-6 rounded-2xl border ${p.border} ${p.bg} flex flex-col gap-4`}
                >
                  <div className={`w-11 h-11 rounded-xl border ${p.border} bg-white/5 flex items-center justify-center`}>
                    <Icon size={20} className={p.color} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold font-[Sora] ${p.color} mb-1`}>{p.label}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <p className="text-[11px] text-white/30 mb-1">Exemplo:</p>
                    <p className="text-xs text-white/60 font-medium">{p.example}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-vpex-green text-black font-bold font-[Sora] hover:shadow-[0_0_40px_rgba(57,255,20,0.3)] transition-all group"
              >
                Ver catálogo completo e preços
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ══════ COMO FUNCIONA ══════ */}
      <Section id="como-funciona" className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs text-vpex-green font-bold uppercase tracking-[0.2em] mb-3">Simples assim</p>
          <h2 className="text-4xl sm:text-5xl font-black font-[Sora] tracking-tight">
            Como funciona
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-vpex-green/30 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-2xl border border-vpex-green/20 bg-vpex-green/5 flex flex-col items-center justify-center gap-2">
                    <Icon size={28} className="text-vpex-green" />
                    <span className="text-[10px] text-vpex-green/40 font-bold tracking-widest">{step.n}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold font-[Sora] mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-64">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ══════ DEPOIMENTOS ══════ */}
      <Section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-vpex-green font-bold uppercase tracking-[0.2em] mb-3">Resultados reais</p>
            <h2 className="text-4xl sm:text-5xl font-black font-[Sora] tracking-tight">
              O que dizem nossos clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} className="fill-vpex-green text-vpex-green" />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vpex-green/20 border border-vpex-green/30 flex items-center justify-center text-xs font-bold text-vpex-green">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════ POR QUE VPEX ══════ */}
      <Section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs text-vpex-green font-bold uppercase tracking-[0.2em] mb-4">Por que VPEX</p>
            <h2 className="text-4xl sm:text-5xl font-black font-[Sora] tracking-tight mb-6">
              Não somos uma agência.<br />
              <span className="text-vpex-green">Somos seus sócios</span><br />
              no digital.
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              Enquanto agências entregam relatório, a VPEX entrega resultado.
              Nosso modelo é baseado em performance: você cresce, nós crescemos juntos.
            </p>
            <div className="space-y-4">
              {[
                "Suporte via WhatsApp em até 2h",
                "Relatórios semanais com dados reais",
                "Especialistas em cada segmento",
                "Acesso ao Hub VPEX com todos os seus produtos",
                "Metodologia validada em 500+ clientes",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-vpex-green shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Taxa de renovação", value: "94%", icon: "🔄" },
              { label: "Tempo médio de resultado", value: "60 dias", icon: "⚡" },
              { label: "Clientes ativos", value: "500+", icon: "👥" },
              { label: "Marketplaces integrados", value: "10+", icon: "🛒" },
            ].map((m) => (
              <div key={m.label} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                <div className="text-3xl mb-2">{m.icon}</div>
                <div className="text-2xl font-black text-vpex-green font-[Sora]">{m.value}</div>
                <div className="text-xs text-white/40 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════ CTA FINAL ══════ */}
      <Section className="py-32 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(57,255,20,0.08) 0%, transparent 70%)",
          }}
        />
        <FloatingParticles />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-5xl sm:text-6xl font-black font-[Sora] tracking-tight mb-6">
            Pronto para<br />
            <span className="text-vpex-green">digitalizar?</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Escolha seu produto, faça o pagamento e acesse o Hub VPEX em minutos.
            Seu negócio no digital começa hoje.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-10 py-5 rounded-xl bg-vpex-green text-black font-black font-[Sora] text-lg hover:shadow-[0_0_60px_rgba(57,255,20,0.5)] transition-all group"
              >
                Começar agora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/entrar">
              <button className="flex items-center gap-2 px-6 py-5 text-white/50 hover:text-white text-sm font-medium transition-colors group">
                Já sou cliente — Acessar Hub
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-vpex-green flex items-center justify-center">
              <span className="text-sm font-bold text-black font-[Sora]">V</span>
            </div>
            <span className="text-sm font-semibold text-white font-[Sora]">VPEX Hub</span>
          </div>
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} VPEX Solutions. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/30">
            <a href="#" className="hover:text-white transition-colors">Termos de uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <Link href="/entrar">
              <span className="hover:text-white transition-colors cursor-pointer">Acessar Hub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
