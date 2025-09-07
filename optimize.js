// Performance Optimization Script for Perspective Paint & Design
(function() {
    'use strict';

    // 1. LAZY LOADING FOR IMAGES
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Handle regular images
                if (img.dataset.src) {
                    // Create a new image to preload
                    const tempImg = new Image();
                    tempImg.onload = function() {
                        img.src = tempImg.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                    };
                    tempImg.onerror = function() {
                        // Fallback to direct load on error
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                    };
                    tempImg.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Handle responsive images with srcset
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                    img.removeAttribute('data-srcset');
                }
                
                // Stop observing
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
    });

    // 2. LAZY LOADING FOR BACKGROUND IMAGES
    const lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const bgImage = element.dataset.bgImage;
                
                if (bgImage) {
                    element.style.backgroundImage = `url('${bgImage}')`;
                    element.removeAttribute('data-bg-image');
                    element.classList.remove('lazy-bg');
                    element.classList.add('lazy-bg-loaded');
                    observer.unobserve(element);
                }
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.01
    });

    // 3. VIDEO LAZY LOADING
    const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                
                // Load video sources
                const sources = video.querySelectorAll('source');
                sources.forEach(source => {
                    if (source.dataset.src) {
                        source.src = source.dataset.src;
                        source.removeAttribute('data-src');
                    }
                });
                
                // Load video
                video.load();
                
                // Try to play if autoplay
                if (video.hasAttribute('autoplay')) {
                    video.play().catch(err => {
                        console.log('Autoplay prevented:', err);
                    });
                }
                
                video.classList.remove('lazy-video');
                observer.unobserve(video);
            }
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0.01
    });

    // 4. PROGRESSIVE IMAGE LOADING (blur-up technique)
    function loadProgressiveImage(img) {
        const tempImg = new Image();
        
        // Load low quality first (if available)
        if (img.dataset.lowSrc) {
            img.src = img.dataset.lowSrc;
            img.classList.add('loading');
        }
        
        // Load high quality
        tempImg.onload = function() {
            img.src = tempImg.src;
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        tempImg.src = img.dataset.src || img.dataset.highSrc;
    }

    // 5. WEBP SUPPORT DETECTION AND FALLBACK
    function supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
    }

    // 6. RESOURCE PRIORITIZATION
    function prioritizeResources() {
        // Preload critical resources
        const criticalResources = [
            { href: 'media/perspective-logo-old.png', as: 'image' },
            { href: 'styles.css', as: 'style' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'font') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }

    // 7. OPTIMIZE ANIMATIONS
    function optimizeAnimations() {
        // Pause animations when not visible
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        });
        
        // Observe all animated elements
        document.querySelectorAll('.animated, .floating-shapes .shape').forEach(el => {
            animationObserver.observe(el);
        });
    }

    // 8. DEFER NON-CRITICAL CSS
    function deferNonCriticalCSS() {
        // Load Font Awesome after page load
        const fontAwesome = document.querySelector('link[href*="font-awesome"]');
        if (fontAwesome && fontAwesome.media === 'print') {
            // Already deferred
            window.addEventListener('load', () => {
                fontAwesome.media = 'all';
            });
        }
    }

    // 9. IMAGE FORMAT OPTIMIZATION
    function optimizeImageFormat() {
        const hasWebPSupport = supportsWebP();
        
        document.querySelectorAll('img[data-webp-src]').forEach(img => {
            if (hasWebPSupport) {
                img.dataset.src = img.dataset.webpSrc;
            }
        });
    }

    // 10. PERFORMANCE MONITORING
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // LCP not supported
            }
            
            // Monitor First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                // FID not supported
            }
        }
    }

    // 11. INITIALIZE ALL OPTIMIZATIONS
    function init() {
        // Note: Hero video playback is handled by script.js videoPlayerModule
        // We'll just ensure it loads with proper priority
        const heroVideo = document.getElementById('heroVideo');
        if (heroVideo) {
            // Set loading priority for hero video
            heroVideo.setAttribute('importance', 'high');
            // Ensure metadata loads immediately
            if (heroVideo.readyState === 0) {
                heroVideo.load();
            }
        }
        
        // Setup lazy loading for images with data-src
        const lazyImages = document.querySelectorAll('img.lazy, img[data-src]');
        lazyImages.forEach(img => {
            // If image has data-src, set up lazy loading
            if (img.dataset.src) {
                lazyImageObserver.observe(img);
            }
        });
        
        // For images with native lazy loading, ensure they work
        const nativeLazyImages = document.querySelectorAll('img[loading="lazy"]:not(.lazy)');
        nativeLazyImages.forEach(img => {
            // Browser handles these automatically, but we can add fallback
            if (!('loading' in HTMLImageElement.prototype)) {
                // Fallback for browsers that don't support native lazy loading
                img.classList.add('lazy');
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect fill="%23333" width="1" height="1"/%3E%3C/svg%3E';
                lazyImageObserver.observe(img);
            }
        });
        
        // Setup lazy loading for backgrounds
        const lazyBackgrounds = document.querySelectorAll('.lazy-bg, [data-bg-image]');
        lazyBackgrounds.forEach(el => {
            lazyBackgroundObserver.observe(el);
        });
        
        // Setup lazy loading for other videos (not hero)
        const lazyVideos = document.querySelectorAll('video.lazy-video:not(#heroVideo), video[data-src]:not(#heroVideo)');
        lazyVideos.forEach(video => {
            lazyVideoObserver.observe(video);
        });
        
        // Initialize other optimizations
        prioritizeResources();
        optimizeAnimations();
        deferNonCriticalCSS();
        optimizeImageFormat();
        
        // Start monitoring
        if (window.location.hostname !== 'localhost') {
            monitorPerformance();
        }
    }

    // 12. THROTTLE AND DEBOUNCE UTILITIES
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // 13. OPTIMIZE SCROLL EVENTS
    const optimizedScroll = throttle(() => {
        // Handle scroll-based operations
        const scrolled = window.pageYOffset;
        
        // Update header
        const header = document.getElementById('header');
        if (header) {
            if (scrolled > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrolled > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }, 100);

    // 14. OPTIMIZE RESIZE EVENTS  
    const optimizedResize = debounce(() => {
        // Handle resize-based operations
        // Trigger layout recalculations only when necessary
    }, 250);

    // 15. SETUP EVENT LISTENERS
    // Use both DOMContentLoaded and load to ensure everything initializes
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already loaded, initialize immediately
        init();
    }
    
    window.addEventListener('load', () => {
        // Double-check lazy images after full page load
        const lazyImages = document.querySelectorAll('img.lazy[data-src]');
        if (lazyImages.length > 0) {
            console.log('Found', lazyImages.length, 'lazy images to load');
            lazyImages.forEach(img => {
                if (img.dataset.src && !img.src.includes(img.dataset.src)) {
                    // Force load images that haven't loaded yet
                    const rect = img.getBoundingClientRect();
                    if (rect.top < window.innerHeight + 100) {
                        // Image is in or near viewport, load it now
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        img.removeAttribute('data-src');
                    }
                }
            });
        }
    });
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    window.addEventListener('resize', optimizedResize, { passive: true });
    
    // 16. PREFETCH PAGES ON HOVER
    let prefetchedUrls = new Set();
    
    function prefetchPage(url) {
        if (!prefetchedUrls.has(url)) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
            prefetchedUrls.add(url);
        }
    }
    
    // Prefetch on hover
    document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                prefetchPage(link.href);
            }, { passive: true });
        });
    });

})();