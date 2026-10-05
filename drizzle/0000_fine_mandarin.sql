CREATE TABLE `activities_2026` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`m_low` decimal(8,3) NOT NULL,
	`m_mid` decimal(8,3) NOT NULL,
	`m_high` decimal(8,3) NOT NULL,
	`m_plat` decimal(8,3) NOT NULL,
	`th_low` decimal(8,3) NOT NULL,
	`th_mid` decimal(8,3) NOT NULL,
	`th_high` decimal(8,3) NOT NULL,
	`th_plat` decimal(8,3) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `activities_2026_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gosi_rate_meta` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(50) NOT NULL,
	`value` decimal(6,2) NOT NULL,
	CONSTRAINT `gosi_rate_meta_id` PRIMARY KEY(`id`),
	CONSTRAINT `gosi_rate_meta_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `gosi_rate_years` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` varchar(4) NOT NULL,
	`employee` decimal(5,2) NOT NULL,
	`employer` decimal(5,2) NOT NULL,
	`saned` decimal(5,2) NOT NULL,
	CONSTRAINT `gosi_rate_years_id` PRIMARY KEY(`id`),
	CONSTRAINT `gosi_rate_years_year_unique` UNIQUE(`year`)
);
--> statement-breakpoint
CREATE TABLE `nationality_rules_nationalities` (
	`id` varchar(50) NOT NULL,
	`labelAr` text NOT NULL,
	`labelEn` text NOT NULL,
	`maxRatio` int,
	`isRestricted` boolean NOT NULL DEFAULT false,
	`color` varchar(50) NOT NULL,
	`flag` varchar(10) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `nationality_rules_nationalities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nationality_rules_size_thresholds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tier` varchar(20) NOT NULL,
	`maxWorkers` int,
	`nonRestrictedMax` int,
	CONSTRAINT `nationality_rules_size_thresholds_id` PRIMARY KEY(`id`),
	CONSTRAINT `nationality_rules_size_thresholds_tier_unique` UNIQUE(`tier`)
);
--> statement-breakpoint
CREATE TABLE `profession_categories` (
	`id` varchar(50) NOT NULL,
	`label` text NOT NULL,
	`required` int,
	`note` text NOT NULL,
	`examples` text NOT NULL,
	`minWage` varchar(50),
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `profession_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profession_category_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` varchar(50) NOT NULL,
	`name` text NOT NULL,
	`minWage` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `profession_category_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profession_category_phases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` varchar(50) NOT NULL,
	`date` varchar(50) NOT NULL,
	`rate` int NOT NULL,
	`label` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `profession_category_phases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `termination_group_labels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`group` varchar(30) NOT NULL,
	`ar` text NOT NULL,
	`en` text NOT NULL,
	CONSTRAINT `termination_group_labels_id` PRIMARY KEY(`id`),
	CONSTRAINT `termination_group_labels_group_unique` UNIQUE(`group`)
);
--> statement-breakpoint
CREATE TABLE `termination_no_entitlement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reason` varchar(60) NOT NULL,
	CONSTRAINT `termination_no_entitlement_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `termination_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` varchar(50) NOT NULL,
	`labelAr` text NOT NULL,
	`labelEn` text NOT NULL,
	`group` varchar(30) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `termination_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disclosure_points` (
	`id` int AUTO_INCREMENT NOT NULL,
	`num` varchar(10) NOT NULL,
	`titleAr` text NOT NULL,
	`titleEn` text NOT NULL,
	`textAr` text NOT NULL,
	`textEn` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `disclosure_points_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_market_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`sector` text NOT NULL,
	`min` int NOT NULL,
	`avg` int NOT NULL,
	`max` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `employee_market_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hr_cost_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionId` int NOT NULL,
	`itemId` varchar(50) NOT NULL,
	`label` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hr_cost_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hr_cost_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(30) NOT NULL,
	`title` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hr_cost_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `hr_cost_sections_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `job_benchmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` varchar(50) NOT NULL,
	`ar` text NOT NULL,
	`en` text NOT NULL,
	`annual` varchar(20) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `job_benchmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `job_benchmarks_jobId_unique` UNIQUE(`jobId`)
);
--> statement-breakpoint
CREATE TABLE `leave_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` varchar(50) NOT NULL,
	`labelAr` text NOT NULL,
	`labelEn` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `leave_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `leave_types_value_unique` UNIQUE(`value`)
);
--> statement-breakpoint
CREATE TABLE `sector_benchmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectorId` varchar(50) NOT NULL,
	`ar` text NOT NULL,
	`en` text NOT NULL,
	`annual` varchar(20) NOT NULL,
	`desc` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `sector_benchmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `sector_benchmarks_sectorId_unique` UNIQUE(`sectorId`)
);
--> statement-breakpoint
CREATE TABLE `training_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`num` varchar(10) NOT NULL,
	`ar` text NOT NULL,
	`en` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `training_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_sectors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ar` text NOT NULL,
	`en` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `training_sectors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hc_builtin_indicators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`categoryId` int NOT NULL,
	`unit` varchar(30),
	`higherIsBetter` int DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hc_builtin_indicators_id` PRIMARY KEY(`id`),
	CONSTRAINT `hc_builtin_indicators_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `hc_kpi_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`color` varchar(100) NOT NULL,
	`icon` varchar(10) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hc_kpi_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `hc_kpi_categories_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `hc_kpi_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`indicatorKey` varchar(100) NOT NULL,
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
CREATE TABLE `hr_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`color` varchar(100) NOT NULL,
	`icon` varchar(10) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hr_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `hr_categories_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `hr_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`url` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hr_images_id` PRIMARY KEY(`id`),
	CONSTRAINT `hr_images_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `hr_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`categoryId` int NOT NULL,
	`url` text NOT NULL,
	`color` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hr_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `hr_sources_code_unique` UNIQUE(`code`)
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
	`disabled` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` int NOT NULL,
	`lang` varchar(5) NOT NULL,
	`field` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_translation` UNIQUE(`entityType`,`entityId`,`lang`,`field`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
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
CREATE TABLE `hr_forms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`categoryId` int NOT NULL,
	`fileUrl` text NOT NULL,
	`ext` varchar(10) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `hr_forms_id` PRIMARY KEY(`id`),
	CONSTRAINT `hr_forms_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `template_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`icon` varchar(10) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `template_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `template_categories_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `update_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`url` text NOT NULL,
	`type` varchar(10) NOT NULL DEFAULT 'pdf',
	`color` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `update_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `update_sources_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `declarations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`items` text,
	`fileUrl` text,
	CONSTRAINT `declarations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`chapterNum` int NOT NULL,
	`categoryId` int NOT NULL,
	`objectives` text,
	`policiesData` text,
	`proceduresData` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `policies_id` PRIMARY KEY(`id`),
	CONSTRAINT `policies_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `policy_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`color` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `policy_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `policy_categories_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`),
	CONSTRAINT `departments_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `job_descriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`departmentId` int NOT NULL,
	`level` varchar(30) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `job_descriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `job_descriptions_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `ministerial_phases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectorId` int NOT NULL,
	`percentage` varchar(20),
	`date` varchar(20),
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `ministerial_phases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ministerial_professions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectorId` int NOT NULL,
	`code` varchar(50),
	`minWage` varchar(50),
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `ministerial_professions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ministerial_sectors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`decisionNumber` varchar(100),
	`decisionDate` varchar(20),
	`saudizationPercentage` varchar(20),
	`minWage` varchar(50),
	`minEmployees` int,
	`excludedProfessions` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `ministerial_sectors_id` PRIMARY KEY(`id`),
	CONSTRAINT `ministerial_sectors_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `quiz_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`color` varchar(100),
	`bgColor` varchar(100),
	`borderColor` varchar(100),
	`icon` varchar(10),
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `quiz_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `quiz_categories_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`correctAnswer` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saudization_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(100) NOT NULL,
	`requiredPercentage` int,
	`minEmployees` int DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `saudization_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `saudization_rules_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `site_about_certifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_about_certifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_about_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`labelAr` text NOT NULL,
	`labelEn` text NOT NULL,
	`valueAr` text,
	`valueEn` text,
	`value` text,
	`hrefType` varchar(30),
	`href` text,
	`color` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_about_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_about_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`labelAr` text NOT NULL,
	`labelEn` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_about_courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_about_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` text NOT NULL,
	`labelAr` text NOT NULL,
	`labelEn` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_about_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `site_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_config_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `site_faq_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` text NOT NULL,
	`icon` varchar(20) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_faq_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_faq_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_faq_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_home_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` varchar(100) NOT NULL,
	`path` varchar(255) NOT NULL,
	`titleAr` text NOT NULL,
	`titleEn` text NOT NULL,
	`subAr` text NOT NULL,
	`subEn` text NOT NULL,
	`descAr` text NOT NULL,
	`descEn` text NOT NULL,
	`badgeAr` text,
	`badgeEn` text,
	`externalUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_home_services_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_home_services_serviceId_unique` UNIQUE(`serviceId`)
);
--> statement-breakpoint
CREATE TABLE `site_resource_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` varchar(10) NOT NULL,
	`title` text NOT NULL,
	`badge` text NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	`href` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_resource_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_resource_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` text NOT NULL,
	`description` text NOT NULL,
	`href` text NOT NULL,
	`color` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_resource_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_resource_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`yes` text NOT NULL,
	`no` text NOT NULL,
	`risk` varchar(20) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `site_resource_questions_id` PRIMARY KEY(`id`)
);
