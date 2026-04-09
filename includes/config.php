<?php
/* ============================================
   MERLUNE — Configuration
   ============================================ */

// --- Database ---
define('DB_HOST', 'localhost');
define('DB_NAME', 'merlune_resort');
define('DB_USER', 'root');         // CHANGE in production
define('DB_PASS', '');             // CHANGE in production
define('DB_CHARSET', 'utf8mb4');

// --- Site ---
define('SITE_NAME', 'Merlune Resort');
define('SITE_URL', 'http://localhost/website');  // CHANGE in production
define('ADMIN_EMAIL', 'reservations@merlune.com');

// --- Email (PHPMailer) ---
define('SMTP_HOST', 'smtp.gmail.com');    // CHANGE to your SMTP
define('SMTP_PORT', 587);
define('SMTP_USER', '');                  // CHANGE
define('SMTP_PASS', '');                  // CHANGE
define('SMTP_FROM', 'reservations@merlune.com');
define('SMTP_FROM_NAME', 'Merlune Resort');

// --- Security ---
define('CORS_ORIGIN', '*');               // Restrict in production
date_default_timezone_set('Asia/Kolkata');

// --- Villa Config ---
define('VILLA_BASE_PRICES', [
    'lagoon-water-villa' => 85000,
    'ocean-pavilion-suite' => 110000,
    'garden-sanctuary-villa' => 65000,
    'coral-beach-suite' => 75000,
    'presidential-estate' => 350000,
    'moonlight-forest-villa' => 70000,
    'starlight-cove-villa' => 95000,
    'astral-overwater-suite' => 105000,
    'indigo-pavilion' => 90000
]);
