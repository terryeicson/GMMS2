<?php
/**
 * Republic of Rwanda - Government Market & Tender Management System (GMMS)
 * User Login Handler (PHP 8+ / PDO)
 * 
 * Flow:
 * - Authenticates using only Email & Password
 * - Verifies against users table with password_verify()
 * - Queries vendor_profiles to check if pre-application profile is completed
 * - Returns bilingual responses and session payload
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

session_start();

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse('error', 'Invalid request method. POST required.', 'Uburyo bwo gusaba butemewe. Hagomba gukoreshwa POST.', [], 405);
}

$email    = trim(strtolower((string)($input['email'] ?? '')));
$password = (string)($input['password'] ?? '');

if (empty($email) || empty($password)) {
    sendJsonResponse(
        'error', 
        'Email and password are both required.', 
        'Imeli n\'ijambobanga byose birakenewe.', 
        [], 
        422
    );
}

try {
    // 1. Fetch user by email
    $stmt = $pdo->prepare("SELECT id, full_name, email, phone_number, id_type, national_id_or_passport, password_hash, role, is_verified FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendJsonResponse(
            'error', 
            'Invalid email or password. Please verify your credentials.', 
            'Imeli cyangwa ijambobanga ntabwo bihuye. Nyamuneka ongera ugerageze.', 
            [], 
            401
        );
    }

    // 2. Check if Vendor Profile exists
    $profileStmt = $pdo->prepare("SELECT id, business_type, company_name, tin_number, business_category, years_of_experience, district, is_profile_completed FROM vendor_profiles WHERE user_id = :uid LIMIT 1");
    $profileStmt->execute([':uid' => $user['id']]);
    $vendorProfile = $profileStmt->fetch();

    // 3. Create Session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role']    = $user['role'];
    $_SESSION['email']   = $user['email'];

    unset($user['password_hash']);

    sendJsonResponse(
        'success', 
        'Login successful. Welcome back to GMMS Rwanda.', 
        'Kwinjira byakunze. Murakaza neza muri sisitemu y\'amasoko ya Leta (GMMS Rwanda).', 
        [
            'user'               => $user,
            'has_vendor_profile' => ($vendorProfile !== false && (bool)$vendorProfile['is_profile_completed']),
            'vendor_profile'     => $vendorProfile ?: null
        ], 
        200
    );

} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    sendJsonResponse(
        'error', 
        'An unexpected server error occurred during login.', 
        'Havutse ikibazo mu kwinjira muri sisitemu.', 
        [], 
        500
    );
}
