<?php
/**
 * Republic of Rwanda - Government Market & Tender Management System (GMMS)
 * Pre-Application Vendor Profile Handler (PHP 8+ / PDO)
 * 
 * Rules:
 * - Mandatory pre-requisite before any user can apply for a tender/market.
 * - Business Type: 'individual' (small trader/hawker) OR 'company' (registered firm).
 * - TIN (Tax Identification Number): Required for companies (9 digits), optional for small individual hawkers/stalls.
 * - Business Category: road_construction, school_feeding, school_uniforms, market_stalls, general_supplies, consultancy.
 * - Years of experience, location (district, province), description of services/goods.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

session_start();

// Get authenticated user ID (from session or Authorization header / input for API usage)
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = $_SESSION['user_id'] ?? (int)($input['user_id'] ?? 0);

if ($userId <= 0) {
    sendJsonResponse(
        'error', 
        'Authentication required. Please log in first.', 
        'Ugomba kwinjira muri sisitemu kugira ngo ukomeze.', 
        [], 
        401
    );
}

// -------------------------------------------------------------
// GET: Fetch existing vendor profile for current user
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM vendor_profiles WHERE user_id = :uid LIMIT 1");
        $stmt->execute([':uid' => $userId]);
        $profile = $stmt->fetch();

        if ($profile) {
            sendJsonResponse('success', 'Vendor profile loaded successfully.', 'Umwirondoro w\'ubucuruzi wabonetse.', $profile);
        } else {
            sendJsonResponse('empty', 'No vendor profile found for this user.', 'Nta mwirondoro w\'ubucuruzi urashyirwamo.', ['has_profile' => false], 404);
        }
    } catch (PDOException $e) {
        error_log("Profile load error: " . $e->getMessage());
        sendJsonResponse('error', 'Failed to retrieve vendor profile.', 'Gushaka umwirondoro w\'ubucuruzi byanze.', [], 500);
    }
}

// -------------------------------------------------------------
// POST: Create or Update vendor profile
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $businessType       = trim((string)($input['business_type'] ?? 'individual')); // 'individual' or 'company'
    $companyName        = trim((string)($input['company_name'] ?? ''));
    $rdbRegNumber       = trim((string)($input['rdb_registration_number'] ?? ''));
    $tinNumber          = trim((string)($input['tin_number'] ?? ''));
    $businessCategory   = trim((string)($input['business_category'] ?? ''));
    $experienceYears    = (int)($input['years_of_experience'] ?? 0);
    $province           = trim((string)($input['province'] ?? 'Kigali City'));
    $district           = trim((string)($input['district'] ?? ''));
    $sector             = trim((string)($input['sector'] ?? ''));
    $servicesDesc       = trim((string)($input['services_description'] ?? ''));
    $hasTaxClearance    = !empty($input['has_rra_tax_clearance']) ? 1 : 0;
    $hasRssbClearance   = !empty($input['has_rssb_clearance']) ? 1 : 0;

    // 1. Validate Business Category
    $validCategories = ['road_construction', 'school_feeding', 'school_uniforms', 'market_stalls', 'general_supplies', 'consultancy'];
    if (!in_array($businessCategory, $validCategories, true)) {
        sendJsonResponse(
            'error', 
            'Please select a valid business category.', 
            'Hitamo icyiciro cy\'ubucuruzi cyemewe.', 
            ['field' => 'business_category'], 
            422
        );
    }

    // 2. Validate Business Type & TIN Requirement
    if ($businessType === 'company') {
        if (empty($companyName)) {
            sendJsonResponse(
                'error', 
                'Company Name is required for registered companies.', 
                'Izina rya sosiyete rirakenewe ku masosiyete yanditse.', 
                ['field' => 'company_name'], 
                422
            );
        }

        // TIN is strictly required for registered companies (9 digits in Rwanda)
        if (empty($tinNumber) || !preg_match('/^\d{9}$/', $tinNumber)) {
            sendJsonResponse(
                'error', 
                'Tax Identification Number (TIN) is mandatory for registered companies and must be exactly 9 numeric digits.', 
                'Nimero y\'ibarura ry\'umusoro (TIN) irakenewe ku masosiyete kandi igomba kuba igizwe n\'imibare 9 gusa.', 
                ['field' => 'tin_number'], 
                422
            );
        }
    } else {
        // Individual vendor / stall hawker: TIN is optional, but if entered, should be 9 digits
        if (!empty($tinNumber) && !preg_match('/^\d{9}$/', $tinNumber)) {
            sendJsonResponse(
                'error', 
                'If provided, TIN must be exactly 9 digits.', 
                'Niba ushyizemo TIN, igomba kuba igizwe n\'imibare 9.', 
                ['field' => 'tin_number'], 
                422
            );
        }
    }

    // 3. Validate District & Description
    if (empty($district)) {
        sendJsonResponse(
            'error', 
            'District of business operation is required.', 
            'Akarere ubucuruzi buherereyemo karakenewe.', 
            ['field' => 'district'], 
            422
        );
    }

    if (strlen($servicesDesc) < 20) {
        sendJsonResponse(
            'error', 
            'Please provide a detailed description of your products or services (at least 20 characters).', 
            'Nyamuneka tanga ibisobanuro birambuye by\'ibicuruzwa cyangwa serivisi utanga (byibuze inyuguti 20).', 
            ['field' => 'services_description'], 
            422
        );
    }

    if ($experienceYears < 0 || $experienceYears > 60) {
        sendJsonResponse(
            'error', 
            'Please provide a realistic number of years of experience.', 
            'Nyamuneka andika imyaka nyayo y\'uburambe mu bucuruzi.', 
            ['field' => 'years_of_experience'], 
            422
        );
    }

    try {
        // Upsert vendor profile using ON DUPLICATE KEY UPDATE
        $sql = "INSERT INTO vendor_profiles 
                (user_id, business_type, company_name, rdb_registration_number, tin_number, business_category, 
                 years_of_experience, province, district, sector, services_description, 
                 has_rra_tax_clearance, has_rssb_clearance, is_profile_completed) 
                VALUES 
                (:user_id, :business_type, :company_name, :rdb_reg, :tin_number, :business_category, 
                 :years_of_experience, :province, :district, :sector, :services_description, 
                 :has_rra, :has_rssb, 1)
                ON DUPLICATE KEY UPDATE 
                    business_type = VALUES(business_type),
                    company_name = VALUES(company_name),
                    rdb_registration_number = VALUES(rdb_registration_number),
                    tin_number = VALUES(tin_number),
                    business_category = VALUES(business_category),
                    years_of_experience = VALUES(years_of_experience),
                    province = VALUES(province),
                    district = VALUES(district),
                    sector = VALUES(sector),
                    services_description = VALUES(services_description),
                    has_rra_tax_clearance = VALUES(has_rra_tax_clearance),
                    has_rssb_clearance = VALUES(has_rssb_clearance),
                    is_profile_completed = 1,
                    updated_at = NOW()";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':user_id'             => $userId,
            ':business_type'       => $businessType,
            ':company_name'        => !empty($companyName) ? $companyName : null,
            ':rdb_reg'             => !empty($rdbRegNumber) ? $rdbRegNumber : null,
            ':tin_number'          => !empty($tinNumber) ? $tinNumber : null,
            ':business_category'   => $businessCategory,
            ':years_of_experience' => $experienceYears,
            ':province'            => $province,
            ':district'            => $district,
            ':sector'              => !empty($sector) ? $sector : null,
            ':services_description'=> $servicesDesc,
            ':has_rra'             => $hasTaxClearance,
            ':has_rssb'            => $hasRssbClearance
        ]);

        sendJsonResponse(
            'success', 
            'Vendor Profile saved successfully! You are now eligible to apply for government markets and tenders.', 
            'Umwirondoro w\'ubucuruzi wabitswe neza! Ubu wemerewe gusaba amasoko ya Leta n\'ibibanza by\'ubucuruzi.', 
            [
                'user_id'              => $userId,
                'business_type'        => $businessType,
                'business_category'    => $businessCategory,
                'tin_number'           => $tinNumber,
                'is_profile_completed' => true
            ], 
            200
        );

    } catch (PDOException $e) {
        error_log("Save profile error: " . $e->getMessage());
        sendJsonResponse(
            'error', 
            'Failed to save vendor profile. Please check that TIN is unique if registered.', 
            'Kubika umwirondoro w\'ubucuruzi byanze. Nyamuneka reba niba amakuru yawe yujuje ibisabwa.', 
            [], 
            500
        );
    }
}
