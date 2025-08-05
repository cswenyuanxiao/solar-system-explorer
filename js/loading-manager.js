// Loading Manager for Solar System Explorer - More Robust Version

class LoadingManager {
    constructor() {
        this.pageLoader = document.getElementById('pageLoader');
        this.progressFill = document.getElementById('progressFill');
        
        if (!this.pageLoader) {
            console.warn('LoadingManager: pageLoader element not found.');
            return;
        }

        this.isLoaderActive = true;
        this.init();
    }

    init() {
        // Fallback to hide loader if something goes wrong. This is the ultimate safety net.
        const fallbackTimeout = setTimeout(() => this.forceHide(), 4000); // Hide after 4s, no matter what.

        // The primary method to hide the loader.
        // Fires when the document and all sub-resources (images, stylesheets) have finished loading.
        window.addEventListener('load', () => {
            clearTimeout(fallbackTimeout); // We made it, so clear the safety net.
            this.updateProgress(100);
            setTimeout(() => this.hideLoader(), 150); // Short delay for animation.
        }, { once: true, passive: true });

        this.simulateLoading();
    }

    simulateLoading() {
        if (!this.isLoaderActive || !this.progressFill) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            if (!this.isLoaderActive) {
                clearInterval(interval);
                return;
            }
            
            progress += Math.random() * 10;
            
            if (progress >= 95) { // Stop at 95% and wait for window.load
                this.updateProgress(95);
                clearInterval(interval);
            } else {
                this.updateProgress(progress);
            }
        }, 150);
    }

    updateProgress(percentage) {
        if (this.progressFill && this.isLoaderActive) {
            requestAnimationFrame(() => {
                this.progressFill.style.transform = `scaleX(${percentage / 100})`;
            });
        }
    }

    hideLoader() {
        if (this.pageLoader && this.isLoaderActive) {
            this.isLoaderActive = false;
            requestAnimationFrame(() => {
                this.pageLoader.classList.add('hidden');
                // After the fade-out animation, set display to none.
                this.pageLoader.addEventListener('transitionend', () => {
                    this.pageLoader.style.display = 'none';
                }, { once: true });
            });
        }
    }
    
    forceHide() {
        if (this.pageLoader && this.isLoaderActive) {
            console.warn("Loader force-hidden due to timeout. This might indicate a page loading issue.");
            this.isLoaderActive = false;
             requestAnimationFrame(() => {
                this.pageLoader.style.transition = 'opacity 0.5s ease';
                this.pageLoader.style.opacity = '0';
                setTimeout(() => {
                    this.pageLoader.style.display = 'none';
                }, 500);
            });
        }
    }
}

// Initialize loading manager as early as possible.
// No need to wait for DOMContentLoaded, as the script is at the end of the body
// and the #pageLoader element should already be in the DOM.
try {
    if (document.getElementById('pageLoader')) {
        new LoadingManager();
    }
} catch (e) {
    console.error("Failed to initialize LoadingManager:", e);
    const loader = document.getElementById('pageLoader');
    if(loader) {
        loader.style.display = 'none';
    }
}
