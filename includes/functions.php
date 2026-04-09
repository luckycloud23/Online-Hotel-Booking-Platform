<?php
/* ============================================
   MERLUNE — Helper Functions
   ============================================ */

/**
 * Sanitize user input string
 */
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email format
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate date format (Y-m-d)
 */
function isValidDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

/**
 * Calculate number of nights between two dates
 */
function calculateNights($checkin, $checkout) {
    $d1 = new DateTime($checkin);
    $d2 = new DateTime($checkout);
    return $d2->diff($d1)->days;
}

/**
 * Check if dates fall on a full moon weekend (approximate)
 * Returns true if stay overlaps with a full moon ±1 day
 */
function isFullMoonPeriod($checkin, $checkout) {
    // Approximate full moon dates for 2026 (can be expanded)
    $fullMoons = [
        '2026-01-03', '2026-02-01', '2026-03-03', '2026-04-01',
        '2026-05-01', '2026-05-31', '2026-06-29', '2026-07-29',
        '2026-08-28', '2026-09-26', '2026-10-26', '2026-11-24', '2026-12-24'
    ];
    $ci = new DateTime($checkin);
    $co = new DateTime($checkout);
    foreach ($fullMoons as $fm) {
        $fmDate = new DateTime($fm);
        $fmStart = (clone $fmDate)->modify('-1 day');
        $fmEnd = (clone $fmDate)->modify('+1 day');
        if ($ci <= $fmEnd && $co >= $fmStart) return true;
    }
    return false;
}

/**
 * Generate a unique booking reference
 */
function generateBookingRef() {
    return 'MER-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));
}

/**
 * Send JSON response and exit
 */
function jsonResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Set CORS headers
 */
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
