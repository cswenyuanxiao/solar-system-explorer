// Favorites System for Solar System Explorer

class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.initializeFavorites();
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem('solarSystemFavorites');
            return stored ? JSON.parse(stored) : [];
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

    addFavorite(planetName, planetData = {}) {
        if (!this.favorites.find(fav => fav.name === planetName)) {
            const favorite = {
                name: planetName,
                addedAt: new Date().toISOString(),
                ...planetData
            };
            this.favorites.push(favorite);
            this.saveFavorites();
            this.updateFavoritesUI();
            return true;
        }
        return false;
    }

    removeFavorite(planetName) {
        const index = this.favorites.findIndex(fav => fav.name === planetName);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.updateFavoritesUI();
            return true;
        }
        return false;
    }

    isFavorite(planetName) {
        return this.favorites.some(fav => fav.name === planetName);
    }

    getFavorites() {
        return [...this.favorites];
    }

    initializeFavorites() {
        // Add favorite buttons to planet pages
        this.addFavoriteButtons();
        
        // Add favorites link to header
        this.addFavoritesLink();
        
        // Update UI
        this.updateFavoritesUI();
    }

    addFavoriteButtons() {
        // Find planet name from page title or URL
        const planetName = this.getCurrentPlanetName();
        if (!planetName) return;

        const header = document.querySelector('header .header-content');
        if (!header) return;

        // Check if favorite button already exists
        if (document.querySelector('.favorite-btn')) return;

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = this.isFavorite(planetName) ? '★' : '☆';
        favoriteBtn.title = this.isFavorite(planetName) ? 'Remove from favorites' : 'Add to favorites';
        
        favoriteBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 215, 0, 0.2);
            color: #ffd700;
            border: none;
            font-size: 1.5rem;
            padding: 0.5rem;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        favoriteBtn.addEventListener('click', () => {
            this.toggleFavorite(planetName);
        });

        favoriteBtn.addEventListener('mouseenter', () => {
            favoriteBtn.style.background = 'rgba(255, 215, 0, 0.3)';
            favoriteBtn.style.transform = 'scale(1.1)';
        });

        favoriteBtn.addEventListener('mouseleave', () => {
            favoriteBtn.style.background = 'rgba(255, 215, 0, 0.2)';
            favoriteBtn.style.transform = 'scale(1)';
        });

        header.style.position = 'relative';
        header.appendChild(favoriteBtn);
    }

    addFavoritesLink() {
        const header = document.querySelector('header .header-content');
        if (!header || document.querySelector('.favorites-link')) return;

        const favoritesLink = document.createElement('a');
        favoritesLink.href = 'favorites.html';
        favoritesLink.className = 'favorites-link';
        favoritesLink.innerHTML = '❤️ Favorites';
        favoritesLink.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 5rem;
            background: rgba(255, 105, 180, 0.2);
            color: #ff69b4;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        `;

        favoritesLink.addEventListener('mouseenter', () => {
            favoritesLink.style.background = 'rgba(255, 105, 180, 0.3)';
            favoritesLink.style.transform = 'scale(1.05)';
        });

        favoritesLink.addEventListener('mouseleave', () => {
            favoritesLink.style.background = 'rgba(255, 105, 180, 0.2)';
            favoritesLink.style.transform = 'scale(1)';
        });

        header.appendChild(favoritesLink);
    }

    toggleFavorite(planetName) {
        const favoriteBtn = document.querySelector('.favorite-btn');
        if (!favoriteBtn) return;

        if (this.isFavorite(planetName)) {
            this.removeFavorite(planetName);
            favoriteBtn.innerHTML = '☆';
            favoriteBtn.title = 'Add to favorites';
            this.showNotification('Removed from favorites', 'info');
        } else {
            this.addFavorite(planetName);
            favoriteBtn.innerHTML = '★';
            favoriteBtn.title = 'Remove from favorites';
            this.showNotification('Added to favorites', 'success');
        }
    }

    updateFavoritesUI() {
        // Update favorite button if it exists
        const favoriteBtn = document.querySelector('.favorite-btn');
        if (favoriteBtn) {
            const planetName = this.getCurrentPlanetName();
            if (planetName) {
                favoriteBtn.innerHTML = this.isFavorite(planetName) ? '★' : '☆';
                favoriteBtn.title = this.isFavorite(planetName) ? 'Remove from favorites' : 'Add to favorites';
            }
        }

        // Update favorites count in link
        const favoritesLink = document.querySelector('.favorites-link');
        if (favoritesLink) {
            const count = this.favorites.length;
            favoritesLink.innerHTML = `❤️ Favorites (${count})`;
        }
    }

    getCurrentPlanetName() {
        // Try to get from page title
        const title = document.title;
        const planetMatch = title.match(/(Sun|Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune)/);
        if (planetMatch) {
            return planetMatch[1];
        }

        // Try to get from URL
        const path = window.location.pathname;
        const urlMatch = path.match(/(sun|mercury|venus|earth|mars|jupiter|saturn|uranus|neptune)\.html/);
        if (urlMatch) {
            return urlMatch[1].charAt(0).toUpperCase() + urlMatch[1].slice(1);
        }

        return null;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize favorites manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new FavoritesManager();
});