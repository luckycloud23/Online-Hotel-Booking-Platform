<?php
/* ============================================
   API: Create Booking (Reservation Request)
   ============================================ */

/* PHP: form processing */
/* PHP: session management */
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';
setCorsHeaders();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST method required.'], 405);
}

// --- Parse JSON body ---
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    jsonResponse(['error' => 'Invalid JSON body.'], 400);
}

// --- Extract & sanitize ---
$villa     = sanitize($input['villa'] ?? '');
$checkin   = sanitize($input['checkin'] ?? '');
$checkout  = sanitize($input['checkout'] ?? '');
$guests    = intval($input['guests'] ?? 0);
$firstName = sanitize($input['first_name'] ?? '');
$lastName  = sanitize($input['last_name'] ?? '');
$email     = sanitize($input['email'] ?? '');
$phone     = sanitize($input['phone'] ?? '');
$country   = sanitize($input['country'] ?? '');
$requests  = sanitize($input['requests'] ?? '');
$transfer  = sanitize($input['transfer'] ?? '');
$addons    = $input['addons'] ?? [];

// --- Validate required fields ---
$errors = [];
if (!$villa) $errors[] = 'Villa is required.';
if (!$checkin || !isValidDate($checkin)) $errors[] = 'Valid check-in date is required.';
if (!$checkout || !isValidDate($checkout)) $errors[] = 'Valid check-out date is required.';
if ($checkin && $checkout && new DateTime($checkout) <= new DateTime($checkin)) $errors[] = 'Check-out must be after check-in.';
if ($guests < 1) $errors[] = 'At least 1 guest is required.';
if (!$firstName) $errors[] = 'First name is required.';
if (!$lastName) $errors[] = 'Last name is required.';
if (!$email || !isValidEmail($email)) $errors[] = 'Valid email is required.';
if (!$phone) $errors[] = 'Phone number is required.';

if (!empty($errors)) {
    jsonResponse(['error' => implode(' ', $errors)], 400);
}

// Minimum stay check removed as per request
$nights = calculateNights($checkin, $checkout);


// --- Check availability ---
try {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM bookings
        WHERE villa_id = (SELECT id FROM villas WHERE slug = :villa LIMIT 1)
        AND status != 'cancelled'
        AND checkin < :checkout AND checkout > :checkin
    ");
    $stmt->execute([':villa' => $villa, ':checkin' => $checkin, ':checkout' => $checkout]);
    if ($stmt->fetchColumn() > 0) {
        jsonResponse(['error' => 'This villa is not available for the selected dates.'], 409);
    }
} catch (PDOException $e) {
    error_log('Merlune Booking Check Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Unable to verify availability.'], 500);
}

// --- Calculate pricing ---
$basePrice = VILLA_BASE_PRICES[$villa] ?? 0;
$isFullMoon = isFullMoonPeriod($checkin, $checkout);
$multiplier = $isFullMoon ? 1.25 : 1.0;
$nightlyRate = round($basePrice * $multiplier);
$totalPrice = $nightlyRate * $nights;
$bookingRef = generateBookingRef();

// --- Insert booking ---
try {
    $stmt = $pdo->prepare("
        INSERT INTO bookings (
            booking_ref, villa_id, checkin, checkout, nights, guests,
            first_name, last_name, email, phone, country,
            special_requests, transfer_type, addons,
            nightly_rate, total_price, is_full_moon,
            status, created_at
        ) VALUES (
            :ref,
            (SELECT id FROM villas WHERE slug = :villa LIMIT 1),
            :checkin, :checkout, :nights, :guests,
            :first_name, :last_name, :email, :phone, :country,
            :requests, :transfer, :addons,
            :nightly_rate, :total_price, :is_full_moon,
            'pending', NOW()
        )
    ");
    $stmt->execute([
        ':ref'          => $bookingRef,
        ':villa'        => $villa,
        ':checkin'      => $checkin,
        ':checkout'     => $checkout,
        ':nights'       => $nights,
        ':guests'       => $guests,
        ':first_name'   => $firstName,
        ':last_name'    => $lastName,
        ':email'        => $email,
        ':phone'        => $phone,
        ':country'      => $country,
        ':requests'     => $requests,
        ':transfer'     => $transfer,
        ':addons'       => json_encode($addons),
        ':nightly_rate' => $nightlyRate,
        ':total_price'  => $totalPrice,
        ':is_full_moon' => $isFullMoon ? 1 : 0,
    ]);

    // Success response
    jsonResponse([
        'success'     => true,
        'booking_ref' => $bookingRef,
        'message'     => 'Reservation request received. We will confirm within 24 hours.'
    ], 201);

} catch (PDOException $e) {
    error_log('Merlune Booking Insert Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Unable to create booking. Please try again or contact us directly.'], 500);
}
