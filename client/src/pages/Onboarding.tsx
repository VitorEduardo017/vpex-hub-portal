/**
 * Onboarding — Wizard de Boas-Vindas para Novos Franqueados
 * Glass Cockpit Design | VPEX Hub
 *
 * 4 steps: Boas-vindas → Dados da Empresa → Metas → Pronto!
 * Focado em simplicidade para usuário não-tech.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Building2,
  Target,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Phone,
  Mail,
  Store,
  DollarSign,
  Users,
  TrendingUp,
  PartyPopper,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();

  /* Form state */
  const [companyName, setCompanyName] = useState("");
  const [segment, setSegment] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [employees, setEmployees] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [challenges, setChallenges] = useState<string[]>([]);

  const segments = [
    "Franquia — Beleza & Cosméticos",
    "Franquia — Alimentação",
    "Franquia — Moda & Vestuário",
    "Franquia — Saúde & Bem-estar",
    "Franquia — Educação",
    "Franquia — Serviços",
    "Empresa Própria — Varejo",
    "Empresa Própria — Serviços",
    "Empresa Própria — Indústria",
    "Outro",
  ];

  const goals = [
    { id: "vendas", label: "Aumentar Vendas", icon: DollarSign },
    { id: "clientes", label: "Captar Clientes", icon: Users },
    { id: "marca", label: "Fortalecer Marca", icon: Shield },
    { id: "escala", label: "Escalar Operação", icon: TrendingUp },
    { id: "digital", label: "Presença Digital", icon: Zap },
    { id: "dados", label: "Inteligência de Dados", icon: BarChart3 },
  ];

  const challengesList = [
    "Não sei por onde começar no digital",
    "Gasto com marketing sem resultado",
    "Equipe sem treinamento adequado",
    "Não tenho controle dos meus números",
    "Dependo 100% da franqueadora",
    "Concorrência local muito forte",
    "Dificuldade em reter clientes",
    "Operação desorganizada",
  ];

  const toggleChallenge = (c: string) => {
    setChallenges((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const steps = [
    { title: "Boas-vindas", icon: Rocket },
    { title: "Sua Empresa", icon: Building2 },
    { title: "Seus Objetivos", icon: Target },
    { title: "Tudo Pronto!", icon: PartyPopper },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-vpex-green/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-vpex-green/[0.02] rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(57,255,20,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-vpex-green flex items-center justify-center">
              <span className="text-black font-bold text-sm font-[Sora]">V</span>
            </div>
            <span className="text-lg font-bold font-[Sora] text-white">VPEX Hub</span>
          </div>
        </div>

        {/* Step Indicator */}
        {step > 0 && step < 3 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.slice(1, 3).map((s, i) => {
              const idx = i + 1;
              const isActive = step === idx;
              const isDone = step > idx;
              return (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isDone ? "bg-vpex-green" : isActive ? "bg-vpex-green w-6" : "bg-white/10"
                    }`}
                  />
                  {i < 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-2xl bg-vpex-green/10 border border-vpex-green/20 flex items-center justify-center mx-auto mb-6"
                >
                  <Rocket size={36} className="text-vpex-green" />
                </motion.div>

                <h2 className="text-2xl font-bold font-[Sora] text-white mb-2">
                  Bem-vindo ao <span className="text-vpex-green">VPEX Hub</span>
                </h2>
                <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed">
                  Em menos de 2 minutos, vamos configurar seu painel para que ele mostre exatamente o que importa pro seu negócio.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    "Painel personalizado para seu segmento",
                    "Métricas que realmente importam",
                    "Tudo simples, sem complicação",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 text-left max-w-xs mx-auto"
                    >
                      <CheckCircle2 size={16} className="text-vpex-green shrink-0" />
                      <span className="text-sm text-white/60">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep(1)}
                  className="mt-8 gap-2 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold text-base px-8 py-3 h-auto hover:shadow-[0_0_25px_rgba(57,255,20,0.3)] transition-all"
                >
                  Vamos Começar <ArrowRight size={16} />
                </Button>

                <p className="text-[11px] text-white/20 mt-4">Leva menos de 2 minutos</p>
              </motion.div>
            )}

            {/* Step 1: Company Data */}
            {step === 1 && (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold font-[Sora] text-white">Conte sobre sua empresa</h3>
                  <p className="text-xs text-white/40 mt-1">Isso nos ajuda a personalizar seu painel</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">Nome da Empresa</label>
                    <div className="relative">
                      <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ex: Cacau Show — Shopping Anápolis"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-vpex-green/40 focus:ring-1 focus:ring-vpex-green/15 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">Segmento</label>
                    <select
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-vpex-green/40 transition-all appearance-none"
                    >
                      <option value="" className="bg-[#141414]">Selecione seu segmento</option>
                      {segments.map((s) => (
                        <option key={s} value={s} className="bg-[#141414]">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block">Cidade</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ex: Anápolis - GO"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-vpex-green/40 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block">WhatsApp</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(62) 99999-9999"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-vpex-green/40 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block">Funcionários</label>
                      <select
                        value={employees}
                        onChange={(e) => setEmployees(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-vpex-green/40 transition-all appearance-none"
                      >
                        <option value="" className="bg-[#141414]">Selecione</option>
                        <option value="1-5" className="bg-[#141414]">1 a 5</option>
                        <option value="6-15" className="bg-[#141414]">6 a 15</option>
                        <option value="16-30" className="bg-[#141414]">16 a 30</option>
                        <option value="31+" className="bg-[#141414]">31+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block">Faturamento Mensal</label>
                      <select
                        value={monthlyRevenue}
                        onChange={(e) => setMonthlyRevenue(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-vpex-green/40 transition-all appearance-none"
                      >
                        <option value="" className="bg-[#141414]">Selecione</option>
                        <option value="ate-50k" className="bg-[#141414]">Até R$ 50k</option>
                        <option value="50k-100k" className="bg-[#141414]">R$ 50k — R$ 100k</option>
                        <option value="100k-300k" className="bg-[#141414]">R$ 100k — R$ 300k</option>
                        <option value="300k-500k" className="bg-[#141414]">R$ 300k — R$ 500k</option>
                        <option value="500k+" className="bg-[#141414]">R$ 500k+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="mb-5">
                  <h3 className="text-lg font-bold font-[Sora] text-white">O que mais importa pra você?</h3>
                  <p className="text-xs text-white/40 mt-1">Vamos priorizar o que aparece no seu painel</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-white/50 mb-2 block">Objetivo principal</label>
                    <div className="grid grid-cols-3 gap-2">
                      {goals.map((g) => {
                        const Icon = g.icon;
                        const isSelected = mainGoal === g.id;
                        return (
                          <button
                            key={g.id}
                            onClick={() => setMainGoal(g.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                              isSelected
                                ? "border-vpex-green/40 bg-vpex-green/5 text-vpex-green"
                                : "border-white/5 text-white/30 hover:border-white/15 hover:text-white/50"
                            }`}
                          >
                            <Icon size={20} />
                            <span className="text-[11px] font-medium text-center leading-tight">{g.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/50 mb-2 block">Maiores desafios (selecione quantos quiser)</label>
                    <div className="space-y-1.5">
                      {challengesList.map((c) => {
                        const isSelected = challenges.includes(c);
                        return (
                          <button
                            key={c}
                            onClick={() => toggleChallenge(c)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all duration-200 ${
                              isSelected
                                ? "border-vpex-green/30 bg-vpex-green/5"
                                : "border-white/5 hover:border-white/10"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? "border-vpex-green bg-vpex-green"
                                  : "border-white/15"
                              }`}
                            >
                              {isSelected && <CheckCircle2 size={10} className="text-black" />}
                            </div>
                            <span className={`text-xs ${isSelected ? "text-white/80" : "text-white/40"}`}>{c}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Done! */}
            {step === 3 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="relative w-20 h-20 mx-auto mb-6"
                >
                  <div className="absolute inset-0 rounded-2xl bg-vpex-green/20 animate-ping" />
                  <div className="relative w-20 h-20 rounded-2xl bg-vpex-green/10 border border-vpex-green/20 flex items-center justify-center">
                    <PartyPopper size={36} className="text-vpex-green" />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold font-[Sora] text-white mb-2">
                  Tudo <span className="text-vpex-green">pronto</span>!
                </h2>
                <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed">
                  {companyName ? `${companyName}, seu` : "Seu"} painel foi personalizado. Agora você tem o controle total do seu negócio na palma da mão.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "Dashboard", desc: "Seus KPIs" },
                    { label: "Relatórios", desc: "Dados reais" },
                    { label: "Crescimento", desc: "Suas metas" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <p className="text-xs font-medium text-vpex-green">{item.label}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate("/")}
                  className="mt-8 gap-2 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold text-base px-8 py-3 h-auto hover:shadow-[0_0_25px_rgba(57,255,20,0.3)] transition-all"
                >
                  Acessar Meu Painel <Sparkles size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation (steps 1-2) */}
          {step > 0 && step < 3 && (
            <div className="flex items-center justify-between p-5 border-t border-white/5">
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronLeft size={14} /> Voltar
              </button>
              <Button
                onClick={() => setStep(step + 1)}
                className="gap-1.5 bg-vpex-green text-black hover:bg-vpex-green/90 font-semibold"
              >
                {step === 2 ? "Finalizar" : "Próximo"} <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Skip */}
        {step < 3 && (
          <button
            onClick={() => navigate("/")}
            className="block mx-auto mt-4 text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            Pular configuração
          </button>
        )}
      </motion.div>
    </div>
  );
}
