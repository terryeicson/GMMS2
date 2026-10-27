<?php
/**
 * Republic of Rwanda - Government Market & Tender Management System (GMMS)
 * Tenders & Markets Listing / Details API (PHP 8+ / PDO)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

// Check if a single tender ID is requested
$tenderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($tenderId > 0) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM tenders WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $tenderId]);
        $tender = $stmt->fetch();

        if ($tender) {
            sendJsonResponse('success', 'Tender retrieved successfully.', 'Amakuru y\'isoko yabonetse neza.', $tender);
        } else {
            sendJsonResponse('error', 'Tender not found.', 'Isoko ntiribonetse.', [], 404);
        }
    } catch (PDOException $e) {
        error_log("Get tender error: " . $e->getMessage());
        sendJsonResponse('error', 'Database error loading tender.', 'Habaye ikibazo mu gushaka isoko.', [], 500);
    }
}

// Listing with optional filters: category, district, search, status
$category = trim((string)($_GET['category'] ?? ''));
$district = trim((string)($_GET['district'] ?? ''));
$search   = trim((string)($_GET['search'] ?? ''));
$status   = trim((string)($_GET['status'] ?? 'open'));

$whereConditions = ["1=1"];
$params = [];

if (!empty($status) && $status !== 'all') {
    $whereConditions[] = "status = :status";
    $params[':status'] = $status;
}

if (!empty($category) && $category !== 'all') {
    $whereConditions[] = "category = :category";
    $params[':category'] = $category;
}

if (!empty($district) && $district !== 'all') {
    $whereConditions[] = "location_district = :district";
    $params[':district'] = $district;
}

if (!empty($search)) {
    $whereConditions[] = "(title_en LIKE :search OR title_rw LIKE :search OR tender_reference LIKE :search OR procuring_entity_en LIKE :search)";
    $params[':search'] = "%{$search}%";
}

$whereClause = implode(' AND ', $whereConditions);
$sql = "SELECT id, tender_reference, title_en, title_rw, procuring_entity_en, procuring_entity_rw,
               category, location_district, estimated_budget_rwf, bid_security_rwf,
               submission_deadline, status, published_at
        FROM tenders 
        WHERE {$whereClause}
        ORDER BY submission_deadline ASC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $tenders = $stmt->fetchAll();

    sendJsonResponse('success', 'Tenders retrieved successfully.', 'Amasoko aboneka yashakishijwe neza.', [
        'count'   => count($tenders),
        'tenders' => $tenders
    ]);
} catch (PDOException $e) {
    error_log("List tenders error: " . $e->getMessage());
    sendJsonResponse('error', 'Failed to retrieve tenders.', 'Gushaka urutonde rw\'amasoko byanze.', [], 500);
}
