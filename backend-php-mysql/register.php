<?php
/**
 * Republic of Rwanda - Government Market & Tender Management System (GMMS)
 * User Registration Handler (PHP 8+ / PDO)
 * 
 * Supports:
 * - 16-Digit Rwandan National ID (Indangamuntu) OR Foreign Passport Number
 * - Full Name, Phone Number (+250... or formatted), Email, and Strong Password
 * - Server-side validation against duplicates and injection
 * - Bilingual (English & Kinyarwanda) responses
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

// Accept both application/json and x-www-form-urlencoded
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse('error', 'Invalid request method. POST required.', 'Uburyo bwo gusaba butemewe. Hagomba gukoreshwa POST.', [], 405);
}

// 1. Sanitize & extract inputs
$fullName         = trim((string)($input['full_name'] ?? ''));
$email            = trim(strtolower((string)($input['email'] ?? '')));
$phoneNumber      = trim((string)($input['phone_number'] ?? ''));
$idType           = trim((string)($input['id_type'] ?? 'national_id')); // 'national_id' or 'passport'
$identityNumber   = trim((string)($input['national_id_or_passport'] ?? ''));
$password         = (string)($input['password'] ?? '');
$confirmPassword  = (string)($input['confirm_password'] ?? '');

// 2. Validate Required Fields
if (empty($fullName) || empty($email) || empty($phoneNumber) || empty($identityNumber) || empty($password)) {
    sendJsonResponse(
        'error', 
        'All fields are required. Please fill in all information.', 
        'Imyanya yose irakenewe. Nyamuneka uzuzamo amakuru yose asabwa.', 
        [], 
        422
    );
}

// 3. Validate Email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(
        'error', 
        'Invalid email address format.', 
        'Imeli wanditse ntabwo yemewe.', 
        [], 
        422
    );
}

// 4. Validate Identity Number (National ID or Passport)
if ($idType === 'national_id') {
    // Rwandan National ID (Indangamuntu) is strictly 16 numeric digits: starts with 1 (or 2/3)
    if (!preg_match('/^[1-3]\d{15}$/', $identityNumber)) {
        sendJsonResponse(
            'error', 
            'Rwandan National ID (Indangamuntu) must be exactly 16 numeric digits starting with 1, 2, or 3.', 
            'Indangamuntu y\'umunyarwanda igomba kuba igizwe n\'imibare 16 gusa itangizwa na 1, 2, cyangwa 3.', 
            ['field' => 'national_id_or_passport'], 
            422
        );
    }
} elseif ($idType === 'passport') {
    // Foreign passport: 6-20 alphanumeric characters
    if (!preg_match('/^[A-Za-z0-9]{6,20}$/', $identityNumber)) {
        sendJsonResponse(
            'error', 
            'Passport number must contain between 6 and 20 alphanumeric characters.', 
            'Nimero ya pasiporo igomba kuba igizwe n\'inyuguti n\'imibare hagati ya 6 na 20.', 
            ['field' => 'national_id_or_passport'], 
            422
        );
    }
} else {
    sendJsonResponse(
        'error', 
        'Invalid identification type selected.', 
        'Ubwoko bw\'icyangombwa wahisemo ntibwemewe.', 
        [], 
        422
    );
}

// 5. Validate Rwandan / International Phone Number
// Clean up spaces, dashes, parentheses
$cleanPhone = preg_replace('/[\s\-\(\)]/', '', $phoneNumber);
if (!preg_match('/^(\+?250|0)7[2389]\d{7}$/', $cleanPhone)) {
    sendJsonResponse(
        'error', 
        'Invalid phone number. Rwandan numbers should follow format: 078/079/072/073 XXX XXXX or +250 78/79/72/73 XXX XXXX.', 
        'Nimero ya telefone ntabwo yemewe. Igomba kuba itangizwa na 078, 079, 072, cyangwa 073.', 
        ['field' => 'phone_number'], 
        422
    );
}

// 6. Validate Password & Match
if (strlen($password) < 8) {
    sendJsonResponse(
        'error', 
        'Password must be at least 8 characters long.', 
        'Ijambobanga rigomba kuba rifite byibuze inyuguti 8.', 
        ['field' => 'password'], 
        422
    );
}

if (!empty($confirmPassword) && $password !== $confirmPassword) {
    sendJsonResponse(
        'error', 
        'Passwords do not match.', 
        'Amagambobanga yombi ntabwo ahuye.', 
        ['field' => 'confirm_password'], 
        422
    );
}

// 7. Check for duplicate Email, Phone Number, or National ID / Passport
try {
    $checkSql = "SELECT id, email, phone_number, national_id_or_passport FROM users 
                 WHERE email = :email OR phone_number = :phone OR national_id_or_passport = :identity LIMIT 1";
    $stmt = $pdo->prepare($checkSql);
    $stmt->execute([
        ':email'    => $email,
        ':phone'    => $cleanPhone,
        ':identity' => $identityNumber
    ]);
    $existing = $stmt->fetch();

    if ($existing) {
        if ($existing['email'] === $email) {
            sendJsonResponse(
                'error', 
                'An account with this email address already exists.', 
                'Konti ifite iyi imeli isanzwe ibaho muri sisitemu.', 
                ['field' => 'email'], 
                409
            );
        }
        if ($existing['phone_number'] === $cleanPhone) {
            sendJsonResponse(
                'error', 
                'An account with this phone number already exists.', 
                'Konti ifite iyi telefone isanzwe ibaho.', 
                ['field' => 'phone_number'], 
                409
            );
        }
        if ($existing['national_id_or_passport'] === $identityNumber) {
            sendJsonResponse(
                'error', 
                'An account with this National ID or Passport already exists in the system.', 
                'Iyi ndangamuntu cyangwa pasiporo isanzwe yanditse muri sisitemu y\'amasoko.', 
                ['field' => 'national_id_or_passport'], 
                409
            );
        }
    }

    // 8. Hash Password and Insert
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    $insertSql = "INSERT INTO users 
                  (full_name, email, phone_number, id_type, national_id_or_passport, password_hash, role) 
                  VALUES (:full_name, :email, :phone_number, :id_type, :identity, :password_hash, 'vendor')";
    
    $insertStmt = $pdo->prepare($insertSql);
    $insertStmt->execute([
        ':full_name'     => $fullName,
        ':email'         => $email,
        ':phone_number'  => $cleanPhone,
        ':id_type'       => $idType,
        ':identity'      => $identityNumber,
        ':password_hash' => $passwordHash
    ]);

    $newUserId = (int)$pdo->lastInsertId();

    sendJsonResponse(
        'success', 
        'Registration successful! You may now log in to complete your Vendor Profile.', 
        'Kwiyandikisha byagenze neza! Ubu ushobora kwinjira ngo wuzuze umwirondoro w\'ubucuruzi bwawe.', 
        [
            'user_id'                 => $newUserId,
            'full_name'               => $fullName,
            'email'                   => $email,
            'phone_number'            => $cleanPhone,
            'id_type'                 => $idType,
            'national_id_or_passport' => $identityNumber,
            'role'                    => 'vendor',
            'has_vendor_profile'      => false
        ], 
        201
    );

} catch (PDOException $e) {
    error_log("Registration error: " . $e->getMessage());
    sendJsonResponse(
        'error', 
        'An error occurred during registration. Please try again.', 
        'Havutse ikibazo mu kwiyandikisha. Nyamuneka ongera ugerageze.', 
        [], 
        500
    );
}
