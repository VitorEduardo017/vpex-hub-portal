import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import {
  getCompanyByUserId,
  getMarketingMetricsForPeriod,
  getLogisticsMetricsForPeriod,
  getHrMetricsForPeriod,
  getFinancialSnapshotsForPeriod,
} from "../db";

export const intelligenceRouter = router({
  /**
   * Commercial intelligence: sales trends, conversion, active customers.
   */
  commercial: protectedProcedure
    .input(
      z
        .object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) return null;

      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const startDate =
        input?.startDate ??
        `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;
      const endDate =
        input?.endDate ??
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const snapshots = await getFinancialSnapshotsForPeriod(
        company.id,
        startDate,
        endDate
      );

      return {
        snapshots,
        companyId: company.id,
      };
    }),

  /**
   * Marketing intelligence: leads, CPL, ROAS, CTR by channel.
   */
  marketing: protectedProcedure
    .input(
      z
        .object({
          periodDate: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) return null;

      const now = new Date();
      const periodDate =
        input?.periodDate ??
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

      const metrics = await getMarketingMetricsForPeriod(
        company.id,
        periodDate
      );

      return { metrics, companyId: company.id };
    }),

  /**
   * Logistics intelligence: delivery rates, stock health.
   */
  logistics: protectedProcedure
    .input(
      z
        .object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) return null;

      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const startDate =
        input?.startDate ??
        `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;
      const endDate =
        input?.endDate ??
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

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
  hr: protectedProcedure
    .input(
      z
        .object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) return null;

      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const startDate =
        input?.startDate ??
        `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;
      const endDate =
        input?.endDate ??
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const metrics = await getHrMetricsForPeriod(
        company.id,
        startDate,
        endDate
      );

      return { metrics, companyId: company.id };
    }),
});
