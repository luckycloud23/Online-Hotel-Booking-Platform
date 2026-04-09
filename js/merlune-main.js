/*
   MERLUNE MAIN JS
   Topic: JavaScript: event handling
   Topic: JavaScript: form validation using DOM
    */

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────────
       1. HEADER SCROLL EFFECT
       When user scrolls past 50px, the fixed 
       navigation header gets a darker, more 
       opaque background via the `.scrolled` class.
       ────────────────────────────────────────── */
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }


    /* ──────────────────────────────────────────
       2. MOBILE MENU TOGGLE
       Toggles the full-screen mobile navigation 
       overlay when the hamburger icon is clicked.
       Also locks body scroll while menu is open.
       Closes automatically when a link is tapped.
       ────────────────────────────────────────── */
    const toggle = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (toggle && overlay) {
        toggle.addEventListener('click', () => {
            overlay.classList.toggle('active');
            toggle.classList.toggle('active');
            // Lock body scroll when mobile menu is open
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        });
        // Close menu when any navigation link is clicked
        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                overlay.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    /* ──────────────────────────────────────────
       3. SMOOTH SCROLL FOR ANCHOR LINKS
       Intercepts clicks on links starting with #
       and smoothly scrolls to the target section,
       accounting for the fixed header height.
       ────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                // Read the header height from CSS variable (default 72px)
                const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
                window.scrollTo({ top: target.offsetTop - headerH - 16, behavior: 'smooth' });
            }
        });
    });


    /* ──────────────────────────────────────────
       4. SCROLL-REVEAL ANIMATIONS
       Uses IntersectionObserver to detect when 
       cards and sections enter the viewport. When 
       they do, a fade-up animation plays once.
       
       Targets: villa cards, dining cards, spa 
       treatments, experiences, policy cards, 
       section headers, and content grids.
       ────────────────────────────────────────── */
    const revealElements = document.querySelectorAll(
        '.villa-card, .dining-card, .treatment-card, .facility-card, .experience-card, ' +
        '.villa-detail-grid, .dining-detail-grid, .experience-detail-grid, .spa-preview-grid, ' +
        '.brand-story-grid, .policy-card, .private-option, .section-header'
    );
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        // Set initial hidden state and start observing
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }


    /* ──────────────────────────────────────────
       5. MOON PHASE CALCULATION
       Calculates the current lunar phase using a 
       simplified astronomical algorithm. Returns  
       one of 8 phases (new moon → waning crescent).
       
       Used in: homepage location widget, contact 
       page moon card, and booking sidebar.
       ────────────────────────────────────────── */
    function getMoonPhase() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        const day = now.getDate();

        // Adjust for Jan/Feb (treated as month 13/14 of prior year)
        if (month < 3) { year--; month += 12; }
        ++month;

        // Julian day number calculation
        const c = 365.25 * year;
        const e = 30.6 * month;
        let jd = c + e + day - 694039.09;
        jd /= 29.5305882; // Divide by synodic month length

        const b_int = parseInt(jd);
        jd -= b_int;
        let b = Math.round(jd * 8);
        if (b >= 8) b = 0;

        // 8 lunar phases with emoji and name
        const phases = [
            { emoji: '🌑', name: 'New Moon' },
            { emoji: '🌒', name: 'Waxing Crescent' },
            { emoji: '🌓', name: 'First Quarter' },
            { emoji: '🌔', name: 'Waxing Gibbous' },
            { emoji: '🌕', name: 'Full Moon' },
            { emoji: '🌖', name: 'Waning Gibbous' },
            { emoji: '🌗', name: 'Last Quarter' },
            { emoji: '🌘', name: 'Waning Crescent' }
        ];
        return phases[b];
    }

    // Update all moon phase widgets across the site
    const moonPhase = getMoonPhase();
    document.querySelectorAll('[id*="moon-emoji"], [id*="moon-icon"]').forEach(el => { el.textContent = moonPhase.emoji; });
    document.querySelectorAll('[id*="moon-phase-text"], [id*="moon-name"]').forEach(el => { el.textContent = moonPhase.name; });
    document.querySelectorAll('.moon-phase-mini').forEach(el => {
        const emoji = el.querySelector('.moon-emoji-sm');
        const text = el.querySelector('span:last-child');
        if (emoji) emoji.textContent = moonPhase.emoji;
        if (text) text.textContent = moonPhase.name;
    });


    /* ──────────────────────────────────────────
       6. GLOBAL FLATPICKR INITIALIZATION
       Applies flatpickr calendar UI to all date 
       inputs sitewide so past dates cannot be 
       selected. Also specifically handles checkin/
       checkout logic for availability forms.
       ────────────────────────────────────────── */
    if (typeof flatpickr !== 'undefined') {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 3);

        // General global date inputs (if any)
        flatpickr("input[type='date']:not(#checkin-date):not(#checkout-date), .date-input:not(#checkin-date):not(#checkout-date)", {
            minDate: "today",
            dateFormat: "Y-m-d"
        });

        // Specific Checkin/Checkout logic
        const checkinInput = document.getElementById('checkin-date');
        const checkoutInput = document.getElementById('checkout-date');

        if (checkinInput && checkoutInput) {
            let checkoutPicker = flatpickr(checkoutInput, {
                minDate: dayAfter,
                defaultDate: dayAfter,
                dateFormat: "Y-m-d"
            });

            flatpickr(checkinInput, {
                minDate: tomorrow,
                defaultDate: tomorrow,
                dateFormat: "Y-m-d",
                onChange: function(selectedDates) {
                    if (selectedDates.length > 0) {
                        const newCheckoutMin = new Date(selectedDates[0]);
                        newCheckoutMin.setDate(newCheckoutMin.getDate() + 2); // Minimum 2 nights
                        
                        checkoutPicker.set("minDate", newCheckoutMin);
                        
                        // If current checkout is before new min checkout, push it back
                        if (checkoutPicker.selectedDates.length > 0 && checkoutPicker.selectedDates[0] <= selectedDates[0]) {
                            checkoutPicker.setDate(newCheckoutMin);
                        }
                    }
                }
            });
        }
    }


    /* ──────────────────────────────────────────
       7. CUSTOM CURSOR (Desktop only)
       Creates a gold dot cursor and a larger 
       trailing ring that follows with a slight 
       delay (eased via requestAnimationFrame).
       
       The cursor enlarges when hovering over 
       interactive elements (links, buttons, cards).
       Hidden on mobile/touch devices.
       ────────────────────────────────────────── */
    if (window.matchMedia('(pointer: fine)').matches) {
        // Create cursor elements
        const curDot = document.createElement('div');
        curDot.id = 'cur-dot';
        curDot.style.cssText = 'width:6px;height:6px;background:#F3C623;border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;transition:transform .2s;';

        const curRing = document.createElement('div');
        curRing.id = 'cur-ring';
        curRing.style.cssText = 'width:32px;height:32px;border:1px solid rgba(243,198,35,.35);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9998;transition:border-color .3s,transform .3s;';

        document.body.appendChild(curDot);
        document.body.appendChild(curRing);
        document.body.style.cursor = 'none'; // Hide default cursor

        let mx = 0, my = 0, rx = 0, ry = 0;

        // Track mouse position for the dot (instant)
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            curDot.style.left = (mx - 3) + 'px';
            curDot.style.top = (my - 3) + 'px';
        });

        // Animate the ring to follow with easing
        (function ringLoop() {
            rx += (mx - rx - 16) * 0.11;
            ry += (my - ry - 16) * 0.11;
            curRing.style.left = rx + 'px';
            curRing.style.top = ry + 'px';
            requestAnimationFrame(ringLoop);
        })();

        // Enlarge cursor on interactive elements
        document.querySelectorAll('a, button, .villa-card, .dining-card, .experience-card, .treatment-card, .facility-card, .private-option, .masonry-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                curDot.style.transform = 'scale(3)';
                curRing.style.transform = 'scale(1.5)';
                curRing.style.borderColor = 'rgba(243,198,35,.65)';
            });
            el.addEventListener('mouseleave', () => {
                curDot.style.transform = '';
                curRing.style.transform = '';
                curRing.style.borderColor = 'rgba(243,198,35,.35)';
            });
        });
    }


    /* ──────────────────────────────────────────
       8. FLOATING "RESERVE" BUTTON
       A fixed-position booking CTA that appears 
       in the bottom-right corner after the user 
       scrolls past the hero section (~500px). 
       Only shown on pages without the booking wizard.
       ────────────────────────────────────────── */
    if (!document.querySelector('.booking-section')) {
        const floatBtn = document.createElement('a');
        floatBtn.href = 'booking.html';
        floatBtn.textContent = 'Reserve Your Escape';
        floatBtn.className = 'btn-primary floating-reserve-btn';
        floatBtn.style.cssText = 'position:fixed;bottom:32px;right:32px;z-index:90;box-shadow:0 8px 32px rgba(243,198,35,.3);opacity:0;transform:translateY(16px);transition:opacity .4s,transform .4s;font-size:.85rem;padding:12px 24px;';
        document.body.appendChild(floatBtn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                floatBtn.style.opacity = '1';
                floatBtn.style.transform = 'translateY(0)';
            } else {
                floatBtn.style.opacity = '0';
                floatBtn.style.transform = 'translateY(16px)';
            }
        });
    }
    /* ------------------------------------------
       9. FORM VALIDATION
       Generic form validation function used for 
       contact and booking forms.
       Topic: JavaScript: form validation using DOM
       ------------------------------------------ */
    window.validateForm = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return true;

        let isValid = true;
        const inputs = form.querySelectorAll('[required]');

        inputs.forEach(input => {
            const errorClass = 'input-error';
            if (!input.value.trim()) {
                input.classList.add(errorClass);
                isValid = false;
            } else {
                input.classList.remove(errorClass);

                // Email-specific validation
                if (input.type === 'email') {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add(errorClass);
                        isValid = false;
                    }
                }
                
                // Phone-specific validation
                if (input.type === 'tel' || input.name === 'phone') {
                    const phoneVal = input.value.replace(/\D/g, ''); // Remove non-digits
                    if (phoneVal.length < 10) {
                        input.classList.add(errorClass);
                        isValid = false;
                    }
                }
            }
        });

        return isValid;
    };
});


/* ──────────────────────────────────────────
   REVEALED CLASS INJECTION
   Injects a CSS rule for the `.revealed` class 
   used by the scroll-reveal animations above.
   When an element gets `.revealed`, it fades 
   in and slides up to its natural position.
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
});
