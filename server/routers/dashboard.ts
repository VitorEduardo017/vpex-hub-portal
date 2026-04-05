import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import {
  getDashboardKPIs,
  getRevenueByChannelForPeriod,
  getActiveAlerts,
  getRecentActivities,
  getCompanyByUserId,
} from "../db";

export const dashboardRouter = router({
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
    const now = new Date();
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
  activities: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ ctx, input }) => {
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
  }),
});
