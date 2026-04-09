<?php
/* ============================================
   API: Newsletter Subscription
   POST /api/newsletter.php
   Body: JSON { email }
   ============================================ */

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

$email = sanitize($input['email'] ?? '');

if (!$email || !isValidEmail($email)) {
    jsonResponse(['error' => 'A valid email address is required.'], 400);
}

try {
    // Check if already subscribed
    $stmt = $pdo->prepare("SELECT id, is_active FROM newsletter_subscribers WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $existing = $stmt->fetch();

    if ($existing) {
        if ($existing['is_active']) {
            jsonResponse(['success' => true, 'message' => 'You are already part of the Merlune circle.']);
        } else {
            // Re-activate
            $stmt = $pdo->prepare("UPDATE newsletter_subscribers SET is_active = 1 WHERE id = :id");
            $stmt->execute([':id' => $existing['id']]);
            jsonResponse(['success' => true, 'message' => 'Welcome back to the Merlune circle.'], 200);
        }
    } else {
        $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email) VALUES (:email)");
        $stmt->execute([':email' => $email]);
        jsonResponse(['success' => true, 'message' => 'Welcome to the Merlune circle. Moonlit dispatches await.'], 201);
    }
} catch (PDOException $e) {
    error_log('Merlune Newsletter Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Unable to subscribe. Please try again.'], 500);
}
