<?php
/**
 * Republic of Rwanda - Government Market & Tender Management System (GMMS)
 * My Submitted Applications & Evaluation Status Tracker (PHP 8+ / PDO)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

session_start();

$input = json_decode(file_get_contents('php://input'), true) ?? $_GET;
$userId = $_SESSION['user_id'] ?? (int)($input['user_id'] ?? 0);

if ($userId <= 0) {
    sendJsonResponse(
        'error', 
        'Authentication required to view your tender applications.', 
        'Ugomba kwinjira muri sisitemu kugira ngo urebe amasoko wasabye.', 
        [], 
        401
    );
}

try {
    $sql = "SELECT a.id, a.application_tracking_code, a.financial_offer_rwf, a.proposed_delivery_days,
                   a.technical_proposal_summary, a.status, a.evaluation_notes, a.submitted_at,
                   t.id AS tender_id, t.tender_reference, t.title_en, t.title_rw, t.category,
                   t.procuring_entity_en, t.procuring_entity_rw, t.location_district, t.estimated_budget_rwf,
                   t.submission_deadline,
                   vp.business_type, vp.company_name, vp.tin_number
            FROM applications a
            INNER JOIN tenders t ON a.tender_id = t.id
            INNER JOIN vendor_profiles vp ON a.vendor_profile_id = vp.id
            WHERE a.user_id = :uid
            ORDER BY a.submitted_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':uid' => $userId]);
    $applications = $stmt->fetchAll();

    sendJsonResponse('success', 'User applications retrieved.', 'Amasoko wasabye yabonetse neza.', [
        'count'        => count($applications),
        'applications' => $applications
    ]);
} catch (PDOException $e) {
    error_log("Get applications error: " . $e->getMessage());
    sendJsonResponse('error', 'Failed to retrieve applications.', 'Gushaka amasoko wasabye byanze.', [], 500);
}
