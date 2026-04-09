<?php
/* ============================================
   API: Check Villa Availability
   ============================================ */

/* PHP: session management */
session_start();

/* PHP: form processing */

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';
setCorsHeaders();
header('Content-Type: application/json');

// --- Validate inputs ---
$checkin  = $_GET['checkin'] ?? $_GET['start'] ?? null;
$checkout = $_GET['checkout'] ?? $_GET['end'] ?? null;

if (!$checkin || !$checkout) {
    jsonResponse(['error' => 'Both checkin and checkout dates are required.'], 400);
}

if (!isValidDate($checkin) || !isValidDate($checkout)) {
    jsonResponse(['error' => 'Invalid date format. Use YYYY-MM-DD.'], 400);
}

if (new DateTime($checkout) <= new DateTime($checkin)) {
    jsonResponse(['error' => 'Checkout must be after checkin.'], 400);
}

if (new DateTime($checkin) < new DateTime('today')) {
    jsonResponse(['error' => 'Checkin date cannot be in the past.'], 400);
}

// --- Query available villas ---
try {
    $stmt = $pdo->prepare("
        SELECT v.* FROM villas v
        WHERE v.id NOT IN (
            SELECT b.villa_id FROM bookings b
            WHERE b.status != 'cancelled'
            AND b.checkin < :checkout
            AND b.checkout > :checkin
        )
        ORDER BY v.sort_order ASC
    ");
    $stmt->execute([
        ':checkin'  => $checkin,
        ':checkout' => $checkout
    ]);
    $villas = $stmt->fetchAll();

    // Calculate pricing
    $nights = calculateNights($checkin, $checkout);
    $isFullMoon = isFullMoonPeriod($checkin, $checkout);

    foreach ($villas as &$villa) {
        $basePrice = $villa['price_per_night'];
        $multiplier = $isFullMoon ? 1.25 : 1.0; // 25% premium on full moon weekends
        $villa['calculated_price'] = round($basePrice * $multiplier);
        $villa['total_price'] = round($basePrice * $multiplier * $nights);
        $villa['nights'] = $nights;
        $villa['is_full_moon'] = $isFullMoon;
    }

    jsonResponse([
        'success' => true,
        'checkin' => $checkin,
        'checkout' => $checkout,
        'nights' => $nights,
        'is_full_moon_period' => $isFullMoon,
        'villas' => $villas
    ]);

} catch (PDOException $e) {
    error_log('Merlune Availability Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Unable to check availability. Please try again.'], 500);
}
