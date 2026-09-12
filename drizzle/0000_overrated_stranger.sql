CREATE TABLE `hc_kpi_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`indicatorKey` varchar(100) NOT NULL,
	`indicatorNameAr` varchar(200) NOT NULL,
	`indicatorNameEn` varchar(200),
	`category` varchar(100) NOT NULL,
	`currentValue` decimal(12,2),
	`currentValueText` text,
	`unit` varchar(30),
	`benchmark` text,
	`targetValue` decimal(12,2),
	`targetDate` varchar(20),
	`initiative` text,
	`initiativeDate` varchar(20),
	`performanceScore` decimal(5,2),
	`trafficLight` enum('green','yellow','red','grey') DEFAULT 'grey',
	`isCustom` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hc_kpi_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hc_organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(100) NOT NULL,
	`nameAr` varchar(200) NOT NULL,
	`nameEn` varchar(200),
	`industry` varchar(100),
	`size` enum('small','medium','large') DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hc_organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hc_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`userId` varchar(100) NOT NULL,
	`titleAr` varchar(200) NOT NULL,
	`titleEn` varchar(200),
	`periodType` enum('monthly','quarterly') NOT NULL DEFAULT 'quarterly',
	`periodLabel` varchar(50) NOT NULL,
	`periodStart` varchar(20) NOT NULL,
	`periodEnd` varchar(20) NOT NULL,
	`status` enum('draft','completed') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hc_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hr_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleAr` varchar(200) NOT NULL,
	`category` varchar(50) NOT NULL DEFAULT 'hr-management',
	`url` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`color` varchar(100) NOT NULL DEFAULT 'oklch(0.50 0.18 180)',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hr_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`deviceName` varchar(200) DEFAULT 'Unknown',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastActiveAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(200) NOT NULL,
	`nameEn` varchar(200),
	`priceMonthly` decimal(10,2) NOT NULL,
	`priceYearly` decimal(10,2) NOT NULL,
	`features` text,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` int NOT NULL,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`type` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(300) NOT NULL,
	`category` varchar(100) NOT NULL,
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` text,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`resetToken` varchar(128),
	`resetTokenExpires` timestamp,
	`refreshToken` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
