class Gallery {
    constructor() {
        this.initializeGallery();
        this.currentImageIndex = 0;
        this.images = [];
        this.createDescriptionPopup();
    }

    initializeGallery() {
        // Create lightbox elements
        this.createLightbox();
        
        // Initialize gallery items
        this.initializeItems();
        
        // Add scroll animation
        this.addScrollAnimation();
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
        popup.querySelector('.description-popup-close').addEventListener('click', () => {
            this.closeDescriptionPopup();
        });
        
        // Close on background click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) this.closeDescriptionPopup();
        });
    }

    initializeItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            title: item.querySelector('.gallery-item-title')?.textContent || '',
            description: item.querySelector('.gallery-item-description')?.textContent || '',
            fullDescription: item.querySelector('.gallery-item-full-description')?.innerHTML || ''
        }));

        galleryItems.forEach((item, index) => {
            const readMoreBtn = item.querySelector('.read-more');
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openDescriptionPopup(index);
                });
            }
            item.addEventListener('click', () => this.openLightbox(index));
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
        const image = this.images[index];
        const popup = this.descriptionPopup;
        popup.querySelector('.description-popup-title').textContent = image.title;
        popup.querySelector('.description-popup-text').innerHTML = image.fullDescription;
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeDescriptionPopup() {
        this.descriptionPopup.classList.remove('active');
        document.body.style.overflow = '';
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
