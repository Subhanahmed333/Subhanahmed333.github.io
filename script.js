// ============================================= //
// LENIS SMOOTH SCROLL INITIALIZATION - OPTIMIZED
// ============================================= //

// Initialize Lenis immediately for instant smooth scrolling
let lenis;

// Don't wait for full page load - start immediately
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 0.8,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
        lerp: 0.08,
    });

    // Optimized RAF loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
} else {
    // Fallback: Load Lenis if not already loaded
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js';
    script.onload = () => {
        lenis = new Lenis({
            duration: 0.8,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            direction: 'vertical',
            smooth: true,
            mouseMultiplier: 0.8,
            lerp: 0.08,
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    };
    document.head.appendChild(script);
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const logoImage = document.getElementById('logoImage'); // Get the logo element

function setDarkMode(isDark) {
    if (isDark) {
        body.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.querySelector('i').className = 'fas fa-sun text-white';
        if (logoImage) logoImage.src = '1.png'; // Set dark mode logo
    } else {
        body.classList.remove('dark');
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.querySelector('i').className = 'fas fa-moon';
        if (logoImage) logoImage.src = '2.png'; // Set light mode logo
    }
}

darkModeToggle.addEventListener('click', () => setDarkMode(!body.classList.contains('dark')));

// Check for saved theme preference or system preference
if (localStorage.getItem('darkMode') === 'enabled' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('darkMode') !== 'disabled')) {
    setDarkMode(true);
} else {
    setDarkMode(false);
}

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
mobileMenuButton.addEventListener('click', () => { mobileMenu.classList.toggle('max-h-0'); mobileMenu.classList.toggle('max-h-screen'); });
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileMenu.classList.add('max-h-0'); mobileMenu.classList.remove('max-h-screen'); }));

// Smooth scrolling with Lenis - ULTRA OPTIMIZED
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Use Lenis if available, otherwise fallback to native
            if (lenis) {
                lenis.scrollTo(targetElement, {
                    offset: -80,
                    duration: 0.8,
                    immediate: false,
                });
            } else {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Active link highlighting - MINIMAL PERFORMANCE IMPACT
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

let ticking = false;
let currentActive = '';

// Use Intersection Observer instead of scroll events - MUCH better performance
const observerOptions = {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            // Only update if changed
            if (currentActive !== id) {
                currentActive = id;
                
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => sectionObserver.observe(section));

// Typing effect
const typedTextSpan = document.getElementById('typed-text');
const textArray = ["ML Engineer", "Android Developer", "Python Developer", "Software Engineer"];
let textArrayIndex = 0, charIndex = 0, isDeleting = false;
function type() {
    if (!typedTextSpan) return;
    const currentText = textArray[textArrayIndex];
    let typeSpeed = isDeleting ? 75 : 150;
    typedTextSpan.textContent = currentText.substring(0, charIndex);
    if (!isDeleting && charIndex < currentText.length) { charIndex++; }
    else if (isDeleting && charIndex > 0) { charIndex--; }
    else { isDeleting = !isDeleting; if (!isDeleting) { textArrayIndex = (textArrayIndex + 1) % textArray.length; } typeSpeed = isDeleting ? 75 : 2000; }
    setTimeout(type, typeSpeed);
}
document.addEventListener("DOMContentLoaded", () => setTimeout(type, 1000));

// Counter Animation for About Section - OPTIMIZED
const counters = document.querySelectorAll('.counter');
let counterAnimated = false;

function animateCounters() {
    if (counterAnimated) return;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500; // Reduced to 1.5 seconds
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };

        requestAnimationFrame(updateCounter);
    });

    counterAnimated = true;
}

// Trigger counter animation when About section is in view - OPTIMIZED
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect(); // Stop observing after animation
            }
        });
    }, { threshold: 0.3, rootMargin: '0px' });

    observer.observe(aboutSection);
}

// Animate stat bars when in view
const statFills = document.querySelectorAll('.stat-fill');
if (statFills.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width;
            }
        });
    }, { threshold: 0.5 });

    statFills.forEach(fill => statObserver.observe(fill));
}


// Experience section scroll animations - OPTIMIZED
const experienceCards = document.querySelectorAll('.experience-card');

if (experienceCards.length > 0) {
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                experienceObserver.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    experienceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        experienceObserver.observe(card);
    });
}

// Project cards scroll animations - OPTIMIZED
const projectCards = document.querySelectorAll('.project-card');

if (projectCards.length > 0) {
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 100); // Staggered animation
                projectObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        projectObserver.observe(card);
    });
}


// ============================================= //
// LENIS SCROLL ENHANCEMENTS - OPTIMIZED
// ============================================= //

// Parallax effect for hero section - DISABLED for performance
// (Uncomment if needed, but it causes performance issues)
/*
if (lenis) {
    lenis.on('scroll', ({ scroll }) => {
        const hero = document.getElementById('home');
        if (hero && scroll < hero.offsetHeight) {
            hero.style.transform = `translateY(${scroll * 0.3}px)`;
        }
    });
}
*/

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target && lenis) {
            lenis.scrollTo(target, { offset: -100 });
        }
    }
});
