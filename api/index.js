// server/_core/vercel-entry.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

// server/db.ts
import dns from "node:dns";
import { eq, desc, and, gte, lte, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// drizzle/schema.ts
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
  unique
} from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum("user_role", ["user", "admin"]);
var companySegmentEnum = pgEnum("company_segment", [
  "franquia",
  "ecommerce",
  "industria",
  "loja",
  "consultoria",
  "digital"
]);
var companyPlanEnum = pgEnum("company_plan", [
  "starter",
  "scale",
  "enterprise"
]);
var companyStatusEnum = pgEnum("company_status", [
  "ativo",
  "inadimplente",
  "pausado",
  "onboarding",
  "cancelado"
]);
var revenueChannelEnum = pgEnum("revenue_channel", [
  "loja_fisica",
  "ecommerce",
  "whatsapp",
  "marketplace",
  "telefone",
  "outros"
]);
var marketingChannelEnum = pgEnum("marketing_channel", [
  "meta_ads",
  "google_ads",
  "tiktok_ads",
  "organico",
  "email",
  "whatsapp",
  "outros"
]);
var alertSeverityEnum = pgEnum("alert_severity", [
  "success",
  "warning",
  "danger",
  "info"
]);
var alertCategoryEnum = pgEnum("alert_category", [
  "financeiro",
  "estoque",
  "marketing",
  "rh",
  "operacao",
  "sistema"
]);
var activityTypeEnum = pgEnum("activity_type", [
  "sale",
  "lead",
  "campaign",
  "stock",
  "report",
  "integration",
  "team",
  "system"
]);
var productTypeEnum = pgEnum("product_type", [
  "ebook",
  "mentoria",
  "servico",
  "ferramenta"
]);
var productSegmentEnum = pgEnum("product_segment", [
  "varejo",
  "agro",
  "industria",
  "franquia",
  "todos"
]);
var purchaseStatusEnum = pgEnum("purchase_status", [
  "pending",
  "paid",
  "cancelled",
  "refunded"
]);
var paymentMethodEnum = pgEnum("payment_method", [
  "pix",
  "boleto",
  "credit_card"
]);
var users = pgTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var companies = pgTable("companies", {
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
  logoEmoji: varchar("logoEmoji", { length: 10 }).default("\u{1F3E2}"),
  phone: varchar("phone", { length: 30 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var financialSnapshots = pgTable("financial_snapshots", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var revenueByChannel = pgTable("revenue_by_channel", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  channel: revenueChannelEnum("channel").notNull(),
  revenueCents: bigint("revenueCents", { mode: "number" }).default(0).notNull(),
  transactionCount: integer("transactionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var marketingMetrics = pgTable("marketing_metrics", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var logisticsMetrics = pgTable("logistics_metrics", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  onTimeDeliveryPercent: numeric("onTimeDeliveryPercent", { precision: 5, scale: 2 }).default("0"),
  avgDeliveryHours: numeric("avgDeliveryHours", { precision: 6, scale: 1 }).default("0"),
  totalStockItems: integer("totalStockItems").default(0).notNull(),
  stockOutItems: integer("stockOutItems").default(0).notNull(),
  lowStockItems: integer("lowStockItems").default(0).notNull(),
  excessStockItems: integer("excessStockItems").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var hrMetrics = pgTable("hr_metrics", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  periodDate: date("periodDate", { mode: "string" }).notNull(),
  totalEmployees: integer("totalEmployees").default(0).notNull(),
  turnoverPercent: numeric("turnoverPercent", { precision: 5, scale: 2 }).default("0"),
  trainingCompletionPercent: numeric("trainingCompletionPercent", { precision: 5, scale: 2 }).default("0"),
  enpsScore: integer("enpsScore").default(0),
  departmentDistribution: jsonb("departmentDistribution"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  severity: alertSeverityEnum("severity").notNull(),
  message: text("message").notNull(),
  category: alertCategoryEnum("category").default("sistema").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  userId: integer("userId"),
  type: activityTypeEnum("activityType").notNull(),
  message: text("message").notNull(),
  icon: varchar("icon", { length: 50 }).default("Activity"),
  iconColor: varchar("iconColor", { length: 50 }).default("text-muted-foreground"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var monthlyGoals = pgTable("monthly_goals", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  monthDate: date("monthDate", { mode: "string" }).notNull(),
  revenueGoalCents: bigint("revenueGoalCents", { mode: "number" }).default(0).notNull(),
  leadsGoal: integer("leadsGoal").default(0),
  newCustomersGoal: integer("newCustomersGoal").default(0),
  idealCmvPercent: numeric("idealCmvPercent", { precision: 5, scale: 2 }).default("38.00"),
  idealNetMarginPercent: numeric("idealNetMarginPercent", { precision: 5, scale: 2 }).default("20.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
}, (t2) => ({
  companyMonthUnique: unique("monthly_goals_company_month").on(t2.companyId, t2.monthDate)
}));
var products = pgTable("products", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var purchases = pgTable("purchases", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
dns.setDefaultResultOrder("ipv4first");
var _db = null;
async function getDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!_db && url) {
    try {
      const client = postgres(url, {
        ssl: "require",
        max: 1,
        prepare: false,
        fetch_types: false,
        connect_timeout: 10,
        idle_timeout: 20,
        max_lifetime: 60 * 30
      });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod", "passwordHash"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] ?? void 0;
}
async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
  return result[0] ?? void 0;
}
async function getCompanyById(companyId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return result[0] ?? void 0;
}
async function getAllCompanies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companies).orderBy(desc(companies.healthScore));
}
async function getCompanyByUserId(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]?.companyId) return void 0;
  return getCompanyById(user[0].companyId);
}
async function createCompany(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(companies).values(data).returning({ id: companies.id });
  return { id: result.id };
}
async function updateCompany(companyId, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(companies).set(data).where(eq(companies.id, companyId));
}
async function getFinancialSnapshotsForPeriod(companyId, startDate, endDate) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(financialSnapshots).where(and(
    eq(financialSnapshots.companyId, companyId),
    gte(financialSnapshots.snapshotDate, startDate),
    lte(financialSnapshots.snapshotDate, endDate)
  )).orderBy(asc(financialSnapshots.snapshotDate));
}
async function getDashboardKPIs(companyId) {
  const db = await getDb();
  if (!db) return null;
  const now = /* @__PURE__ */ new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevFirstOfMonth = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}-01`;
  const prevLastOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const prevEndDate = `${prevLastOfMonth.getFullYear()}-${String(prevLastOfMonth.getMonth() + 1).padStart(2, "0")}-${String(prevLastOfMonth.getDate()).padStart(2, "0")}`;
  const [currentSnapshots, prevSnapshots] = await Promise.all([
    getFinancialSnapshotsForPeriod(companyId, firstOfMonth, today),
    getFinancialSnapshotsForPeriod(companyId, prevFirstOfMonth, prevEndDate)
  ]);
  const goalResult = await db.select().from(monthlyGoals).where(and(eq(monthlyGoals.companyId, companyId), eq(monthlyGoals.monthDate, firstOfMonth))).limit(1);
  const goal = goalResult[0] ?? null;
  const todaySnapshot = currentSnapshots.find((s) => s.snapshotDate === today);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  const yesterdaySnapshot = currentSnapshots.find((s) => s.snapshotDate === yesterdayStr);
  const currentMonthRevenue = currentSnapshots.reduce((sum, s) => sum + s.revenueCents, 0);
  const prevMonthRevenue = prevSnapshots.reduce((sum, s) => sum + s.revenueCents, 0);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = lastDayOfMonth - now.getDate();
  const avgTicketCurrent = currentSnapshots.length > 0 ? currentSnapshots.reduce((sum, s) => sum + s.avgTicketCents, 0) / currentSnapshots.length : 0;
  const avgTicketPrev = prevSnapshots.length > 0 ? prevSnapshots.reduce((sum, s) => sum + s.avgTicketCents, 0) / prevSnapshots.length : 0;
  return {
    currentMonthRevenueCents: currentMonthRevenue,
    monthlyGoalCents: goal?.revenueGoalCents ?? 0,
    revenuePercent: goal?.revenueGoalCents && goal.revenueGoalCents > 0 ? Math.round(currentMonthRevenue / goal.revenueGoalCents * 100) : 0,
    daysRemaining,
    remainingCents: Math.max(0, (goal?.revenueGoalCents ?? 0) - currentMonthRevenue),
    dailyAvgNeededCents: daysRemaining > 0 ? Math.round(Math.max(0, (goal?.revenueGoalCents ?? 0) - currentMonthRevenue) / daysRemaining) : 0,
    todayRevenueCents: todaySnapshot?.revenueCents ?? 0,
    todayRevenueChange: yesterdaySnapshot ? calculateChange(todaySnapshot?.revenueCents ?? 0, yesterdaySnapshot.revenueCents) : 0,
    avgTicketCents: Math.round(avgTicketCurrent),
    avgTicketChange: calculateChange(avgTicketCurrent, avgTicketPrev),
    cmvPercent: todaySnapshot?.cmvPercent ? parseFloat(String(todaySnapshot.cmvPercent)) : 0,
    idealCmvPercent: goal?.idealCmvPercent ? parseFloat(String(goal.idealCmvPercent)) : 38,
    netMarginPercent: todaySnapshot?.netMarginPercent ? parseFloat(String(todaySnapshot.netMarginPercent)) : 0,
    netMarginChange: calculateChange(
      todaySnapshot?.netMarginPercent ? parseFloat(String(todaySnapshot.netMarginPercent)) : 0,
      prevSnapshots.length > 0 ? parseFloat(String(prevSnapshots[prevSnapshots.length - 1].netMarginPercent)) : 0
    ),
    breakEvenDay: todaySnapshot?.breakEvenDay ?? 0,
    customersServed: todaySnapshot?.customersServed ?? 0,
    newLeads: todaySnapshot?.newLeads ?? 0,
    openOrders: todaySnapshot?.openOrders ?? 0,
    dailyData: currentSnapshots.map((s) => ({
      date: s.snapshotDate,
      revenueCents: s.revenueCents,
      goalCents: s.monthlyGoalCents,
      leads: s.newLeads
    }))
  };
}
function calculateChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round((current - previous) / previous * 1e3) / 10;
}
async function getRevenueByChannelForPeriod(companyId, periodDate) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(revenueByChannel).where(and(
    eq(revenueByChannel.companyId, companyId),
    eq(revenueByChannel.periodDate, periodDate)
  ));
}
async function getMarketingMetricsForPeriod(companyId, periodDate) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketingMetrics).where(and(
    eq(marketingMetrics.companyId, companyId),
    eq(marketingMetrics.periodDate, periodDate)
  ));
}
async function getLogisticsMetricsForPeriod(companyId, startDate, endDate) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(logisticsMetrics).where(and(
    eq(logisticsMetrics.companyId, companyId),
    gte(logisticsMetrics.periodDate, startDate),
    lte(logisticsMetrics.periodDate, endDate)
  )).orderBy(asc(logisticsMetrics.periodDate));
}
async function getHrMetricsForPeriod(companyId, startDate, endDate) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hrMetrics).where(and(
    eq(hrMetrics.companyId, companyId),
    gte(hrMetrics.periodDate, startDate),
    lte(hrMetrics.periodDate, endDate)
  )).orderBy(asc(hrMetrics.periodDate));
}
async function getActiveAlerts(companyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alerts).where(and(
    eq(alerts.companyId, companyId),
    eq(alerts.isActive, true)
  )).orderBy(desc(alerts.createdAt)).limit(20);
}
async function getRecentActivities(companyId, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activities).where(eq(activities.companyId, companyId)).orderBy(desc(activities.createdAt)).limit(limit);
}
async function getAdminOverview() {
  const db = await getDb();
  if (!db) return null;
  const allCompanies = await db.select().from(companies);
  const totalMrr = allCompanies.reduce((sum, c) => sum + c.mrrCents, 0);
  const activeCount = allCompanies.filter((c) => c.status === "ativo").length;
  const avgHealth = allCompanies.length > 0 ? Math.round(allCompanies.reduce((sum, c) => sum + c.healthScore, 0) / allCompanies.length) : 0;
  const atRiskCount = allCompanies.filter(
    (c) => c.status === "inadimplente" || c.status === "pausado" || c.healthScore < 50
  ).length;
  const byPlan = {
    starter: allCompanies.filter((c) => c.plan === "starter").length,
    scale: allCompanies.filter((c) => c.plan === "scale").length,
    enterprise: allCompanies.filter((c) => c.plan === "enterprise").length
  };
  const byStatus = {
    ativo: allCompanies.filter((c) => c.status === "ativo").length,
    onboarding: allCompanies.filter((c) => c.status === "onboarding").length,
    inadimplente: allCompanies.filter((c) => c.status === "inadimplente").length,
    pausado: allCompanies.filter((c) => c.status === "pausado").length
  };
  const bySegment = {};
  allCompanies.forEach((c) => {
    bySegment[c.segment] = (bySegment[c.segment] || 0) + 1;
  });
  return { totalMrrCents: totalMrr, activeCount, totalCount: allCompanies.length, avgHealthScore: avgHealth, atRiskCount, byPlan, byStatus, bySegment, companies: allCompanies };
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (v) => typeof v === "string" && v.length > 0;
var SDKServer = class {
  getSessionSecret() {
    return new TextEncoder().encode(ENV.cookieSecret);
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) return /* @__PURE__ */ new Map();
    return new Map(Object.entries(parseCookieHeader(cookieHeader)));
  }
  async createSessionToken(openId, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    return new SignJWT({ openId, name: options.name ?? "" }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(this.getSessionSecret());
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const { payload } = await jwtVerify(cookieValue, this.getSessionSecret(), {
        algorithms: ["HS256"]
      });
      const { openId, name } = payload;
      if (!isNonEmptyString(openId)) {
        console.warn("[Auth] Session payload missing openId");
        return null;
      }
      return { openId, name: isNonEmptyString(name) ? name : "" };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) throw ForbiddenError("Invalid session");
    const user = await getUserByOpenId(session.openId);
    if (!user) throw ForbiddenError("User not found");
    await upsertUser({ openId: user.openId, lastSignedIn: /* @__PURE__ */ new Date() });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function json400(res, message) {
  return res.status(400).json({ error: message });
}
function registerOAuthRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body ?? {};
    if (!email || !password || !name) {
      return json400(res, "Nome, email e senha s\xE3o obrigat\xF3rios");
    }
    if (typeof password !== "string" || password.length < 6) {
      return json400(res, "Senha deve ter pelo menos 6 caracteres");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json400(res, "Email inv\xE1lido");
    }
    const existing = await getUserByEmail(email);
    if (existing) {
      return json400(res, "Email j\xE1 cadastrado");
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const openId = nanoid(24);
    const isOwner = ENV.ownerOpenId && ENV.ownerOpenId === openId;
    await upsertUser({
      openId,
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      loginMethod: "email",
      role: isOwner ? "admin" : "user",
      lastSignedIn: /* @__PURE__ */ new Date()
    });
    const token = await sdk.createSessionToken(openId, {
      name: String(name).trim()
    });
    res.cookie(COOKIE_NAME, token, {
      ...getSessionCookieOptions(req),
      maxAge: 365 * 24 * 60 * 60 * 1e3
    });
    const user = await getUserByOpenId(openId);
    return res.json({ success: true, user: { name: user?.name, email: user?.email, role: user?.role } });
  });
  app2.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return json400(res, "Email e senha s\xE3o obrigat\xF3rios");
    }
    const user = await getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return json400(res, "Email ou senha inv\xE1lidos");
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return json400(res, "Email ou senha inv\xE1lidos");
    }
    const token = await sdk.createSessionToken(user.openId, {
      name: user.name ?? ""
    });
    res.cookie(COOKIE_NAME, token, {
      ...getSessionCookieOptions(req),
      maxAge: 365 * 24 * 60 * 60 * 1e3
    });
    await upsertUser({ openId: user.openId, lastSignedIn: /* @__PURE__ */ new Date() });
    return res.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  });
  app2.post("/api/auth/logout", (req, res) => {
    res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(req), maxAge: -1 });
    return res.json({ success: true });
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/dashboard.ts
import { z as z2 } from "zod";
var dashboardRouter = router({
  /**
   * Get all dashboard KPIs for the authenticated user's company.
   * Returns revenue vs goal, today's metrics, daily chart data, etc.
   */
  kpis: protectedProcedure.query(async ({ ctx }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) {
      return null;
    }
    return getDashboardKPIs(company.id);
  }),
  /**
   * Get revenue breakdown by sales channel for the current month.
   */
  revenueByChannel: protectedProcedure.query(async ({ ctx }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) return [];
    const now = /* @__PURE__ */ new Date();
    const periodDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    return getRevenueByChannelForPeriod(company.id, periodDate);
  }),
  /**
   * Get active alerts for the user's company.
   */
  alerts: protectedProcedure.query(async ({ ctx }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) return [];
    return getActiveAlerts(company.id);
  }),
  /**
   * Get recent activity feed for the user's company.
   */
  activities: protectedProcedure.input(z2.object({ limit: z2.number().min(1).max(50).default(10) }).optional()).query(async ({ ctx, input }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) return [];
    return getRecentActivities(company.id, input?.limit ?? 10);
  }),
  /**
   * Get the user's company profile.
   */
  company: protectedProcedure.query(async ({ ctx }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    return company ?? null;
  })
});

// server/routers/admin.ts
import { z as z3 } from "zod";
var adminRouter = router({
  /**
   * Get aggregated overview for the VPEX admin panel.
   * MRR total, active clients, health scores, distribution by plan/status/segment.
   */
  overview: adminProcedure.query(async () => {
    return getAdminOverview();
  }),
  /**
   * List all companies with their details.
   */
  companies: adminProcedure.query(async () => {
    return getAllCompanies();
  }),
  /**
   * Get a specific company's details + dashboard KPIs (for "enter account" feature).
   */
  companyDetail: adminProcedure.input(z3.object({ companyId: z3.number() })).query(async ({ input }) => {
    const company = await getCompanyById(input.companyId);
    if (!company) return null;
    const kpis = await getDashboardKPIs(company.id);
    return { company, kpis };
  }),
  /**
   * Create a new company (client onboarding from admin side).
   */
  createCompany: adminProcedure.input(
    z3.object({
      name: z3.string().min(1),
      ownerName: z3.string().optional(),
      segment: z3.enum([
        "franquia",
        "ecommerce",
        "industria",
        "loja",
        "consultoria",
        "digital"
      ]),
      franchiseBrand: z3.string().optional(),
      plan: z3.enum(["starter", "scale", "enterprise"]).default("starter"),
      mrrCents: z3.number().default(0),
      phone: z3.string().optional(),
      contactEmail: z3.string().email().optional(),
      city: z3.string().optional(),
      state: z3.string().max(2).optional(),
      storeCount: z3.number().default(1),
      teamSize: z3.number().default(1),
      logoEmoji: z3.string().default("\u{1F3E2}")
    })
  ).mutation(async ({ input }) => {
    return createCompany({
      ...input,
      status: "onboarding",
      healthScore: 50,
      integrationsCount: 0
    });
  }),
  /**
   * Update company details (plan, status, health score, etc.).
   */
  updateCompany: adminProcedure.input(
    z3.object({
      companyId: z3.number(),
      data: z3.object({
        name: z3.string().optional(),
        plan: z3.enum(["starter", "scale", "enterprise"]).optional(),
        status: z3.enum(["ativo", "inadimplente", "pausado", "onboarding", "cancelado"]).optional(),
        mrrCents: z3.number().optional(),
        healthScore: z3.number().min(0).max(100).optional(),
        storeCount: z3.number().optional(),
        teamSize: z3.number().optional()
      })
    })
  ).mutation(async ({ input }) => {
    await updateCompany(input.companyId, input.data);
    return { success: true };
  })
});

// server/routers/intelligence.ts
import { z as z4 } from "zod";
var intelligenceRouter = router({
  /**
   * Commercial intelligence: sales trends, conversion, active customers.
   */
  commercial: protectedProcedure.input(
    z4.object({
      startDate: z4.string().optional(),
      endDate: z4.string().optional()
    }).optional()
  ).query(async ({ ctx, input }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) return null;
    const now = /* @__PURE__ */ new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startDate = input?.startDate ?? `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;
    const endDate = input?.endDate ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const snapshots = await getFinancialSnapshotsForPeriod(
      company.id,
      startDate,
      endDate
    );
    return {
      snapshots,
      companyId: company.id
    };
  }),
  /**
   * Marketing intelligence: leads, CPL, ROAS, CTR by channel.
   */
  marketing: protectedProcedure.input(
    z4.object({
      periodDate: z4.string().optional()
    }).optional()
  ).query(async ({ ctx, input }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) return null;
    const now = /* @__PURE__ */ new Date();
    const periodDate = input?.periodDate ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const metrics = await getMarketingMetricsForPeriod(
      company.id,
      periodDate
    );
    return { metrics, companyId: company.id };
  }),
  /**
   * Logistics intelligence: delivery rates, stock health.
   */
  logistics: protectedProcedure.input(
    z4.object({
      startDate: z4.string().optional(),
      endDate: z4.string().optional()
    }).optional()
  ).query(async ({ ctx, input }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) return null;
    const now = /* @__PURE__ */ new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startDate = input?.startDate ?? `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;
    const endDate = input?.endDate ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const metrics = await getLogisticsMetricsForPeriod(
      company.id,
      startDate,
      endDate
    );
    return { metrics, companyId: company.id };
  }),
  /**
   * HR intelligence: turnover, training, eNPS.
   */
  hr: protectedProcedure.input(
    z4.object({
      startDate: z4.string().optional(),
      endDate: z4.string().optional()
    }).optional()
  ).query(async ({ ctx, input }) => {
    const company = await getCompanyByUserId(ctx.user.id);
    if (!company) return null;
    const now = /* @__PURE__ */ new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startDate = input?.startDate ?? `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;
    const endDate = input?.endDate ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const metrics = await getHrMetricsForPeriod(
      company.id,
      startDate,
      endDate
    );
    return { metrics, companyId: company.id };
  })
});

// server/routers/produtos.ts
import { z as z5 } from "zod";
import { eq as eq2, and as and2, asc as asc2 } from "drizzle-orm";

// server/_core/asaas.ts
var ASAAS_BASE = process.env.ASAAS_SANDBOX === "true" ? "https://sandbox.asaas.com/api/v3" : "https://api.asaas.com/v3";
var ASAAS_KEY = process.env.ASAAS_API_KEY ?? "";
async function asaasRequest(method, path, body) {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_KEY
    },
    body: body ? JSON.stringify(body) : void 0
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.[0]?.description ?? "Erro no Asaas";
    throw new Error(msg);
  }
  return data;
}
async function findOrCreateCustomer(params) {
  if (params.email) {
    const search = await asaasRequest(
      "GET",
      `/customers?email=${encodeURIComponent(params.email)}`
    );
    if (search.data.length > 0) return search.data[0];
  }
  return asaasRequest("POST", "/customers", {
    name: params.name,
    email: params.email,
    cpfCnpj: params.cpfCnpj,
    phone: params.phone
  });
}
async function createPayment(params) {
  const payment = await asaasRequest("POST", "/payments", {
    customer: params.customerId,
    billingType: params.billingType,
    value: params.value,
    dueDate: params.dueDate,
    description: params.description,
    externalReference: params.externalReference
  });
  if (params.billingType === "PIX") {
    const pix = await asaasRequest(
      "GET",
      `/payments/${payment.id}/pixQrCode`
    ).catch(() => null);
    if (pix) {
      payment.pixQrCodeImage = pix.encodedImage;
      payment.pixCopiaECola = pix.payload;
    }
  }
  return payment;
}
async function getPayment(paymentId) {
  return asaasRequest("GET", `/payments/${paymentId}`);
}
function mapAsaasStatus(asaasStatus) {
  switch (asaasStatus) {
    case "RECEIVED":
    case "CONFIRMED":
      return "paid";
    case "REFUNDED":
      return "refunded";
    case "DELETED":
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
}

// server/routers/produtos.ts
function dueDateStr() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
var produtosRouter = router({
  /* ─── Lista produtos públicos do catálogo ─── */
  listar: publicProcedure.input(z5.object({
    type: z5.enum(["ebook", "mentoria", "servico", "ferramenta"]).optional(),
    segment: z5.enum(["varejo", "agro", "industria", "franquia", "todos"]).optional()
  }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return mockProducts;
    const rows = await db.select().from(products).where(and2(
      eq2(products.isActive, true),
      input?.type ? eq2(products.type, input.type) : void 0,
      input?.segment ? eq2(products.segment, input.segment) : void 0
    )).orderBy(asc2(products.sortOrder), asc2(products.id));
    return rows.length > 0 ? rows : mockProducts;
  }),
  /* ─── Minhas compras (autenticado) ─── */
  minhasCompras: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select({ purchase: purchases, product: products }).from(purchases).innerJoin(products, eq2(purchases.productId, products.id)).where(eq2(purchases.userId, ctx.user.id));
  }),
  /* ─── Inicia compra via Asaas ─── */
  comprar: protectedProcedure.input(z5.object({
    productId: z5.number(),
    paymentMethod: z5.enum(["pix", "boleto", "credit_card"]),
    cpfCnpj: z5.string().optional(),
    phone: z5.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    const productRow = db ? (await db.select().from(products).where(eq2(products.id, input.productId)).limit(1))[0] : mockProducts.find((p) => p.id === input.productId);
    if (!productRow) throw new Error("Produto n\xE3o encontrado");
    if (!productRow.isActive) throw new Error("Produto indispon\xEDvel");
    const asaasKey = process.env.ASAAS_API_KEY;
    if (!asaasKey) {
      return {
        purchaseId: 0,
        status: "pending",
        paymentUrl: null,
        pixQrCode: null,
        pixCopyPaste: null,
        message: "Asaas n\xE3o configurado. Configure ASAAS_API_KEY no .env para processar pagamentos."
      };
    }
    const customer = await findOrCreateCustomer({
      name: ctx.user.name ?? "Cliente",
      email: ctx.user.email ?? "",
      cpfCnpj: input.cpfCnpj,
      phone: input.phone
    });
    const billingType = input.paymentMethod === "pix" ? "PIX" : input.paymentMethod === "boleto" ? "BOLETO" : "CREDIT_CARD";
    const payment = await createPayment({
      customerId: customer.id,
      billingType,
      value: productRow.priceCents / 100,
      dueDate: dueDateStr(),
      description: `VPEX \u2014 ${productRow.name}`,
      externalReference: `user_${ctx.user.id}_product_${productRow.id}`
    });
    if (db) {
      const [result] = await db.insert(purchases).values({
        userId: ctx.user.id,
        productId: productRow.id,
        asaasPaymentId: payment.id,
        asaasCustomerId: customer.id,
        status: "pending",
        amountCents: productRow.priceCents,
        paymentMethod: input.paymentMethod,
        paymentUrl: payment.invoiceUrl ?? payment.bankSlipUrl ?? null,
        pixQrCode: payment.pixQrCodeImage ?? null,
        pixCopyPaste: payment.pixCopiaECola ?? null
      }).returning({ id: purchases.id });
      return {
        purchaseId: result.id,
        status: "pending",
        paymentUrl: payment.invoiceUrl ?? payment.bankSlipUrl ?? null,
        pixQrCode: payment.pixQrCodeImage ?? null,
        pixCopyPaste: payment.pixCopiaECola ?? null,
        message: null
      };
    }
    return {
      purchaseId: 0,
      status: "pending",
      paymentUrl: payment.invoiceUrl ?? payment.bankSlipUrl ?? null,
      pixQrCode: payment.pixQrCodeImage ?? null,
      pixCopyPaste: payment.pixCopiaECola ?? null,
      message: null
    };
  }),
  /* ─── Verifica status de um pagamento ─── */
  verificarPagamento: protectedProcedure.input(z5.object({ purchaseId: z5.number() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return { status: "pending" };
    const [row] = await db.select().from(purchases).where(and2(eq2(purchases.id, input.purchaseId), eq2(purchases.userId, ctx.user.id))).limit(1);
    if (!row) throw new Error("Compra n\xE3o encontrada");
    if (row.status === "paid") return { status: "paid" };
    if (!row.asaasPaymentId) return { status: row.status };
    const payment = await getPayment(row.asaasPaymentId).catch(() => null);
    if (!payment) return { status: row.status };
    const newStatus = mapAsaasStatus(payment.status);
    if (newStatus !== row.status) {
      await db.update(purchases).set({
        status: newStatus,
        paidAt: newStatus === "paid" ? /* @__PURE__ */ new Date() : void 0
      }).where(eq2(purchases.id, input.purchaseId));
    }
    return { status: newStatus };
  })
});
var mockProducts = [
  { id: 1, name: "Como Vender no Mercado Livre do Zero", description: "Guia completo para criar, configurar e escalar uma opera\xE7\xE3o no Mercado Livre, do cadastro ao Full.", type: "ebook", segment: "varejo", priceCents: 4700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 1, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 2, name: "Shopee: Do Cadastro \xE0s Primeiras Vendas", description: "Passo a passo para entrar na Shopee, otimizar seus an\xFAncios e crescer r\xE1pido.", type: "ebook", segment: "varejo", priceCents: 3700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 2, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 3, name: "Mentoria de Marketplace \u2014 4 Sess\xF5es", description: "4 sess\xF5es 1:1 com especialistas VPEX. Diagn\xF3stico, estrat\xE9gia e acompanhamento da sua opera\xE7\xE3o.", type: "mentoria", segment: "todos", priceCents: 149700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 3, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 4, name: "Mentoria Agro Digital \u2014 2 Sess\xF5es", description: "Como digitalizar sua produ\xE7\xE3o e vender direto ao consumidor final, sem intermedi\xE1rios.", type: "mentoria", segment: "agro", priceCents: 79700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 4, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 5, name: "Setup Completo Mercado Livre", description: "Criamos e configuramos toda sua opera\xE7\xE3o no Mercado Livre. Cat\xE1logo, an\xFAncios e log\xEDstica.", type: "servico", segment: "varejo", priceCents: 299700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 5, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 6, name: "Gest\xE3o Mensal de Marketplace", description: "Nossa equipe gerencia sua loja no ML, Shopee ou TikTok. Relat\xF3rio semanal incluso.", type: "servico", segment: "todos", priceCents: 199700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 6, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 7, name: "Hub VPEX \u2014 Painel de Gest\xE3o Completo", description: "Acesso ao Hub VPEX com painel de KPIs, relat\xF3rios, academia e ferramentas propriet\xE1rias.", type: "ferramenta", segment: "todos", priceCents: 99700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 7, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 8, name: "Kit Franquia Digital", description: "E-book + mentoria + setup de presen\xE7a digital para sua franquia. Pacote completo.", type: "ferramenta", segment: "franquia", priceCents: 499700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 8, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
];

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Feature routers
  dashboard: dashboardRouter,
  admin: adminRouter,
  intelligence: intelligenceRouter,
  produtos: produtosRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vercel-entry.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({ router: appRouter, createContext })
);
var vercel_entry_default = app;
export {
  vercel_entry_default as default
};
