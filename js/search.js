// Search functionality for Solar System Explorer
// Uses unified planet data source to avoid duplication

class SearchEngine {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.searchResults = document.getElementById('searchResults');
        
        this.initializeEventListeners();
        this.displayAllPlanets();

        // Re-translate dynamic placeholders when language changes
        document.addEventListener('languageChanged', () => {
            if (window.languageManager) {
                window.languageManager.translatePage();
            }
            // Re-render results text
            if (!this.searchInput.value.trim()) this.displayAllPlanets();
        });
    }

    initializeEventListeners() {
        // Search on input change
        this.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Search on button click
        this.searchButton.addEventListener('click', () => {
            this.performSearch(this.searchInput.value);
        });

        // Search on Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(this.searchInput.value);
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) {
            this.displayAllPlanets();
            return;
        }

        const results = this.searchPlanets(query);
        this.displayResults(results, query);
    }

    searchPlanets(query) {
        // Use unified planet data if available, otherwise fall back to local data
        const planets = window.planetData ? window.planetData.getAllPlanets() : this.getLocalPlanets();
        const searchTerm = query.toLowerCase().trim();
        
        return planets.filter(planet => {
            if (planet.name.toLowerCase().includes(searchTerm) ||
                planet.displayName.toLowerCase().includes(searchTerm)) return true;
            if (planet.description.toLowerCase().includes(searchTerm)) return true;
            return planet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
        });
    }

    // Fallback local planet data (for backward compatibility)
    getLocalPlanets() {
        return (window.planetData ? window.planetData.getAllPlanets() : []);
    }

    displayResults(results, query = '') {
        const t = (key) => (window.languageManager ? window.languageManager.getText(key) : key);

        if (!results || results.length === 0) {
            const msg = t('no_results') || 'No results found';
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>${msg} "${query}"</p>
                </div>
            `;
            return;
        }

        this.searchResults.innerHTML = results.map(planet => `
            <a href="${planet.url}" class="search-result-card">
                <img src="${planet.image}" alt="${planet.name}" class="result-image" onerror="this.src='images/placeholder.jpg'">
                <div class="result-info">
                    <h3 class="result-title">${this.highlightText(planet.name, query)}</h3>
                    <p class="result-description">${this.highlightText(planet.description, query)}</p>
                </div>
            </a>
        `).join('');
    }

    displayAllPlanets() {
        const all = window.planetData ? window.planetData.getAllPlanets() : this.getLocalPlanets();
        this.displayResults(all, '');
    }

    highlightText(text, query) {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: #ffd700; color: #000;">$1</mark>');
    }

    showLoading() {
        this.searchResults.innerHTML = '<div class="loading"></div>';
    }
}

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SearchEngine();
});

// Add search functionality to main page
function addSearchToMainPage() {
    const header = document.querySelector('header .header-content');
    if (header && !document.querySelector('.main-search')) {
        const searchLink = document.createElement('a');
        searchLink.href = 'search.html';
        searchLink.className = 'main-search';
        searchLink.innerHTML = '🔍 Search Planets';
        searchLink.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 215, 0, 0.2);
            color: #ffd700;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            text-decoration: none;
            transition: all 0.3s ease;
        `;
        
        searchLink.addEventListener('mouseenter', () => {
            searchLink.style.background = 'rgba(255, 215, 0, 0.3)';
            searchLink.style.transform = 'scale(1.05)';
        });
        
        searchLink.addEventListener('mouseleave', () => {
            searchLink.style.background = 'rgba(255, 215, 0, 0.2)';
            searchLink.style.transform = 'scale(1)';
        });
        
        header.style.position = 'relative';
        header.appendChild(searchLink);
    }
}

// Add search to main page if we're on it
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', addSearchToMainPage);
}