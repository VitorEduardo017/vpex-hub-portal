CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`userId` int,
	`activityType` enum('sale','lead','campaign','stock','report','integration','team','system') NOT NULL,
	`message` text NOT NULL,
	`icon` varchar(50) DEFAULT 'Activity',
	`iconColor` varchar(50) DEFAULT 'text-muted-foreground',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`severity` enum('success','warning','danger','info') NOT NULL,
	`message` text NOT NULL,
	`category` enum('financeiro','estoque','marketing','rh','operacao','sistema') NOT NULL DEFAULT 'sistema',
	`isRead` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`ownerName` varchar(255),
	`segment` enum('franquia','ecommerce','industria','loja','consultoria','digital') NOT NULL,
	`franchiseBrand` varchar(255),
	`plan` enum('starter','scale','enterprise') NOT NULL DEFAULT 'starter',
	`status` enum('ativo','inadimplente','pausado','onboarding','cancelado') NOT NULL DEFAULT 'onboarding',
	`mrrCents` int NOT NULL DEFAULT 0,
	`healthScore` int NOT NULL DEFAULT 50,
	`storeCount` int NOT NULL DEFAULT 1,
	`teamSize` int NOT NULL DEFAULT 1,
	`integrationsCount` int NOT NULL DEFAULT 0,
	`logoEmoji` varchar(10) DEFAULT '🏢',
	`phone` varchar(30),
	`contactEmail` varchar(320),
	`city` varchar(100),
	`state` varchar(2),
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`snapshotDate` date NOT NULL,
	`revenueCents` bigint NOT NULL DEFAULT 0,
	`monthlyGoalCents` bigint NOT NULL DEFAULT 0,
	`avgTicketCents` int NOT NULL DEFAULT 0,
	`cmvPercent` decimal(5,2) DEFAULT '0',
	`netMarginPercent` decimal(5,2) DEFAULT '0',
	`breakEvenDay` int DEFAULT 0,
	`salesCount` int NOT NULL DEFAULT 0,
	`customersServed` int NOT NULL DEFAULT 0,
	`newLeads` int NOT NULL DEFAULT 0,
	`openOrders` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `financial_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hr_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`periodDate` date NOT NULL,
	`totalEmployees` int NOT NULL DEFAULT 0,
	`turnoverPercent` decimal(5,2) DEFAULT '0',
	`trainingCompletionPercent` decimal(5,2) DEFAULT '0',
	`enpsScore` int DEFAULT 0,
	`departmentDistribution` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hr_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logistics_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`periodDate` date NOT NULL,
	`onTimeDeliveryPercent` decimal(5,2) DEFAULT '0',
	`avgDeliveryHours` decimal(6,1) DEFAULT '0',
	`totalStockItems` int NOT NULL DEFAULT 0,
	`stockOutItems` int NOT NULL DEFAULT 0,
	`lowStockItems` int NOT NULL DEFAULT 0,
	`excessStockItems` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logistics_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketing_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`periodDate` date NOT NULL,
	`marketingChannel` enum('meta_ads','google_ads','tiktok_ads','organico','email','whatsapp','outros') NOT NULL,
	`leadsGenerated` int NOT NULL DEFAULT 0,
	`cplCents` int NOT NULL DEFAULT 0,
	`roas` decimal(5,2) DEFAULT '0',
	`ctrPercent` decimal(5,2) DEFAULT '0',
	`spendCents` int NOT NULL DEFAULT 0,
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`activeCampaigns` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `marketing_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monthly_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`monthDate` date NOT NULL,
	`revenueGoalCents` bigint NOT NULL DEFAULT 0,
	`leadsGoal` int DEFAULT 0,
	`newCustomersGoal` int DEFAULT 0,
	`idealCmvPercent` decimal(5,2) DEFAULT '38.00',
	`idealNetMarginPercent` decimal(5,2) DEFAULT '20.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `monthly_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenue_by_channel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`periodDate` date NOT NULL,
	`channel` enum('loja_fisica','ecommerce','whatsapp','marketplace','telefone','outros') NOT NULL,
	`revenueCents` bigint NOT NULL DEFAULT 0,
	`transactionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `revenue_by_channel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `companyId` int;