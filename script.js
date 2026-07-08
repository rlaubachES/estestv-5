/* ==========================================
   ECLIPSE STUDIO - INTERACTIVE JAVASCRIPT
   Advanced Animations & Functionality
   ========================================== */

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initMobileMenu();
    initLogoAnimation();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimations();
    initParallax();
    initFormValidation();
    initBackToTop();
    initPreloader();
});

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class after 100px
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ==========================================
// MOBILE MENU
// ==========================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// ==========================================
// LOGO TAP ANIMATION
// The logo no longer navigates anywhere - it's purely a
// decorative "find your eclipse moment" moment. Clicking or
// tapping it plays the same eclipse animation that used to be
// hover-only, so it works reliably on touch devices.
// ==========================================
function initLogoAnimation() {
    const logos = document.querySelectorAll('.logo');
    if (!logos.length) return;

    logos.forEach(logo => {
        logo.addEventListener('click', () => {
            if (logo.classList.contains('is-animating')) return;
            logo.classList.add('is-animating');
            setTimeout(() => {
                logo.classList.remove('is-animating');
            }, 2800);
        });
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 40;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements — slide animations handled separately
    const animatedElements = document.querySelectorAll(
        '.feature-text, .stat-item, .service-card, .work-item, .value-item'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Scroll-triggered slide animations for who-we-are rows NOT in viewport on load
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                slideObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.slide-from-left, .slide-from-right').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= window.innerHeight) {
            // Below viewport — observe for scroll trigger
            slideObserver.observe(el);
        } else if (rect.bottom < 0) {
            // Above viewport on load — add in-view immediately, no animation needed
            el.classList.add('in-view');
        }
        // Elements in viewport on load are handled by the preloader callback
    });
}

// ==========================================
// COUNTER ANIMATIONS
// ==========================================
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-value');
    const speed = 1000; // Animation duration in ms

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get all stat items and animate them sequentially
                const statItems = document.querySelectorAll('.stat-item');
                
                statItems.forEach((item, index) => {
                    const counter = item.querySelector('.stat-value');
                    const target = parseInt(counter.getAttribute('data-target'));
                    const delay = index * 200; // 300ms delay between each stat
                    
                    setTimeout(() => {
                        animateCounter(counter, target, speed, item);
                    }, delay);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe the first counter to trigger all animations
    if (counters.length > 0) {
        observer.observe(counters[0]);
    }
}

function animateCounter(counter, target, speed, statItem) {
    const increment = target / (speed / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            counter.textContent = Math.floor(current) + '%';
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + '%';
            
            // Add complete class for pop animation and arrow
            statItem.classList.add('complete');
        }
    };

    updateCounter();
}

// ==========================================
// PARALLAX EFFECTS
// ==========================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    // Add placeholder attribute for label animation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.setAttribute('placeholder', ' ');
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;

        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        submitBtn.style.opacity = '0.6';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            showFormMessage('Thank you! We\'ll be in touch soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }, 1500);
    });

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');

    // Remove existing error
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    // Validate email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email');
            return false;
        }
    }

    return true;
}

function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #D8747F;
        font-size: 11px;
        margin-top: 8px;
        letter-spacing: 1px;
    `;

    fieldGroup.appendChild(errorDiv);
}

function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#C8C0D6' : '#D8747F'};
        color: white;
        padding: 30px 60px;
        font-size: 14px;
        letter-spacing: 2px;
        text-align: center;
        z-index: 10000;
        animation: messageSlideIn 0.5s ease;
    `;

    document.body.appendChild(messageDiv);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
    `;
    document.head.appendChild(style);

    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.5s ease';
        style.textContent += `
            @keyframes messageSlideOut {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -40%);
                }
            }
        `;
        
        setTimeout(() => {
            messageDiv.remove();
            style.remove();
        }, 500);
    }, 3000);
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// CUSTOM CURSOR EFFECT (Desktop Only)
// ==========================================
function initCursorEffect() {
    // Only on desktop
    if (window.innerWidth < 968) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: #C8C0D6;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease, opacity 0.15s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);

    const cursorOuter = document.createElement('div');
    cursorOuter.className = 'custom-cursor-outer';
    cursorOuter.style.cssText = `
        position: fixed;
        width: 32px;
        height: 32px;
        border: 1px solid #C8C0D6;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.2s ease, opacity 0.2s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorOuter);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let outerX = 0;
    let outerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
        cursorOuter.style.opacity = '0.5';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorOuter.style.opacity = '0';
    });

    // Animate cursor
    function animateCursor() {
        // Inner cursor (fast)
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursor.style.left = cursorX - 4 + 'px';
        cursor.style.top = cursorY - 4 + 'px';

        // Outer cursor (slow)
        outerX += (mouseX - outerX) * 0.15;
        outerY += (mouseY - outerY) * 0.15;
        cursorOuter.style.left = outerX - 16 + 'px';
        cursorOuter.style.top = outerY - 16 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .work-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorOuter.style.transform = 'scale(1.5)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorOuter.style.transform = 'scale(1)';
        });
    });
}

// ==========================================
// PRELOADER
// ==========================================
function initPreloader() {
    // Create preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="logo-icon">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="4"/>
                    <circle cx="62" cy="50" r="32" fill="currentColor"/>
                </svg>
            </div>
            <div class="preloader-text">ECLIPSE</div>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #F8F7F4;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.6s ease, visibility 0.6s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
        .preloader-content {
            text-align: center;
        }
        .preloader .logo-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            color: #8E7FA9;
            animation: preloaderPulse 2s ease-in-out infinite;
        }
        .preloader-text {
            font-size: 18px;
            letter-spacing: 6px;
            color: #222222;
            font-weight: 200;
            animation: preloaderFade 2s ease-in-out infinite;
        }
        @keyframes preloaderPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
        }
        @keyframes preloaderFade {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(preloader);

    // Hide preloader when page is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            setTimeout(() => {
                preloader.remove();
                style.remove();

                // Animate who-we-are elements already in viewport after preloader clears
                const inViewSlides = document.querySelectorAll('.slide-from-left, .slide-from-right');
                inViewSlides.forEach((el, index) => {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        setTimeout(() => {
                            el.classList.add('in-view');
                        }, 200 + (index * 200));
                    }
                });

            }, 600);
        }, 700);
    });
}

// Pricing card stagger animation
const pricingCards = document.querySelectorAll('.pricing-card');
const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('in-view');
            }, delay);
            pricingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

pricingCards.forEach(card => pricingObserver.observe(card));

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Lazy load images when implemented
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c✨ Eclipse Studio', 'font-size: 20px; font-weight: 200; color: #C8C0D6; letter-spacing: 4px;');
console.log('%cElevated Social Media Management', 'font-size: 12px; color: #B39F7C; letter-spacing: 2px;');
console.log('%cWebsite crafted with precision and care', 'font-size: 11px; color: #818181; margin-top: 10px;');

// ==========================================
// EXPORT FOR MODULE USE (Optional)
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHeaderScroll,
        initMobileMenu,
        initSmoothScroll,
        initScrollAnimations,
        initCounterAnimations
    };
}
