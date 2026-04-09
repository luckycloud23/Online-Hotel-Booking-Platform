<?php
/* ============================================
   API: Contact Form Submission
   ============================================ */

/* PHP: form processing */
/* PHP: cookies */

session_start(); /* PHP: session management */

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';
setCorsHeaders();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST method required.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    jsonResponse(['error' => 'Invalid JSON body.'], 400);
}

// --- Extract & sanitize ---
$firstName = sanitize($input['first_name'] ?? '');
$lastName  = sanitize($input['last_name'] ?? '');
$email     = sanitize($input['email'] ?? '');
$phone     = sanitize($input['phone'] ?? '');
$subject   = sanitize($input['subject'] ?? '');
$dateFrom  = sanitize($input['date_from'] ?? '');
$dateTo    = sanitize($input['date_to'] ?? '');
$message   = sanitize($input['message'] ?? '');

// --- Validate ---
if (!$firstName || !$lastName) jsonResponse(['error' => 'Name is required.'], 400);
if (!$email || !isValidEmail($email)) jsonResponse(['error' => 'Valid email is required.'], 400);
if (!$message) jsonResponse(['error' => 'Message is required.'], 400);

// --- Save to database ---
try {
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages (
            first_name, last_name, email, phone, subject,
            travel_date_from, travel_date_to, message,
            status, created_at
        ) VALUES (
            :first_name, :last_name, :email, :phone, :subject,
            :date_from, :date_to, :message,
            'new', NOW()
        )
    ");
    $stmt->execute([
        ':first_name' => $firstName,
        ':last_name'  => $lastName,
        ':email'      => $email,
        ':phone'      => $phone,
        ':subject'    => $subject,
        ':date_from'  => $dateFrom ?: null,
        ':date_to'    => $dateTo ?: null,
        ':message'    => $message,
    ]);

    // Store email in a cookie for 30 days to remember the user
    setcookie('user_email', $email, time() + (86400 * 30), "/"); /* PHP: cookies */

    jsonResponse([
        'success' => true,
        'message' => 'Thank you for your message. Our team will respond within 24 hours.'
    ], 201);

} catch (PDOException $e) {
    error_log('Merlune Contact Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Unable to send message. Please try again.'], 500);
}
