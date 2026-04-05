import { relations } from "drizzle-orm";
import {
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
} from "./schema";

export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  financialSnapshots: many(financialSnapshots),
  revenueByChannel: many(revenueByChannel),
  marketingMetrics: many(marketingMetrics),
  logisticsMetrics: many(logisticsMetrics),
  hrMetrics: many(hrMetrics),
  alerts: many(alerts),
  activities: many(activities),
  monthlyGoals: many(monthlyGoals),
}));

export const financialSnapshotsRelations = relations(financialSnapshots, ({ one }) => ({
  company: one(companies, {
    fields: [financialSnapshots.companyId],
    references: [companies.id],
  }),
}));

export const revenueByChannelRelations = relations(revenueByChannel, ({ one }) => ({
  company: one(companies, {
    fields: [revenueByChannel.companyId],
    references: [companies.id],
  }),
}));

export const marketingMetricsRelations = relations(marketingMetrics, ({ one }) => ({
  company: one(companies, {
    fields: [marketingMetrics.companyId],
    references: [companies.id],
  }),
}));

export const logisticsMetricsRelations = relations(logisticsMetrics, ({ one }) => ({
  company: one(companies, {
    fields: [logisticsMetrics.companyId],
    references: [companies.id],
  }),
}));

export const hrMetricsRelations = relations(hrMetrics, ({ one }) => ({
  company: one(companies, {
    fields: [hrMetrics.companyId],
    references: [companies.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  company: one(companies, {
    fields: [alerts.companyId],
    references: [companies.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  company: one(companies, {
    fields: [activities.companyId],
    references: [companies.id],
  }),
}));

export const monthlyGoalsRelations = relations(monthlyGoals, ({ one }) => ({
  company: one(companies, {
    fields: [monthlyGoals.companyId],
    references: [companies.id],
  }),
}));
