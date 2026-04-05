import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import {
  getAdminOverview,
  getAllCompanies,
  getCompanyById,
  getDashboardKPIs,
  createCompany,
  updateCompany,
} from "../db";

export const adminRouter = router({
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
  companyDetail: adminProcedure
    .input(z.object({ companyId: z.number() }))
    .query(async ({ input }) => {
      const company = await getCompanyById(input.companyId);
      if (!company) return null;
      const kpis = await getDashboardKPIs(company.id);
      return { company, kpis };
    }),

  /**
   * Create a new company (client onboarding from admin side).
   */
  createCompany: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        ownerName: z.string().optional(),
        segment: z.enum([
          "franquia",
          "ecommerce",
          "industria",
          "loja",
          "consultoria",
          "digital",
        ]),
        franchiseBrand: z.string().optional(),
        plan: z.enum(["starter", "scale", "enterprise"]).default("starter"),
        mrrCents: z.number().default(0),
        phone: z.string().optional(),
        contactEmail: z.string().email().optional(),
        city: z.string().optional(),
        state: z.string().max(2).optional(),
        storeCount: z.number().default(1),
        teamSize: z.number().default(1),
        logoEmoji: z.string().default("🏢"),
      })
    )
    .mutation(async ({ input }) => {
      return createCompany({
        ...input,
        status: "onboarding",
        healthScore: 50,
        integrationsCount: 0,
      });
    }),

  /**
   * Update company details (plan, status, health score, etc.).
   */
  updateCompany: adminProcedure
    .input(
      z.object({
        companyId: z.number(),
        data: z.object({
          name: z.string().optional(),
          plan: z.enum(["starter", "scale", "enterprise"]).optional(),
          status: z
            .enum(["ativo", "inadimplente", "pausado", "onboarding", "cancelado"])
            .optional(),
          mrrCents: z.number().optional(),
          healthScore: z.number().min(0).max(100).optional(),
          storeCount: z.number().optional(),
          teamSize: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      await updateCompany(input.companyId, input.data);
      return { success: true };
    }),
});
