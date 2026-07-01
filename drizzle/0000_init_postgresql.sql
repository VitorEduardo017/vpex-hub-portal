CREATE TYPE "public"."activity_type" AS ENUM('sale', 'lead', 'campaign', 'stock', 'report', 'integration', 'team', 'system');--> statement-breakpoint
CREATE TYPE "public"."alert_category" AS ENUM('financeiro', 'estoque', 'marketing', 'rh', 'operacao', 'sistema');--> statement-breakpoint
CREATE TYPE "public"."alert_severity" AS ENUM('success', 'warning', 'danger', 'info');--> statement-breakpoint
CREATE TYPE "public"."company_plan" AS ENUM('starter', 'scale', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."company_segment" AS ENUM('franquia', 'ecommerce', 'industria', 'loja', 'consultoria', 'digital');--> statement-breakpoint
CREATE TYPE "public"."company_status" AS ENUM('ativo', 'inadimplente', 'pausado', 'onboarding', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."marketing_channel" AS ENUM('meta_ads', 'google_ads', 'tiktok_ads', 'organico', 'email', 'whatsapp', 'outros');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('pix', 'boleto', 'credit_card');--> statement-breakpoint
CREATE TYPE "public"."product_segment" AS ENUM('varejo', 'agro', 'industria', 'franquia', 'todos');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('ebook', 'mentoria', 'servico', 'ferramenta');--> statement-breakpoint
CREATE TYPE "public"."purchase_status" AS ENUM('pending', 'paid', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."revenue_channel" AS ENUM('loja_fisica', 'ecommerce', 'whatsapp', 'marketplace', 'telefone', 'outros');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"userId" integer,
	"activityType" "activity_type" NOT NULL,
	"message" text NOT NULL,
	"icon" varchar(50) DEFAULT 'Activity',
	"iconColor" varchar(50) DEFAULT 'text-muted-foreground',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"severity" "alert_severity" NOT NULL,
	"message" text NOT NULL,
	"category" "alert_category" DEFAULT 'sistema' NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"ownerName" varchar(255),
	"segment" "company_segment" NOT NULL,
	"franchiseBrand" varchar(255),
	"plan" "company_plan" DEFAULT 'starter' NOT NULL,
	"status" "company_status" DEFAULT 'onboarding' NOT NULL,
	"mrrCents" integer DEFAULT 0 NOT NULL,
	"healthScore" integer DEFAULT 50 NOT NULL,
	"storeCount" integer DEFAULT 1 NOT NULL,
	"teamSize" integer DEFAULT 1 NOT NULL,
	"integrationsCount" integer DEFAULT 0 NOT NULL,
	"logoEmoji" varchar(10) DEFAULT '🏢',
	"phone" varchar(30),
	"contactEmail" varchar(320),
	"city" varchar(100),
	"state" varchar(2),
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"snapshotDate" date NOT NULL,
	"revenueCents" bigint DEFAULT 0 NOT NULL,
	"monthlyGoalCents" bigint DEFAULT 0 NOT NULL,
	"avgTicketCents" integer DEFAULT 0 NOT NULL,
	"cmvPercent" numeric(5, 2) DEFAULT '0',
	"netMarginPercent" numeric(5, 2) DEFAULT '0',
	"breakEvenDay" integer DEFAULT 0,
	"salesCount" integer DEFAULT 0 NOT NULL,
	"customersServed" integer DEFAULT 0 NOT NULL,
	"newLeads" integer DEFAULT 0 NOT NULL,
	"openOrders" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hr_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"periodDate" date NOT NULL,
	"totalEmployees" integer DEFAULT 0 NOT NULL,
	"turnoverPercent" numeric(5, 2) DEFAULT '0',
	"trainingCompletionPercent" numeric(5, 2) DEFAULT '0',
	"enpsScore" integer DEFAULT 0,
	"departmentDistribution" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logistics_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"periodDate" date NOT NULL,
	"onTimeDeliveryPercent" numeric(5, 2) DEFAULT '0',
	"avgDeliveryHours" numeric(6, 1) DEFAULT '0',
	"totalStockItems" integer DEFAULT 0 NOT NULL,
	"stockOutItems" integer DEFAULT 0 NOT NULL,
	"lowStockItems" integer DEFAULT 0 NOT NULL,
	"excessStockItems" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"periodDate" date NOT NULL,
	"marketingChannel" "marketing_channel" NOT NULL,
	"leadsGenerated" integer DEFAULT 0 NOT NULL,
	"cplCents" integer DEFAULT 0 NOT NULL,
	"roas" numeric(5, 2) DEFAULT '0',
	"ctrPercent" numeric(5, 2) DEFAULT '0',
	"spendCents" integer DEFAULT 0 NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"conversions" integer DEFAULT 0 NOT NULL,
	"activeCampaigns" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"monthDate" date NOT NULL,
	"revenueGoalCents" bigint DEFAULT 0 NOT NULL,
	"leadsGoal" integer DEFAULT 0,
	"newCustomersGoal" integer DEFAULT 0,
	"idealCmvPercent" numeric(5, 2) DEFAULT '38.00',
	"idealNetMarginPercent" numeric(5, 2) DEFAULT '20.00',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "monthly_goals_company_month" UNIQUE("companyId","monthDate")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" "product_type" NOT NULL,
	"segment" "product_segment" DEFAULT 'todos' NOT NULL,
	"priceCents" integer NOT NULL,
	"thumbnailUrl" varchar(500),
	"contentUrl" varchar(500),
	"featured" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"productId" integer NOT NULL,
	"asaasPaymentId" varchar(255),
	"asaasCustomerId" varchar(255),
	"status" "purchase_status" DEFAULT 'pending' NOT NULL,
	"amountCents" integer NOT NULL,
	"paymentMethod" "payment_method" DEFAULT 'pix' NOT NULL,
	"paymentUrl" varchar(500),
	"pixQrCode" text,
	"pixCopyPaste" text,
	"paidAt" timestamp,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revenue_by_channel" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyId" integer NOT NULL,
	"periodDate" date NOT NULL,
	"channel" "revenue_channel" NOT NULL,
	"revenueCents" bigint DEFAULT 0 NOT NULL,
	"transactionCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(128) NOT NULL,
	"name" text,
	"email" varchar(320),
	"passwordHash" varchar(255),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"companyId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
