-- =====================================================================
-- REPUBLIC OF RWANDA - GOVERNMENT MARKET & TENDER MANAGEMENT SYSTEM (GMMS)
-- Database: gmms_rwanda
-- MySQL 8.0+ / MariaDB 10.4+ Schema
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `gmms_rwanda` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `gmms_rwanda`;

-- ---------------------------------------------------------------------
-- Table 1: users
-- Stores registered applicants (Rwandan citizens with 16-digit NID or Foreigners with Passport)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `vendor_profiles`;
DROP TABLE IF EXISTS `tenders`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `phone_number` VARCHAR(30) NOT NULL,
    `id_type` ENUM('national_id', 'passport') NOT NULL DEFAULT 'national_id',
    `national_id_or_passport` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('vendor', 'procurement_officer', 'admin') NOT NULL DEFAULT 'vendor',
    `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Strict Unique Constraints as required
    CONSTRAINT `uq_users_email` UNIQUE (`email`),
    CONSTRAINT `uq_users_phone` UNIQUE (`phone_number`),
    CONSTRAINT `uq_users_identity` UNIQUE (`national_id_or_passport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 2: vendor_profiles
-- Mandatory pre-application business profile before applying for tenders
-- ---------------------------------------------------------------------
CREATE TABLE `vendor_profiles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `business_type` ENUM('individual', 'company') NOT NULL,
    `company_name` VARCHAR(200) NULL,
    `rdb_registration_number` VARCHAR(60) NULL,
    `tin_number` VARCHAR(20) NULL, -- Required for companies (9 digits), optional for individual hawkers/stall vendors
    `business_category` ENUM(
        'road_construction', 
        'school_feeding', 
        'school_uniforms', 
        'market_stalls', 
        'general_supplies', 
        'consultancy'
    ) NOT NULL,
    `years_of_experience` INT UNSIGNED NOT NULL DEFAULT 0,
    `province` VARCHAR(50) NOT NULL DEFAULT 'Kigali City',
    `district` VARCHAR(50) NOT NULL,
    `sector` VARCHAR(50) NULL,
    `services_description` TEXT NOT NULL,
    `has_rra_tax_clearance` TINYINT(1) NOT NULL DEFAULT 0,
    `has_rssb_clearance` TINYINT(1) NOT NULL DEFAULT 0,
    `is_profile_completed` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `uq_vendor_user` UNIQUE (`user_id`),
    CONSTRAINT `fk_vendor_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_vendor_category` (`business_category`),
    INDEX `idx_vendor_tin` (`tin_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 3: tenders
-- Government markets/tenders (Road Construction, School Feeding, Uniforms, Stall Allocations)
-- ---------------------------------------------------------------------
CREATE TABLE `tenders` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tender_reference` VARCHAR(50) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `title_rw` VARCHAR(255) NOT NULL,
    `procuring_entity_en` VARCHAR(200) NOT NULL,
    `procuring_entity_rw` VARCHAR(200) NOT NULL,
    `category` ENUM(
        'road_construction', 
        'school_feeding', 
        'school_uniforms', 
        'market_stalls'
    ) NOT NULL,
    `location_district` VARCHAR(50) NOT NULL,
    `estimated_budget_rwf` DECIMAL(15, 2) NOT NULL,
    `bid_security_rwf` DECIMAL(15, 2) DEFAULT 0.00,
    `description_en` TEXT NOT NULL,
    `description_rw` TEXT NOT NULL,
    `requirements_en` TEXT NOT NULL,
    `requirements_rw` TEXT NOT NULL,
    `published_at` DATETIME NOT NULL,
    `submission_deadline` DATETIME NOT NULL,
    `status` ENUM('open', 'evaluation', 'closed', 'awarded') NOT NULL DEFAULT 'open',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT `uq_tender_ref` UNIQUE (`tender_reference`),
    INDEX `idx_tenders_category` (`category`),
    INDEX `idx_tenders_status` (`status`),
    INDEX `idx_tenders_deadline` (`submission_deadline`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 4: applications
-- Specific bids submitted by vendors for available tenders
-- ---------------------------------------------------------------------
CREATE TABLE `applications` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `application_tracking_code` VARCHAR(50) NOT NULL,
    `tender_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `vendor_profile_id` INT UNSIGNED NOT NULL,
    `financial_offer_rwf` DECIMAL(15, 2) NOT NULL,
    `proposed_delivery_days` INT UNSIGNED NOT NULL,
    `technical_proposal_summary` TEXT NOT NULL,
    `attached_license_url` VARCHAR(255) NULL,
    `anti_corruption_pledge_signed` TINYINT(1) NOT NULL DEFAULT 1,
    `status` ENUM(
        'submitted', 
        'administrative_review', 
        'technical_evaluation', 
        'financial_opening', 
        'awarded', 
        'rejected'
    ) NOT NULL DEFAULT 'submitted',
    `evaluation_notes` TEXT NULL,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Prevent duplicate applications by same user for the same tender
    CONSTRAINT `uq_user_tender_app` UNIQUE (`user_id`, `tender_id`),
    CONSTRAINT `uq_app_tracking` UNIQUE (`application_tracking_code`),
    
    CONSTRAINT `fk_app_tender` FOREIGN KEY (`tender_id`) 
        REFERENCES `tenders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_app_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_app_profile` FOREIGN KEY (`vendor_profile_id`) 
        REFERENCES `vendor_profiles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
        
    INDEX `idx_apps_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- SEED SAMPLE DATA: Government Markets & Initial Records
-- ---------------------------------------------------------------------

-- Sample Admin / Officer user & Sample Vendor
-- Passwords below are hashed representations of 'Password@2026'
INSERT INTO `users` (`id`, `full_name`, `email`, `phone_number`, `id_type`, `national_id_or_passport`, `password_hash`, `role`) VALUES
(1, 'Jean Claude Hakizimana', 'jclaude.hakiza@kigalicity.gov.rw', '+250788123456', 'national_id', '1198580012345678', '$2y$10$eO1WJ8e8Z.r4.bNqQvB4cOqNq7qG4zR7M7yv.K8fLqG0LqZ6X5BWW', 'admin'),
(2, 'Marie Chantal Mukamana', 'chantal.mukamana@gmail.com', '+250788987654', 'national_id', '1199270098765432', '$2y$10$eO1WJ8e8Z.r4.bNqQvB4cOqNq7qG4zR7M7yv.K8fLqG0LqZ6X5BWW', 'vendor'),
(3, 'Eric Kwizera Mugabo', 'kwizera.infrastructure@rwanda.rw', '+250783112233', 'national_id', '1198880044556677', '$2y$10$eO1WJ8e8Z.r4.bNqQvB4cOqNq7qG4zR7M7yv.K8fLqG0LqZ6X5BWW', 'vendor'),
(4, 'David Robert Smith', 'd.smith@eastafricaconstruct.com', '+250791445566', 'passport', 'PA9823412', '$2y$10$eO1WJ8e8Z.r4.bNqQvB4cOqNq7qG4zR7M7yv.K8fLqG0LqZ6X5BWW', 'vendor');

-- Sample Vendor Profile for Vendor 2 (Mukamana - Food Supply & Stalls)
INSERT INTO `vendor_profiles` (`id`, `user_id`, `business_type`, `company_name`, `rdb_registration_number`, `tin_number`, `business_category`, `years_of_experience`, `province`, `district`, `sector`, `services_description`, `has_rra_tax_clearance`, `has_rssb_clearance`) VALUES
(1, 2, 'individual', 'Mukamana Agri-Trade & Distribution', NULL, '108459201', 'school_feeding', 6, 'Eastern Province', 'Bugesera', 'Nyamata', 'Supply of certified fortified cereals, dry beans, maize flour, and fresh horticultural produce for schools and public markets.', 1, 1),
(2, 3, 'company', 'Kigali Civil Infrastructure & Engineering Ltd', 'RDB-2018-B-4921', '100482931', 'road_construction', 10, 'Kigali City', 'Nyarugenge', 'Nyamirambo', 'Class-A road construction, asphalt overlay, drainage storm sewers, and urban paving works.', 1, 1);

-- Standard Rwandan Government Tenders (Road, School Feeding, School Uniforms, Market Stalls)
INSERT INTO `tenders` (`id`, `tender_reference`, `title_en`, `title_rw`, `procuring_entity_en`, `procuring_entity_rw`, `category`, `location_district`, `estimated_budget_rwf`, `bid_security_rwf`, `description_en`, `description_rw`, `requirements_en`, `requirements_rw`, `published_at`, `submission_deadline`, `status`) VALUES
(1, 'TND/2026/COK/RDS/041', 
 'Rehabilitation and Asphalt Paving of Nyarugenge-Nyamirambo Feeder Roads (6.8 km) and Storm Drainage', 
 'Kuvugurura no gushyiramo kaburimbo imihanda yo muri Nyarugenge-Nyamirambo (km 6.8) no kubaka imiyoboro y\'amazi', 
 'City of Kigali - Directorate of Infrastructure', 
 'Umujyi wa Kigali - Ishami ry\'Ibikorwaremezo', 
 'road_construction', 
 'Nyarugenge', 
 1450000000.00, 
 29000000.00, 
 'The City of Kigali invites eligible registered civil engineering firms to submit bids for asphalt rehabilitation, construction of pedestrian sidewalks, street lighting conduits, and stone masonry drainage across 4 major feeder corridors in Nyarugenge District.', 
 'Umujyi wa Kigali uratumiye ibigo by\'ubwubatsi byanditse byujuje ibisabwa gupiganira isoko ryo gusana no gushyira kaburimbo mu mihanda y\'imigenderano, inzira z\'abanyamaguru, n\'imiyoboro y\'amazi y\'imvura mu Karere ka Nyarugenge.', 
 '1. RDB Registration Certificate (Category: Civil Works)\n2. Valid RRA Tax Clearance Certificate\n3. Valid RSSB Contribution Certificate\n4. Bid Security of 29,000,000 RWF from a reputable commercial bank\n5. Proof of at least 3 completed asphalt road contracts in East Africa', 
 '1. Icyemezo cy\'ubwanditsi muri RDB (Ubwubatsi bw\'Imihanda)\n2. Icyemezo cyo kutabamo imyenda y\'imisoro (RRA)\n3. Icyemezo cy\'ubwisungane muri RSSB\n4. Ingarama y\'ipiganwa (Bid Security) ingana na 29,000,000 RWF\n5. Ibyemezo by\'amasoko 3 yo kubaka imihanda yakozwe neza', 
 NOW(), 
 DATE_ADD(NOW(), INTERVAL 24 DAY), 
 'open'),

(2, 'TND/2026/MINEDUC/SF/019', 
 'Bulk Supply of Grade-1 Fortified Maize Flour, Dry Beans and Rice to 32 Public Secondary Schools in Bugesera District', 
 'Gutanga ibiribwa bikungahaye ku ntungamubiri (Kawunga, Ibihyimbo n\'Umuceri) mu mashuri 32 ya Leta muri Bugesera', 
 'Ministry of Education & Bugesera District Joint School Feeding Board', 
 'Minisiteri y\'Uburezi n\'Akarere ka Bugesera - Gahunda yo Kugaburira Abanyeshuri', 
 'school_feeding', 
 'Bugesera', 
 280000000.00, 
 5600000.00, 
 'Bugesera District tenders for the supply, transport, and hygienic delivery of quality-inspected foodstuffs including 120 metric tons of fortified maize meal, 65 metric tons of red beans, and 45 metric tons of locally processed rice for secondary schools across all 15 sectors.', 
 'Akarere ka Bugesera gafatanije na MINEDUC karashaka abacuruzi n\'amakoperative y\'ubuhinzi bazatunganya kandi bakageza ibiribwa byujuje ubuziranenge (Kawunga ya toni 120, Ibihyimbo by\'umutuku toni 65, n\'umuceri toni 45) mu mashuri yisumbuye 32.', 
 '1. Valid Business Registration (Food Trade / Agro-processing)\n2. FDA/RSB Food Quality Hygiene Inspection Certificate\n3. Proof of transport and hygienic storage facility\n4. RRA Tax Clearance Certificate\n5. Bid guarantee of 5,600,000 RWF', 
 '1. Icyemezo cyo gucuruza ibiribwa byanditse\n2. Icyemezo cy\'ubuziranenge gitangwa na Rwanda FDA / RSB\n3. Ubushobozi bwo gutwara no kubika ibiribwa mu buryo bwizewe\n4. Icyemezo cyo kwishyura imisoro (RRA)\n5. Ingarama y\'ipiganwa ingana na 5,600,000 RWF', 
 NOW(), 
 DATE_ADD(NOW(), INTERVAL 14 DAY), 
 'open'),

(3, 'TND/2026/HUYE/TXT/008', 
 'Bulk Manufacturing and Distribution of Standardized School Uniforms and Sportswear for Basic Education (14,200 Sets)', 
 'Kudoda no gutanga imyenda y\'ishuri (Impuzankano n\'imyenda ya Siporo) igenewe abanyeshuri 14,200 mu Karere ka Huye', 
 'Southern Province - Huye District Administration', 
 'Intara y\'Amajyepfo - Ubuyobozi bw\'Akarere ka Huye', 
 'school_uniforms', 
 'Huye', 
 115000000.00, 
 2300000.00, 
 'Huye District invites registered textile manufacturers, tailoring cooperatives, and garment enterprises to manufacture and deliver durable standardized school uniforms (shirts, skirts, trousers, and sweaters) under the Made-in-Rwanda initiative.', 
 'Akarere ka Huye karamenyesha amakoperative n\'inganda zikora imyenda mu Rwanda gupiganira isoko ryo kudoda no gukwirakwiza impuzankano z\'amashuri abanza n\'ayisumbuye zujuje ireme rya Made-in-Rwanda.', 
 '1. Textile & Garment Manufacturing License / RDB Registration\n2. Sample uniform submission conforming to MINEDUC color and fabric standards\n3. Production capacity of at least 1,500 sets per week\n4. RRA Tax Compliance Certificate', 
 '1. Uruhushya rwo kudoda imyenda muri RDB / Koperative yemewe\n2. Kugaragaza icyitegererezo cy\'umwenda uhuye n\'amabwiriza ya MINEDUC\n3. Ubushobozi bwo kudoda byibuze impuzankano 1,500 mu cyumweru\n4. Icyemezo cyo kutabamo imyenda y\'imisoro (RRA)', 
 NOW(), 
 DATE_ADD(NOW(), INTERVAL 18 DAY), 
 'open'),

(4, 'TND/2026/GASABO/MKT/012', 
 'Allocation and 3-Year Renewable Lease of Modern Commercial Stalls at Kimironko & Nyabugogo Municipal Markets (Block C - 48 Stalls)', 
 'Gukodesha no gutanga ibibanza by\'ubucuruzi buciriritse mu Isoko rya Kimironko n\'Irya Nyabugogo (Block C - Ibibanza 48)', 
 'City of Kigali - Gasabo District Market Authority', 
 'Umujyi wa Kigali - Ubuyobozi bw\'Amasoko y\'Akarere ka Gasabo', 
 'market_stalls', 
 'Gasabo', 
 45000.00, 
 50000.00, 
 'Public tender open to individual vendors, small traders, and registered cooperatives for the fair allocation of renovated indoor market stalls designated for fresh vegetables, fruits, dry grains, and dairy products. Monthly fixed stall tariff: 45,000 RWF.', 
 'Itangazo rigenewe abacuruzi baciriritse, abazunguzayi bifuza gukorera ahazwi, n\'amakoperative yo gusaba ibibanza byujuje ibisabwa mu isoko rya Kimironko na Nyabugogo mu gice cy\'imboga, imbuto, n\'ibinyampeke. Ubukode bw\'ukwezi ni 45,000 RWF ku kibanza.', 
 '1. Valid Rwandan National ID (Indangamuntu) or Passport for foreigners\n2. Registered Vendor Profile in GMMS\n3. Commitment to cleanliness and hygiene regulations\n4. Security deposit of 50,000 RWF (refundable)', 
 '1. Indangamuntu y\'umunyarwanda ifite imibare 16 cyangwa Pasiporo ku banyamahanga\n2. Umwirondoro w\'umucuruzi wuzuye muri GMMS\n3. Icyemezo cyo kubahiriza isuku n\'umutekano mu isoko\n4. Ingarama y\'ingwate ingana na 50,000 RWF (isubizwa)', 
 NOW(), 
 DATE_ADD(NOW(), INTERVAL 30 DAY), 
 'open');

-- Sample Application already submitted for testing
INSERT INTO `applications` (`id`, `application_tracking_code`, `tender_id`, `user_id`, `vendor_profile_id`, `financial_offer_rwf`, `proposed_delivery_days`, `technical_proposal_summary`, `anti_corruption_pledge_signed`, `status`, `evaluation_notes`) VALUES
(1, 'RW-TND-2026-8812', 2, 2, 1, 268500000.00, 45, 'Comprehensive delivery matrix using 3 refrigerated trucks and direct farmer aggregator storage hubs in Bugesera. 100% fortified grain sourced from Eastern Province farmers.', 1, 'administrative_review', 'All preliminary administrative documents and RRA clearances successfully verified.');
