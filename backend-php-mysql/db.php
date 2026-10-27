<?php
/**
 * Republic of Rwanda - Government Market & Tender Management System (GMMS)
 * Database Connection using PHP 8+ and PDO
 * 
 * Secure, prepared-statement ready, UTF-8 mb4 encoding.
 */

declare(strict_types=1);

// Configuration parameters (can be overridden via Environment Variables)
$host     = getenv('DB_HOST')     ?: '127.0.0.1';
$dbname   = getenv('DB_NAME')     ?: 'gmms_rwanda';
$username = getenv('DB_USER')     ?: 'root';
$password = getenv('DB_PASS')     ?: '';
$port     = getenv('DB_PORT')     ?: '3306';
$charset  = 'utf8mb4';

$dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false, // Enforce true native prepared statements
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE {$charset}_unicode_ci"
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    // In production, log error privately; return sanitized message
    error_log("Database Connection Failed: " . $e->getMessage());
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message_en' => 'Database connection failed. Please ensure MySQL is running.',
        'message_rw' => 'Guhuza na database byanze. Nyamuneka reba niba MySQL iri gukora.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Helper to return uniform JSON response
 */
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
}
