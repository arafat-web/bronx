// Navbar scroll effect
const navbar = document.getElementById('mainNavbar');

window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Scroll animations and counter for sections
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

// Counter Animation
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target % 1 === 0 ? target : target.toFixed(1);
            clearInterval(timer);
        } else {
            element.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
    }, 16);
}

// Number Counter (for different format)
function animateNumberCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

const animateOnScroll = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            
            // Animate data-target counters (How It Works)
            const counters = entry.target.querySelectorAll('.stat-number[data-target]');
            counters.forEach(counter => {
                animateCounter(counter);
            });
            
            // Animate data-counter numbers (Screening)
            const numberCounters = entry.target.querySelectorAll('[data-counter]');
            numberCounters.forEach(counter => {
                animateNumberCounter(counter);
            });
            
            // Animate rate-number (Screening approval rate)
            const rateNumbers = entry.target.querySelectorAll('.rate-number[data-target]');
            rateNumbers.forEach(num => {
                animateCounter(num);
            });
        }
    });
}, observerOptions);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const processSteps = document.querySelectorAll('.process-step');
    const screeningVisual = document.querySelector('.screening-visual');
    const statCards = document.querySelectorAll('.stat-card');
    const locationCards = document.querySelectorAll('.location-card');
    const coverageMap = document.querySelector('.coverage-map');
    
    // Observe process steps
    processSteps.forEach(step => {
        animateOnScroll.observe(step);
    });
    
    // Observe screening section
    if (screeningVisual) {
        animateOnScroll.observe(screeningVisual);
    }
    
    // Observe stat cards
    statCards.forEach(card => {
        animateOnScroll.observe(card);
    });
    
    // Observe location cards
    locationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        cardObserver.observe(card);
    });
    
    // Observe coverage map
    if (coverageMap) {
        animateOnScroll.observe(coverageMap);
    }
    
    // Add enhanced hover effects
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
    
    const screeningSteps = document.querySelectorAll('.screening-step');
    screeningSteps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
});