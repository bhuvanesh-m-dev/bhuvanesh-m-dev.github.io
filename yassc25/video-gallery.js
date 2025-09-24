class VideoGallery {
    constructor() {
        this.initializeVideoGallery();
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
            const iframe = item.querySelector('iframe');
            const overlay = item.querySelector('.video-gallery-item-overlay');
            
            // Handle hover effects for YouTube videos
            item.addEventListener('mouseenter', () => {
                if (iframe) {
                    // The video is already playing due to autoplay
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
                const description = overlay.querySelector('.video-gallery-item-full-description');
                const readLess = overlay.querySelector('.read-less');

                if (description) {
                    description.style.display = 'block';
                    button.style.display = 'none';
                    if (readLess) {
                        readLess.style.display = 'block';
                    }
                }
            });
        });

        document.querySelectorAll('.video-gallery-item .read-less').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const overlay = button.closest('.video-gallery-item-overlay');
                const description = overlay.querySelector('.video-gallery-item-full-description');
                const readMore = overlay.querySelector('.read-more');

                if (description) {
                    description.style.display = 'none';
                    button.style.display = 'none';
                    if (readMore) {
                        readMore.style.display = 'block';
                    }
                }
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

        document.querySelectorAll('.video-gallery-wrapper').forEach(wrapper => {
            observer.observe(wrapper);
        });
    }
}

// Initialize video gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoGallery();
});
