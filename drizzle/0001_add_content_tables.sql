-- Migration: Add content/translation tables, remove bilingual columns from existing tables

-- 1. Drop hr_files (replaced by hr_sources)
DROP TABLE IF EXISTS `hr_files`;

-- 2. Create translations table
CREATE TABLE IF NOT EXISTS `translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityType` varchar(100) NOT NULL,
  `entityId` int NOT NULL,
  `lang` varchar(5) NOT NULL,
  `field` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_translation` (`entityType`,`entityId`,`lang`,`field`)
);

-- 3. Create HR content tables
CREATE TABLE IF NOT EXISTS `hr_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `color` varchar(100) NOT NULL,
  `icon` varchar(10) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_categories_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `hr_sources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `categoryId` int NOT NULL,
  `url` text NOT NULL,
  `color` varchar(100) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_sources_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `hr_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `url` text NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_images_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `update_sources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `url` text NOT NULL,
  `type` varchar(10) NOT NULL DEFAULT 'pdf',
  `color` varchar(100) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `update_sources_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `template_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `icon` varchar(10) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `template_categories_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `hr_forms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `categoryId` int NOT NULL,
  `fileUrl` text NOT NULL,
  `ext` varchar(10) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_forms_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `policy_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `color` varchar(100) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `policy_categories_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `policies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `chapterNum` int NOT NULL,
  `categoryId` int NOT NULL,
  `objectives` text,
  `policiesData` text,
  `proceduresData` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `policies_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `declarations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sortOrder` int NOT NULL DEFAULT 0,
  `items` text,
  `fileUrl` text,
  PRIMARY KEY (`id`)
);

-- 4. Create HC KPI tables
CREATE TABLE IF NOT EXISTS `hc_kpi_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `color` varchar(100) NOT NULL,
  `icon` varchar(10) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hc_kpi_categories_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `hc_builtin_indicators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `categoryId` int NOT NULL,
  `unit` varchar(30),
  `higherIsBetter` int DEFAULT 1,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hc_builtin_indicators_key_unique` (`key`)
);

-- 5. Create Job Description tables
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `job_descriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `departmentId` int NOT NULL,
  `level` varchar(30) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_descriptions_code_unique` (`code`)
);

-- 6. Create Ministerial tables
CREATE TABLE IF NOT EXISTS `ministerial_sectors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `decisionNumber` varchar(100),
  `decisionDate` varchar(20),
  `saudizationPercentage` varchar(20),
  `minWage` varchar(50),
  `minEmployees` int,
  `excludedProfessions` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ministerial_sectors_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `ministerial_professions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sectorId` int NOT NULL,
  `code` varchar(50),
  `minWage` varchar(50),
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `ministerial_phases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sectorId` int NOT NULL,
  `percentage` varchar(20),
  `date` varchar(20),
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- 7. Create Quiz tables
CREATE TABLE IF NOT EXISTS `quiz_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `color` varchar(100),
  `bgColor` varchar(100),
  `borderColor` varchar(100),
  `icon` varchar(10),
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quiz_categories_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `correctAnswer` int NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- 8. Remove bilingual columns from existing tables
ALTER TABLE `hc_organizations` DROP COLUMN `nameAr`, DROP COLUMN `nameEn`;
ALTER TABLE `hc_reports` DROP COLUMN `titleAr`, DROP COLUMN `titleEn`;
ALTER TABLE `hc_kpi_entries` DROP COLUMN `indicatorNameAr`, DROP COLUMN `indicatorNameEn`;
ALTER TABLE `subscription_plans` DROP COLUMN `nameAr`, DROP COLUMN `nameEn`;
