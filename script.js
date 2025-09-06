// Testimonial Read More Functionality
function initializeReadMore() {
    const testimonials = document.querySelectorAll('.testimonial-text');
    
    testimonials.forEach(testimonial => {
        const fullText = testimonial.textContent.trim();
        const sentences = fullText.match(/[^\.!?]+[\.!?]+/g) || [fullText];
        
        // If more than 2 sentences, add read more functionality
        if (sentences.length > 2) {
            const previewText = sentences.slice(0, 2).join('').trim();
            const remainingText = sentences.slice(2).join('').trim();
            
            // Create elements
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
            readMoreBtn.onclick = function() {
                if (moreSpan.style.display === 'none') {
                    moreSpan.style.display = 'inline';
                    readMoreBtn.textContent = ' Read less';
                } else {
                    moreSpan.style.display = 'none';
                    readMoreBtn.textContent = ' Read more';
                }
            };
            
            // Clear and rebuild the testimonial text
            testimonial.innerHTML = '';
            testimonial.appendChild(previewSpan);
            testimonial.appendChild(moreSpan);
            testimonial.appendChild(readMoreBtn);
        }
    });
}

// Add CSS styles for video controls
const videoStyles = document.createElement('style');
videoStyles.textContent = `
    .video-controls-container {
        position: absolute;
        bottom: 70px;
        left: 20px;
        right: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 3;
    }
    
    .video-controls-container.visible {
        opacity: 1;
    }
    
    .video-progress-bar {
        position: relative;
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        cursor: pointer;
        margin-bottom: 10px;
        overflow: visible;
    }
    
    .video-progress-filled {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: var(--primary);
        border-radius: 3px;
        transition: width 0.1s linear;
        pointer-events: none;
    }
    
    .video-progress-handle {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        cursor: grab;
        transition: transform 0.2s ease;
    }
    
    .video-progress-handle:hover {
        transform: translate(-50%, -50%) scale(1.2);
    }
    
    .video-progress-handle:active {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.1);
    }
    
    .video-time {
        color: white;
        font-size: 12px;
        font-weight: 500;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        display: flex;
        gap: 5px;
    }
    
    .hero-video-wrapper:hover .video-controls-container {
        opacity: 1;
    }
    
    /* Adjust video control button position */
    .video-control {
        bottom: 20px !important;
    }
`;
document.head.appendChild(videoStyles);

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Add this to your script.js file after the existing header scroll effect code

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Read More functionality
    initializeReadMore();
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const body = document.body;
    
    // Create mobile menu overlay
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(mobileMenuOverlay);
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active classes
            this.classList.toggle('active');
            navContainer.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Animate hamburger lines
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close menu when clicking overlay
    mobileMenuOverlay.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        navContainer.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
    
    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                mobileMenuBtn.classList.remove('active');
                navContainer.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset hamburger animation
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            mobileMenuBtn.classList.remove('active');
            navContainer.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Reset hamburger animation
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (spans.length > 0) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#top' || targetId === '#') {
            // Scroll to top for logo click
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        } else {
            // Scroll to specific section
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80; // Account for fixed header
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({ 
                    top: targetPosition, 
                    behavior: 'smooth' 
                });
            }
        }
    });
});

// Special handler for logo click
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

// Video Controls - FIXED AND ENHANCED
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    const videoControl = document.getElementById('videoControl');
    const videoWrapper = document.querySelector('.hero-video-wrapper');
    
    if (video && videoControl) {
        // Start loading video immediately for faster playback
        video.load();
        
        // Try to play video as soon as possible
        video.addEventListener('canplay', function() {
            video.play().catch(err => {
                // Auto-play might be blocked by browser
                console.log('Auto-play prevented:', err);
            });
        }, { once: true });
        // Play/Pause functionality
        videoControl.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            
            if (video.paused) {
                video.play();
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                video.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
        
        // Create video progress bar and controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'video-controls-container';
        controlsContainer.innerHTML = `
            <div class="video-progress-bar">
                <div class="video-progress-filled"></div>
                <div class="video-progress-handle"></div>
            </div>
            <div class="video-time">
                <span class="current-time">0:00</span> / <span class="total-time">0:00</span>
            </div>
        `;
        videoWrapper.appendChild(controlsContainer);
        
        const progressBar = controlsContainer.querySelector('.video-progress-bar');
        const progressFilled = controlsContainer.querySelector('.video-progress-filled');
        const progressHandle = controlsContainer.querySelector('.video-progress-handle');
        const currentTimeSpan = controlsContainer.querySelector('.current-time');
        const totalTimeSpan = controlsContainer.querySelector('.total-time');
        
        // Format time helper function
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
        
        // Update progress bar as video plays
        video.addEventListener('timeupdate', function() {
            const percent = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = percent + '%';
            progressHandle.style.left = percent + '%';
            currentTimeSpan.textContent = formatTime(video.currentTime);
        });
        
        // Set total duration when metadata loads
        video.addEventListener('loadedmetadata', function() {
            totalTimeSpan.textContent = formatTime(video.duration);
        });
        
        // Click on progress bar to seek
        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width);
            video.currentTime = percent * video.duration;
        });
        
        // Drag functionality for progress handle
        let isDragging = false;
        
        progressHandle.addEventListener('mousedown', function(e) {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const rect = progressBar.getBoundingClientRect();
                let percent = ((e.clientX - rect.left) / rect.width);
                percent = Math.max(0, Math.min(1, percent)); // Clamp between 0 and 1
                video.currentTime = percent * video.duration;
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // Add keyboard controls
        document.addEventListener('keydown', function(e) {
            // Only work if video is in view
            const rect = video.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (inView) {
                switch(e.key) {
                    case ' ': // Spacebar for play/pause
                        e.preventDefault();
                        videoControl.click();
                        break;
                    case 'ArrowLeft': // Rewind 5 seconds
                        e.preventDefault();
                        video.currentTime = Math.max(0, video.currentTime - 5);
                        break;
                    case 'ArrowRight': // Forward 5 seconds
                        e.preventDefault();
                        video.currentTime = Math.min(video.duration, video.currentTime + 5);
                        break;
                }
            }
        });
        
        // Show controls on hover
        let hideControlsTimeout;
        
        videoWrapper.addEventListener('mouseenter', function() {
            controlsContainer.classList.add('visible');
            clearTimeout(hideControlsTimeout);
        });
        
        videoWrapper.addEventListener('mouseleave', function() {
            hideControlsTimeout = setTimeout(() => {
                if (!video.paused) {
                    controlsContainer.classList.remove('visible');
                }
            }, 2000);
        });
        
        // Keep controls visible when paused
        video.addEventListener('pause', function() {
            controlsContainer.classList.add('visible');
        });
        
        video.addEventListener('play', function() {
            setTimeout(() => {
                if (!videoWrapper.matches(':hover')) {
                    controlsContainer.classList.remove('visible');
                }
            }, 2000);
        });
    }
});

// Gallery Slider Functionality
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let thumbnails = document.querySelectorAll('.thumbnail .item');
let countItem = items.length;
let itemActive = 0;
let refreshInterval;

// Only initialize slider if elements exist
if (items.length > 0 && next && prev && thumbnails.length > 0) {
    // Next button click
    next.onclick = function(){
        itemActive = itemActive + 1;
        if(itemActive >= countItem){
            itemActive = 0;
        }
        showSlider();
    }

    // Previous button click
    prev.onclick = function(){
        itemActive = itemActive - 1;
        if(itemActive < 0){
            itemActive = countItem - 1;
        }
        showSlider();
    }

    // Auto play slider
    refreshInterval = setInterval(() => {
        next.click();
    }, 5000);

    function showSlider(){
        // Remove old active class
        let itemActiveOld = document.querySelector('.slider .list .item.active');
        let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
        if (itemActiveOld) itemActiveOld.classList.remove('active');
        if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

        // Add new active class
        if (items[itemActive]) items[itemActive].classList.add('active');
        if (thumbnails[itemActive]) thumbnails[itemActive].classList.add('active');
        
        // Clear and reset auto play timer
        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
            next.click();
        }, 5000);
    }

    // Click on thumbnail
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            itemActive = index;
            showSlider();
        });
    });
}

// Team Carousel
let currentTeamSlide = 0;
const teamGrid = document.getElementById('teamGrid');
const teamCards = document.querySelectorAll('.team-card');
const totalTeamMembers = teamCards.length;
const teamDots = document.querySelectorAll('.team-dot');
let visibleTeamCards = window.innerWidth > 1200 ? 4 : window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;

// Only initialize if team elements exist
if (teamGrid && teamCards.length > 0) {
    function updateTeamView() {
        visibleTeamCards = window.innerWidth > 1200 ? 4 : window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
        const maxSlides = Math.ceil(totalTeamMembers / visibleTeamCards);
        
        // Update dots
        const dotsContainer = document.getElementById('teamDots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < maxSlides; i++) {
                const dot = document.createElement('button');
                dot.className = i === currentTeamSlide ? 'team-dot active' : 'team-dot';
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', () => {
                    currentTeamSlide = i;
                    updateTeamView();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        // Update carousel position
        const offset = -(currentTeamSlide * 100);
        teamGrid.style.transform = `translateX(${offset}%)`;
    }

    const teamNext = document.getElementById('teamNext');
    const teamPrev = document.getElementById('teamPrev');
    
    if (teamNext) {
        teamNext.addEventListener('click', () => {
            const maxSlides = Math.ceil(totalTeamMembers / visibleTeamCards) - 1;
            currentTeamSlide = (currentTeamSlide + 1) > maxSlides ? 0 : currentTeamSlide + 1;
            updateTeamView();
        });
    }

    if (teamPrev) {
        teamPrev.addEventListener('click', () => {
            const maxSlides = Math.ceil(totalTeamMembers / visibleTeamCards) - 1;
            currentTeamSlide = currentTeamSlide - 1 < 0 ? maxSlides : currentTeamSlide - 1;
            updateTeamView();
        });
    }

    // Update on window resize
    window.addEventListener('resize', () => {
        updateTeamView();
    });

    // Initialize team view
    updateTeamView();
    
    // Add click functionality for mobile team cards
    teamCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only handle clicks on mobile devices
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const description = this.querySelector('.team-description');
                const isActive = this.classList.contains('active-mobile');
                
                // Close all other cards first
                teamCards.forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.classList.remove('active-mobile');
                    }
                });
                
                // Toggle current card
                if (isActive) {
                    this.classList.remove('active-mobile');
                } else {
                    this.classList.add('active-mobile');
                }
            }
        });
    });
    
    // Close team descriptions when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            // If click is not on a team card, close all descriptions
            if (!e.target.closest('.team-card')) {
                teamCards.forEach(card => {
                    card.classList.remove('active-mobile');
                });
            }
        }
    });
    
    // Reset active states on window resize
    window.addEventListener('resize', () => {
        // Remove all active states when resizing
        teamCards.forEach(card => {
            card.classList.remove('active-mobile');
        });
    });
}

// ============================================================
// TESTIMONIALS CAROUSEL CODE REMOVED 
// (Since we changed to a static 4-review display)
// ============================================================

// Color Palette Functionality
const colorOptions = document.querySelectorAll('.color-option');
const colorPreview = document.getElementById('colorPreview');

// Only initialize if color elements exist
if (colorOptions.length > 0 && colorPreview) {
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            
            // Update preview
            colorPreview.style.backgroundColor = color;
            colorPreview.innerHTML = `<span class="color-preview-label">${color}</span>`;
            
            // Update active state
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Number Counter Animation
function animateCounter(element, start, end, duration, suffix = '') {
    let startTime = null;
    const isPercentage = suffix === '%';
    
    const animation = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = progress => progress * (2 - progress);
        const currentValue = Math.floor(easeOutQuad(progress) * (end - start) + start);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        } else {
            element.textContent = end + suffix;
        }
    };
    
    requestAnimationFrame(animation);
}

// Initialize counters with Intersection Observer
function initializeCounters() {
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
                    // Start from 0 and animate to the target value
                    animateCounter(entry.target, 0, counterInfo.value, 1200, counterInfo.suffix);
                }
            }
        });
    }, observerOptions);
    
    // Observe all counter elements
    counters.forEach(counter => {
        const element = document.querySelector(counter.selector);
        if (element) {
            // Set initial value to 0
            element.textContent = '0' + counter.suffix;
            observer.observe(element);
        }
    });
}

// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
});

// Mobile Review Carousel
document.addEventListener('DOMContentLoaded', function() {
    const reviewCards = document.querySelectorAll('.testimonial-card');
    const reviewNext = document.getElementById('reviewNext');
    const reviewPrev = document.getElementById('reviewPrev');
    const reviewDotsContainer = document.getElementById('reviewDots');
    
    // Only initialize if elements exist and we're on mobile
    if (reviewCards.length > 0 && reviewNext && reviewPrev && reviewDotsContainer) {
        let currentReview = 0;
        
        // Create dots
        function createDots() {
            reviewDotsContainer.innerHTML = '';
            for (let i = 0; i < reviewCards.length; i++) {
                const dot = document.createElement('button');
                dot.className = i === currentReview ? 'review-dot active' : 'review-dot';
                dot.addEventListener('click', () => {
                    showReview(i);
                });
                reviewDotsContainer.appendChild(dot);
            }
        }
        
        // Show specific review
        function showReview(index) {
            // Hide all reviews
            reviewCards.forEach(card => {
                card.classList.remove('active');
            });
            
            // Update dots
            const dots = reviewDotsContainer.querySelectorAll('.review-dot');
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show current review
            currentReview = index;
            reviewCards[currentReview].classList.add('active');
            if (dots[currentReview]) {
                dots[currentReview].classList.add('active');
            }
            
            // Update button states
            reviewPrev.disabled = currentReview === 0;
            reviewNext.disabled = currentReview === reviewCards.length - 1;
        }
        
        // Next button
        reviewNext.addEventListener('click', () => {
            if (currentReview < reviewCards.length - 1) {
                showReview(currentReview + 1);
            }
        });
        
        // Previous button
        reviewPrev.addEventListener('click', () => {
            if (currentReview > 0) {
                showReview(currentReview - 1);
            }
        });
        
        // Initialize on mobile only
        function initMobileReviews() {
            if (window.innerWidth <= 480) {
                createDots();
                showReview(0);
            }
        }
        
        // Initialize and handle resize
        initMobileReviews();
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth <= 480) {
                    initMobileReviews();
                } else {
                    // Show all reviews on desktop
                    reviewCards.forEach(card => {
                        card.classList.add('active');
                    });
                }
            }, 250);
        });
    }
});

// Custom Color Picker - Add this functionality
document.addEventListener('DOMContentLoaded', function() {
    const customColorPicker = document.getElementById('customColorPicker');
    const customColorValue = document.getElementById('customColorValue');
    const colorPreview = document.getElementById('colorPreview');
    
    if (customColorPicker && customColorValue) {
        // Handle custom color picker changes
        customColorPicker.addEventListener('input', function(e) {
            const selectedColor = e.target.value;
            
            // Update the preview area
            if (colorPreview) {
                colorPreview.style.backgroundColor = selectedColor;
                colorPreview.innerHTML = `<span class="color-preview-label">${selectedColor.toUpperCase()}</span>`;
            }
            
            // Update the hex value display
            customColorValue.textContent = selectedColor.toUpperCase();
            
            // Remove active state from preset colors
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(opt => opt.classList.remove('active'));
        });
        
        // Initialize the display
        customColorValue.textContent = customColorPicker.value.toUpperCase();
    }
});