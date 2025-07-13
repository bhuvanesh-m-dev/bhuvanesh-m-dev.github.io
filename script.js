// Navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Social Popup
const moreBtn = document.getElementById('moreBtn');
const socialPopup = document.getElementById('socialPopup');
const closePopup = document.querySelector('.close-popup');

moreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    socialPopup.classList.add('active');
});

closePopup.addEventListener('click', () => {
    socialPopup.classList.remove('active');
});

socialPopup.addEventListener('click', (e) => {
    if (e.target === socialPopup) {
        socialPopup.classList.remove('active');
    }
});

// Scroll to Top
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission
const messageForm = document.getElementById('messageForm');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add form submission logic here
    alert('Message sent successfully!');
    messageForm.reset();
});

// Update copyright year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Animate skill bars on scroll
const skillBars = document.querySelector('.skills-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress').forEach(progress => {
                progress.style.width = progress.parentElement.parentElement.querySelector('span').textContent;
            });
        }
    });
}, { threshold: 0.5 });

if (skillBars) {
    observer.observe(skillBars);
}
