// Initialize animations when elements come into view
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Scroll to top button functionality
    const scrollButton = document.getElementById('scrollToTop');
    
    function toggleScrollButton() {
        if (window.scrollY > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleScrollButton);
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Function to handle scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
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