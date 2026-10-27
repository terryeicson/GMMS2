export interface CodeFile {
  filename: string;
  language: 'sql' | 'php' | 'html';
  title: string;
  description: string;
  content: string;
}

export const phpCodeFiles: CodeFile[] = [
  {
    filename: 'schema.sql',
    language: 'sql',
    title: 'MySQL 8.0+ Database Schema',
    description: 'Complete schema with users, vendor_profiles, tenders, applications, unique constraints on NID/email/phone, and foreign keys.',
    content: `-- REPUBLIC OF RWANDA - GOVERNMENT MARKET & TENDER MANAGEMENT SYSTEM (GMMS)
CREATE DATABASE IF NOT EXISTS \`gmms_rwanda\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`gmms_rwanda\`;

CREATE TABLE \`users\` (
    \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`full_name\` VARCHAR(150) NOT NULL,
    \`email\` VARCHAR(120) NOT NULL,
    \`phone_number\` VARCHAR(30) NOT NULL,
    \`id_type\` ENUM('national_id', 'passport') NOT NULL DEFAULT 'national_id',
    \`national_id_or_passport\` VARCHAR(50) NOT NULL,
    \`password_hash\` VARCHAR(255) NOT NULL,
    \`role\` ENUM('vendor', 'procurement_officer', 'admin') NOT NULL DEFAULT 'vendor',
    \`is_verified\` TINYINT(1) NOT NULL DEFAULT 1,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT \`uq_users_email\` UNIQUE (\`email\`),
    CONSTRAINT \`uq_users_phone\` UNIQUE (\`phone_number\`),
    CONSTRAINT \`uq_users_identity\` UNIQUE (\`national_id_or_passport\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE \`vendor_profiles\` (
    \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT UNSIGNED NOT NULL,
    \`business_type\` ENUM('individual', 'company') NOT NULL,
    \`company_name\` VARCHAR(200) NULL,
    \`rdb_registration_number\` VARCHAR(60) NULL,
    \`tin_number\` VARCHAR(20) NULL, -- Required for companies (9 digits), optional for small hawkers
    \`business_category\` ENUM('road_construction', 'school_feeding', 'school_uniforms', 'market_stalls', 'general_supplies', 'consultancy') NOT NULL,
    \`years_of_experience\` INT UNSIGNED NOT NULL DEFAULT 0,
    \`province\` VARCHAR(50) NOT NULL DEFAULT 'Kigali City',
    \`district\` VARCHAR(50) NOT NULL,
    \`sector\` VARCHAR(50) NULL,
    \`services_description\` TEXT NOT NULL,
    \`has_rra_tax_clearance\` TINYINT(1) NOT NULL DEFAULT 0,
    \`has_rssb_clearance\` TINYINT(1) NOT NULL DEFAULT 0,
    \`is_profile_completed\` TINYINT(1) NOT NULL DEFAULT 1,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`uq_vendor_user\` UNIQUE (\`user_id\`),
    CONSTRAINT \`fk_vendor_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE \`tenders\` (
    \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`tender_reference\` VARCHAR(50) NOT NULL,
    \`title_en\` VARCHAR(255) NOT NULL,
    \`title_rw\` VARCHAR(255) NOT NULL,
    \`procuring_entity_en\` VARCHAR(200) NOT NULL,
    \`procuring_entity_rw\` VARCHAR(200) NOT NULL,
    \`category\` ENUM('road_construction', 'school_feeding', 'school_uniforms', 'market_stalls') NOT NULL,
    \`location_district\` VARCHAR(50) NOT NULL,
    \`estimated_budget_rwf\` DECIMAL(15, 2) NOT NULL,
    \`bid_security_rwf\` DECIMAL(15, 2) DEFAULT 0.00,
    \`description_en\` TEXT NOT NULL,
    \`description_rw\` TEXT NOT NULL,
    \`requirements_en\` TEXT NOT NULL,
    \`requirements_rw\` TEXT NOT NULL,
    \`submission_deadline\` DATETIME NOT NULL,
    \`status\` ENUM('open', 'evaluation', 'closed', 'awarded') NOT NULL DEFAULT 'open',
    CONSTRAINT \`uq_tender_ref\` UNIQUE (\`tender_reference\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE \`applications\` (
    \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`application_tracking_code\` VARCHAR(50) NOT NULL,
    \`tender_id\` INT UNSIGNED NOT NULL,
    \`user_id\` INT UNSIGNED NOT NULL,
    \`vendor_profile_id\` INT UNSIGNED NOT NULL,
    \`financial_offer_rwf\` DECIMAL(15, 2) NOT NULL,
    \`proposed_delivery_days\` INT UNSIGNED NOT NULL,
    \`technical_proposal_summary\` TEXT NOT NULL,
    \`anti_corruption_pledge_signed\` TINYINT(1) NOT NULL DEFAULT 1,
    \`status\` ENUM('submitted', 'administrative_review', 'technical_evaluation', 'financial_opening', 'awarded', 'rejected') NOT NULL DEFAULT 'submitted',
    \`submitted_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT \`uq_user_tender_app\` UNIQUE (\`user_id\`, \`tender_id\`),
    CONSTRAINT \`uq_app_tracking\` UNIQUE (\`application_tracking_code\`),
    CONSTRAINT \`fk_app_tender\` FOREIGN KEY (\`tender_id\`) REFERENCES \`tenders\` (\`id\`),
    CONSTRAINT \`fk_app_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`),
    CONSTRAINT \`fk_app_profile\` FOREIGN KEY (\`vendor_profile_id\`) REFERENCES \`vendor_profiles\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    filename: 'db.php',
    language: 'php',
    title: 'PDO Database Connection (db.php)',
    description: 'Establishes secure UTF8MB4 connection with prepared statements and uniform JSON error handling.',
    content: `<?php
declare(strict_types=1);

$host     = getenv('DB_HOST') ?: '127.0.0.1';
$dbname   = getenv('DB_NAME') ?: 'gmms_rwanda';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';
$port     = getenv('DB_PORT') ?: '3306';
$charset  = 'utf8mb4';

$dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE {$charset}_unicode_ci"
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message_en' => 'Database connection failed. Please ensure MySQL is running.',
        'message_rw' => 'Guhuza na database byanze. Nyamuneka reba niba MySQL iri gukora.'
    ]);
    exit;
}

function sendJsonResponse(string $status, string $messageEn, string $messageRw, array $data = [], int $httpCode = 200): void {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($httpCode);
    echo json_encode([
        'status'     => $status,
        'message_en' => $messageEn,
        'message_rw' => $messageRw,
        'data'       => $data
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}`
  },
  {
    filename: 'register.php',
    language: 'php',
    title: 'User Registration (register.php)',
    description: 'Enforces 16-digit Rwandan NID or Passport regex, phone validation, password hashing with PASSWORD_BCRYPT, and duplicate checks.',
    content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$fullName       = trim((string)($input['full_name'] ?? ''));
$email          = trim(strtolower((string)($input['email'] ?? '')));
$phoneNumber    = trim((string)($input['phone_number'] ?? ''));
$idType         = trim((string)($input['id_type'] ?? 'national_id'));
$identityNumber = trim((string)($input['national_id_or_passport'] ?? ''));
$password       = (string)($input['password'] ?? '');

// Validate 16 numeric digits for Rwandan NID
if ($idType === 'national_id') {
    if (!preg_match('/^[1-3]\\d{15}$/', $identityNumber)) {
        sendJsonResponse('error', 'Rwandan National ID must be exactly 16 numeric digits starting with 1, 2, or 3.', 'Indangamuntu igomba kuba igizwe n\\'imibare 16 gusa itangizwa na 1, 2, cyangwa 3.', [], 422);
    }
} else {
    if (!preg_match('/^[A-Za-z0-9]{6,20}$/', $identityNumber)) {
        sendJsonResponse('error', 'Passport number must contain between 6 and 20 alphanumeric characters.', 'Nimero ya pasiporo igomba kuba igizwe n\\'inyuguti n\\'imibare hagati ya 6 na 20.', [], 422);
    }
}

// Check duplicates
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR phone_number = :phone OR national_id_or_passport = :id LIMIT 1");
$stmt->execute([':email' => $email, ':phone' => $phoneNumber, ':id' => $identityNumber]);
if ($stmt->fetch()) {
    sendJsonResponse('error', 'An account with this Email, Phone, or National ID/Passport already exists.', 'Konti ifite iyi meli, telefone, cyangwa indangamuntu isanzwe ibaho.', [], 409);
}

// Secure Hash
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
$ins = $pdo->prepare("INSERT INTO users (full_name, email, phone_number, id_type, national_id_or_passport, password_hash) VALUES (:name, :email, :phone, :type, :id, :hash)");
$ins->execute([':name' => $fullName, ':email' => $email, ':phone' => $phoneNumber, ':type' => $idType, ':id' => $identityNumber, ':hash' => $hash]);

sendJsonResponse('success', 'Registration successful! You may now log in to complete your Vendor Profile.', 'Kwiyandikisha byagenze neza! Ubu ushobora kwinjira ngo wuzuze umwirondoro w\\'ubucuruzi bwawe.', ['user_id' => $pdo->lastInsertId()], 201);`
  },
  {
    filename: 'login.php',
    language: 'php',
    title: 'User Login & Profile Detection (login.php)',
    description: 'Authenticates with Email and Password, and verifies if the user has completed their pre-application vendor profile.',
    content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
session_start();

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email    = trim(strtolower((string)($input['email'] ?? '')));
$password = (string)($input['password'] ?? '');

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    sendJsonResponse('error', 'Invalid email or password.', 'Imeli cyangwa ijambobanga ntabwo bihuye.', [], 401);
}

// Check if pre-application Vendor Profile exists
$vp = $pdo->prepare("SELECT * FROM vendor_profiles WHERE user_id = :uid LIMIT 1");
$vp->execute([':uid' => $user['id']]);
$profile = $vp->fetch();

$_SESSION['user_id'] = $user['id'];
unset($user['password_hash']);

sendJsonResponse('success', 'Login successful.', 'Kwinjira byakunze.', [
    'user' => $user,
    'has_vendor_profile' => ($profile !== false && (bool)$profile['is_profile_completed']),
    'vendor_profile' => $profile ?: null
]);`
  },
  {
    filename: 'vendor_profile.php',
    language: 'php',
    title: 'Mandatory Vendor Profile Handler (vendor_profile.php)',
    description: 'Enforces 9-digit TIN for registered companies, allows optional TIN for small hawkers, saves business category and experience.',
    content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
session_start();

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = $_SESSION['user_id'] ?? (int)($input['user_id'] ?? 0);

if ($userId <= 0) {
    sendJsonResponse('error', 'Authentication required.', 'Ugomba kwinjira muri sisitemu.', [], 401);
}

$bizType = trim((string)($input['business_type'] ?? 'individual'));
$tin     = trim((string)($input['tin_number'] ?? ''));

// Conditional TIN requirement
if ($bizType === 'company') {
    if (empty($tin) || !preg_match('/^\\d{9}$/', $tin)) {
        sendJsonResponse('error', 'TIN is mandatory for registered companies and must be exactly 9 digits.', 'TIN irakenewe ku masosiyete kandi igomba kuba igizwe n\\'imibare 9 gusa.', [], 422);
    }
}

// Upsert profile
$sql = "INSERT INTO vendor_profiles (user_id, business_type, company_name, tin_number, business_category, years_of_experience, district, services_description, is_profile_completed)
        VALUES (:uid, :type, :cname, :tin, :cat, :exp, :dist, :desc, 1)
        ON DUPLICATE KEY UPDATE business_type = VALUES(business_type), company_name = VALUES(company_name), tin_number = VALUES(tin_number), business_category = VALUES(business_category), years_of_experience = VALUES(years_of_experience), services_description = VALUES(services_description), is_profile_completed = 1";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':uid'   => $userId,
    ':type'  => $bizType,
    ':cname' => $input['company_name'] ?? null,
    ':tin'   => !empty($tin) ? $tin : null,
    ':cat'   => $input['business_category'],
    ':exp'   => (int)$input['years_of_experience'],
    ':dist'  => $input['district'],
    ':desc'  => $input['services_description']
]);

sendJsonResponse('success', 'Vendor Profile saved successfully! You can now bid on tenders.', 'Umwirondoro w\\'ubucuruzi wabitswe neza! Ubu wemerewe gusaba amasoko.', ['user_id' => $userId]);`
  },
  {
    filename: 'apply_tender.php',
    language: 'php',
    title: 'Tender Application & Bid Submission (apply_tender.php)',
    description: 'Enforces pre-requisite Vendor Profile verification, generates unique Rwandan tracking code (RW-TND-YYYY-XXXX), and prevents duplicate bidding.',
    content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';
session_start();

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = $_SESSION['user_id'] ?? (int)($input['user_id'] ?? 0);
$tenderId = (int)($input['tender_id'] ?? 0);

// 1. Mandatory Pre-requisite: Check if user has completed Vendor Profile
$stmt = $pdo->prepare("SELECT id FROM vendor_profiles WHERE user_id = :uid AND is_profile_completed = 1 LIMIT 1");
$stmt->execute([':uid' => $userId]);
$profile = $stmt->fetch();

if (!$profile) {
    sendJsonResponse('error', 'Pre-Application Requirement: You must complete your Vendor Profile before applying for any tender.', 'Ibisabwa mbere yo gusaba: Ugomba kubanza kuzuza Umwirondoro w\\'Ubucuruzi mbere yo gusaba isoko.', ['action' => 'complete_profile'], 403);
}

// 2. Prevent duplicate bid
$dup = $pdo->prepare("SELECT id, application_tracking_code FROM applications WHERE user_id = :uid AND tender_id = :tid LIMIT 1");
$dup->execute([':uid' => $userId, ':tid' => $tenderId]);
if ($existing = $dup->fetch()) {
    sendJsonResponse('error', 'You have already applied for this tender (Tracking Code: ' . $existing['application_tracking_code'] . ').', 'Wamaze gusaba iri soko (Nimero y\\'idosiye: ' . $existing['application_tracking_code'] . ').', [], 409);
}

// 3. Issue unique Rwandan tracking code
$trackingCode = "RW-TND-" . date('Y') . "-" . strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));

$ins = $pdo->prepare("INSERT INTO applications (application_tracking_code, tender_id, user_id, vendor_profile_id, financial_offer_rwf, proposed_delivery_days, technical_proposal_summary, anti_corruption_pledge_signed, status)
                      VALUES (:code, :tid, :uid, :vpid, :offer, :days, :summary, 1, 'submitted')");
$ins->execute([
    ':code'    => $trackingCode,
    ':tid'     => $tenderId,
    ':uid'     => $userId,
    ':vpid'    => $profile['id'],
    ':offer'   => (float)$input['financial_offer_rwf'],
    ':days'    => (int)$input['proposed_delivery_days'],
    ':summary' => $input['technical_proposal_summary']
]);

sendJsonResponse('success', 'Your tender application has been officially submitted.', 'Gusaba isoko byakiriwe neza kandi byanditswe.', ['tracking_code' => $trackingCode, 'status' => 'submitted'], 201);`
  }
];
