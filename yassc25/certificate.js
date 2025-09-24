class Certificates {
    constructor() {
        this.initializeCertificates();
        this.initializeEventListeners();
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
            // Add click event for the image to show lightbox if needed
            const image = item.querySelector('img');
            if (image) {
                image.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Could add lightbox functionality here if needed
                });
            }
        });
    }

    initializeReadMore() {
        document.querySelectorAll('.certificate-overlay .read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const overlay = button.closest('.certificate-overlay');
                const fullDesc = overlay.querySelector('.certificate-full-description');

                if (fullDesc) {
                    this.openReadMorePopup(fullDesc.innerHTML, overlay.querySelector('.certificate-title').textContent);
                }
            });
        });
    }

    openReadMorePopup(content, title) {
        if (!this.readMorePopup) {
            this.createReadMorePopup();
        }

        const popup = this.readMorePopup;
        popup.querySelector('.popup-title').textContent = title;
        popup.querySelector('.popup-content').innerHTML = content;

        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeReadMorePopup() {
        if (this.readMorePopup) {
            this.readMorePopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    createReadMorePopup() {
        const popup = document.createElement('div');
        popup.className = 'certificate-read-more-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h3 class="popup-title"></h3>
                <button class="popup-close">×</button>
            </div>
            <div class="popup-content"></div>
            <button class="scroll-top" aria-label="Scroll to top"></button>
        `;

        document.body.appendChild(popup);
        this.readMorePopup = popup;

        popup.querySelector('.popup-close').addEventListener('click', () => {
            this.closeReadMorePopup();
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closeReadMorePopup();
            }
        });

        // Add scroll-to-top functionality
        const scrollButton = popup.querySelector('.scroll-top');
        popup.addEventListener('scroll', () => {
            if (popup.scrollTop > 100) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });

        scrollButton.addEventListener('click', () => {
            popup.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initializeEventListeners() {
        // Close popup with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeReadMorePopup();
            }
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