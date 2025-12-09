// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize certificate iframes
    initCertificateIframes();
    
    // Initialize achievement cards
    initAchievementCards();
    
    // Initialize scroll animations
    initScrollAnimations();
});

/**
 * Initialize certificate iframes with loading states and error handling
 */
function initCertificateIframes() {
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        const iframe = card.querySelector('iframe');
        const overlay = card.querySelector('.iframe-overlay');
        
        // Show overlay initially
        overlay.style.display = 'flex';
        
        // Handle iframe load
        iframe.onload = function() {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }, 500);
        };
        
        // Handle iframe errors
        iframe.onerror = function() {
            overlay.innerHTML = `
                <div class="error-content">
                    <i class="fas fa-exclamation-circle" style="color: var(--error-color);"></i>
                    <h4>Could not load certificate</h4>
                    <p>JavaScript may be disabled in your browser or the certificate URL is not accessible.</p>
                    <button class="retry-button"><i class="fas fa-redo"></i> Retry</button>
                </div>
            `;
            
            const retryButton = overlay.querySelector('.retry-button');
            retryButton.addEventListener('click', function() {
                overlay.style.display = 'flex';
                overlay.style.opacity = '1';
                overlay.querySelector('.error-content').remove();
                overlay.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading certificate...</p>
                `;
                iframe.src = iframe.src; // Reload iframe
            });
        };
    });
}

/**
 * Initialize achievement cards with enhanced hover effects
 */
function initAchievementCards() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    achievementCards.forEach(card => {
        // Add subtle animation on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 10;
            const angleX = (centerY - y) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.certificate-card, .achievement-card');
    
    // Set initial state
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
    });
    
    // Create observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Initial check for elements already in view
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }, 100);
}

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 250);
});