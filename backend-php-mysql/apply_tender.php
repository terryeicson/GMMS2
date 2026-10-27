<?php
/**
 * Republic of Rwanda - Government Market & Tender Management System (GMMS)
 * Tender / Market Application Submission Handler (PHP 8+ / PDO)
 * 
 * Strict Business Logic:
 * 1. Checks user authentication.
 * 2. Mandatory: verifies user has an active, completed Vendor Profile in vendor_profiles table.
 * 3. Enforces single submission per user per tender (prevents duplicate bidding).
 * 4. Validates Financial Offer in RWF, Proposed Delivery Days, and Technical Proposal.
 * 5. Issues official unique Rwandan Tracking Code (e.g., RW-TND-2026-4821).
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

session_start();

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = $_SESSION['user_id'] ?? (int)($input['user_id'] ?? 0);

if ($userId <= 0) {
    sendJsonResponse(
        'error', 
        'Authentication required to apply for tenders.', 
        'Ugomba kuba winjiye muri sisitemu kugira ngo usabe isoko.', 
        [], 
        401
    );
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse('error', 'POST request method required.', 'Uburyo bwa POST nibwo bwemewe.', [], 405);
}

$tenderId        = (int)($input['tender_id'] ?? 0);
$financialOffer  = (float)($input['financial_offer_rwf'] ?? 0);
$deliveryDays    = (int)($input['proposed_delivery_days'] ?? 0);
$proposalSummary = trim((string)($input['technical_proposal_summary'] ?? ''));
$pledgeAccepted  = !empty($input['anti_corruption_pledge_signed']) ? 1 : 0;

// 1. Verify Tender ID exists and is currently OPEN
try {
    $tenderStmt = $pdo->prepare("SELECT id, tender_reference, title_en, title_rw, category, submission_deadline, status, estimated_budget_rwf FROM tenders WHERE id = :tid LIMIT 1");
    $tenderStmt->execute([':tid' => $tenderId]);
    $tender = $tenderStmt->fetch();

    if (!$tender) {
        sendJsonResponse('error', 'The requested government tender does not exist.', 'Isoko rya Leta ushaka ntabwo ribaho.', [], 404);
    }

    if ($tender['status'] !== 'open' || strtotime($tender['submission_deadline']) < time()) {
        sendJsonResponse(
            'error', 
            'This tender is closed for bidding. No further submissions are accepted.', 
            'Iri soko ryamaze gufungwa. Nta kindi cyifuzo cyemewe kwakirwa.', 
            [], 
            400
        );
    }

    // 2. CRITICAL PRE-REQUISITE CHECK:
    // Does the user have a completed Vendor Profile?
    $profileStmt = $pdo->prepare("SELECT * FROM vendor_profiles WHERE user_id = :uid AND is_profile_completed = 1 LIMIT 1");
    $profileStmt->execute([':uid' => $userId]);
    $vendorProfile = $profileStmt->fetch();

    if (!$vendorProfile) {
        sendJsonResponse(
            'error', 
            'Pre-Application Requirement: You must complete your Vendor Profile (Business details, TIN, category) before applying for any government tender.', 
            'Ibisabwa mbere yo gusaba: Ugomba kubanza kuzuza Umwirondoro w\'Ubucuruzi (Amakuru y\'ubucuruzi, TIN, icyiciro) mbere yo gusaba isoko rya Leta.', 
            ['action_required' => 'complete_vendor_profile'], 
            403
        );
    }

    // 3. Duplicate Application Check
    $dupStmt = $pdo->prepare("SELECT id, application_tracking_code, submitted_at FROM applications WHERE user_id = :uid AND tender_id = :tid LIMIT 1");
    $dupStmt->execute([':uid' => $userId, ':tid' => $tenderId]);
    $existingApp = $dupStmt->fetch();

    if ($existingApp) {
        sendJsonResponse(
            'error', 
            'You have already submitted an application/bid for this tender (Tracking Code: ' . $existingApp['application_tracking_code'] . ').', 
            'Wamaze gusaba iri soko (Nimero y\'idosiye: ' . $existingApp['application_tracking_code'] . '). Ntiwemerewe gusaba kabiri isoko rimwe.', 
            ['existing_tracking_code' => $existingApp['application_tracking_code']], 
            409
        );
    }

    // 4. Validate Bid Submission Parameters
    if ($financialOffer <= 0) {
        sendJsonResponse(
            'error', 
            'Please specify a valid financial offer / bid amount in Rwandan Francs (RWF).', 
            'Nyamuneka andika amafaranga nyayo wifuza ku isoko (mu Mafiranga y\'u Rwanda - RWF).', 
            ['field' => 'financial_offer_rwf'], 
            422
        );
    }

    if ($deliveryDays <= 0 || $deliveryDays > 730) {
        sendJsonResponse(
            'error', 
            'Please indicate a realistic execution or delivery timeline in days (1 to 730 days).', 
            'Andika iminsi nyayo yo kurangiza isoko (hagati y\'umunsi 1 n\'iminsi 730).', 
            ['field' => 'proposed_delivery_days'], 
            422
        );
    }

    if (strlen($proposalSummary) < 30) {
        sendJsonResponse(
            'error', 
            'Please provide a comprehensive technical execution summary and capability statement (minimum 30 characters).', 
            'Nyamuneka tanga incamake y\'uburyo uzasohozamo isoko n\'ubushobozi ufite (byibuze inyuguti 30).', 
            ['field' => 'technical_proposal_summary'], 
            422
        );
    }

    if (!$pledgeAccepted) {
        sendJsonResponse(
            'error', 
            'You must sign and accept the Republic of Rwanda Public Procurement Anti-Corruption and Integrity Pledge.', 
            'Ugomba kwemeza no gusinya igihango cyo kurwanya ruswa no gukorera mu mucyo mu masoko ya Leta.', 
            ['field' => 'anti_corruption_pledge_signed'], 
            422
        );
    }

    // 5. Generate Official Rwandan Application Tracking Code
    $year = date('Y');
    $randomSuffix = strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));
    $trackingCode = "RW-TND-{$year}-{$randomSuffix}";

    // 6. Insert Application into Database
    $insertSql = "INSERT INTO applications 
                  (application_tracking_code, tender_id, user_id, vendor_profile_id, 
                   financial_offer_rwf, proposed_delivery_days, technical_proposal_summary, 
                   anti_corruption_pledge_signed, status) 
                  VALUES 
                  (:code, :tid, :uid, :vpid, :offer, :days, :summary, :pledge, 'submitted')";

    $insertStmt = $pdo->prepare($insertSql);
    $insertStmt->execute([
        ':code'    => $trackingCode,
        ':tid'     => $tenderId,
        ':uid'     => $userId,
        ':vpid'    => $vendorProfile['id'],
        ':offer'   => $financialOffer,
        ':days'    => $deliveryDays,
        ':summary' => $proposalSummary,
        ':pledge'  => $pledgeAccepted
    ]);

    $appId = (int)$pdo->lastInsertId();

    sendJsonResponse(
        'success', 
        'Your tender application has been officially submitted and recorded in the National E-Procurement Registry.', 
        'Gusaba isoko byakiriwe neza kandi byanditswe mu gitabo cy\'amasoko ya Leta y\'u Rwanda.', 
        [
            'application_id'            => $appId,
            'application_tracking_code' => $trackingCode,
            'tender_reference'          => $tender['tender_reference'],
            'tender_title_en'           => $tender['title_en'],
            'tender_title_rw'           => $tender['title_rw'],
            'financial_offer_rwf'       => $financialOffer,
            'proposed_delivery_days'    => $deliveryDays,
            'status'                    => 'submitted',
            'submitted_at'              => date('Y-m-d H:i:s'),
            'vendor_business_type'      => $vendorProfile['business_type'],
            'vendor_tin'                => $vendorProfile['tin_number']
        ], 
        201
    );

} catch (PDOException $e) {
    error_log("Apply tender error: " . $e->getMessage());
    sendJsonResponse(
        'error', 
        'Database error occurred while recording your tender application.', 
        'Habaye ikibazo mu kubika ubusabe bwawe. Nyamuneka ongera ugerageze.', 
        [], 
        500
    );
}
