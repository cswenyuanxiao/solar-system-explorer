// Loading Manager for Solar System Explorer - Performance Optimized
class LoadingManager {
    constructor() {
        this.pageLoader = document.getElementById('pageLoader');
        this.progressFill = document.getElementById('progressFill');
        this.isLoaderActive = true;
        this.init();
    }

    init() {
        // Fallback to hide loader if something goes wrong
        const fallbackTimeout = setTimeout(() => this.hideLoader(), 5000); // Hide after 5s
        
        // Use a more reliable event to hide the loader
        window.addEventListener('load', () => {
            clearTimeout(fallbackTimeout);
            this.updateProgress(100);
            
            // Wait for animations to complete
            setTimeout(() => this.hideLoader(), 300);
        }, { once: true, passive: true }); // Use once to ensure it only runs once
        
        // Start a simple loading simulation
        this.simulateLoading();
    }

    simulateLoading() {
        if (!this.isLoaderActive) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            if (!this.isLoaderActive) {
                clearInterval(interval);
                return;
            }
            
            progress += Math.random() * 5; // Slower, more realistic progress
            
            if (progress >= 95) { // Stop at 95% and wait for window.onload
                clearInterval(interval);
            } else {
                this.updateProgress(progress);
            }
        }, 100);
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
                
                // Remove from DOM after transition
                this.pageLoader.addEventListener('transitionend', () => {
                    if (this.pageLoader.parentNode) {
                        this.pageLoader.style.display = 'none';
                    }
                }, { once: true });
            });
        }
    }

    showLoader() {
        if (this.pageLoader && !this.isLoaderActive) {
            this.isLoaderActive = true;
            
            requestAnimationFrame(() => {
                this.pageLoader.style.display = 'flex';
                this.pageLoader.classList.remove('hidden');
            });
        }
    }
}

// Initialize loading manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LoadingManager();
    });
} else {
    new LoadingManager();
}