// Lazy Loading Implementation with Performance Optimizations
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.loadedImages = 0;
        this.options = {
            root: null,
            rootMargin: '150px', // Increased margin for earlier loading
            threshold: 0.01
        };
        
        // Bind 'this' to methods
        this.handleIntersection = this.handleIntersection.bind(this);
        
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection, this.options);
            
            // Use a more robust initialization strategy
            if ('requestIdleCallback' in window) {
                const timeout = setTimeout(() => this.observeImages(), 100);
                requestIdleCallback(() => {
                    clearTimeout(timeout);
                    this.observeImages();
                }, { timeout: 500 });
            } else {
                requestAnimationFrame(() => this.observeImages());
            }
        } else {
            // Fallback for older browsers
            this.loadImagesImmediately();
        }
    }

    observeImages() {
        this.images.forEach(img => this.observer.observe(img));
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => this.loadImage(entry.target));
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Use a temporary image to handle loading
        const tempImage = new Image();
        tempImage.src = src;
        
        tempImage.onload = () => {
            requestAnimationFrame(() => {
                img.src = src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                this.loadedImages++;
            });
        };

        tempImage.onerror = () => {
            console.warn('Failed to load image:', src);
            img.classList.add('error');
            this.observer.unobserve(img);
        };
    }

    loadImagesImmediately() {
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

// Initialize lazy loading
if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            new LazyLoader();
        }, { timeout: 1000 });
    } else {
        window.addEventListener('load', () => {
            new LazyLoader();
        });
    }
}