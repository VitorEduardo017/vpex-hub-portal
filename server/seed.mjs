/**
 * Seed Script — VPEX Hub
 * Popula o banco com dados realistas de franqueados e KPIs.
 *
 * Uso: node server/seed.mjs
 */
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL não encontrada. Configure o .env");
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function dateStr(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min, max, decimals = 2) {
  return (Math.random() * (max - min) + min).toFixed(decimals);
}

function esc(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  // Escape single quotes
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function execSQL(query) {
  return db.execute(sql.raw(query));
}

// ═══════════════════════════════════════════════════════════════
// COMPANIES DATA
// ═══════════════════════════════════════════════════════════════
const companiesData = [
  {
    name: "Boticário Anápolis Centro",
    ownerName: "Carlos Mendes",
    segment: "franquia",
    franchiseBrand: "O Boticário",
    plan: "enterprise",
    status: "ativo",
    mrrCents: 450000,
    healthScore: 92,
    storeCount: 3,
    teamSize: 12,
    integrationsCount: 8,
    logoEmoji: "🌸",
    phone: "(62) 99999-1234",
    contactEmail: "carlos@boticario-anapolis.com",
    city: "Anápolis",
    state: "GO",
  },
  {
    name: "Cacau Show Shopping",
    ownerName: "Ana Paula Souza",
    segment: "franquia",
    franchiseBrand: "Cacau Show",
    plan: "scale",
    status: "ativo",
    mrrCents: 280000,
    healthScore: 78,
    storeCount: 2,
    teamSize: 6,
    integrationsCount: 5,
    logoEmoji: "🍫",
    phone: "(62) 98888-5678",
    contactEmail: "ana@cacaushow-goiania.com",
    city: "Goiânia",
    state: "GO",
  },
  {
    name: "TechStore Brasil",
    ownerName: "Roberto Lima",
    segment: "ecommerce",
    franchiseBrand: null,
    plan: "scale",
    status: "ativo",
    mrrCents: 320000,
    healthScore: 85,
    storeCount: 1,
    teamSize: 8,
    integrationsCount: 12,
    logoEmoji: "💻",
    phone: "(11) 97777-9012",
    contactEmail: "roberto@techstore.com.br",
    city: "São Paulo",
    state: "SP",
  },
  {
    name: "Bella Moda Feminina",
    ownerName: "Fernanda Costa",
    segment: "loja",
    franchiseBrand: null,
    plan: "starter",
    status: "ativo",
    mrrCents: 150000,
    healthScore: 65,
    storeCount: 1,
    teamSize: 4,
    integrationsCount: 3,
    logoEmoji: "👗",
    phone: "(62) 96666-3456",
    contactEmail: "fernanda@bellamoda.com.br",
    city: "Anápolis",
    state: "GO",
  },
  {
    name: "Açaí Power Goiânia",
    ownerName: "Thiago Oliveira",
    segment: "franquia",
    franchiseBrand: "Açaí Power",
    plan: "scale",
    status: "ativo",
    mrrCents: 250000,
    healthScore: 88,
    storeCount: 4,
    teamSize: 15,
    integrationsCount: 6,
    logoEmoji: "🍇",
    phone: "(62) 95555-7890",
    contactEmail: "thiago@acaipower-goiania.com",
    city: "Goiânia",
    state: "GO",
  },
  {
    name: "Digital Growth Agency",
    ownerName: "Mariana Alves",
    segment: "digital",
    franchiseBrand: null,
    plan: "enterprise",
    status: "ativo",
    mrrCents: 380000,
    healthScore: 95,
    storeCount: 1,
    teamSize: 10,
    integrationsCount: 15,
    logoEmoji: "🚀",
    phone: "(11) 94444-2345",
    contactEmail: "mariana@digitalgrowth.com.br",
    city: "São Paulo",
    state: "SP",
  },
  {
    name: "Farmácia Popular Plus",
    ownerName: "Dr. Ricardo Santos",
    segment: "franquia",
    franchiseBrand: "Farmácia Popular",
    plan: "starter",
    status: "inadimplente",
    mrrCents: 180000,
    healthScore: 35,
    storeCount: 1,
    teamSize: 5,
    integrationsCount: 2,
    logoEmoji: "💊",
    phone: "(62) 93333-6789",
    contactEmail: "ricardo@farmaciapopular-plus.com",
    city: "Anápolis",
    state: "GO",
  },
  {
    name: "Consultoria Nexus",
    ownerName: "Patrícia Ferreira",
    segment: "consultoria",
    franchiseBrand: null,
    plan: "starter",
    status: "onboarding",
    mrrCents: 120000,
    healthScore: 50,
    storeCount: 1,
    teamSize: 3,
    integrationsCount: 0,
    logoEmoji: "📊",
    phone: "(62) 92222-1234",
    contactEmail: "patricia@nexusconsultoria.com",
    city: "Goiânia",
    state: "GO",
  },
];

// ═══════════════════════════════════════════════════════════════
// SEED EXECUTION
// ═══════════════════════════════════════════════════════════════

async function seed() {
  console.log("🌱 Iniciando seed do VPEX Hub...\n");

  // 1. Insert companies
  console.log("📦 Inserindo empresas...");
  const companyIds = [];
  for (const c of companiesData) {
    const result = await execSQL(
      `INSERT INTO companies (name, ownerName, segment, franchiseBrand, \`plan\`, status, mrrCents, healthScore, storeCount, teamSize, integrationsCount, logoEmoji, phone, contactEmail, city, state)
       VALUES (${esc(c.name)}, ${esc(c.ownerName)}, ${esc(c.segment)}, ${esc(c.franchiseBrand)}, ${esc(c.plan)}, ${esc(c.status)}, ${c.mrrCents}, ${c.healthScore}, ${c.storeCount}, ${c.teamSize}, ${c.integrationsCount}, ${esc(c.logoEmoji)}, ${esc(c.phone)}, ${esc(c.contactEmail)}, ${esc(c.city)}, ${esc(c.state)})`
    );
    companyIds.push(Number(result[0].insertId));
    console.log(`  ✅ ${c.name} (ID: ${result[0].insertId})`);
  }

  // 2. Financial snapshots — last 30 days for each company
  console.log("\n📊 Gerando snapshots financeiros (30 dias)...");
  const now = new Date();

  for (let ci = 0; ci < companyIds.length; ci++) {
    const companyId = companyIds[ci];
    const company = companiesData[ci];
    const baseRevenue = company.mrrCents * 5;

    const rows = [];
    for (let d = 30; d >= 0; d--) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      const sDate = dateStr(date.getFullYear(), date.getMonth() + 1, date.getDate());

      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const dayFactor = isWeekend ? 0.4 : 1.0;
      const variance = randomBetween(-20, 20) / 100;
      const dailyRevenue = Math.round((baseRevenue / 26) * dayFactor * (1 + variance));

      rows.push(
        `(${companyId}, ${esc(sDate)}, ${dailyRevenue}, ${baseRevenue}, ${randomBetween(8000, 25000)}, ${randomDecimal(32, 48)}, ${randomDecimal(12, 28)}, ${randomBetween(15, 22)}, ${randomBetween(5, 40)}, ${randomBetween(10, 60)}, ${randomBetween(2, 20)}, ${randomBetween(0, 8)})`
      );
    }

    await execSQL(
      `INSERT INTO financial_snapshots (companyId, snapshotDate, revenueCents, monthlyGoalCents, avgTicketCents, cmvPercent, netMarginPercent, breakEvenDay, salesCount, customersServed, newLeads, openOrders)
       VALUES ${rows.join(",\n       ")}`
    );
    console.log(`  ✅ ${company.name}: 31 snapshots`);
  }

  // 3. Revenue by channel — current month for each company
  console.log("\n💰 Gerando receita por canal...");
  const currentPeriod = dateStr(now.getFullYear(), now.getMonth() + 1, 1);
  const channels = ["loja_fisica", "ecommerce", "whatsapp", "marketplace"];
  const channelSplits = [0.45, 0.28, 0.18, 0.09];

  for (let ci = 0; ci < companyIds.length; ci++) {
    const companyId = companyIds[ci];
    const company = companiesData[ci];
    const baseMonthly = company.mrrCents * 5;

    const rows = channels.map((ch, i) =>
      `(${companyId}, ${esc(currentPeriod)}, ${esc(ch)}, ${Math.round(baseMonthly * channelSplits[i])}, ${randomBetween(20, 200)})`
    );

    await execSQL(
      `INSERT INTO revenue_by_channel (companyId, periodDate, channel, revenueCents, transactionCount)
       VALUES ${rows.join(",\n       ")}`
    );
    console.log(`  ✅ ${company.name}: 4 canais`);
  }

  // 4. Marketing metrics — current month for each company
  console.log("\n📈 Gerando métricas de marketing...");
  const mktChannels = ["meta_ads", "google_ads", "tiktok_ads", "organico"];

  for (let ci = 0; ci < companyIds.length; ci++) {
    const companyId = companyIds[ci];
    const company = companiesData[ci];

    const channelData = [
      { leads: randomBetween(120, 250), cpl: randomBetween(800, 1500), roas: randomDecimal(2.5, 5.0), ctr: randomDecimal(1.5, 3.5), spend: randomBetween(150000, 300000), impressions: randomBetween(30000, 80000), clicks: randomBetween(1500, 4000), conversions: randomBetween(20, 60), campaigns: randomBetween(3, 8) },
      { leads: randomBetween(60, 130), cpl: randomBetween(1200, 2200), roas: randomDecimal(2.0, 4.0), ctr: randomDecimal(1.0, 2.5), spend: randomBetween(100000, 250000), impressions: randomBetween(20000, 50000), clicks: randomBetween(800, 2500), conversions: randomBetween(10, 40), campaigns: randomBetween(2, 5) },
      { leads: randomBetween(20, 60), cpl: randomBetween(600, 1200), roas: randomDecimal(1.5, 3.5), ctr: randomDecimal(2.0, 4.0), spend: randomBetween(20000, 80000), impressions: randomBetween(15000, 40000), clicks: randomBetween(500, 2000), conversions: randomBetween(5, 25), campaigns: randomBetween(1, 3) },
      { leads: randomBetween(15, 40), cpl: 0, roas: "0.00", ctr: "0.00", spend: 0, impressions: randomBetween(5000, 15000), clicks: randomBetween(200, 800), conversions: randomBetween(5, 15), campaigns: 0 },
    ];

    const rows = mktChannels.map((ch, i) => {
      const d = channelData[i];
      return `(${companyId}, ${esc(currentPeriod)}, ${esc(ch)}, ${d.leads}, ${d.cpl}, ${d.roas}, ${d.ctr}, ${d.spend}, ${d.impressions}, ${d.clicks}, ${d.conversions}, ${d.campaigns})`;
    });

    await execSQL(
      `INSERT INTO marketing_metrics (companyId, periodDate, marketingChannel, leadsGenerated, cplCents, roas, ctrPercent, spendCents, impressions, clicks, conversions, activeCampaigns)
       VALUES ${rows.join(",\n       ")}`
    );
    console.log(`  ✅ ${company.name}: 4 canais de marketing`);
  }

  // 5. Logistics metrics — last 6 months for each company
  console.log("\n🚚 Gerando métricas de logística...");
  for (let ci = 0; ci < companyIds.length; ci++) {
    const companyId = companyIds[ci];
    const company = companiesData[ci];

    const rows = [];
    for (let m = 5; m >= 0; m--) {
      const mDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const period = dateStr(mDate.getFullYear(), mDate.getMonth() + 1, 1);

      rows.push(
        `(${companyId}, ${esc(period)}, ${randomDecimal(85, 98)}, ${randomDecimal(24, 72, 1)}, ${randomBetween(300, 1200)}, ${randomBetween(0, 8)}, ${randomBetween(10, 50)}, ${randomBetween(5, 20)})`
      );
    }

    await execSQL(
      `INSERT INTO logistics_metrics (companyId, periodDate, onTimeDeliveryPercent, avgDeliveryHours, totalStockItems, stockOutItems, lowStockItems, excessStockItems)
       VALUES ${rows.join(",\n       ")}`
    );
    console.log(`  ✅ ${company.name}: 6 meses`);
  }

  // 6. HR metrics — last 6 months for each company
  console.log("\n👥 Gerando métricas de RH...");
  for (let ci = 0; ci < companyIds.length; ci++) {
    const companyId = companyIds[ci];
    const company = companiesData[ci];

    const rows = [];
    for (let m = 5; m >= 0; m--) {
      const mDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const period = dateStr(mDate.getFullYear(), mDate.getMonth() + 1, 1);

      const deptDistribution = JSON.stringify([
        { dept: "Vendas", count: Math.ceil(company.teamSize * 0.4), trained: Math.ceil(company.teamSize * 0.35) },
        { dept: "Estoque", count: Math.ceil(company.teamSize * 0.25), trained: Math.ceil(company.teamSize * 0.2) },
        { dept: "Admin", count: Math.ceil(company.teamSize * 0.2), trained: Math.ceil(company.teamSize * 0.2) },
        { dept: "Marketing", count: Math.ceil(company.teamSize * 0.15), trained: Math.ceil(company.teamSize * 0.1) },
      ]);

      rows.push(
        `(${companyId}, ${esc(period)}, ${company.teamSize + randomBetween(-2, 2)}, ${randomDecimal(5, 18)}, ${randomDecimal(60, 95)}, ${randomBetween(50, 90)}, ${esc(deptDistribution)})`
      );
    }

    await execSQL(
      `INSERT INTO hr_metrics (companyId, periodDate, totalEmployees, turnoverPercent, trainingCompletionPercent, enpsScore, departmentDistribution)
       VALUES ${rows.join(",\n       ")}`
    );
    console.log(`  ✅ ${company.name}: 6 meses`);
  }

  // 7. Alerts — 3-5 per company
  console.log("\n🚨 Gerando alertas...");
  const alertTemplates = [
    { severity: "warning", message: "CMV acima de 40% — revisar fornecedores", category: "financeiro" },
    { severity: "success", message: "Break-even atingido no dia 18 — dentro do prazo", category: "financeiro" },
    { severity: "danger", message: "Ticket Médio caiu 8% vs. mês anterior", category: "financeiro" },
    { severity: "warning", message: "Estoque baixo: Kit Presente Dia das Mães", category: "estoque" },
    { severity: "success", message: "Meta semanal batida: R$ 22.100 no sábado", category: "financeiro" },
    { severity: "info", message: "Nova integração com Meta Ads configurada", category: "sistema" },
    { severity: "danger", message: "3 itens em ruptura de estoque — risco de perda de venda", category: "estoque" },
    { severity: "warning", message: "22% da equipe não concluiu treinamentos obrigatórios", category: "rh" },
    { severity: "success", message: "ROAS subiu para 4.2x no Meta Ads", category: "marketing" },
    { severity: "warning", message: "CTR caiu 0.3% — revisar criativos", category: "marketing" },
  ];

  for (const companyId of companyIds) {
    const numAlerts = randomBetween(3, 5);
    const shuffled = [...alertTemplates].sort(() => Math.random() - 0.5);

    const rows = [];
    for (let i = 0; i < numAlerts; i++) {
      const a = shuffled[i];
      rows.push(
        `(${companyId}, ${esc(a.severity)}, ${esc(a.message)}, ${esc(a.category)}, ${Math.random() > 0.7 ? 1 : 0}, 1)`
      );
    }

    await execSQL(
      `INSERT INTO alerts (companyId, severity, message, category, isRead, isActive)
       VALUES ${rows.join(",\n       ")}`
    );
    console.log(`  ✅ Company ${companyId}: ${numAlerts} alertas`);
  }

  // 8. Activities — 5-8 per company
  console.log("\n📋 Gerando atividades...");
  const activityTemplates = [
    { type: "sale", message: "Meta diária batida: R$ 22.100 no sábado", icon: "CheckCircle2", iconColor: "text-vpex-green" },
    { type: "stock", message: "Estoque baixo: Kit Presente Dia das Mães", icon: "AlertTriangle", iconColor: "text-vpex-yellow" },
    { type: "campaign", message: "Nova campanha Meta Ads ativada", icon: "Zap", iconColor: "text-vpex-green" },
    { type: "report", message: "Relatório semanal disponível", icon: "Activity", iconColor: "text-muted-foreground" },
    { type: "lead", message: "12 novos leads capturados via landing page", icon: "ArrowUpRight", iconColor: "text-vpex-green" },
    { type: "integration", message: "Integração com Google Ads atualizada", icon: "Zap", iconColor: "text-vpex-green" },
    { type: "team", message: "Novo colaborador adicionado: Vendas", icon: "Users", iconColor: "text-muted-foreground" },
    { type: "system", message: "Backup automático realizado com sucesso", icon: "CheckCircle2", iconColor: "text-vpex-green" },
    { type: "sale", message: "Venda de alto valor: R$ 4.850 via e-commerce", icon: "DollarSign", iconColor: "text-vpex-green" },
    { type: "lead", message: "Formulário de contato recebido: João Silva", icon: "ArrowUpRight", iconColor: "text-vpex-green" },
  ];

  for (const companyId of companyIds) {
    const numActivities = randomBetween(5, 8);
    const shuffled = [...activityTemplates].sort(() => Math.random() - 0.5);

    const rows = [];
    for (let i = 0; i < numActivities; i++) {
      const act = shuffled[i];
      rows.push(
        `(${companyId}, ${esc(act.type)}, ${esc(act.message)}, ${esc(act.icon)}, ${esc(act.iconColor)})`
      );
    }

    await execSQL(
      `INSERT INTO activities (companyId, activityType, message, icon, iconColor)
       VALUES ${rows.join(",\n       ")}`
    );
    console.log(`  ✅ Company ${companyId}: ${numActivities} atividades`);
  }

  // 9. Monthly goals — current month for each company
  console.log("\n🎯 Gerando metas mensais...");
  for (let ci = 0; ci < companyIds.length; ci++) {
    const companyId = companyIds[ci];
    const company = companiesData[ci];
    const baseMonthly = company.mrrCents * 5;

    await execSQL(
      `INSERT INTO monthly_goals (companyId, monthDate, revenueGoalCents, leadsGoal, newCustomersGoal, idealCmvPercent, idealNetMarginPercent)
       VALUES (${companyId}, ${esc(currentPeriod)}, ${Math.round(baseMonthly * 1.1)}, ${randomBetween(200, 500)}, ${randomBetween(30, 80)}, 38.00, 20.00)`
    );
    console.log(`  ✅ ${company.name}`);
  }

  console.log("\n✅ Seed completo! Dados inseridos com sucesso.");
  console.log(`   📦 ${companiesData.length} empresas`);
  console.log(`   📊 ${companiesData.length * 31} snapshots financeiros`);
  console.log(`   💰 ${companiesData.length * 4} registros de receita por canal`);
  console.log(`   📈 ${companiesData.length * 4} métricas de marketing`);
  console.log(`   🚚 ${companiesData.length * 6} métricas de logística`);
  console.log(`   👥 ${companiesData.length * 6} métricas de RH`);
  console.log(`   🚨 ~${companiesData.length * 4} alertas`);
  console.log(`   📋 ~${companiesData.length * 6} atividades`);
  console.log(`   🎯 ${companiesData.length} metas mensais`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
