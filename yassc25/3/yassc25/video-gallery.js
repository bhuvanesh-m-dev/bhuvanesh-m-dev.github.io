class VideoGallery {
    constructor() {
        this.initializeVideoGallery();
        this.initializeEventListeners();
    }

    initializeVideoGallery() {
        // Initialize video items
        this.initializeVideoItems();
        
        // Add scroll animation
        this.addScrollAnimation();
        
        // Initialize Read More functionality
        this.initializeReadMore();
    }

    initializeVideoItems() {
        const videoItems = document.querySelectorAll('.video-gallery-item');
        
        videoItems.forEach(item => {
            const video = item.querySelector('video');
            const iframe = item.querySelector('iframe');
            
            // Handle video autoplay and loop
            if (video) {
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                
                // Ensure video plays
                video.play().catch(e => {
                    console.log('Video autoplay failed:', e);
                });
            }
            
            // Handle hover effects
            item.addEventListener('mouseenter', () => {
                if (video) {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
                if (iframe) {
                    iframe.style.opacity = '1';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (iframe) {
                    iframe.style.opacity = '0.8';
                }
            });
        });
    }

    initializeReadMore() {
        document.querySelectorAll('.video-gallery-item .read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const overlay = button.closest('.video-gallery-item-overlay');
                const fullDesc = overlay.querySelector('.video-gallery-item-full-description');

                if (fullDesc) {
                    this.openReadMorePopup(fullDesc.innerHTML, overlay.querySelector('.video-gallery-item-title').textContent);
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
        popup.className = 'video-read-more-popup';
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
                        
                        // Start videos when they come into view
                        const videos = entry.target.querySelectorAll('video');
                        videos.forEach(video => {
                            video.play().catch(e => console.log('Video autoplay failed:', e));
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.video-gallery-wrapper').forEach(wrapper => {
            observer.observe(wrapper);
        });
    }
}

// Initialize video gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoGallery();
});
