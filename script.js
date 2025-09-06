// Perspective Paint & Design - Main JavaScript
// Encapsulated in IIFE to avoid global pollution
(function() {
    'use strict';

    // Configuration object for magic numbers
    const CONFIG = {
        ANIMATION: {
            COUNTER_DURATION: 1200,
            SLIDER_INTERVAL: 5000,
            SCROLL_OFFSET: 80,
            DEBOUNCE_DELAY: 250
        },
        BREAKPOINTS: {
            MOBILE: 480,
            TABLET: 768,
            DESKTOP: 1024,
            LARGE: 1200
        },
        VIDEO: {
            SEEK_SECONDS: 5,
            CONTROL_HIDE_DELAY: 2000
        },
        CAROUSEL: {
            TEAM_CARDS_LARGE: 4,
            TEAM_CARDS_DESKTOP: 3,
            TEAM_CARDS_TABLET: 2,
            TEAM_CARDS_MOBILE: 1
        }
    };

    // State management object
    const state = {
        gallery: {
            items: null,
            next: null,
            prev: null,
            thumbnails: null,
            countItem: 0,
            itemActive: 0,
            refreshInterval: null
        },
        team: {
            currentSlide: 0,
            grid: null,
            cards: null,
            visibleCards: CONFIG.CAROUSEL.TEAM_CARDS_LARGE
        },
        video: {
            element: null,
            control: null,
            wrapper: null,
            isDragging: false,
            hideControlsTimeout: null,
            mouseMoveHandler: null,
            mouseUpHandler: null
        },
        mobile: {
            menuBtn: null,
            navContainer: null,
            overlay: null
        }
    };

    // Utility Functions
    const utils = {
        // Debounce function for performance
        debounce: function(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        // Safe element query with null check
        safeQuery: function(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (e) {
                console.warn(`Failed to query selector: ${selector}`, e);
                return null;
            }
        },

        // Safe element query all with null check
        safeQueryAll: function(selector, parent = document) {
            try {
                return parent.querySelectorAll(selector);
            } catch (e) {
                console.warn(`Failed to query selector: ${selector}`, e);
                return [];
            }
        },

        // Format time for video player
        formatTime: function(seconds) {
            if (isNaN(seconds)) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        },

        // Easing function for animations
        easeOutQuad: function(progress) {
            return progress * (2 - progress);
        }
    };

    // Header Module
    const headerModule = {
        init: function() {
            const header = document.getElementById('header');
            if (!header) return;

            window.addEventListener('scroll', utils.debounce(function() {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 10));
        }
    };

    // Mobile Menu Module
    const mobileMenuModule = {
        init: function() {
            state.mobile.menuBtn = utils.safeQuery('.mobile-menu-btn');
            state.mobile.navContainer = utils.safeQuery('.nav-container');
            const body = document.body;

            if (!state.mobile.menuBtn || !state.mobile.navContainer) return;

            // Create overlay
            state.mobile.overlay = document.createElement('div');
            state.mobile.overlay.className = 'mobile-menu-overlay';
            document.body.appendChild(state.mobile.overlay);

            // Toggle menu
            state.mobile.menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });

            // Close on overlay click
            state.mobile.overlay.addEventListener('click', () => {
                this.closeMenu();
            });

            // Close on nav link click
            const navLinks = utils.safeQueryAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= CONFIG.BREAKPOINTS.DESKTOP) {
                        this.closeMenu();
                    }
                });
            });

            // Handle resize
            window.addEventListener('resize', utils.debounce(() => {
                if (window.innerWidth > CONFIG.BREAKPOINTS.DESKTOP) {
                    this.closeMenu();
                }
            }, CONFIG.ANIMATION.DEBOUNCE_DELAY));
        },

        toggleMenu: function() {
            const btn = state.mobile.menuBtn;
            const nav = state.mobile.navContainer;
            const overlay = state.mobile.overlay;
            const body = document.body;

            if (!btn || !nav || !overlay) return;

            const isActive = btn.classList.contains('active');
            
            if (isActive) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },

        openMenu: function() {
            const btn = state.mobile.menuBtn;
            const nav = state.mobile.navContainer;
            const overlay = state.mobile.overlay;
            const body = document.body;

            if (!btn || !nav || !overlay) return;

            btn.classList.add('active');
            nav.classList.add('active');
            overlay.classList.add('active');
            body.classList.add('menu-open');

            // Animate hamburger
            const spans = btn.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            }
        },

        closeMenu: function() {
            const btn = state.mobile.menuBtn;
            const nav = state.mobile.navContainer;
            const overlay = state.mobile.overlay;
            const body = document.body;

            if (!btn || !nav || !overlay) return;

            btn.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');

            // Reset hamburger
            const spans = btn.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    };

    // Smooth Scroll Module
    const smoothScrollModule = {
        init: function() {
            // Handle anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    
                    if (targetId === '#top' || targetId === '#') {
                        window.scrollTo({ 
                            top: 0, 
                            behavior: 'smooth' 
                        });
                    } else {
                        const target = document.querySelector(targetId);
                        if (target) {
                            const targetPosition = target.offsetTop - CONFIG.ANIMATION.SCROLL_OFFSET;
                            window.scrollTo({ 
                                top: targetPosition, 
                                behavior: 'smooth' 
                            });
                        }
                    }
                });
            });

            // Logo click handler
            const logoLink = document.getElementById('logoLink');
            if (logoLink) {
                logoLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.scrollTo({ 
                        top: 0, 
                        behavior: 'smooth' 
                    });
                });
            }
        }
    };

    // Video Player Module
    const videoPlayerModule = {
        init: function() {
            state.video.element = document.getElementById('heroVideo');
            state.video.control = document.getElementById('videoControl');
            state.video.wrapper = utils.safeQuery('.hero-video-wrapper');
            
            if (!state.video.element || !state.video.control || !state.video.wrapper) return;

            this.setupVideo();
            this.setupControls();
            this.setupProgressBar();
            this.setupKeyboardControls();
        },

        setupVideo: function() {
            const video = state.video.element;
            
            // Load video
            video.load();
            
            // Try to play when ready
            video.addEventListener('canplay', () => {
                video.play().catch(err => {
                    console.log('Auto-play prevented:', err);
                    this.showPlayButton();
                });
            }, { once: true });
        },

        setupControls: function() {
            const video = state.video.element;
            const control = state.video.control;
            
            control.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePlayPause();
            });
        },

        togglePlayPause: function() {
            const video = state.video.element;
            const control = state.video.control;
            const icon = control.querySelector('i');
            
            if (!video || !control || !icon) return;
            
            if (video.paused) {
                video.play().then(() => {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                }).catch(err => {
                    console.error('Failed to play video:', err);
                    this.showError('Unable to play video');
                });
            } else {
                video.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        },

        setupProgressBar: function() {
            const wrapper = state.video.wrapper;
            const video = state.video.element;
            
            // Create controls container
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'video-controls-container';
            controlsContainer.innerHTML = `
                <div class="video-progress-bar" role="slider" aria-label="Video progress" aria-valuemin="0" aria-valuemax="100">
                    <div class="video-progress-filled"></div>
                    <div class="video-progress-handle" role="button" aria-label="Seek video"></div>
                </div>
                <div class="video-time">
                    <span class="current-time">0:00</span> / <span class="total-time">0:00</span>
                </div>
            `;
            wrapper.appendChild(controlsContainer);
            
            const progressBar = controlsContainer.querySelector('.video-progress-bar');
            const progressFilled = controlsContainer.querySelector('.video-progress-filled');
            const progressHandle = controlsContainer.querySelector('.video-progress-handle');
            const currentTimeSpan = controlsContainer.querySelector('.current-time');
            const totalTimeSpan = controlsContainer.querySelector('.total-time');
            
            // Update progress
            video.addEventListener('timeupdate', () => {
                const percent = (video.currentTime / video.duration) * 100;
                if (progressFilled) progressFilled.style.width = percent + '%';
                if (progressHandle) progressHandle.style.left = percent + '%';
                if (currentTimeSpan) currentTimeSpan.textContent = utils.formatTime(video.currentTime);
                if (progressBar) progressBar.setAttribute('aria-valuenow', Math.round(percent));
            });
            
            // Set duration
            video.addEventListener('loadedmetadata', () => {
                if (totalTimeSpan) totalTimeSpan.textContent = utils.formatTime(video.duration);
                if (progressBar) progressBar.setAttribute('aria-valuemax', Math.round(video.duration));
            });
            
            // Click to seek
            if (progressBar) {
                progressBar.addEventListener('click', (e) => {
                    const rect = progressBar.getBoundingClientRect();
                    const percent = ((e.clientX - rect.left) / rect.width);
                    video.currentTime = percent * video.duration;
                });
            }
            
            // Drag functionality
            if (progressHandle) {
                this.setupDragHandlers(progressHandle, progressBar);
            }
            
            // Show/hide controls
            this.setupControlVisibility(wrapper, controlsContainer, video);
        },

        setupDragHandlers: function(handle, progressBar) {
            const video = state.video.element;
            
            handle.addEventListener('mousedown', (e) => {
                state.video.isDragging = true;
                e.preventDefault();
            });
            
            // Create handlers that can be removed later
            state.video.mouseMoveHandler = (e) => {
                if (state.video.isDragging && progressBar && video) {
                    const rect = progressBar.getBoundingClientRect();
                    let percent = ((e.clientX - rect.left) / rect.width);
                    percent = Math.max(0, Math.min(1, percent));
                    video.currentTime = percent * video.duration;
                }
            };
            
            state.video.mouseUpHandler = () => {
                state.video.isDragging = false;
            };
            
            document.addEventListener('mousemove', state.video.mouseMoveHandler);
            document.addEventListener('mouseup', state.video.mouseUpHandler);
        },

        setupControlVisibility: function(wrapper, controlsContainer, video) {
            wrapper.addEventListener('mouseenter', () => {
                controlsContainer.classList.add('visible');
                clearTimeout(state.video.hideControlsTimeout);
            });
            
            wrapper.addEventListener('mouseleave', () => {
                state.video.hideControlsTimeout = setTimeout(() => {
                    if (!video.paused) {
                        controlsContainer.classList.remove('visible');
                    }
                }, CONFIG.VIDEO.CONTROL_HIDE_DELAY);
            });
            
            video.addEventListener('pause', () => {
                controlsContainer.classList.add('visible');
            });
            
            video.addEventListener('play', () => {
                setTimeout(() => {
                    if (!wrapper.matches(':hover')) {
                        controlsContainer.classList.remove('visible');
                    }
                }, CONFIG.VIDEO.CONTROL_HIDE_DELAY);
            });
        },

        setupKeyboardControls: function() {
            document.addEventListener('keydown', (e) => {
                const video = state.video.element;
                const control = state.video.control;
                
                if (!video) return;
                
                const rect = video.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (inView) {
                    switch(e.key) {
                        case ' ':
                            e.preventDefault();
                            if (control) control.click();
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            video.currentTime = Math.max(0, video.currentTime - CONFIG.VIDEO.SEEK_SECONDS);
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            video.currentTime = Math.min(video.duration, video.currentTime + CONFIG.VIDEO.SEEK_SECONDS);
                            break;
                    }
                }
            });
        },

        showPlayButton: function() {
            const control = state.video.control;
            if (control) {
                const icon = control.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            }
        },

        showError: function(message) {
            console.error(message);
            // Could add user-facing error display here
        },

        cleanup: function() {
            // Remove event listeners to prevent memory leaks
            if (state.video.mouseMoveHandler) {
                document.removeEventListener('mousemove', state.video.mouseMoveHandler);
            }
            if (state.video.mouseUpHandler) {
                document.removeEventListener('mouseup', state.video.mouseUpHandler);
            }
            clearTimeout(state.video.hideControlsTimeout);
        }
    };

    // Gallery Slider Module
    const galleryModule = {
        init: function() {
            state.gallery.items = utils.safeQueryAll('.slider .list .item');
            state.gallery.next = document.getElementById('next');
            state.gallery.prev = document.getElementById('prev');
            state.gallery.thumbnails = utils.safeQueryAll('.thumbnail .item');
            state.gallery.countItem = state.gallery.items.length;
            
            if (state.gallery.countItem === 0 || !state.gallery.next || !state.gallery.prev) return;
            
            this.setupControls();
            this.setupThumbnails();
            this.startAutoPlay();
        },

        setupControls: function() {
            state.gallery.next.onclick = () => {
                state.gallery.itemActive = (state.gallery.itemActive + 1) % state.gallery.countItem;
                this.showSlider();
            };
            
            state.gallery.prev.onclick = () => {
                state.gallery.itemActive = state.gallery.itemActive - 1;
                if (state.gallery.itemActive < 0) {
                    state.gallery.itemActive = state.gallery.countItem - 1;
                }
                this.showSlider();
            };
        },

        setupThumbnails: function() {
            state.gallery.thumbnails.forEach((thumbnail, index) => {
                thumbnail.addEventListener('click', () => {
                    state.gallery.itemActive = index;
                    this.showSlider();
                });
            });
        },

        showSlider: function() {
            // Remove old active
            const itemActiveOld = utils.safeQuery('.slider .list .item.active');
            const thumbnailActiveOld = utils.safeQuery('.thumbnail .item.active');
            if (itemActiveOld) itemActiveOld.classList.remove('active');
            if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');
            
            // Add new active
            if (state.gallery.items[state.gallery.itemActive]) {
                state.gallery.items[state.gallery.itemActive].classList.add('active');
            }
            if (state.gallery.thumbnails[state.gallery.itemActive]) {
                state.gallery.thumbnails[state.gallery.itemActive].classList.add('active');
            }
            
            // Reset auto play
            this.resetAutoPlay();
        },

        startAutoPlay: function() {
            state.gallery.refreshInterval = setInterval(() => {
                if (state.gallery.next) state.gallery.next.click();
            }, CONFIG.ANIMATION.SLIDER_INTERVAL);
        },

        resetAutoPlay: function() {
            clearInterval(state.gallery.refreshInterval);
            this.startAutoPlay();
        },

        cleanup: function() {
            clearInterval(state.gallery.refreshInterval);
        }
    };

    // Team Carousel Module
    const teamCarouselModule = {
        init: function() {
            state.team.grid = document.getElementById('teamGrid');
            state.team.cards = utils.safeQueryAll('.team-card');
            
            if (!state.team.grid || state.team.cards.length === 0) return;
            
            this.setupControls();
            this.setupCardInteractions();
            this.updateView();
            
            // Handle resize with debounce
            window.addEventListener('resize', utils.debounce(() => {
                this.updateView();
            }, CONFIG.ANIMATION.DEBOUNCE_DELAY));
        },

        setupControls: function() {
            const next = document.getElementById('teamNext');
            const prev = document.getElementById('teamPrev');
            
            if (next) {
                next.addEventListener('click', () => {
                    const maxSlides = this.getMaxSlides() - 1;
                    state.team.currentSlide = (state.team.currentSlide + 1) > maxSlides ? 0 : state.team.currentSlide + 1;
                    this.updateView();
                });
            }
            
            if (prev) {
                prev.addEventListener('click', () => {
                    const maxSlides = this.getMaxSlides() - 1;
                    state.team.currentSlide = state.team.currentSlide - 1 < 0 ? maxSlides : state.team.currentSlide - 1;
                    this.updateView();
                });
            }
        },

        setupCardInteractions: function() {
            state.team.cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (window.innerWidth <= CONFIG.BREAKPOINTS.TABLET) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleCard(card);
                    }
                });
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= CONFIG.BREAKPOINTS.TABLET) {
                    if (!e.target.closest('.team-card')) {
                        this.closeAllCards();
                    }
                }
            });
        },

        toggleCard: function(card) {
            const isActive = card.classList.contains('active-mobile');
            this.closeAllCards();
            if (!isActive) {
                card.classList.add('active-mobile');
            }
        },

        closeAllCards: function() {
            state.team.cards.forEach(card => {
                card.classList.remove('active-mobile');
            });
        },

        getVisibleCards: function() {
            const width = window.innerWidth;
            if (width > CONFIG.BREAKPOINTS.LARGE) return CONFIG.CAROUSEL.TEAM_CARDS_LARGE;
            if (width > CONFIG.BREAKPOINTS.TABLET) return CONFIG.CAROUSEL.TEAM_CARDS_DESKTOP;
            if (width > CONFIG.BREAKPOINTS.MOBILE) return CONFIG.CAROUSEL.TEAM_CARDS_TABLET;
            return CONFIG.CAROUSEL.TEAM_CARDS_MOBILE;
        },

        getMaxSlides: function() {
            return Math.ceil(state.team.cards.length / this.getVisibleCards());
        },

        updateView: function() {
            state.team.visibleCards = this.getVisibleCards();
            const maxSlides = this.getMaxSlides();
            
            // Update dots
            this.updateDots(maxSlides);
            
            // Update position
            const offset = -(state.team.currentSlide * 100);
            if (state.team.grid) {
                state.team.grid.style.transform = `translateX(${offset}%)`;
            }
        },

        updateDots: function(maxSlides) {
            const dotsContainer = document.getElementById('teamDots');
            if (!dotsContainer) return;
            
            dotsContainer.innerHTML = '';
            for (let i = 0; i < maxSlides; i++) {
                const dot = document.createElement('button');
                dot.className = i === state.team.currentSlide ? 'team-dot active' : 'team-dot';
                dot.setAttribute('aria-label', `Go to team slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    state.team.currentSlide = i;
                    this.updateView();
                });
                dotsContainer.appendChild(dot);
            }
        }
    };

    // Testimonial Module
    const testimonialModule = {
        init: function() {
            this.initializeReadMore();
            this.initializeMobileCarousel();
        },

        initializeReadMore: function() {
            const testimonials = utils.safeQueryAll('.testimonial-text');
            
            testimonials.forEach(testimonial => {
                const fullText = testimonial.textContent.trim();
                const sentences = fullText.match(/[^\.!?]+[\.!?]+/g) || [fullText];
                
                if (sentences.length > 2) {
                    const previewText = sentences.slice(0, 2).join('').trim();
                    const remainingText = sentences.slice(2).join('').trim();
                    
                    const previewSpan = document.createElement('span');
                    previewSpan.className = 'testimonial-preview';
                    previewSpan.textContent = previewText;
                    
                    const moreSpan = document.createElement('span');
                    moreSpan.className = 'testimonial-more';
                    moreSpan.style.display = 'none';
                    moreSpan.textContent = ' ' + remainingText;
                    
                    const readMoreBtn = document.createElement('button');
                    readMoreBtn.className = 'read-more-btn';
                    readMoreBtn.textContent = ' Read more';
                    readMoreBtn.setAttribute('aria-expanded', 'false');
                    readMoreBtn.setAttribute('aria-label', 'Read more testimonial text');
                    
                    readMoreBtn.onclick = function() {
                        const isExpanded = moreSpan.style.display !== 'none';
                        moreSpan.style.display = isExpanded ? 'none' : 'inline';
                        readMoreBtn.textContent = isExpanded ? ' Read more' : ' Read less';
                        readMoreBtn.setAttribute('aria-expanded', !isExpanded);
                    };
                    
                    testimonial.innerHTML = '';
                    testimonial.appendChild(previewSpan);
                    testimonial.appendChild(moreSpan);
                    testimonial.appendChild(readMoreBtn);
                }
            });
        },

        initializeMobileCarousel: function() {
            const reviewCards = utils.safeQueryAll('.testimonial-card');
            const reviewNext = document.getElementById('reviewNext');
            const reviewPrev = document.getElementById('reviewPrev');
            const reviewDotsContainer = document.getElementById('reviewDots');
            
            if (reviewCards.length === 0 || !reviewNext || !reviewPrev || !reviewDotsContainer) return;
            
            let currentReview = 0;
            
            const createDots = () => {
                reviewDotsContainer.innerHTML = '';
                for (let i = 0; i < reviewCards.length; i++) {
                    const dot = document.createElement('button');
                    dot.className = i === currentReview ? 'review-dot active' : 'review-dot';
                    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
                    dot.addEventListener('click', () => showReview(i));
                    reviewDotsContainer.appendChild(dot);
                }
            };
            
            const showReview = (index) => {
                reviewCards.forEach(card => card.classList.remove('active'));
                const dots = reviewDotsContainer.querySelectorAll('.review-dot');
                dots.forEach(dot => dot.classList.remove('active'));
                
                currentReview = index;
                if (reviewCards[currentReview]) reviewCards[currentReview].classList.add('active');
                if (dots[currentReview]) dots[currentReview].classList.add('active');
                
                reviewPrev.disabled = currentReview === 0;
                reviewNext.disabled = currentReview === reviewCards.length - 1;
            };
            
            reviewNext.addEventListener('click', () => {
                if (currentReview < reviewCards.length - 1) {
                    showReview(currentReview + 1);
                }
            });
            
            reviewPrev.addEventListener('click', () => {
                if (currentReview > 0) {
                    showReview(currentReview - 1);
                }
            });
            
            const initMobileReviews = () => {
                if (window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE) {
                    createDots();
                    showReview(0);
                } else {
                    reviewCards.forEach(card => card.classList.add('active'));
                }
            };
            
            initMobileReviews();
            
            window.addEventListener('resize', utils.debounce(() => {
                initMobileReviews();
            }, CONFIG.ANIMATION.DEBOUNCE_DELAY));
        }
    };

    // Color Picker Module
    const colorPickerModule = {
        init: function() {
            const colorOptions = utils.safeQueryAll('.color-option');
            const colorPreview = document.getElementById('colorPreview');
            const customColorPicker = document.getElementById('customColorPicker');
            const customColorValue = document.getElementById('customColorValue');
            
            // Preset colors
            if (colorOptions.length > 0 && colorPreview) {
                colorOptions.forEach(option => {
                    option.addEventListener('click', function() {
                        const color = this.getAttribute('data-color');
                        colorPreview.style.backgroundColor = color;
                        colorPreview.innerHTML = `<span class="color-preview-label">${color}</span>`;
                        colorOptions.forEach(opt => opt.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
            }
            
            // Custom color picker
            if (customColorPicker && customColorValue && colorPreview) {
                customColorPicker.addEventListener('input', function(e) {
                    const selectedColor = e.target.value;
                    colorPreview.style.backgroundColor = selectedColor;
                    colorPreview.innerHTML = `<span class="color-preview-label">${selectedColor.toUpperCase()}</span>`;
                    customColorValue.textContent = selectedColor.toUpperCase();
                    colorOptions.forEach(opt => opt.classList.remove('active'));
                });
                
                customColorValue.textContent = customColorPicker.value.toUpperCase();
            }
        }
    };

    // Counter Animation Module
    const counterModule = {
        init: function() {
            const counters = [
                { selector: '.about-badge .number', value: 1000, suffix: '+' },
                { selector: '.about-stats .stat:nth-child(1) .stat-number', value: 1000, suffix: '+' },
                { selector: '.about-stats .stat:nth-child(2) .stat-number', value: 15, suffix: '+' },
                { selector: '.about-stats .stat:nth-child(3) .stat-number', value: 100, suffix: '%' }
            ];
            
            const observerOptions = {
                threshold: 0.5,
                rootMargin: '0px'
            };
            
            const animatedElements = new Set();
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                        animatedElements.add(entry.target);
                        const counterInfo = counters.find(c => entry.target.matches(c.selector));
                        if (counterInfo) {
                            this.animateCounter(entry.target, 0, counterInfo.value, CONFIG.ANIMATION.COUNTER_DURATION, counterInfo.suffix);
                        }
                    }
                });
            }, observerOptions);
            
            counters.forEach(counter => {
                const element = utils.safeQuery(counter.selector);
                if (element) {
                    element.textContent = '0' + counter.suffix;
                    observer.observe(element);
                }
            });
        },

        animateCounter: function(element, start, end, duration, suffix = '') {
            let startTime = null;
            
            const animation = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentValue = Math.floor(utils.easeOutQuad(progress) * (end - start) + start);
                
                element.textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    element.textContent = end + suffix;
                }
            };
            
            requestAnimationFrame(animation);
        }
    };

    // Main initialization
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all modules
        headerModule.init();
        mobileMenuModule.init();
        smoothScrollModule.init();
        videoPlayerModule.init();
        galleryModule.init();
        teamCarouselModule.init();
        testimonialModule.init();
        colorPickerModule.init();
        counterModule.init();
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        videoPlayerModule.cleanup();
        galleryModule.cleanup();
    });

})();