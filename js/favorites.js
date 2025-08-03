// Favorites functionality for Solar System Explorer

class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.initializeFavoriteButtons();
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('solarSystemFavorites') || '[]');
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('solarSystemFavorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    addFavorite(planetName) {
        if (!this.favorites.includes(planetName)) {
            this.favorites.push(planetName);
            this.saveFavorites();
            this.updateFavoriteButton(planetName, true);
            this.showNotification(`${planetName} added to favorites! ⭐`);
        }
    }

    removeFavorite(planetName) {
        this.favorites = this.favorites.filter(name => name !== planetName);
        this.saveFavorites();
        this.updateFavoriteButton(planetName, false);
        this.showNotification(`${planetName} removed from favorites`);
    }

    toggleFavorite(planetName) {
        if (this.isFavorite(planetName)) {
            this.removeFavorite(planetName);
        } else {
            this.addFavorite(planetName);
        }
    }

    isFavorite(planetName) {
        return this.favorites.includes(planetName);
    }

    initializeFavoriteButtons() {
        // Add favorite button to planet detail pages
        const planetTitle = document.querySelector('h1');
        if (planetTitle && this.isPlanetPage()) {
            const planetName = planetTitle.textContent.trim();
            this.addFavoriteButton(planetName);
        }

        // Add favorite indicators to main page planet cards
        this.addFavoriteIndicators();
    }

    isPlanetPage() {
        const planetPages = ['sun.html', 'mercury.html', 'venus.html', 'earth.html', 
                           'mars.html', 'jupiter.html', 'saturn.html', 'uranus.html', 'neptune.html'];
        return planetPages.some(page => window.location.pathname.includes(page));
    }

    addFavoriteButton(planetName) {
        const header = document.querySelector('header .header-content');
        if (header && !document.querySelector('.favorite-button')) {
            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'favorite-button';
            favoriteButton.innerHTML = this.isFavorite(planetName) ? '⭐ Favorited' : '☆ Add to Favorites';
            favoriteButton.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: ${this.isFavorite(planetName) ? '#ffd700' : 'rgba(255, 215, 0, 0.2)'};
                color: ${this.isFavorite(planetName) ? '#000' : '#ffd700'};
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                z-index: 10;
            `;

            favoriteButton.addEventListener('click', () => {
                this.toggleFavorite(planetName);
            });

            favoriteButton.addEventListener('mouseenter', () => {
                favoriteButton.style.transform = 'scale(1.05)';
            });

            favoriteButton.addEventListener('mouseleave', () => {
                favoriteButton.style.transform = 'scale(1)';
            });

            header.style.position = 'relative';
            header.appendChild(favoriteButton);
        }
    }

    updateFavoriteButton(planetName, isFavorite) {
        const button = document.querySelector('.favorite-button');
        if (button) {
            button.innerHTML = isFavorite ? '⭐ Favorited' : '☆ Add to Favorites';
            button.style.background = isFavorite ? '#ffd700' : 'rgba(255, 215, 0, 0.2)';
            button.style.color = isFavorite ? '#000' : '#ffd700';
        }
    }

    addFavoriteIndicators() {
        const planetCards = document.querySelectorAll('.planet-card');
        planetCards.forEach(card => {
            const planetName = card.querySelector('h2')?.textContent.trim();
            if (planetName && this.isFavorite(planetName)) {
                this.addFavoriteIndicator(card);
            }
        });
    }

    addFavoriteIndicator(card) {
        if (!card.querySelector('.favorite-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'favorite-indicator';
            indicator.innerHTML = '⭐';
            indicator.style.cssText = `
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: rgba(255, 215, 0, 0.9);
                color: #000;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                z-index: 5;
            `;
            
            card.style.position = 'relative';
            card.appendChild(indicator);
        }
    }

    showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.favorite-notification');
        if (existing) {
            existing.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'favorite-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #ffd700;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.3);
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    getFavorites() {
        return [...this.favorites];
    }

    getFavoriteCount() {
        return this.favorites.length;
    }

    clearAllFavorites() {
        this.favorites = [];
        this.saveFavorites();
        this.showNotification('All favorites cleared');
        // Refresh the page to update UI
        window.location.reload();
    }
}

// Initialize favorites manager
let favoritesManager;
document.addEventListener('DOMContentLoaded', () => {
    favoritesManager = new FavoritesManager();
});

// Export for use in other scripts
window.FavoritesManager = FavoritesManager;