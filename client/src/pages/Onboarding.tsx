/**
 * VPEX Hub — Onboarding Premium (Wizard Comercial)
 * Design: Glass Cockpit | Dark Mode | Verde Neon #39FF14
 * 6 Steps: Tipo de Negócio → Dados da Empresa → Estrutura Digital → Time → Expectativas → Guia
 * Bifurcação por tipo de negócio para personalizar campos
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Store, Factory, Globe, Briefcase, ShoppingCart,
  ChevronRight, ChevronLeft, Check, Upload, Plus, X,
  Users, Target, BookOpen, Rocket, Shield, BarChart3,
  MapPin, Palette, FileText, Key, Layers, TrendingUp,
  ArrowRight, Sparkles, CheckCircle2, Info
} from "lucide-react";
import { useLocation } from "wouter";

const businessTypes = [
  { id: "franquia", label: "Franquia", icon: Store, desc: "O Boticário, Cacau Show, McDonald's...", color: "#39FF14" },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingCart, desc: "Loja virtual, marketplace, dropshipping...", color: "#00D4FF" },
  { id: "industria", label: "Indústria", icon: Factory, desc: "Fabricação, produção, manufatura...", color: "#FF6B35" },
  { id: "loja_fisica", label: "Loja Física", icon: Building2, desc: "Varejo, atacado, ponto de venda...", color: "#FFD700" },
  { id: "consultoria", label: "Consultoria / Serviços", icon: Briefcase, desc: "Agência, escritório, prestação de serviços...", color: "#A855F7" },
  { id: "digital", label: "Negócio Digital", icon: Globe, desc: "SaaS, infoproduto, plataforma online...", color: "#F43F5E" },
];

const vpexPlans = [
  { id: "starter", label: "Starter", desc: "Gestão básica + relatórios" },
  { id: "scale", label: "Scale", desc: "Gestão completa + automações + BI" },
  { id: "enterprise", label: "Enterprise", desc: "Tudo + consultoria dedicada + IA" },
];

const taxRegimes = ["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Não sei informar"];

const revenueRanges = [
  "Até R$ 30 mil/mês", "R$ 30 mil — R$ 100 mil/mês", "R$ 100 mil — R$ 300 mil/mês",
  "R$ 300 mil — R$ 500 mil/mês", "R$ 500 mil — R$ 1 milhão/mês", "Acima de R$ 1 milhão/mês",
];

const getDynamicFields = (type: string) => {
  switch (type) {
    case "franquia": return { showStores: true, showFranchisor: true, storeLabel: "Quantas unidades você opera?", extraLabel: "" };
    case "ecommerce": return { showStores: false, showFranchisor: false, storeLabel: "", extraLabel: "Qual a plataforma? (Shopify, Nuvemshop, WooCommerce...)" };
    case "industria": return { showStores: true, showFranchisor: false, storeLabel: "Quantas plantas/fábricas?", extraLabel: "Qual o segmento industrial?" };
    case "loja_fisica": return { showStores: true, showFranchisor: false, storeLabel: "Quantas lojas você tem?", extraLabel: "Qual o segmento? (Moda, Alimentação, Saúde...)" };
    case "consultoria": return { showStores: false, showFranchisor: false, storeLabel: "", extraLabel: "Qual a especialidade? (Marketing, Jurídico, Contábil...)" };
    case "digital": return { showStores: false, showFranchisor: false, storeLabel: "", extraLabel: "Qual o modelo? (SaaS, Infoproduto, Marketplace...)" };
    default: return { showStores: false, showFranchisor: false, storeLabel: "", extraLabel: "" };
  }
};

const painOptions = [
  "Não sei se meu marketing está funcionando", "Minha equipe não segue processos",
  "Não tenho controle financeiro real", "Perco vendas por falta de estoque",
  "Não consigo escalar meu negócio", "Gasto muito e não vejo retorno",
  "Meu time não é treinado", "Não tenho dados para tomar decisões",
];

const digitalAssetOptions = [
  "Website / Landing Page", "Instagram Business", "Facebook / Meta Business",
  "Google Meu Negócio", "TikTok Business", "YouTube", "LinkedIn Company",
  "App próprio", "Blog", "Podcast",
];

const platformGuide = [
  { icon: BarChart3, title: "Painel Central", desc: "Seu painel de guerra com KPIs em tempo real." },
  { icon: TrendingUp, title: "Relatórios", desc: "Relatórios detalhados de marketing e operação." },
  { icon: Target, title: "Crescimento", desc: "Sua jornada gamificada com metas e conquistas." },
  { icon: Users, title: "Academia", desc: "Treine sua equipe com cursos personalizados." },
  { icon: Shield, title: "Suporte", desc: "Chat direto com a VPEX. Especialistas a um clique." },
  { icon: Rocket, title: "Inteligência", desc: "Análise profunda por área do seu negócio." },
];

const steps = [
  { id: 1, title: "Negócio", icon: Layers },
  { id: 2, title: "Empresa", icon: Building2 },
  { id: 3, title: "Estrutura", icon: Globe },
  { id: 4, title: "Time", icon: Users },
  { id: 5, title: "Expectativas", icon: Target },
  { id: 6, title: "Guia", icon: BookOpen },
];

const InputField = ({ icon: Icon, label, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
      {Icon && <Icon size={12} />} {label}
    </label>
    <input
      {...props}
      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:border-[#39FF14]/50 focus:outline-none transition-colors"
    />
  </div>
);

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("scale");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [revenue, setRevenue] = useState("");
  const [taxRegime, setTaxRegime] = useState("");
  const [extraField, setExtraField] = useState("");
  const [storeCount, setStoreCount] = useState("");
  const [franchisor, setFranchisor] = useState("");
  const [digitalAssets, setDigitalAssets] = useState<string[]>([]);
  const [hasWebsite, setHasWebsite] = useState(false);
  const [hasSocialMedia, setHasSocialMedia] = useState(false);
  const [hasCRM, setHasCRM] = useState(false);
  const [hasERP, setHasERP] = useState(false);
  const [hasBrandbook, setHasBrandbook] = useState(false);
  const [importantSheets, setImportantSheets] = useState<string[]>([]);
  const [newSheet, setNewSheet] = useState("");
  const [accessList, setAccessList] = useState<{ platform: string; login: string }[]>([]);
  const [newAccessPlatform, setNewAccessPlatform] = useState("");
  const [newAccessLogin, setNewAccessLogin] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [teamMembers, setTeamMembers] = useState<{ name: string; role: string; email: string }[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [expectedResults, setExpectedResults] = useState("");
  const [timeline, setTimeline] = useState("");

  const dynamicFields = getDynamicFields(selectedBusiness);

  const canAdvance = () => {
    switch (currentStep) {
      case 1: return selectedBusiness !== "" && selectedPlan !== "";
      case 2: return companyName !== "" && revenue !== "";
      case 3: return true;
      case 4: return teamSize !== "";
      case 5: return mainGoal !== "";
      case 6: return true;
      default: return false;
    }
  };

  const nextStep = () => { if (currentStep < 6 && canAdvance()) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const addSheet = () => { if (newSheet.trim()) { setImportantSheets([...importantSheets, newSheet.trim()]); setNewSheet(""); } };
  const addAccess = () => { if (newAccessPlatform.trim()) { setAccessList([...accessList, { platform: newAccessPlatform.trim(), login: newAccessLogin.trim() }]); setNewAccessPlatform(""); setNewAccessLogin(""); } };
  const addMember = () => { if (newMemberName.trim()) { setTeamMembers([...teamMembers, { name: newMemberName.trim(), role: newMemberRole.trim(), email: newMemberEmail.trim() }]); setNewMemberName(""); setNewMemberRole(""); setNewMemberEmail(""); } };

  const ToggleChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`px-3 py-2 rounded-lg border text-xs text-left transition-all ${active ? "border-[#39FF14]/50 bg-[#39FF14]/5 text-[#39FF14]" : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10"}`}>
      {active && <Check size={10} className="inline mr-1" />}{label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center">
              <span className="text-[#39FF14] font-bold text-base font-['Sora']">V</span>
            </div>
            <div>
              <h1 className="text-white font-['Sora'] font-bold text-base">VPEX Hub</h1>
              <p className="text-white/30 text-[10px]">Configuração Inicial</p>
            </div>
          </div>
          <span className="text-white/30 text-xs">{currentStep} / 6</span>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5">
        <div className="flex gap-1">
          {steps.map((s) => (
            <div key={s.id} className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
              <motion.div className="h-full rounded-full bg-[#39FF14]" initial={{ width: 0 }} animate={{ width: currentStep >= s.id ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {steps.map((s) => { const I = s.icon; return (
            <span key={s.id} className={`flex items-center gap-1 text-[10px] transition-colors ${currentStep >= s.id ? "text-[#39FF14]" : "text-white/15"}`}>
              <I size={10} /><span className="hidden sm:inline">{s.title}</span>
            </span>
          ); })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>

            {/* ═══ STEP 1: Tipo de Negócio ═══ */}
            {currentStep === 1 && (
              <div className="space-y-7">
                <div>
                  <h2 className="text-xl sm:text-2xl font-['Sora'] font-bold text-white">Qual o <span className="text-[#39FF14]">modelo</span> do seu negócio?</h2>
                  <p className="text-white/40 text-sm mt-1">Isso personaliza toda a sua experiência no VPEX Hub.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {businessTypes.map((bt) => { const I = bt.icon; const sel = selectedBusiness === bt.id; return (
                    <button key={bt.id} onClick={() => setSelectedBusiness(bt.id)} className={`relative p-4 rounded-2xl border text-left transition-all group ${sel ? "border-[#39FF14]/50 bg-[#39FF14]/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
                      {sel && <motion.div className="absolute top-2.5 right-2.5" initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-[#39FF14]" /></motion.div>}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: sel ? `${bt.color}15` : "rgba(255,255,255,0.03)" }}>
                        <I size={20} style={{ color: sel ? bt.color : "rgba(255,255,255,0.3)" }} />
                      </div>
                      <h3 className={`font-['Sora'] font-semibold text-sm mb-0.5 ${sel ? "text-white" : "text-white/60"}`}>{bt.label}</h3>
                      <p className="text-white/25 text-[11px] leading-tight">{bt.desc}</p>
                    </button>
                  ); })}
                </div>
                {selectedBusiness && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <h3 className="text-sm font-['Sora'] font-semibold text-white">Plano fechado com a <span className="text-[#39FF14]">VPEX</span></h3>
                    <div className="grid grid-cols-3 gap-2">
                      {vpexPlans.map((p) => (
                        <button key={p.id} onClick={() => setSelectedPlan(p.id)} className={`p-3 rounded-xl border text-left transition-all ${selectedPlan === p.id ? "border-[#39FF14]/50 bg-[#39FF14]/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
                          <span className={`font-['Sora'] font-semibold text-xs ${selectedPlan === p.id ? "text-[#39FF14]" : "text-white/50"}`}>{p.label}</span>
                          <p className="text-white/25 text-[10px] mt-0.5">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* ═══ STEP 2: Dados da Empresa ═══ */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-['Sora'] font-bold text-white">Dados da sua <span className="text-[#39FF14]">empresa</span></h2>
                  <p className="text-white/40 text-sm mt-1">Informações essenciais para configurar seu painel.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField icon={Building2} label="Nome da Empresa *" value={companyName} onChange={(e: any) => setCompanyName(e.target.value)} placeholder="Ex: Cacau Show Anápolis" />
                  <InputField icon={FileText} label="CNPJ" value={cnpj} onChange={(e: any) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
                </div>
                {dynamicFields.showFranchisor && <InputField icon={Store} label="Qual a franqueadora?" value={franchisor} onChange={(e: any) => setFranchisor(e.target.value)} placeholder="Ex: O Boticário, Cacau Show..." />}
                {dynamicFields.extraLabel && <InputField label={dynamicFields.extraLabel} value={extraField} onChange={(e: any) => setExtraField(e.target.value)} placeholder="Digite aqui..." />}
                {dynamicFields.showStores && <InputField icon={MapPin} label={dynamicFields.storeLabel} type="number" value={storeCount} onChange={(e: any) => setStoreCount(e.target.value)} placeholder="Ex: 3" />}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-medium flex items-center gap-1.5"><TrendingUp size={12} /> Faturamento Mensal *</label>
                    <div className="space-y-1">
                      {revenueRanges.map((r) => (
                        <button key={r} onClick={() => setRevenue(r)} className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${revenue === r ? "border-[#39FF14]/50 bg-[#39FF14]/5 text-[#39FF14]" : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10"}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-medium flex items-center gap-1.5"><Shield size={12} /> Regime Tributário</label>
                    <div className="space-y-1">
                      {taxRegimes.map((r) => (
                        <button key={r} onClick={() => setTaxRegime(r)} className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${taxRegime === r ? "border-[#39FF14]/50 bg-[#39FF14]/5 text-[#39FF14]" : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10"}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 3: Estrutura Digital ═══ */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-['Sora'] font-bold text-white">Sua <span className="text-[#39FF14]">estrutura</span> digital</h2>
                  <p className="text-white/40 text-sm mt-1">Quais ativos digitais e ferramentas você já utiliza?</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white/60 font-['Sora'] font-semibold text-[11px] uppercase tracking-wider">Ativos Digitais</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
                    {digitalAssetOptions.map((a) => <ToggleChip key={a} label={a} active={digitalAssets.includes(a)} onClick={() => setDigitalAssets(digitalAssets.includes(a) ? digitalAssets.filter(x => x !== a) : [...digitalAssets, a])} />)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white/60 font-['Sora'] font-semibold text-[11px] uppercase tracking-wider">Ferramentas que já usa</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[{ l: "Website", s: hasWebsite, f: setHasWebsite }, { l: "Redes Sociais", s: hasSocialMedia, f: setHasSocialMedia }, { l: "CRM", s: hasCRM, f: setHasCRM }, { l: "ERP", s: hasERP, f: setHasERP }].map((t) => (
                      <ToggleChip key={t.l} label={t.l} active={t.s} onClick={() => t.f(!t.s)} />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white/60 font-['Sora'] font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5"><Palette size={12} /> Brandbook</h3>
                  <ToggleChip label={hasBrandbook ? "Sim, tenho brandbook" : "Não tenho brandbook"} active={hasBrandbook} onClick={() => setHasBrandbook(!hasBrandbook)} />
                  {hasBrandbook && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                      <div className="border border-dashed border-white/10 rounded-xl p-5 text-center">
                        <Upload size={20} className="mx-auto text-white/15 mb-1.5" />
                        <p className="text-white/25 text-xs">Arraste seu brandbook aqui ou clique para enviar</p>
                        <p className="text-white/10 text-[10px] mt-0.5">PDF, PNG, ZIP — até 50MB</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-white/60 font-['Sora'] font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5"><Key size={12} /> Acessos para a VPEX</h3>
                  <p className="text-white/20 text-[10px] flex items-center gap-1"><Info size={10} /> Criptografados e usados apenas pela equipe VPEX.</p>
                  <div className="flex gap-1.5">
                    <input value={newAccessPlatform} onChange={(e) => setNewAccessPlatform(e.target.value)} placeholder="Plataforma" className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/15 focus:border-[#39FF14]/50 focus:outline-none" />
                    <input value={newAccessLogin} onChange={(e) => setNewAccessLogin(e.target.value)} placeholder="Login / E-mail" className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/15 focus:border-[#39FF14]/50 focus:outline-none" />
                    <button onClick={addAccess} className="px-2.5 py-2 rounded-lg bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 transition-colors"><Plus size={14} /></button>
                  </div>
                  {accessList.map((a, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1.5">
                      <span className="text-white/50 text-xs flex items-center gap-2"><Key size={10} className="text-[#39FF14]/40" />{a.platform} <span className="text-white/20">— {a.login}</span></span>
                      <button onClick={() => setAccessList(accessList.filter((_, idx) => idx !== i))} className="text-white/15 hover:text-red-400"><X size={12} /></button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-white/60 font-['Sora'] font-semibold text-[11px] uppercase tracking-wider">Planilhas / Documentos Importantes</h3>
                  <div className="flex gap-1.5">
                    <input value={newSheet} onChange={(e) => setNewSheet(e.target.value)} placeholder="Ex: Planilha de metas Q2" className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/15 focus:border-[#39FF14]/50 focus:outline-none" onKeyDown={(e) => e.key === "Enter" && addSheet()} />
                    <button onClick={addSheet} className="px-2.5 py-2 rounded-lg bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 transition-colors"><Plus size={14} /></button>
                  </div>
                  {importantSheets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {importantSheets.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1 text-white/50 text-[11px]">
                          <FileText size={10} /> {s} <button onClick={() => setImportantSheets(importantSheets.filter((_, idx) => idx !== i))} className="text-white/15 hover:text-red-400 ml-0.5"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ STEP 4: Seu Time ═══ */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-['Sora'] font-bold text-white">Seu <span className="text-[#39FF14]">time</span></h2>
                  <p className="text-white/40 text-sm mt-1">Quem são as pessoas-chave da sua operação?</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-medium">Tamanho total da equipe *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {["1-5", "6-15", "16-30", "31-50", "51-100", "100+"].map((s) => (
                      <button key={s} onClick={() => setTeamSize(s)} className={`px-3 py-2.5 rounded-xl border text-xs transition-all ${teamSize === s ? "border-[#39FF14]/50 bg-[#39FF14]/5 text-[#39FF14]" : "border-white/5 bg-white/[0.02] text-white/35 hover:border-white/10"}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white/60 font-['Sora'] font-semibold text-[11px] uppercase tracking-wider">Pessoas-chave (opcional)</h3>
                  <p className="text-white/20 text-[10px]">Adicione líderes ou responsáveis por cada área.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <input value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="Nome" className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/15 focus:border-[#39FF14]/50 focus:outline-none" />
                    <input value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} placeholder="Cargo / Função" className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/15 focus:border-[#39FF14]/50 focus:outline-none" />
                    <div className="flex gap-1.5">
                      <input value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} placeholder="E-mail" className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/15 focus:border-[#39FF14]/50 focus:outline-none" />
                      <button onClick={addMember} className="px-2.5 py-2 rounded-lg bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                  {teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] text-[10px] font-bold">{m.name.charAt(0)}</div>
                        <div><span className="text-white/70 text-xs font-medium">{m.name}</span><span className="text-white/25 text-[10px] ml-1.5">{m.role}</span></div>
                      </div>
                      <div className="flex items-center gap-2"><span className="text-white/15 text-[10px]">{m.email}</span><button onClick={() => setTeamMembers(teamMembers.filter((_, idx) => idx !== i))} className="text-white/15 hover:text-red-400"><X size={12} /></button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ STEP 5: Expectativas ═══ */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-['Sora'] font-bold text-white">Suas <span className="text-[#39FF14]">expectativas</span></h2>
                  <p className="text-white/40 text-sm mt-1">O que você espera alcançar com a VPEX?</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-medium">Objetivo principal *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {["Aumentar vendas e faturamento", "Organizar processos internos", "Escalar minha operação", "Melhorar meu marketing digital", "Reduzir custos operacionais", "Treinar e reter minha equipe", "Ter dados para tomar decisões", "Outro"].map((g) => (
                      <button key={g} onClick={() => setMainGoal(g)} className={`px-3 py-2.5 rounded-xl border text-xs text-left transition-all ${mainGoal === g ? "border-[#39FF14]/50 bg-[#39FF14]/5 text-[#39FF14]" : "border-white/5 bg-white/[0.02] text-white/35 hover:border-white/10"}`}>
                        {mainGoal === g && <Check size={10} className="inline mr-1" />}{g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-medium">Maiores dores hoje (selecione quantas quiser)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {painOptions.map((p) => (
                      <button key={p} onClick={() => setPainPoints(painPoints.includes(p) ? painPoints.filter(x => x !== p) : [...painPoints, p])} className={`px-3 py-2.5 rounded-xl border text-xs text-left transition-all ${painPoints.includes(p) ? "border-red-500/40 bg-red-500/5 text-red-400" : "border-white/5 bg-white/[0.02] text-white/35 hover:border-white/10"}`}>
                        {painPoints.includes(p) && <Check size={10} className="inline mr-1" />}{p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-medium">Em quanto tempo espera ver resultados?</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["30 dias", "60 dias", "90 dias", "6 meses"].map((t) => (
                      <button key={t} onClick={() => setTimeline(t)} className={`px-3 py-2.5 rounded-xl border text-xs transition-all ${timeline === t ? "border-[#39FF14]/50 bg-[#39FF14]/5 text-[#39FF14]" : "border-white/5 bg-white/[0.02] text-white/35 hover:border-white/10"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-medium">Observação ou resultado específico (opcional)</label>
                  <textarea value={expectedResults} onChange={(e) => setExpectedResults(e.target.value)} placeholder="Ex: Quero faturar R$ 300k/mês em 6 meses..." rows={2} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/15 focus:border-[#39FF14]/50 focus:outline-none resize-none" />
                </div>
              </div>
            )}

            {/* ═══ STEP 6: Guia da Plataforma ═══ */}
            {currentStep === 6 && (
              <div className="space-y-7">
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={28} className="text-[#39FF14]" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-['Sora'] font-bold text-white">Tudo pronto, <span className="text-[#39FF14]">{companyName || "parceiro"}</span>!</h2>
                  <p className="text-white/40 text-sm mt-1 max-w-md mx-auto">Seu Hub foi configurado. Aqui está um guia rápido:</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {platformGuide.map((item, i) => { const I = item.icon; return (
                    <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#39FF14]/20 transition-all group">
                      <div className="w-9 h-9 rounded-xl bg-[#39FF14]/10 flex items-center justify-center mb-2 group-hover:bg-[#39FF14]/20 transition-colors"><I size={18} className="text-[#39FF14]" /></div>
                      <h3 className="font-['Sora'] font-semibold text-white text-xs mb-0.5">{item.title}</h3>
                      <p className="text-white/25 text-[10px] leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ); })}
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-5 rounded-2xl border border-[#39FF14]/20 bg-[#39FF14]/5 text-center">
                  <p className="text-white/60 text-xs mb-0.5">Seu consultor VPEX já foi notificado e entrará em contato em breve.</p>
                  <p className="text-[#39FF14] font-['Sora'] font-semibold text-sm">Bem-vindo ao futuro do seu negócio.</p>
                </motion.div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Nav */}
      <div className="border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={prevStep} disabled={currentStep === 1} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${currentStep === 1 ? "text-white/10 cursor-not-allowed" : "text-white/50 hover:text-white border border-white/10 hover:border-white/20"}`}>
            <ChevronLeft size={14} /> Voltar
          </button>
          <div className="flex gap-1">
            {steps.map((s) => <div key={s.id} className={`w-1.5 h-1.5 rounded-full transition-all ${currentStep === s.id ? "bg-[#39FF14] w-4" : currentStep > s.id ? "bg-[#39FF14]/40" : "bg-white/10"}`} />)}
          </div>
          {currentStep < 6 ? (
            <button onClick={nextStep} disabled={!canAdvance()} className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-['Sora'] font-semibold transition-all ${canAdvance() ? "bg-[#39FF14] text-black hover:bg-[#39FF14]/90 shadow-[0_0_16px_rgba(57,255,20,0.25)]" : "bg-white/5 text-white/15 cursor-not-allowed"}`}>
              Próximo <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={() => navigate("/")} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-['Sora'] font-semibold bg-[#39FF14] text-black hover:bg-[#39FF14]/90 shadow-[0_0_16px_rgba(57,255,20,0.25)] transition-all">
              Acessar meu Hub <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
