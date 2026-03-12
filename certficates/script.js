// script.js

// Certificate Data - Replace this with your actual data.json content
// or fetch from data.json file
const certificatesData = [
    {
        id: "cert-001",
        title: "EXPOThon 2K26 - Winner",
        issuer: "Department of CSE",
        date: "2026-02-26",
        category: "competition",
        image: "https://raw.githubusercontent.com/bhuvanesh-m-dev/bhuvanesh-m-dev.github.io/refs/heads/main/blog/expothon/image/bhuvanesh-certificate.jpg",
        description: "First place winner at EXPOThon 2K26 for presenting Zenskin by ZentoraOS. Recognized for innovation in Linux desktop transformation and system-level enhancement tools.",
        skills: ["Linux", "System Architecture", "Presentation", "Open Source"]
    },
    {
        id: "cert-002",
        title: "Python Programming Fundamentals",
        issuer: "Coursera - University of Michigan",
        date: "2025-08-15",
        category: "technical",
        image: "https://images.unsplash.com/photo-1589330694653-1a6d893470dd?w=800&h=600&fit=crop",
        description: "Completed comprehensive Python programming course covering data structures, algorithms, and application development. Achieved 98% grade.",
        skills: ["Python", "Data Structures", "Algorithms", "Programming"]
    },
    {
        id: "cert-003",
        title: "Web Development Bootcamp",
        issuer: "Udemy",
        date: "2025-06-20",
        category: "technical",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
        description: "Full-stack web development certification covering HTML, CSS, JavaScript, Node.js, React, and database management.",
        skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"]
    },
    {
        id: "cert-004",
        title: "Machine Learning Specialization",
        issuer: "Stanford Online - Coursera",
        date: "2025-12-10",
        category: "technical",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
        description: "Advanced machine learning certification covering supervised learning, neural networks, and deep learning fundamentals.",
        skills: ["Machine Learning", "Neural Networks", "Python", "TensorFlow"]
    },
    {
        id: "cert-005",
        title: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "2025-09-05",
        category: "cloud",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        description: "Foundational cloud computing certification demonstrating knowledge of AWS services, cloud concepts, and basic architecture.",
        skills: ["AWS", "Cloud Computing", "Infrastructure", "DevOps"]
    },
    {
        id: "cert-006",
        title: "Cybersecurity Essentials",
        issuer: "Cisco Networking Academy",
        date: "2025-11-18",
        category: "security",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
        description: "Introduction to cybersecurity covering network security, threats, vulnerabilities, and protection mechanisms.",
        skills: ["Cybersecurity", "Network Security", "Risk Management"]
    },
    {
        id: "cert-007",
        title: "Open Source Contribution Award",
        issuer: "GitHub",
        date: "2025-10-30",
        category: "achievement",
        image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop",
        description: "Recognized for significant contributions to open-source projects with over 500+ commits and community engagement.",
        skills: ["Git", "Open Source", "Collaboration", "Community"]
    },
    {
        id: "cert-008",
        title: "Linux System Administration",
        issuer: "Linux Foundation",
        date: "2025-07-22",
        category: "technical",
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop",
        description: "Professional certification in Linux system administration covering installation, configuration, and maintenance of Linux systems.",
        skills: ["Linux", "System Admin", "Bash", "Server Management"]
    }
];

// State
let currentFilter = 'all';
let currentCertIndex = 0;
let filteredCerts = [...certificatesData];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const filterContainer = document.getElementById('filterContainer');
const timelineContainer = document.getElementById('timelineContainer');
const statsContainer = document.getElementById('statsContainer');
const modal = document.getElementById('certModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    renderFilters();
    renderGallery();
    renderTimeline();
    initScrollEffects();
    initNavigation();
});

// Render Statistics
function renderStats() {
    const categories = {};
    certificatesData.forEach(cert => {
        categories[cert.category] = (categories[cert.category] || 0) + 1;
    });
    
    const totalCerts = certificatesData.length;
    const currentYear = new Date().getFullYear();
    const thisYearCerts = certificatesData.filter(c => new Date(c.date).getFullYear() === currentYear).length;
    
    statsContainer.innerHTML = `
        <div class="border doc-border px-6 py-3 rounded-full flex items-center gap-2 hover-lift">
            <span class="text-2xl font-bold">${totalCerts}</span>
            <span class="text-sm font-medium doc-text-secondary">Total</span>
        </div>
        <div class="border doc-border px-6 py-3 rounded-full flex items-center gap-2 hover-lift">
            <span class="text-2xl font-bold">${thisYearCerts}</span>
            <span class="text-sm font-medium doc-text-secondary">This Year</span>
        </div>
        <div class="border doc-border px-6 py-3 rounded-full flex items-center gap-2 hover-lift">
            <span class="text-2xl font-bold">${Object.keys(categories).length}</span>
            <span class="text-sm font-medium doc-text-secondary">Categories</span>
        </div>
    `;
}

// Render Filter Buttons
function renderFilters() {
    const categories = [...new Set(certificatesData.map(c => c.category))];
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn px-4 py-2 rounded-full border doc-border text-sm font-medium hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors capitalize';
        btn.textContent = cat;
        btn.dataset.filter = cat;
        btn.onclick = () => setFilter(cat);
        filterContainer.appendChild(btn);
    });
    
    // Set all button click
    document.querySelector('[data-filter="all"]').onclick = () => setFilter('all');
}

function setFilter(filter) {
    currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter and render
    filteredCerts = filter === 'all' 
        ? [...certificatesData]
        : certificatesData.filter(c => c.category === filter);
    
    renderGallery();
}

// Render Gallery Grid
function renderGallery() {
    galleryGrid.innerHTML = '';
    
    filteredCerts.forEach((cert, index) => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        card.onclick = () => openModal(index);
        
        const date = new Date(cert.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        card.innerHTML = `
            <span class="cert-category">${cert.category}</span>
            <img src="${cert.image}" alt="${cert.title}" loading="lazy">
            <div class="cert-card-content">
                <h3>${cert.title}</h3>
                <p>${cert.issuer} • ${date}</p>
            </div>
        `;
        
        galleryGrid.appendChild(card);
    });
}

// Render Timeline
function renderTimeline() {
    // Sort by date descending
    const sortedCerts = [...certificatesData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    timelineContainer.innerHTML = '<div class="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)] hidden md:block"></div>';
    
    sortedCerts.forEach((cert, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item section-fade';
        item.style.animationDelay = `${index * 0.1}s`;
        
        const date = new Date(cert.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
        
        item.innerHTML = `
            <div class="timeline-date">${date}</div>
            <h4 class="timeline-title font-display">${cert.title}</h4>
            <p class="timeline-desc">${cert.issuer}</p>
        `;
        
        timelineContainer.appendChild(item);
    });
}

// Modal Functions
function openModal(index) {
    currentCertIndex = index;
    updateModalContent();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function updateModalContent() {
    const cert = filteredCerts[currentCertIndex];
    
    document.getElementById('modalImage').src = cert.image;
    document.getElementById('modalCategory').textContent = cert.category;
    document.getElementById('modalTitle').textContent = cert.title;
    document.getElementById('modalIssuer').textContent = cert.issuer;
    document.getElementById('modalDate').textContent = new Date(cert.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('modalDescription').textContent = cert.description;
    document.getElementById('modalCounter').textContent = `${currentCertIndex + 1} / ${filteredCerts.length}`;
    
    // Skills
    const skillsList = document.getElementById('modalSkillsList');
    skillsList.innerHTML = '';
    cert.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        skillsList.appendChild(tag);
    });
}

function nextCert() {
    currentCertIndex = (currentCertIndex + 1) % filteredCerts.length;
    updateModalContent();
}

function prevCert() {
    currentCertIndex = (currentCertIndex - 1 + filteredCerts.length) % filteredCerts.length;
    updateModalContent();
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextCert();
    if (e.key === 'ArrowLeft') prevCert();
});

// Touch/Swipe Support
let touchStartX = 0;
let touchEndX = 0;

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextCert();
        else prevCert();
    }
}

// Scroll Effects
function initScrollEffects() {
    // Progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scrollBar').style.width = scrolled + '%';
    });
    
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.section-fade').forEach(el => observer.observe(el));
}

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    let navOpen = false;
    
    navToggle.addEventListener('click', () => {
        navOpen = !navOpen;
        sidebar.classList.toggle('-translate-x-full');
    });
    
    // Active nav highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile nav
                if (window.innerWidth < 768) {
                    sidebar.classList.add('-translate-x-full');
                    navOpen = false;
                }
            }
        });
    });
}

// Optional: Fetch from data.json instead of inline data
// Uncomment this and comment the inline data to use external JSON
/*
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        certificatesData.length = 0;
        certificatesData.push(...data);
        init();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function init() {
    renderStats();
    renderFilters();
    renderGallery();
    renderTimeline();
}

document.addEventListener('DOMContentLoaded', loadData);
*/