import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  date,
  boolean,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

// ═══════════════════════════════════════════════════════════════
// 1. USERS — Core auth table (already existed, extended)
// ═══════════════════════════════════════════════════════════════
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  companyId: int("companyId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 2. COMPANIES — Empresa/Franqueado (tenant principal)
// ═══════════════════════════════════════════════════════════════
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  /** Nome da empresa (ex: "Boticário Anápolis Centro") */
  name: varchar("name", { length: 255 }).notNull(),
  /** Nome do responsável */
  ownerName: varchar("ownerName", { length: 255 }),
  /** Segmento do negócio */
  segment: mysqlEnum("segment", [
    "franquia",
    "ecommerce",
    "industria",
    "loja",
    "consultoria",
    "digital",
  ]).notNull(),
  /** Franquia mãe (ex: "O Boticário", "Cacau Show") — null se não for franquia */
  franchiseBrand: varchar("franchiseBrand", { length: 255 }),
  /** Plano contratado */
  plan: mysqlEnum("plan", ["starter", "scale", "enterprise"]).default("starter").notNull(),
  /** Status da conta */
  status: mysqlEnum("status", ["ativo", "inadimplente", "pausado", "onboarding", "cancelado"])
    .default("onboarding")
    .notNull(),
  /** MRR em centavos (evita problemas de float) */
  mrrCents: int("mrrCents").default(0).notNull(),
  /** Health Score 0-100 */
  healthScore: int("healthScore").default(50).notNull(),
  /** Número de lojas/unidades */
  storeCount: int("storeCount").default(1).notNull(),
  /** Tamanho da equipe */
  teamSize: int("teamSize").default(1).notNull(),
  /** Integrações ativas */
  integrationsCount: int("integrationsCount").default(0).notNull(),
  /** Emoji/logo */
  logoEmoji: varchar("logoEmoji", { length: 10 }).default("🏢"),
  /** Contato */
  phone: varchar("phone", { length: 30 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  /** Endereço */
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  /** Data de entrada */
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 3. FINANCIAL_SNAPSHOTS — KPIs financeiros diários
//    Uma linha por empresa por dia. Alimenta Dashboard + Inteligência.
// ═══════════════════════════════════════════════════════════════
export const financialSnapshots = mysqlTable("financial_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  /** Data de referência (YYYY-MM-DD) */
  snapshotDate: date("snapshotDate", { mode: "string" }).notNull(),
  /** Faturamento do dia em centavos */
  revenueCents: bigint("revenueCents", { mode: "number" }).default(0).notNull(),
  /** Meta do mês em centavos (repetida por conveniência, pode vir de goals) */
  monthlyGoalCents: bigint("monthlyGoalCents", { mode: "number" }).default(0).notNull(),
  /** Ticket médio em centavos */
  avgTicketCents: int("avgTicketCents").default(0).notNull(),
  /** CMV em porcentagem (ex: 42.0 = 42%) */
  cmvPercent: decimal("cmvPercent", { precision: 5, scale: 2 }).default("0"),
  /** Margem líquida em porcentagem */
  netMarginPercent: decimal("netMarginPercent", { precision: 5, scale: 2 }).default("0"),
  /** Dia do break-even no mês (0 = ainda não atingido) */
  breakEvenDay: int("breakEvenDay").default(0),
  /** Número de vendas no dia */
  salesCount: int("salesCount").default(0).notNull(),
  /** Clientes atendidos no dia */
  customersServed: int("customersServed").default(0).notNull(),
  /** Leads novos no dia */
  newLeads: int("newLeads").default(0).notNull(),
  /** Pedidos em aberto */
  openOrders: int("openOrders").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FinancialSnapshot = typeof financialSnapshots.$inferSelect;
export type InsertFinancialSnapshot = typeof financialSnapshots.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 4. REVENUE_BY_CHANNEL — Faturamento por canal de venda
// ═══════════════════════════════════════════════════════════════
export const revenueByChannel = mysqlTable("revenue_by_channel", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  /** Período de referência (YYYY-MM-DD, primeiro dia do mês) */
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  /** Canal de venda */
  channel: mysqlEnum("channel", [
    "loja_fisica",
    "ecommerce",
    "whatsapp",
    "marketplace",
    "telefone",
    "outros",
  ]).notNull(),
  /** Faturamento em centavos */
  revenueCents: bigint("revenueCents", { mode: "number" }).default(0).notNull(),
  /** Número de transações */
  transactionCount: int("transactionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RevenueByChannel = typeof revenueByChannel.$inferSelect;
export type InsertRevenueByChannel = typeof revenueByChannel.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 5. MARKETING_METRICS — Performance de marketing por canal
// ═══════════════════════════════════════════════════════════════
export const marketingMetrics = mysqlTable("marketing_metrics", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  /** Canal de marketing */
  channel: mysqlEnum("marketingChannel", [
    "meta_ads",
    "google_ads",
    "tiktok_ads",
    "organico",
    "email",
    "whatsapp",
    "outros",
  ]).notNull(),
  /** Leads gerados */
  leadsGenerated: int("leadsGenerated").default(0).notNull(),
  /** CPL em centavos */
  cplCents: int("cplCents").default(0).notNull(),
  /** ROAS (ex: 3.8 = 3.8x) */
  roas: decimal("roas", { precision: 5, scale: 2 }).default("0"),
  /** CTR em porcentagem */
  ctrPercent: decimal("ctrPercent", { precision: 5, scale: 2 }).default("0"),
  /** Investimento em centavos */
  spendCents: int("spendCents").default(0).notNull(),
  /** Impressões */
  impressions: int("impressions").default(0).notNull(),
  /** Cliques */
  clicks: int("clicks").default(0).notNull(),
  /** Conversões */
  conversions: int("conversions").default(0).notNull(),
  /** Campanhas ativas */
  activeCampaigns: int("activeCampaigns").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MarketingMetric = typeof marketingMetrics.$inferSelect;
export type InsertMarketingMetric = typeof marketingMetrics.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 6. LOGISTICS_METRICS — Métricas de logística/estoque
// ═══════════════════════════════════════════════════════════════
export const logisticsMetrics = mysqlTable("logistics_metrics", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  /** Pedidos entregues no prazo (porcentagem) */
  onTimeDeliveryPercent: decimal("onTimeDeliveryPercent", { precision: 5, scale: 2 }).default("0"),
  /** Tempo médio de entrega em horas */
  avgDeliveryHours: decimal("avgDeliveryHours", { precision: 6, scale: 1 }).default("0"),
  /** Total de itens em estoque */
  totalStockItems: int("totalStockItems").default(0).notNull(),
  /** Itens em ruptura */
  stockOutItems: int("stockOutItems").default(0).notNull(),
  /** Itens com estoque baixo */
  lowStockItems: int("lowStockItems").default(0).notNull(),
  /** Itens com excesso */
  excessStockItems: int("excessStockItems").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LogisticsMetric = typeof logisticsMetrics.$inferSelect;
export type InsertLogisticsMetric = typeof logisticsMetrics.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 7. HR_METRICS — Métricas de RH
// ═══════════════════════════════════════════════════════════════
export const hrMetrics = mysqlTable("hr_metrics", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  /** Total de colaboradores */
  totalEmployees: int("totalEmployees").default(0).notNull(),
  /** Turnover em porcentagem */
  turnoverPercent: decimal("turnoverPercent", { precision: 5, scale: 2 }).default("0"),
  /** Treinamentos concluídos (porcentagem) */
  trainingCompletionPercent: decimal("trainingCompletionPercent", { precision: 5, scale: 2 }).default("0"),
  /** eNPS score (0-100) */
  enpsScore: int("enpsScore").default(0),
  /** Distribuição por departamento (JSON: [{dept, count, trained}]) */
  departmentDistribution: json("departmentDistribution"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HrMetric = typeof hrMetrics.$inferSelect;
export type InsertHrMetric = typeof hrMetrics.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 8. ALERTS — Alertas inteligentes do sistema
// ═══════════════════════════════════════════════════════════════
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  /** Severidade do alerta */
  severity: mysqlEnum("severity", ["success", "warning", "danger", "info"]).notNull(),
  /** Texto do alerta */
  message: text("message").notNull(),
  /** Categoria */
  category: mysqlEnum("category", [
    "financeiro",
    "estoque",
    "marketing",
    "rh",
    "operacao",
    "sistema",
  ]).default("sistema").notNull(),
  /** Se já foi lido/resolvido */
  isRead: boolean("isRead").default(false).notNull(),
  /** Se está ativo */
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 9. ACTIVITIES — Feed de atividades recentes
// ═══════════════════════════════════════════════════════════════
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  /** Usuário que gerou a atividade (null = sistema) */
  userId: int("userId"),
  /** Tipo de atividade */
  type: mysqlEnum("activityType", [
    "sale",
    "lead",
    "campaign",
    "stock",
    "report",
    "integration",
    "team",
    "system",
  ]).notNull(),
  /** Texto descritivo */
  message: text("message").notNull(),
  /** Ícone sugerido (nome do Lucide icon) */
  icon: varchar("icon", { length: 50 }).default("Activity"),
  /** Cor do ícone (CSS class) */
  iconColor: varchar("iconColor", { length: 50 }).default("text-muted-foreground"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityRecord = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 10. MONTHLY_GOALS — Metas mensais por empresa
// ═══════════════════════════════════════════════════════════════
export const monthlyGoals = mysqlTable("monthly_goals", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  /** Mês de referência (YYYY-MM-01) */
  monthDate: date("monthDate", { mode: "string" }).notNull(),
  /** Meta de faturamento em centavos */
  revenueGoalCents: bigint("revenueGoalCents", { mode: "number" }).default(0).notNull(),
  /** Meta de leads */
  leadsGoal: int("leadsGoal").default(0),
  /** Meta de clientes novos */
  newCustomersGoal: int("newCustomersGoal").default(0),
  /** CMV ideal (porcentagem) */
  idealCmvPercent: decimal("idealCmvPercent", { precision: 5, scale: 2 }).default("38.00"),
  /** Margem líquida ideal (porcentagem) */
  idealNetMarginPercent: decimal("idealNetMarginPercent", { precision: 5, scale: 2 }).default("20.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MonthlyGoal = typeof monthlyGoals.$inferSelect;
export type InsertMonthlyGoal = typeof monthlyGoals.$inferInsert;
