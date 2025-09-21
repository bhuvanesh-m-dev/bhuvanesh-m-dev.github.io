// Initialize animations when elements come into view
document.addEventListener('DOMContentLoaded', function() {
    // Function to handle scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections and header elements
    document.querySelectorAll('section, header h1, header .subtitle').forEach(element => {
        observer.observe(element);
    });

    // Add subtle hover effect to media placeholders
    const placeholders = document.querySelectorAll('.media-placeholder');
    placeholders.forEach(placeholder => {
        placeholder.addEventListener('mouseenter', function() {
            this.style.borderColor = '#555';
            this.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.1)';
        });
        
        placeholder.addEventListener('mouseleave', function() {
            this.style.borderColor = '#333';
            this.style.boxShadow = 'none';
        });
    });

    // Add subtle animation to milestone highlights
    setTimeout(() => {
        document.querySelectorAll('.milestone').forEach(milestone => {
            milestone.style.transform = 'translateX(0)';
            milestone.style.opacity = '1';
        });
    }, 300);
});

// Add smooth scrolling for anchor links (if we had any)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
