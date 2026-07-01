import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  numeric,
  date,
  bigint,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

// ═══════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const companySegmentEnum = pgEnum("company_segment", [
  "franquia", "ecommerce", "industria", "loja", "consultoria", "digital",
]);

export const companyPlanEnum = pgEnum("company_plan", [
  "starter", "scale", "enterprise",
]);

export const companyStatusEnum = pgEnum("company_status", [
  "ativo", "inadimplente", "pausado", "onboarding", "cancelado",
]);

export const revenueChannelEnum = pgEnum("revenue_channel", [
  "loja_fisica", "ecommerce", "whatsapp", "marketplace", "telefone", "outros",
]);

export const marketingChannelEnum = pgEnum("marketing_channel", [
  "meta_ads", "google_ads", "tiktok_ads", "organico", "email", "whatsapp", "outros",
]);

export const alertSeverityEnum = pgEnum("alert_severity", [
  "success", "warning", "danger", "info",
]);

export const alertCategoryEnum = pgEnum("alert_category", [
  "financeiro", "estoque", "marketing", "rh", "operacao", "sistema",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "sale", "lead", "campaign", "stock", "report", "integration", "team", "system",
]);

export const productTypeEnum = pgEnum("product_type", [
  "ebook", "mentoria", "servico", "ferramenta",
]);

export const productSegmentEnum = pgEnum("product_segment", [
  "varejo", "agro", "industria", "franquia", "todos",
]);

export const purchaseStatusEnum = pgEnum("purchase_status", [
  "pending", "paid", "cancelled", "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "pix", "boleto", "credit_card",
]);

// ═══════════════════════════════════════════════════════════════
// 1. USERS
// ═══════════════════════════════════════════════════════════════
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  companyId: integer("companyId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 2. COMPANIES
// ═══════════════════════════════════════════════════════════════
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerName: varchar("ownerName", { length: 255 }),
  segment: companySegmentEnum("segment").notNull(),
  franchiseBrand: varchar("franchiseBrand", { length: 255 }),
  plan: companyPlanEnum("plan").default("starter").notNull(),
  status: companyStatusEnum("status").default("onboarding").notNull(),
  mrrCents: integer("mrrCents").default(0).notNull(),
  healthScore: integer("healthScore").default(50).notNull(),
  storeCount: integer("storeCount").default(1).notNull(),
  teamSize: integer("teamSize").default(1).notNull(),
  integrationsCount: integer("integrationsCount").default(0).notNull(),
  logoEmoji: varchar("logoEmoji", { length: 10 }).default("🏢"),
  phone: varchar("phone", { length: 30 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 3. FINANCIAL_SNAPSHOTS
// ═══════════════════════════════════════════════════════════════
export const financialSnapshots = pgTable("financial_snapshots", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  snapshotDate: date("snapshotDate", { mode: "string" }).notNull(),
  revenueCents: bigint("revenueCents", { mode: "number" }).default(0).notNull(),
  monthlyGoalCents: bigint("monthlyGoalCents", { mode: "number" }).default(0).notNull(),
  avgTicketCents: integer("avgTicketCents").default(0).notNull(),
  cmvPercent: numeric("cmvPercent", { precision: 5, scale: 2 }).default("0"),
  netMarginPercent: numeric("netMarginPercent", { precision: 5, scale: 2 }).default("0"),
  breakEvenDay: integer("breakEvenDay").default(0),
  salesCount: integer("salesCount").default(0).notNull(),
  customersServed: integer("customersServed").default(0).notNull(),
  newLeads: integer("newLeads").default(0).notNull(),
  openOrders: integer("openOrders").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FinancialSnapshot = typeof financialSnapshots.$inferSelect;
export type InsertFinancialSnapshot = typeof financialSnapshots.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 4. REVENUE_BY_CHANNEL
// ═══════════════════════════════════════════════════════════════
export const revenueByChannel = pgTable("revenue_by_channel", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  channel: revenueChannelEnum("channel").notNull(),
  revenueCents: bigint("revenueCents", { mode: "number" }).default(0).notNull(),
  transactionCount: integer("transactionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RevenueByChannel = typeof revenueByChannel.$inferSelect;
export type InsertRevenueByChannel = typeof revenueByChannel.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 5. MARKETING_METRICS
// ═══════════════════════════════════════════════════════════════
export const marketingMetrics = pgTable("marketing_metrics", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  channel: marketingChannelEnum("marketingChannel").notNull(),
  leadsGenerated: integer("leadsGenerated").default(0).notNull(),
  cplCents: integer("cplCents").default(0).notNull(),
  roas: numeric("roas", { precision: 5, scale: 2 }).default("0"),
  ctrPercent: numeric("ctrPercent", { precision: 5, scale: 2 }).default("0"),
  spendCents: integer("spendCents").default(0).notNull(),
  impressions: integer("impressions").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  conversions: integer("conversions").default(0).notNull(),
  activeCampaigns: integer("activeCampaigns").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MarketingMetric = typeof marketingMetrics.$inferSelect;
export type InsertMarketingMetric = typeof marketingMetrics.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 6. LOGISTICS_METRICS
// ═══════════════════════════════════════════════════════════════
export const logisticsMetrics = pgTable("logistics_metrics", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  onTimeDeliveryPercent: numeric("onTimeDeliveryPercent", { precision: 5, scale: 2 }).default("0"),
  avgDeliveryHours: numeric("avgDeliveryHours", { precision: 6, scale: 1 }).default("0"),
  totalStockItems: integer("totalStockItems").default(0).notNull(),
  stockOutItems: integer("stockOutItems").default(0).notNull(),
  lowStockItems: integer("lowStockItems").default(0).notNull(),
  excessStockItems: integer("excessStockItems").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LogisticsMetric = typeof logisticsMetrics.$inferSelect;
export type InsertLogisticsMetric = typeof logisticsMetrics.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 7. HR_METRICS
// ═══════════════════════════════════════════════════════════════
export const hrMetrics = pgTable("hr_metrics", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  totalEmployees: integer("totalEmployees").default(0).notNull(),
  turnoverPercent: numeric("turnoverPercent", { precision: 5, scale: 2 }).default("0"),
  trainingCompletionPercent: numeric("trainingCompletionPercent", { precision: 5, scale: 2 }).default("0"),
  enpsScore: integer("enpsScore").default(0),
  departmentDistribution: jsonb("departmentDistribution"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HrMetric = typeof hrMetrics.$inferSelect;
export type InsertHrMetric = typeof hrMetrics.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 8. ALERTS
// ═══════════════════════════════════════════════════════════════
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  severity: alertSeverityEnum("severity").notNull(),
  message: text("message").notNull(),
  category: alertCategoryEnum("category").default("sistema").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 9. ACTIVITIES
// ═══════════════════════════════════════════════════════════════
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  userId: integer("userId"),
  type: activityTypeEnum("activityType").notNull(),
  message: text("message").notNull(),
  icon: varchar("icon", { length: 50 }).default("Activity"),
  iconColor: varchar("iconColor", { length: 50 }).default("text-muted-foreground"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityRecord = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 10. MONTHLY_GOALS
// ═══════════════════════════════════════════════════════════════
export const monthlyGoals = pgTable("monthly_goals", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  monthDate: date("monthDate", { mode: "string" }).notNull(),
  revenueGoalCents: bigint("revenueGoalCents", { mode: "number" }).default(0).notNull(),
  leadsGoal: integer("leadsGoal").default(0),
  newCustomersGoal: integer("newCustomersGoal").default(0),
  idealCmvPercent: numeric("idealCmvPercent", { precision: 5, scale: 2 }).default("38.00"),
  idealNetMarginPercent: numeric("idealNetMarginPercent", { precision: 5, scale: 2 }).default("20.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  companyMonthUnique: unique("monthly_goals_company_month").on(t.companyId, t.monthDate),
}));

export type MonthlyGoal = typeof monthlyGoals.$inferSelect;
export type InsertMonthlyGoal = typeof monthlyGoals.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 11. PRODUCTS
// ═══════════════════════════════════════════════════════════════
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: productTypeEnum("type").notNull(),
  segment: productSegmentEnum("segment").default("todos").notNull(),
  priceCents: integer("priceCents").notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  contentUrl: varchar("contentUrl", { length: 500 }),
  featured: boolean("featured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// 12. PURCHASES
// ═══════════════════════════════════════════════════════════════
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  productId: integer("productId").notNull(),
  asaasPaymentId: varchar("asaasPaymentId", { length: 255 }),
  asaasCustomerId: varchar("asaasCustomerId", { length: 255 }),
  status: purchaseStatusEnum("status").default("pending").notNull(),
  amountCents: integer("amountCents").notNull(),
  paymentMethod: paymentMethodEnum("paymentMethod").default("pix").notNull(),
  paymentUrl: varchar("paymentUrl", { length: 500 }),
  pixQrCode: text("pixQrCode"),
  pixCopyPaste: text("pixCopyPaste"),
  paidAt: timestamp("paidAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;
