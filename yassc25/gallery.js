class Gallery {
    constructor() {
        this.initializeGallery();
        this.currentImageIndex = 0;
        this.images = [];
        this.initializeEventListeners();
    }

    initializeGallery() {
        // Create lightbox elements
        this.createLightbox();
        
        // Initialize gallery items
        this.initializeItems();
        
        // Add scroll animation
        this.addScrollAnimation();
        
        // Initialize Read More functionality
        this.initializeReadMore();
    }

    initializeReadMore() {
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const overlay = button.closest('.gallery-item-overlay');
                const fullDesc = overlay.querySelector('.gallery-item-full-description');

                if (fullDesc) {
                    this.openReadMorePopup(fullDesc.innerHTML, overlay.querySelector('.gallery-item-title').textContent);
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
        popup.className = 'read-more-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h3 class="popup-title"></h3>
                <button class="popup-close">×</button>
            </div>
            <div class="popup-content"></div>
            <button class="scroll-to-top" aria-label="Scroll to top"></button>
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
        const scrollButton = popup.querySelector('.scroll-to-top');
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
                this.closeDescriptionPopup();
            }
        });
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Gallery image">
                <button class="lightbox-close">×</button>
                <div class="lightbox-nav">
                    <button class="prev">❮</button>
                    <button class="next">❯</button>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        this.lightbox = lightbox;
        this.lightboxImg = lightbox.querySelector('img');
        
        // Add event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.querySelector('.prev').addEventListener('click', () => this.navigateImage(-1));
        lightbox.querySelector('.next').addEventListener('click', () => this.navigateImage(1));
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.navigateImage(-1);
                    break;
                case 'ArrowRight':
                    this.navigateImage(1);
                    break;
            }
        });
    }

    createDescriptionPopup() {
        // Create popup if it doesn't exist
        if (!this.descriptionPopup) {
            const popup = document.createElement('div');
            popup.className = 'description-popup';
            popup.innerHTML = `
                <div class="description-popup-content">
                    <h3 class="description-popup-title"></h3>
                    <div class="description-popup-text"></div>
                    <button class="description-popup-close">×</button>
                </div>
            `;
            document.body.appendChild(popup);
            
            this.descriptionPopup = popup;
            
            // Add event listener for close button
            const closeBtn = popup.querySelector('.description-popup-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeDescriptionPopup();
                });
            }
            
            // Close on background click
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.closeDescriptionPopup();
                }
            });
        }
    }

    initializeItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        this.images = Array.from(galleryItems).map(item => {
            const fullDescriptionEl = item.querySelector('.gallery-item-full-description');
            return {
                src: item.querySelector('img').src,
                title: item.querySelector('.gallery-item-title')?.textContent || '',
                description: item.querySelector('.gallery-item-description')?.textContent || '',
                fullDescription: fullDescriptionEl ? fullDescriptionEl.innerHTML : ''
            };
        });

        galleryItems.forEach((item, index) => {
            // Add click event for the Read More button
            const readMoreBtn = item.querySelector('.read-more');
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openDescriptionPopup(index);
                });
            }

            // Add click event for the image to open lightbox
            const image = item.querySelector('img');
            if (image) {
                image.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openLightbox(index);
                });
            }
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        this.lightboxImg.src = this.images[index].src;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateImage(direction) {
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length;
        this.lightboxImg.src = this.images[this.currentImageIndex].src;
    }

    openDescriptionPopup(index) {
        if (!this.descriptionPopup) {
            this.createDescriptionPopup();
        }

        const image = this.images[index];
        if (!image) return;

        const popup = this.descriptionPopup;
        const titleEl = popup.querySelector('.description-popup-title');
        const textEl = popup.querySelector('.description-popup-text');

        if (titleEl) titleEl.textContent = image.title;
        if (textEl) textEl.innerHTML = image.fullDescription;

        // Add active class with a slight delay to ensure smooth animation
        requestAnimationFrame(() => {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    closeDescriptionPopup() {
        if (!this.descriptionPopup) return;

        this.descriptionPopup.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear content after animation
        setTimeout(() => {
            const titleEl = this.descriptionPopup.querySelector('.description-popup-title');
            const textEl = this.descriptionPopup.querySelector('.description-popup-text');
            if (titleEl) titleEl.textContent = '';
            if (textEl) textEl.innerHTML = '';
        }, 300); // Match the CSS transition duration
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

        document.querySelectorAll('.gallery-wrapper').forEach(wrapper => {
            observer.observe(wrapper);
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});
