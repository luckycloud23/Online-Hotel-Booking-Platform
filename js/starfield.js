/* ============================================
   STARFIELD.JS — Animated Canvas Star Background
   ============================================
   This script creates an animated night sky on the
   homepage hero section's <canvas> element.
   
   Features:
   - 120 twinkling stars at random positions
   - Stars pulse in opacity (twinkle effect)
   - Occasional shooting stars streak diagonally 
     with a fading gradient trail
   - Canvas auto-resizes with the browser window
   
   Used on: index.html (hero section)
   Target element: <canvas id="starfield-canvas">
   ============================================ */

(function() {
    // Find the canvas element — exit if not on this page
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 120;           // Total number of twinkling stars
    const SHOOTING_STAR_CHANCE = 0.001; // Probability per frame of spawning a shooting star


    /* ── RESIZE ──
       Match the canvas pixel dimensions to its 
       parent container (the hero section). Called 
       on init and on window resize events.
       ─────────────────────────────────────────── */
    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }


    /* ── CREATE STAR ──
       Generates a single star object with random 
       position, radius (0.3–1.8px), initial opacity 
       (0.2–1.0), and twinkle speed/direction.
       ─────────────────────────────────────────── */
    function createStar() {
        return {
            x: Math.random() * canvas.width,     // Horizontal position
            y: Math.random() * canvas.height,     // Vertical position
            r: Math.random() * 1.5 + 0.3,         // Radius in pixels
            alpha: Math.random() * 0.8 + 0.2,     // Initial opacity
            twinkleSpeed: Math.random() * 0.02 + 0.005, // How fast it fades in/out
            twinkleDir: Math.random() > 0.5 ? 1 : -1    // Start brightening or dimming
        };
    }


    /* ── INITIALIZE ──
       Sets canvas size and creates the star array.
       ─────────────────────────────────────────── */
    function init() {
        resize();
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) stars.push(createStar());
    }


    /* ── SHOOTING STAR ──
       A temporary object that streaks diagonally 
       with a gradient tail. Spawned randomly and 
       removed once it leaves the canvas or fades out.
       ─────────────────────────────────────────── */
    let shootingStar = null;

    function createShootingStar() {
        return {
            x: Math.random() * canvas.width * 0.8,   // Start in left 80% of canvas
            y: Math.random() * canvas.height * 0.3,   // Start in top 30%
            len: Math.random() * 60 + 40,              // Tail length (40–100px)
            speed: Math.random() * 6 + 4,              // Movement speed per frame
            alpha: 1,                                   // Start fully opaque
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3 // ~45° with slight variation
        };
    }


    /* ── DRAW LOOP ──
       Main animation loop running via requestAnimationFrame.
       Each frame:
       1. Clears the canvas
       2. Draws all stars with updated twinkle opacity
       3. Optionally spawns and draws a shooting star
       ─────────────────────────────────────────── */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw each twinkling star
        stars.forEach(star => {
            // Update twinkle — bounce between 0.1 and 1.0
            star.alpha += star.twinkleSpeed * star.twinkleDir;
            if (star.alpha >= 1) { star.alpha = 1; star.twinkleDir = -1; }
            if (star.alpha <= 0.1) { star.alpha = 0.1; star.twinkleDir = 1; }

            // Draw the star as a small white circle
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });

        // Randomly spawn a shooting star (if none is active)
        if (!shootingStar && Math.random() < SHOOTING_STAR_CHANCE) {
            shootingStar = createShootingStar();
        }

        // Draw and animate the shooting star
        if (shootingStar) {
            const s = shootingStar;
            // Calculate tail endpoint
            const tailX = s.x - Math.cos(s.angle) * s.len;
            const tailY = s.y - Math.sin(s.angle) * s.len;

            // Create gradient from bright head to transparent tail
            const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            // Draw the streak line
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Move the shooting star forward
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.alpha -= 0.01; // Gradually fade out

            // Remove if faded or off-screen
            if (s.alpha <= 0 || s.x > canvas.width || s.y > canvas.height) {
                shootingStar = null;
            }
        }

        requestAnimationFrame(draw);
    }


    // Re-initialize on window resize
    window.addEventListener('resize', () => { resize(); });

    // Start the animation
    init();
    draw();
})();
