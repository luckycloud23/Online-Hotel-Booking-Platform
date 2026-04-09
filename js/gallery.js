/* ============================================
   GALLERY — Masonry filters & Lightbox
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // --- Category Filters ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            masonryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.4s ease';
                        item.style.opacity = '1';
                    });
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!lightbox) return;

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
        return Array.from(masonryItems).filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        visibleItems = getVisibleItems();
        currentIndex = index;
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.masonry-caption span');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
    }

    // Click on masonry items
    masonryItems.forEach((item, i) => {
        item.addEventListener('click', () => {
            visibleItems = getVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
});
