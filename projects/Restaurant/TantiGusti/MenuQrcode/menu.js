/* 
   TANTI GUSTI 2 - Menu Digital 3D 
   Logic for Flipbook & Navigation
*/

let currentPage = 0;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;
const currentPageDisplay = document.getElementById('current-page');
const totalPagesDisplay = document.getElementById('total-pages');

let isResetting = false; // Verrouille le menu pendant l'animation de retour

// Initialize Z-indexes
function initPages() {
    pages.forEach((page, index) => {
        page.style.zIndex = totalPages - index;
    });
    if (totalPagesDisplay) {
        totalPagesDisplay.textContent = totalPages;
    }
    updatePageIndicator();
}

// Flip to NEXT page
function nextPage(event) {
    if (event) event.stopPropagation();
    if (isResetting) return; // Bloque le clic pendant le retour couverture
    
    if (currentPage < totalPages - 1) {
        const pageIdx = currentPage; // Capture locale de l'index
        const page = document.getElementById(`p${pageIdx}`);
        page.classList.add('flipped');
        
        // Adjust z-index after flip to ensure correct stacking
        setTimeout(() => {
            page.style.zIndex = pageIdx + 1; // Utilise la valeur capturée, pas la globale
        }, 300);
        
        currentPage++;
        updatePageIndicator();
    } else {
        // Loop back to cover
        resetBook();
    }
}

// Flip to PREVIOUS page
function prevPage(event) {
    if (event) event.stopPropagation();
    if (isResetting) return;
    
    if (currentPage > 0) {
        currentPage--;
        const pageIdx = currentPage; // Capture locale de l'index
        const page = document.getElementById(`p${pageIdx}`);
        page.classList.remove('flipped');
        
        // Restore initial z-index
        setTimeout(() => {
            page.style.zIndex = totalPages - pageIdx; // Utilise la valeur capturée
        }, 300);
        
        updatePageIndicator();
    }
}

// Reset book to cover (Loop)
function resetBook() {
    if (isResetting) return;
    isResetting = true;
    
    // Flip all pages back in reverse order for a cool effect
    let maxDelay = 0;
    for (let i = totalPages - 2; i >= 0; i--) {
        const page = document.getElementById(`p${i}`);
        const delay = (totalPages - 2 - i) * 100;
        if (delay > maxDelay) maxDelay = delay;
        
        setTimeout(() => {
            page.classList.remove('flipped');
            page.style.zIndex = totalPages - i;
        }, delay);
    }
    
    // Wait for animation to finish
    setTimeout(() => {
        currentPage = 0;
        updatePageIndicator();
        isResetting = false;
    }, maxDelay + 850); // Small buffer for safety
}

// Update the navigation bar indicator
function updatePageIndicator() {
    if (currentPageDisplay) {
        currentPageDisplay.textContent = currentPage + 1;
    }
}

/* SWIPE GESTURES */
let touchstartX = 0;
let touchendX = 0;

function handleGesture() {
    if (touchendX < touchstartX - 50) {
        nextPage();
    }
    if (touchendX > touchstartX + 50) {
        prevPage();
    }
}

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
}, { passive: true });

/* KEYBOARD NAVIGATION */
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
});

/* MODAL LOGIC */
function openProductModal(imageSrc) {
    const modal = document.getElementById('pizza-modal');
    const modalImg = document.getElementById('pizza-img');
    
    modalImg.src = imageSrc;
    modal.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('pizza-modal');
    modal.classList.remove('active');
}

// Start
initPages();
