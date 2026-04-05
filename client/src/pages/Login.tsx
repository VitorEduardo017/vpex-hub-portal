/**
 * Login — Tela de Entrada Premium
 * Glass Cockpit Design | VPEX Hub
 *
 * Layout split-screen: Lado esquerdo com mensagens rotativas
 * que tocam nas dores dos franqueados. Lado direito com formulário.
 * Sem sidebar, sem header — experiência imersiva.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Users,
  MapPin,
  BarChart3,
  Flame,
  Heart,
  Clock,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

/* ─── Pain Point Messages ─── */
interface PainSlide {
  icon: React.ElementType;
  tag: string;
  tagColor: string;
  headline: string;
  subtext: string;
  stat: string;
  statLabel: string;
}

const painSlides: PainSlide[] = [
  {
    icon: TrendingUp,
    tag: "MARGEM",
    tagColor: "bg-red-500/20 text-red-400 border-red-500/30",
    headline: "Margem de 12%? Cada cliente que a VPEX traz vale ouro pra você.",
    subtext:
      "Fatura R$ 100k, lucra R$ 12k. Qualquer imprevisto = mês no zero. A VPEX traz +30 clientes/mês — cada um é lucro direto no seu bolso.",
    stat: "+30",
    statLabel: "clientes/mês",
  },
  {
    icon: Shield,
    tag: "SUPORTE",
    tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    headline: "Franqueadora te vendeu e sumiu. A VPEX fica do seu lado.",
    subtext:
      "1 consultor pra 100 unidades. Visita 2x por ano. 0800 que nunca retorna. Na VPEX: WhatsApp direto, reunião mensal, relatório semanal.",
    stat: "2h",
    statLabel: "tempo de resposta",
  },
  {
    icon: Zap,
    tag: "BURNOUT",
    tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    headline: "Você trabalha 12h/dia trazendo cliente? Marketing faz isso enquanto você dorme.",
    subtext:
      "10-12h por dia, 6 dias por semana, zero folga. Você comprou um emprego, não um negócio. Marketing automático trabalha 24/7 por você.",
    stat: "24/7",
    statLabel: "marketing ativo",
  },
  {
    icon: Target,
    tag: "MARKETING",
    tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    headline: "Franqueadora faz outdoor na rodovia. VPEX coloca placa 'vire aqui, 500m'.",
    subtext:
      "Você paga R$ 5.000/mês de taxa de marketing e o resultado é ZERO cliente na porta. A VPEX faz tráfego hiperlocal: só pra quem mora a 3-5km da sua loja.",
    stat: "5km",
    statLabel: "raio de captação",
  },
  {
    icon: Users,
    tag: "EQUIPE",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    headline: "Loja vazia desmotiva funcionário. Loja cheia retém talento.",
    subtext:
      "Turnover de 50-80% ao ano. Treina funcionário que sai em 3 meses. Mais movimento = pode pagar melhor = equipe motivada = atendimento de qualidade.",
    stat: "-60%",
    statLabel: "rotatividade",
  },
  {
    icon: MapPin,
    tag: "PONTO",
    tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    headline: "Ponto ruim? Marketing digital faz cliente VIR ATÉ VOCÊ.",
    subtext:
      "Investiu R$ 300k num ponto que não funciona. Muito tarde pra voltar atrás. Google Ads traz cliente de 5km. Instagram mostra sua loja pra vizinhança inteira.",
    stat: "R$ 300k",
    statLabel: "protegidos",
  },
  {
    icon: Flame,
    tag: "INVESTIMENTO",
    tagColor: "bg-red-500/20 text-red-400 border-red-500/30",
    headline: "Você já investiu R$ 250k. R$ 997/mês pode salvar isso.",
    subtext:
      "Investiu R$ 200k, colocou mais R$ 50k, e continua afundando. Não é sobre gastar mais. É sobre fazer render o que já gastou. A VPEX é a intervenção a tempo.",
    stat: "25x",
    statLabel: "ROI médio",
  },
  {
    icon: Heart,
    tag: "PARCERIA",
    tagColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    headline: "Eu sei que você não pode falar isso com a franqueadora. Pode falar com a VPEX.",
    subtext:
      "Outros franqueados são concorrentes. Franqueadora é fornecedora, não parceira. Você se sente sozinho na batalha. A VPEX já atendeu +20 franquias — entende sua realidade.",
    stat: "+20",
    statLabel: "franquias atendidas",
  },
  {
    icon: Clock,
    tag: "SAZONALIDADE",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    headline: "Páscoa vende sozinha. Agosto precisa de marketing.",
    subtext:
      "4-6 meses bons, 6-8 ruins. Caixa aperta na entressafra, mas as contas não esperam. Marketing off-season agressivo suaviza a curva e mantém o caixa girando.",
    stat: "12",
    statLabel: "meses faturando",
  },
  {
    icon: BarChart3,
    tag: "REALIDADE",
    tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    headline: "Franqueadora te vendeu sonho. VPEX te mostra realidade e te ajuda a crescer nela.",
    subtext:
      "Mês 0-6: lua de mel. Mês 7-12: onde tá o lucro? Mês 13+: desencanto total. A VPEX não promete milagre. Traz 30 clientes/mês. Você faz o resto.",
    stat: "100%",
    statLabel: "transparência",
  },
];

/* ─── Floating Particles ─── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-vpex-green/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ─── */
export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  /* Auto-rotate slides every 6 seconds */
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % painSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    },
    [currentSlide]
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % painSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + painSlides.length) % painSlides.length
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    setIsLoading(true);
    // Simulated login
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    toast.success("Bem-vindo ao VPEX Hub!", {
      description: "Redirecionando para o painel...",
    });
    setTimeout(() => setLocation("/"), 800);
  };

  const slide = painSlides[currentSlide];
  const SlideIcon = slide.icon;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* ═══ LEFT SIDE — Pain Points Carousel ═══ */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-10 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(57,255,20,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(57,255,20,0.03) 0%, transparent 50%)",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(57,255,20,1) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <FloatingParticles />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vpex-green flex items-center justify-center">
              <span className="text-base font-bold text-black font-[Sora]">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-[Sora] tracking-tight">
                VPEX Hub
              </h1>
              <p className="text-[10px] text-vpex-green/70 font-medium uppercase tracking-[0.2em]">
                Portal de Gestão Estratégica
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Tag */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${slide.tagColor}`}
                >
                  <SlideIcon size={12} />
                  {slide.tag}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Headline */}
              <h2 className="text-3xl lg:text-[2.5rem] font-bold text-white font-[Sora] leading-[1.15] tracking-tight">
                {slide.headline.split("VPEX").map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <span className="text-vpex-green">VPEX</span>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </h2>

              {/* Subtext */}
              <p className="text-base text-white/50 leading-relaxed max-w-lg">
                {slide.subtext}
              </p>

              {/* Stat Card */}
              <div className="flex items-center gap-4 mt-2">
                <div className="glass-card px-5 py-3 inline-flex items-center gap-3">
                  <span className="text-3xl font-bold text-vpex-green font-[Sora]">
                    {slide.stat}
                  </span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    {slide.statLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {painSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 bg-vpex-green"
                    : "w-1.5 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
          <span className="text-[11px] text-white/25">
            &copy; 2026 VPEX Solutions. Todos os direitos reservados.
          </span>
          <span className="text-[11px] text-white/15">·</span>
          <button className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
            Política de Privacidade
          </button>
          <span className="text-[11px] text-white/15">·</span>
          <button className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
            Termos de Uso
          </button>
        </div>
      </div>

      {/* ═══ RIGHT SIDE — Login Form ═══ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-[#0d0d0d] lg:bg-[#111111] relative">
        {/* Subtle border left */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-vpex-green/10 to-transparent" />

        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-vpex-green flex items-center justify-center">
              <span className="text-base font-bold text-black font-[Sora]">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-[Sora]">VPEX Hub</h1>
              <p className="text-[10px] text-vpex-green/70 font-medium uppercase tracking-[0.2em]">
                Portal de Gestão Estratégica
              </p>
            </div>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-white font-[Sora]">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-white/40 mt-1.5">
              Entre com suas credenciais para acessar o painel.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-vpex-green/40 focus:ring-1 focus:ring-vpex-green/15 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/60">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast("Em breve", {
                      description: "Recuperação de senha será ativada com o backend.",
                    })
                  }
                  className="text-[11px] text-vpex-green hover:text-vpex-green/80 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-vpex-green/40 focus:ring-1 focus:ring-vpex-green/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-vpex-green text-black text-sm font-bold font-[Sora] uppercase tracking-wider hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                />
              ) : (
                <>
                  ENTRAR
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-white/20 uppercase tracking-wider">
              ou continue com
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                toast("Em breve", {
                  description: "Login com Google será ativado com o backend.",
                })
              }
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              onClick={() =>
                toast("Em breve", {
                  description: "Login com WhatsApp será ativado com o backend.",
                })
              }
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/60 hover:text-white hover:border-vpex-green/20 hover:bg-vpex-green/[0.03] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
          </div>

          {/* Register CTA */}
          <p className="text-center text-sm text-white/30">
            Não tem conta?{" "}
            <button
              onClick={() =>
                toast("Em breve", {
                  description: "Cadastro será ativado com o backend.",
                })
              }
              className="text-vpex-green font-medium hover:text-vpex-green/80 transition-colors"
            >
              Solicite acesso
            </button>
          </p>

          {/* Mobile Footer */}
          <div className="lg:hidden text-center pt-4 border-t border-white/5">
            <span className="text-[11px] text-white/20">
              &copy; 2026 VPEX Solutions. Todos os direitos reservados.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
