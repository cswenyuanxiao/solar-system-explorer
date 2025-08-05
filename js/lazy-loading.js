// Lazy Loading Implementation with Performance Optimizations
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.loadedImages = 0;
        this.options = {
            root: null,
            rootMargin: '50px', // Reduced margin for faster loading
            threshold: 0.01
        };
        
        // Bind 'this' to methods
        this.handleIntersection = this.handleIntersection.bind(this);
        
        this.init();
    }

    init() {
        console.log(`LazyLoader: Found ${this.images.length} images to load`);
        
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection, this.options);
            this.observeImages();
        } else {
            // Fallback for older browsers
            this.loadImagesImmediately();
        }
    }

    observeImages() {
        this.images.forEach(img => {
            console.log(`Observing image: ${img.getAttribute('data-src')}`);
            this.observer.observe(img);
        });
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`Loading image: ${entry.target.getAttribute('data-src')}`);
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) {
            console.warn('No data-src attribute found');
            return;
        }

        console.log(`Attempting to load: ${src}`);

        // Use a temporary image to handle loading
        const tempImage = new Image();
        
        tempImage.onload = () => {
            console.log(`Successfully loaded: ${src}`);
            requestAnimationFrame(() => {
                img.src = src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                this.loadedImages++;
                console.log(`Image loaded successfully: ${src}`);
            });
        };

        tempImage.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            img.classList.add('error');
            this.observer.unobserve(img);
        };

        tempImage.src = src;
    }

    loadImagesImmediately() {
        console.log('Using fallback loading method');
        const imageArray = Array.from(this.images);
        const processBatch = (startIndex) => {
            if (startIndex >= imageArray.length) return;
            
            const batch = imageArray.slice(startIndex, startIndex + 5);
            batch.forEach(img => this.loadImage(img));
            
            requestAnimationFrame(() => processBatch(startIndex + 5));
        };
        
        processBatch(0);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize lazy loading immediately when script loads
if (typeof window !== 'undefined') {
    // Try to initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded - Initializing LazyLoader');
            new LazyLoader();
        });
    } else {
        console.log('DOM already loaded - Initializing LazyLoader immediately');
        new LazyLoader();
    }
    
    // Also try on window load as backup
    window.addEventListener('load', () => {
        console.log('Window loaded - Checking if LazyLoader needs re-initialization');
        if (document.querySelectorAll('img[data-src]').length > 0) {
            new LazyLoader();
        }
    });
}