/* MERLUNE BOOKING WIZARD
   Topic: JavaScript: event handling
   Topic: JavaScript: form validation using DOM */
document.addEventListener('DOMContentLoaded', () => {

    const steps = [1, 2, 3, 4];
    let currentStep = 1;

    // --- Selection helpers ---
    const bCheckin = document.getElementById('booking-checkin');
    const bCheckout = document.getElementById('booking-checkout');

    // --- Read URL params to pre-select villa ---
    const urlParams = new URLSearchParams(window.location.search);
    const preVilla = urlParams.get('villa');
    if (preVilla) {
        const radio = document.querySelector(`input[name="villa"][value="${preVilla}"]`);
        if (radio) radio.checked = true;
    }

    // --- Initialize Flatpickr ---
    if (typeof flatpickr !== 'undefined' && bCheckin && bCheckout) {
        const fpConfig = {
            dateFormat: "Y-m-d",
            minDate: "today",
            theme: "dark",
            disableMobile: "true"
        };
        
        flatpickr(bCheckin, {
            ...fpConfig,
            onChange: function(selectedDates, dateStr, instance) {
                checkoutFp.set('minDate', selectedDates[0].fp_incr(1));
            }
        });
        
        const checkoutFp = flatpickr(bCheckout, fpConfig);
    }

    // --- Step Navigation ---
    function showStep(step) {
        steps.forEach(s => {
            const el = document.getElementById(`booking-step-${s}`);
            if (el) el.hidden = (s !== step);
        });
        // Update progress
        document.querySelectorAll('.progress-step').forEach(ps => {
            const s = parseInt(ps.dataset.step);
            ps.classList.remove('active', 'completed');
            if (s === step) ps.classList.add('active');
            if (s < step) ps.classList.add('completed');
        });
        currentStep = step;
        window.scrollTo({ top: document.getElementById('booking-section').offsetTop - 100, behavior: 'smooth' });
    }

    // Next buttons
    document.querySelectorAll('.booking-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = parseInt(btn.dataset.next);
            if (currentStep === 1 && !validateStep1()) return;

            /* JavaScript: form validation using DOM */
            if (currentStep === 3 && !window.validateForm('booking-step-3')) {
                alert('Please fill in all required guest details.');
                return;
            }

            if (next === 4) populateSummary();
            showStep(next);
        });
    });

    // Prev buttons
    document.querySelectorAll('.booking-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            showStep(parseInt(btn.dataset.prev));
        });
    });

    // --- Step 1 Validation ---
    function validateStep1() {
        const checkin = document.getElementById('booking-checkin');
        const checkout = document.getElementById('booking-checkout');
        const guests = document.getElementById('booking-guests');
        const villa = document.querySelector('input[name="villa"]:checked');

        if (!checkin || !checkin.value) { alert('Please select a check-in date.'); return false; }
        if (!checkout || !checkout.value) { alert('Please select a check-out date.'); return false; }
        if (new Date(checkout.value) <= new Date(checkin.value)) { alert('Check-out must be after check-in.'); return false; }
        if (!guests || !guests.value) { alert('Please select number of guests.'); return false; }
        if (!villa) { alert('Please select a villa.'); return false; }

        return true;
    }

    // Removed manual date field sync in favor of Flatpickr logic
    

    // --- Populate Summary ---
    function populateSummary() {
        const villa = document.querySelector('input[name="villa"]:checked');
        const villaNames = {
            'lagoon-water-villa': 'Lagoon Water Villa',
            'ocean-pavilion-suite': 'Ocean Pavilion Suite',
            'garden-sanctuary-villa': 'Garden Sanctuary Villa',
            'coral-beach-suite': 'Coral Beach Suite',
            'presidential-estate': 'Presidential Estate',
            'moonlight-forest-villa': 'Moonlight Forest Villa',
            'starlight-cove-villa': 'Starlight Cove Villa',
            'astral-overwater-suite': 'The Astral Overwater Suite',
            'indigo-pavilion': 'The Indigo Pavilion'
        };

        const checkin = document.getElementById('booking-checkin').value;
        const checkout = document.getElementById('booking-checkout').value;
        const guests = document.getElementById('booking-guests');
        const firstName = document.getElementById('guest-first-name');
        const lastName = document.getElementById('guest-last-name');
        const email = document.getElementById('guest-email');

        document.getElementById('summary-villa').textContent = villa ? villaNames[villa.value] || villa.value : '—';
        document.getElementById('summary-checkin').textContent = checkin ? new Date(checkin).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '—';
        document.getElementById('summary-checkout').textContent = checkout ? new Date(checkout).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '—';
        document.getElementById('summary-guests').textContent = guests ? guests.options[guests.selectedIndex].text : '—';
        document.getElementById('summary-name').textContent = (firstName && lastName) ? `${firstName.value} ${lastName.value}` : '—';
        document.getElementById('summary-email').textContent = email ? email.value : '—';

        // Add-ons
        const addonsContainer = document.getElementById('summary-addons');
        const checkedAddons = document.querySelectorAll('input[name="addon"]:checked');
        if (checkedAddons.length === 0) {
            addonsContainer.innerHTML = '<p class="summary-empty">No add-ons selected</p>';
        } else {
            addonsContainer.innerHTML = '';
            checkedAddons.forEach(addon => {
                const card = addon.closest('.addon-card');
                const name = card.querySelector('strong').textContent;
                const price = card.querySelector('.addon-price').textContent;
                const row = document.createElement('div');
                row.className = 'summary-row';
                row.innerHTML = `<span>${name}</span><span>${price}</span>`;
                addonsContainer.appendChild(row);
            });
        }
    }

    // --- Confirm Booking (sends to API + WhatsApp redirect) ---
    const confirmBtn = document.getElementById('booking-confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Preparing Your Request...';

            const villaInput = document.querySelector('input[name="villa"]:checked');
            const addons = Array.from(document.querySelectorAll('input[name="addon"]:checked')).map(a => a.closest('.addon-card').querySelector('strong').textContent);

            const villaNames = {
                'lagoon-water-villa': 'Lagoon Water Villa',
                'ocean-pavilion-suite': 'Ocean Pavilion Suite',
                'garden-sanctuary-villa': 'Garden Sanctuary Villa',
                'coral-beach-suite': 'Coral Beach Suite',
                'presidential-estate': 'Presidential Estate',
                'moonlight-forest-villa': 'Moonlight Forest Villa',
                'starlight-cove-villa': 'Starlight Cove Villa',
                'astral-overwater-suite': 'The Astral Overwater Suite',
                'indigo-pavilion': 'The Indigo Pavilion'
            };

            const data = {
                villa: villaInput ? villaInput.value : '',
                villa_name: villaInput ? villaNames[villaInput.value] : 'Unknown Villa',
                checkin: document.getElementById('booking-checkin').value,
                checkout: document.getElementById('booking-checkout').value,
                guests: document.getElementById('booking-guests').value,
                first_name: document.getElementById('guest-first-name').value,
                last_name: document.getElementById('guest-last-name').value,
                email: document.getElementById('guest-email').value,
                phone: document.getElementById('guest-phone').value,
                requests: document.getElementById('guest-requests').value,
                addons: addons
            };

            // 1. Construct WhatsApp Message
            let waMessage = `*RESERVATION REQUEST*\n`;
            waMessage += `☽ *Merlune Resort, Andaman*\n`;
            waMessage += `---------------------------\n`;
            waMessage += `*Guest:* ${data.first_name} ${data.last_name}\n`;
            waMessage += `*Villa:* ${data.villa_name}\n`;
            waMessage += `*Stay:* ${data.checkin} to ${data.checkout}\n`;
            waMessage += `*Guests:* ${data.guests}\n`;
            if (addons.length > 0) waMessage += `*Add-ons:* ${addons.join(', ')}\n`;
            if (data.requests) waMessage += `*Personal Requests:* ${data.requests}\n`;
            waMessage += `---------------------------\n`;
            waMessage += `Please confirm availability for these dates.`;

            const encodedMsg = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/911234567890?text=${encodedMsg}`;

            // 2. Submit to API (Record in DB)
            try {
                const response = await fetch('api/create-booking.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                // We'll redirect to WhatsApp regardless if the network allows, 
                // but we check for a valid response.
                const result = await response.json();
                
                if (result.success || response.ok) {
                    confirmBtn.textContent = 'Redirecting to WhatsApp...';
                    setTimeout(() => {
                        window.location.href = waUrl;
                    }, 800);
                } else {
                    alert('Note: Reservation recorded but there was a sync issue. Redirecting to WhatsApp Concierge now.');
                    window.location.href = waUrl;
                }
            } catch (err) {
                // If API fails (e.g. local XAMPP not running), still allow WhatsApp redirect
                console.error('API Error:', err);
                window.location.href = waUrl;
            }
        });
    }
});
