// Portfolio Pages JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Image loading animation
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    galleryImages.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Optional: Lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });
});

// Lightbox functionality
// Store lightbox styles globally to prevent re-adding on each open
let lightboxStylesAdded = false;

function openLightbox(imageSrc, imageAlt) {
    // Create lightbox overlay programmatically (prevents XSS)
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image lightbox');

    // Create lightbox content
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';

    // Create image element with properly set attributes
    const img = document.createElement('img');
    img.src = imageSrc; // Safely set as property
    img.alt = imageAlt; // Safely set as property

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close lightbox');
    closeButton.setAttribute('type', 'button');

    // Assemble lightbox structure
    lightboxContent.appendChild(img);
    lightboxContent.appendChild(closeButton);
    lightbox.appendChild(lightboxContent);

    // Add lightbox styles only once
    if (!lightboxStylesAdded) {
        const lightboxStyles = document.createElement('style');
        lightboxStyles.id = 'lightbox-styles';
        lightboxStyles.textContent = `
            .lightbox-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .lightbox-overlay.active {
                opacity: 1;
            }

            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }

            .lightbox-content img {
                width: 100%;
                height: auto;
                border-radius: 8px;
            }

            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .lightbox-close:hover {
                color: #ccc;
            }
        `;

        document.head.appendChild(lightboxStyles);
        lightboxStylesAdded = true;
    }

    document.body.appendChild(lightbox);

    // Show lightbox
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);

    // Event handler references for cleanup
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    };

    // Close lightbox functionality with proper cleanup
    const closeLightbox = () => {
        lightbox.classList.remove('active');

        // Remove event listeners to prevent memory leaks
        document.removeEventListener('keydown', handleEscapeKey);
        lightbox.removeEventListener('click', handleOverlayClick);
        closeButton.removeEventListener('click', closeLightbox);

        setTimeout(() => {
            if (lightbox.parentNode) {
                document.body.removeChild(lightbox);
            }
        }, 300);
    };

    // Add event listeners
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscapeKey);
} 