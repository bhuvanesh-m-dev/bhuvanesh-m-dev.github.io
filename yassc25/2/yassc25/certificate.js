class Certificates {
    constructor() {
        this.initializeCertificates();
    }

    initializeCertificates() {
        // Initialize certificate items
        this.initializeItems();
        
        // Add scroll animation
        this.addScrollAnimation();
        
        // Initialize Read More functionality
        this.initializeReadMore();
    }

    initializeItems() {
        const certificateItems = document.querySelectorAll('.certificate-item');
        
        certificateItems.forEach(item => {
            const readMoreBtn = item.querySelector('.read-more');
            const readLessBtn = item.querySelector('.read-less');
            const description = item.querySelector('.certificate-full-description');
            
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    readMoreBtn.style.display = 'none';
                    if (readLessBtn) readLessBtn.style.display = 'inline-block';
                    if (description) description.style.display = 'block';
                });
            }

            if (readLessBtn) {
                readLessBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    readLessBtn.style.display = 'none';
                    if (readMoreBtn) readMoreBtn.style.display = 'inline-block';
                    if (description) description.style.display = 'none';
                });
            }
        });
    }

    initializeReadMore() {
        document.querySelectorAll('.certificate-overlay .read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const overlay = button.closest('.certificate-overlay');
                overlay.classList.add('expanded');
            });
        });

        document.querySelectorAll('.certificate-overlay .read-less').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const overlay = button.closest('.certificate-overlay');
                overlay.classList.remove('expanded');
            });
        });
    }

    addScrollAnimation() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.certificates-wrapper').forEach(wrapper => {
            observer.observe(wrapper);
        });
    }
}

// Initialize certificates when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Certificates();
});