import { eq, desc, and, gte, lte, asc } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  InsertUser,
  users,
  companies,
  financialSnapshots,
  revenueByChannel,
  marketingMetrics,
  logisticsMetrics,
  hrMetrics,
  alerts,
  activities,
  monthlyGoals,
  type InsertCompany,
  type InsertFinancialSnapshot,
  type InsertRevenueByChannel,
  type InsertMarketingMetric,
  type InsertLogisticsMetric,
  type InsertHrMetric,
  type InsertAlert,
  type InsertActivity,
  type InsertMonthlyGoal,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: NodePgDatabase | null = null;

export async function getDb(): Promise<NodePgDatabase | null> {
  const url = process.env.DATABASE_URL?.trim();
  if (!_db && url) {
    try {
      const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
        max: 1,
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 10000,
      });
      _db = drizzle({ client: pool });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
    }
  }
  return _db;
}

// ═══════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] ?? undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
  return result[0] ?? undefined;
}

// ═══════════════════════════════════════════════════════════════
// COMPANIES
// ═══════════════════════════════════════════════════════════════

export async function getCompanyById(companyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return result[0] ?? undefined;
}

export async function getAllCompanies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companies).orderBy(desc(companies.healthScore));
}

export async function getCompanyByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]?.companyId) return undefined;
  return getCompanyById(user[0].companyId);
}

export async function createCompany(data: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(companies).values(data).returning({ id: companies.id });
  return { id: result.id };
}

export async function updateCompany(companyId: number, data: Partial<InsertCompany>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(companies).set(data).where(eq(companies.id, companyId));
}

// ═══════════════════════════════════════════════════════════════
// FINANCIAL SNAPSHOTS
// ═══════════════════════════════════════════════════════════════

export async function getFinancialSnapshotsForPeriod(companyId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(financialSnapshots)
    .where(and(
      eq(financialSnapshots.companyId, companyId),
      gte(financialSnapshots.snapshotDate, startDate),
      lte(financialSnapshots.snapshotDate, endDate),
    ))
    .orderBy(asc(financialSnapshots.snapshotDate));
}

export async function getLatestFinancialSnapshot(companyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(financialSnapshots)
    .where(eq(financialSnapshots.companyId, companyId))
    .orderBy(desc(financialSnapshots.snapshotDate))
    .limit(1);
  return result[0] ?? undefined;
}

export async function getDashboardKPIs(companyId: number) {
  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevFirstOfMonth = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}-01`;
  const prevLastOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const prevEndDate = `${prevLastOfMonth.getFullYear()}-${String(prevLastOfMonth.getMonth() + 1).padStart(2, "0")}-${String(prevLastOfMonth.getDate()).padStart(2, "0")}`;

  const [currentSnapshots, prevSnapshots] = await Promise.all([
    getFinancialSnapshotsForPeriod(companyId, firstOfMonth, today),
    getFinancialSnapshotsForPeriod(companyId, prevFirstOfMonth, prevEndDate),
  ]);

  const goalResult = await db
    .select()
    .from(monthlyGoals)
    .where(and(eq(monthlyGoals.companyId, companyId), eq(monthlyGoals.monthDate, firstOfMonth)))
    .limit(1);
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
  const avgTicketCurrent = currentSnapshots.length > 0
    ? currentSnapshots.reduce((sum, s) => sum + s.avgTicketCents, 0) / currentSnapshots.length : 0;
  const avgTicketPrev = prevSnapshots.length > 0
    ? prevSnapshots.reduce((sum, s) => sum + s.avgTicketCents, 0) / prevSnapshots.length : 0;

  return {
    currentMonthRevenueCents: currentMonthRevenue,
    monthlyGoalCents: goal?.revenueGoalCents ?? 0,
    revenuePercent: goal?.revenueGoalCents && goal.revenueGoalCents > 0
      ? Math.round((currentMonthRevenue / goal.revenueGoalCents) * 100) : 0,
    daysRemaining,
    remainingCents: Math.max(0, (goal?.revenueGoalCents ?? 0) - currentMonthRevenue),
    dailyAvgNeededCents: daysRemaining > 0
      ? Math.round(Math.max(0, (goal?.revenueGoalCents ?? 0) - currentMonthRevenue) / daysRemaining) : 0,
    todayRevenueCents: todaySnapshot?.revenueCents ?? 0,
    todayRevenueChange: yesterdaySnapshot
      ? calculateChange(todaySnapshot?.revenueCents ?? 0, yesterdaySnapshot.revenueCents) : 0,
    avgTicketCents: Math.round(avgTicketCurrent),
    avgTicketChange: calculateChange(avgTicketCurrent, avgTicketPrev),
    cmvPercent: todaySnapshot?.cmvPercent ? parseFloat(String(todaySnapshot.cmvPercent)) : 0,
    idealCmvPercent: goal?.idealCmvPercent ? parseFloat(String(goal.idealCmvPercent)) : 38,
    netMarginPercent: todaySnapshot?.netMarginPercent ? parseFloat(String(todaySnapshot.netMarginPercent)) : 0,
    netMarginChange: calculateChange(
      todaySnapshot?.netMarginPercent ? parseFloat(String(todaySnapshot.netMarginPercent)) : 0,
      prevSnapshots.length > 0 ? parseFloat(String(prevSnapshots[prevSnapshots.length - 1].netMarginPercent)) : 0,
    ),
    breakEvenDay: todaySnapshot?.breakEvenDay ?? 0,
    customersServed: todaySnapshot?.customersServed ?? 0,
    newLeads: todaySnapshot?.newLeads ?? 0,
    openOrders: todaySnapshot?.openOrders ?? 0,
    dailyData: currentSnapshots.map((s) => ({
      date: s.snapshotDate,
      revenueCents: s.revenueCents,
      goalCents: s.monthlyGoalCents,
      leads: s.newLeads,
    })),
  };
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function insertFinancialSnapshot(data: InsertFinancialSnapshot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(financialSnapshots).values(data);
}

export async function bulkInsertFinancialSnapshots(data: InsertFinancialSnapshot[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (data.length === 0) return;
  await db.insert(financialSnapshots).values(data);
}

// ═══════════════════════════════════════════════════════════════
// REVENUE BY CHANNEL
// ═══════════════════════════════════════════════════════════════

export async function getRevenueByChannelForPeriod(companyId: number, periodDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(revenueByChannel).where(and(
    eq(revenueByChannel.companyId, companyId),
    eq(revenueByChannel.periodDate, periodDate),
  ));
}

export async function bulkInsertRevenueByChannel(data: InsertRevenueByChannel[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (data.length === 0) return;
  await db.insert(revenueByChannel).values(data);
}

// ═══════════════════════════════════════════════════════════════
// MARKETING METRICS
// ═══════════════════════════════════════════════════════════════

export async function getMarketingMetricsForPeriod(companyId: number, periodDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketingMetrics).where(and(
    eq(marketingMetrics.companyId, companyId),
    eq(marketingMetrics.periodDate, periodDate),
  ));
}

export async function bulkInsertMarketingMetrics(data: InsertMarketingMetric[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (data.length === 0) return;
  await db.insert(marketingMetrics).values(data);
}

// ═══════════════════════════════════════════════════════════════
// LOGISTICS METRICS
// ═══════════════════════════════════════════════════════════════

export async function getLogisticsMetricsForPeriod(companyId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(logisticsMetrics).where(and(
    eq(logisticsMetrics.companyId, companyId),
    gte(logisticsMetrics.periodDate, startDate),
    lte(logisticsMetrics.periodDate, endDate),
  )).orderBy(asc(logisticsMetrics.periodDate));
}

export async function insertLogisticsMetric(data: InsertLogisticsMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(logisticsMetrics).values(data);
}

// ═══════════════════════════════════════════════════════════════
// HR METRICS
// ═══════════════════════════════════════════════════════════════

export async function getHrMetricsForPeriod(companyId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hrMetrics).where(and(
    eq(hrMetrics.companyId, companyId),
    gte(hrMetrics.periodDate, startDate),
    lte(hrMetrics.periodDate, endDate),
  )).orderBy(asc(hrMetrics.periodDate));
}

export async function insertHrMetric(data: InsertHrMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(hrMetrics).values(data);
}

// ═══════════════════════════════════════════════════════════════
// ALERTS
// ═══════════════════════════════════════════════════════════════

export async function getActiveAlerts(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alerts).where(and(
    eq(alerts.companyId, companyId),
    eq(alerts.isActive, true),
  )).orderBy(desc(alerts.createdAt)).limit(20);
}

export async function insertAlert(data: InsertAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(alerts).values(data);
}

export async function bulkInsertAlerts(data: InsertAlert[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (data.length === 0) return;
  await db.insert(alerts).values(data);
}

export async function markAlertRead(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, alertId));
}

// ═══════════════════════════════════════════════════════════════
// ACTIVITIES
// ═══════════════════════════════════════════════════════════════

export async function getRecentActivities(companyId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activities).where(eq(activities.companyId, companyId))
    .orderBy(desc(activities.createdAt)).limit(limit);
}

export async function insertActivity(data: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(activities).values(data);
}

export async function bulkInsertActivities(data: InsertActivity[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (data.length === 0) return;
  await db.insert(activities).values(data);
}

// ═══════════════════════════════════════════════════════════════
// MONTHLY GOALS
// ═══════════════════════════════════════════════════════════════

export async function getMonthlyGoal(companyId: number, monthDate: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(monthlyGoals).where(and(
    eq(monthlyGoals.companyId, companyId),
    eq(monthlyGoals.monthDate, monthDate),
  )).limit(1);
  return result[0] ?? undefined;
}

export async function upsertMonthlyGoal(data: InsertMonthlyGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(monthlyGoals).values(data).onConflictDoUpdate({
    target: [monthlyGoals.companyId, monthlyGoals.monthDate],
    set: {
      revenueGoalCents: data.revenueGoalCents,
      leadsGoal: data.leadsGoal,
      newCustomersGoal: data.newCustomersGoal,
      idealCmvPercent: data.idealCmvPercent,
      idealNetMarginPercent: data.idealNetMarginPercent,
    },
  });
}

export async function bulkInsertMonthlyGoals(data: InsertMonthlyGoal[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (data.length === 0) return;
  await db.insert(monthlyGoals).values(data);
}

// ═══════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════

export async function getAdminOverview() {
  const db = await getDb();
  if (!db) return null;

  const allCompanies = await db.select().from(companies);
  const totalMrr = allCompanies.reduce((sum, c) => sum + c.mrrCents, 0);
  const activeCount = allCompanies.filter((c) => c.status === "ativo").length;
  const avgHealth = allCompanies.length > 0
    ? Math.round(allCompanies.reduce((sum, c) => sum + c.healthScore, 0) / allCompanies.length) : 0;
  const atRiskCount = allCompanies.filter(
    (c) => c.status === "inadimplente" || c.status === "pausado" || c.healthScore < 50
  ).length;

  const byPlan = {
    starter: allCompanies.filter((c) => c.plan === "starter").length,
    scale: allCompanies.filter((c) => c.plan === "scale").length,
    enterprise: allCompanies.filter((c) => c.plan === "enterprise").length,
  };
  const byStatus = {
    ativo: allCompanies.filter((c) => c.status === "ativo").length,
    onboarding: allCompanies.filter((c) => c.status === "onboarding").length,
    inadimplente: allCompanies.filter((c) => c.status === "inadimplente").length,
    pausado: allCompanies.filter((c) => c.status === "pausado").length,
  };
  const bySegment: Record<string, number> = {};
  allCompanies.forEach((c) => { bySegment[c.segment] = (bySegment[c.segment] || 0) + 1; });

  return { totalMrrCents: totalMrr, activeCount, totalCount: allCompanies.length, avgHealthScore: avgHealth, atRiskCount, byPlan, byStatus, bySegment, companies: allCompanies };
}
