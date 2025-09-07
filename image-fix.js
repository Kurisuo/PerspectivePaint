// Quick fix for images not loading
(function() {
    'use strict';
    
    // Fix lazy images that haven't loaded
    function fixLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                console.log('Fixing lazy image:', img.dataset.src);
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
                img.classList.add('lazy-loaded');
            }
        });
    }
    
    // Fix background images (ensure they're loading)
    function checkBackgroundImages() {
        // Check inline style backgrounds
        const elements = document.querySelectorAll('[style*="background-image"]');
        elements.forEach(el => {
            const style = el.getAttribute('style');
            const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch) {
                const imageUrl = urlMatch[1];
                console.log('Background image found:', imageUrl);
                
                // Preload the image to ensure it loads
                const img = new Image();
                img.onload = () => console.log('Background loaded:', imageUrl);
                img.onerror = () => console.error('Background failed:', imageUrl);
                img.src = imageUrl;
            }
        });
        
        // Also check CSS-defined backgrounds
        const heroBg = document.querySelector('.hero-bg-image');
        if (heroBg) {
            // Force the background image to load
            const img = new Image();
            img.onload = () => {
                console.log('Hero background loaded: media/house_1.jpg');
                // Ensure the element is visible
                heroBg.style.display = 'block';
                heroBg.style.visibility = 'visible';
            };
            img.onerror = () => {
                console.error('Hero background failed to load');
                // Fallback to a gradient
                heroBg.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            };
            img.src = 'media/house_1.jpg';
        }
    }
    
    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            fixLazyImages();
            checkBackgroundImages();
        });
    } else {
        fixLazyImages();
        checkBackgroundImages();
    }
    
    // Also run on window load as backup
    window.addEventListener('load', () => {
        setTimeout(() => {
            fixLazyImages();
            checkBackgroundImages();
        }, 100);
    });
    
})();