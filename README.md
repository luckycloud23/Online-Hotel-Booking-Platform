# Online-Hotel-Booking-Platform

# ☽ Merlune Resort — Luxury Night-Sky Sanctuary Website

> *Where the moon meets the waves.*

A fully handcrafted, multi-page luxury resort website for **Merlune** — a fictional five-star sanctuary set on a private island in the Andaman archipelago, India. Built with vanilla HTML, CSS, and JavaScript, backed by a PHP + MySQL stack for dynamic bookings, contact inquiries, and newsletter management.

---

## 🌊 Live Preview

> *Deploy locally using XAMPP / WAMP / Laragon. See [Getting Started](#-getting-started) below.*

---

## ✨ Features

### 🎨 Frontend
- **Dark "Moon & Night" design system** — deep navy, midnight blue, and gold/ivory accents
- **Animated starfield canvas** — procedurally generated, animated night-sky particle effect on the hero
- **Infinite auto-scrolling gallery strip** — seamless horizontal carousel of resort imagery
- **Flatpickr date pickers** — elegant, theme-matched date selection throughout the site
- **Fully responsive layout** — mobile hamburger navigation, fluid grids, touch-friendly UI
- **CSS micro-animations** — scroll-reveal, hover transitions, floating elements, glow effects
- **Moon phase widget** — displays the current real-world lunar phase on the homepage

### 🏨 Pages
| Page | Description |
|---|---|
| `index.html` | Homepage — hero with availability checker, villa/dining/spa/experiences previews, newsletter CTA |
| `villas.html` | All 9 villa types with detailed descriptions, amenities, and pricing |
| `dining.html` | 9 restaurants — from underwater fine dining to a rooftop moonbar |
| `spa.html` | The Lunar Spa — Ayurvedic treatments, moonwater rituals, thalasso therapy |
| `experiences.html` | Curated after-dark experiences — bioluminescent kayaking, stargazing, coral diving |
| `gallery.html` | Full interactive photo gallery with lightbox |
| `booking.html` | Multi-step reservation form with real-time availability check and price calculator |
| `contact.html` | Contact form with inquiry routing to the backend |

### ⚙️ Backend (PHP + MySQL)
- **PDO database connection** with exception-mode error handling
- **Booking engine** — validates dates, checks availability, calculates nightly rates + full moon surcharges, generates unique `MER-XXXXXXXX` reference codes
- **Contact form API** — stores guest inquiries in the database
- **Newsletter API** — manages subscriber signups with duplicate handling
- **Availability checker** — real-time date-range conflict detection against confirmed bookings

---

## 🗂️ Project Structure

```
website/
│
├── index.html                  # Homepage
├── villas.html                 # Villas & Accommodations
├── dining.html                 # Dining & Restaurants
├── spa.html                    # Spa & Wellness
├── experiences.html            # Curated Experiences
├── gallery.html                # Photo Gallery
├── booking.html                # Booking & Reservations
├── contact.html                # Contact Us
│
├── css/
│   └── style.css               # Main stylesheet (design system + all page styles)
│
├── js/
│   ├── merlune-main.js         # Core JS — nav, scroll effects, moon phase, animations
│   ├── merlune-booking.js      # Booking form logic, availability check, price calculator
│   ├── gallery.js              # Gallery lightbox and filter interactions
│   └── starfield.js            # Canvas-based animated starfield for the hero
│
├── api/
│   ├── availability.php        # GET — check villa availability for date range
│   ├── create-booking.php      # POST — validate & save new booking to database
│   ├── contact.php             # POST — save contact form inquiry
│   └── newsletter.php          # POST — subscribe email to newsletter
│
├── includes/
│   ├── config.php              # Global constants (DB credentials, villa prices, SMTP)
│   ├── db.php                  # PDO database connection singleton
│   └── functions.php           # Shared helper functions (sanitize, validate, booking ref, etc.)
│
├── sql/
│   └── sql commands.txt        # Database schema — all CREATE TABLE & seed INSERT statements
│
└── imgs/
    └── *.png                   # All resort imagery assets
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 (semantic, SEO-optimised) |
| **Styling** | Vanilla CSS3 (custom properties, grid, flexbox, animations) |
| **Scripting** | Vanilla JavaScript (ES6+, no frameworks) |
| **Backend** | PHP 8+ |
| **Database** | MySQL 8+ via PDO |
| **Date Picker** | [Flatpickr](https://flatpickr.js.org/) (CDN) |
| **Fonts** | Google Fonts — Playfair Display, Inter, Montserrat |

---

## 🚀 Getting Started

### Prerequisites
- **XAMPP**, **WAMP**, **Laragon**, or any local PHP server with MySQL
- PHP 8.0+
- MySQL 8.0+

### 1. Clone / Copy the Project

Place the `website/` folder inside your local server's web root:

```bash
# XAMPP example
C:\xampp\htdocs\website\

# Laragon example
C:\laragon\www\website\
```

### 2. Set Up the Database

1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`)
2. Create a new database called `merlune_resort`
3. Open the SQL tab and run the contents of `sql/sql commands.txt`

This will create and seed the following tables:
- `villas` — all 9 villa types
- `bookings` — guest reservations
- `newsletter_subscribers` — email list
- `contact_messages` — guest inquiries

### 3. Configure the Backend

Edit `includes/config.php` with your local credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'merlune_resort');
define('DB_USER', 'root');       // your MySQL username
define('DB_PASS', '');           // your MySQL password
define('SITE_URL', 'http://localhost/website');
```

### 4. Launch the Site

Navigate to:
```
http://localhost/website/index.html
```

---

## 🏛️ Database Schema

```
villas                    bookings                   newsletter_subscribers
──────────────────        ───────────────────────    ──────────────────────
id (PK)                   id (PK)                    id (PK)
name                      booking_ref (UNIQUE)       email (UNIQUE)
slug (UNIQUE)             villa_id (FK → villas)     is_active
                          checkin / checkout         created_at
                          nights / guests
                          first_name / last_name     contact_messages
                          email / phone / country    ──────────────────────
                          special_requests           id (PK)
                          transfer_type              first_name / last_name
                          addons (JSON)              email / phone
                          nightly_rate               subject / message
                          total_price                travel_date_from/to
                          is_full_moon               status
                          status / created_at        created_at
```

---

## 🌙 Villas & Pricing

| Villa | Type | From (₹/night) |
|---|---|---|
| Lagoon Water Villa | Overwater, Glass Floor | ₹85,000 |
| Garden Sanctuary Villa | Candlelit Jungle | ₹65,000 |
| Moonlight Forest Villa | Forest Immersion | ₹70,000 |
| Coral Beach Suite | Beachfront | ₹75,000 |
| The Indigo Pavilion | Bioluminescent Lagoon | ₹90,000 |
| Starlight Cove Villa | Secluded Volcanic Cove | ₹95,000 |
| The Astral Overwater Suite | Panoramic Lagoon | ₹1,05,000 |
| Ocean Pavilion Suite | Cliffside Infinity Pool | ₹1,10,000 |
| Presidential Estate | Private Headland, 3 Wings | ₹3,50,000 |

> **Full Moon Surcharge:** Bookings overlapping with a full moon weekend are automatically flagged and may include a premium surcharge.

---

## 🍽️ Dining

| Restaurant | Cuisine |
|---|---|
| Tideline | Contemporary Coastal |
| Nautilus | Underwater Fine Dining |
| The Moonbar | Rooftop Cocktails & Tapas |
| Saffron Garden | Indian Spice Kitchen |
| Coral Table | Chef's Table (10 Courses) |
| The Drift | Floating Breakfast |
| Zenith | Modern Asian-Indian Fusion |
| The Moonstone Deli | Artisan Pantry & Snacks |
| Saltwater Snaps | Coastal Small Bites |

---

## 🌟 Curated Experiences

- 🚣 **Bioluminescent Kayak** — paddle through a glowing lagoon at night
- 🔭 **Stargazing Observatory** — guided constellation tour with a resident astronomer
- 🤿 **Private Coral Dive** — guided dive through Andaman's coral cathedrals
- 🐢 **Sea Turtle Conservation** — witness olive ridley hatchlings reach the sea *(seasonal: Nov–Mar)*
- 🌿 **Andaman Rainforest Trek** — dawn trek with a naturalist guide

---

## 🔒 Production Checklist

Before deploying to a live server:

- [ ] Change `DB_USER` and `DB_PASS` in `config.php`
- [ ] Update `SITE_URL` to your live domain
- [ ] Configure `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` for email delivery
- [ ] Restrict `CORS_ORIGIN` to your domain (currently set to `*`)
- [ ] Remove `DB_PASS` from version control (use environment variables)
- [ ] Enable HTTPS on the server
- [ ] Consider rate-limiting the API endpoints

---

## 📸 Image Credits

All imagery used in this project is for **design demonstration purposes only**. Replace with licensed or original photography before any commercial use.

---

## 📁 Key Scripts Reference

| File | Purpose |
|---|---|
| `js/starfield.js` | Canvas particle system — renders and animates the hero starfield |
| `js/merlune-main.js` | Scroll effects, sticky nav, moon phase calculation, gallery strip |
| `js/merlune-booking.js` | Booking form wizard — date validation, pricing, availability API calls |
| `js/gallery.js` | Gallery lightbox, keyboard navigation, filter by category |
| `api/availability.php` | Queries `bookings` table for date conflicts for a chosen villa |
| `api/create-booking.php` | Validates full booking payload, checks availability again server-side, writes record |
| `includes/functions.php` | `sanitize()`, `isValidEmail()`, `calculateNights()`, `isFullMoonPeriod()`, `generateBookingRef()` |

---

## 📄 License

This project is for **educational and portfolio purposes**. The Merlune brand, concept, and all associated content are fictional and original.

---

<p align="center">
  <em>☽ Merlune — a night-sky sanctuary of overwater villas, moonlit dining, and holistic wellness, cradled by the Andaman Sea. ☽</em>
</p>
