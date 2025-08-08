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
        return [
            {
                name: 'Sun',
                displayName: 'SUN',
                description: 'The center of our solar system',
                image: '../images/sun.jpg',
                url: 'sun.html',
                keywords: ['star', 'center', 'hot', 'fusion']
            },
            {
                name: 'Mercury',
                displayName: 'MERCURY',
                description: 'The smallest and innermost planet',
                image: '../images/mercury.jpg',
                url: 'mercury.html',
                keywords: ['smallest', 'closest', 'hot', 'fastest']
            },
            {
                name: 'Venus',
                displayName: 'VENUS',
                description: 'The hottest planet with thick atmosphere',
                image: '../images/venus.jpg',
                url: 'venus.html',
                keywords: ['hottest', 'thick', 'atmosphere', 'greenhouse']
            },
            {
                name: 'Earth',
                displayName: 'EARTH',
                description: 'Our home planet with life',
                image: '../images/earth.jpg',
                url: 'earth.html',
                keywords: ['home', 'life', 'water', 'blue', 'habitable']
            },
            {
                name: 'Mars',
                displayName: 'MARS',
                description: 'The red planet with polar ice caps',
                image: '../images/mars.jpg',
                url: 'mars.html',
                keywords: ['red', 'iron', 'oxide', 'polar', 'ice', 'rover']
            },
            {
                name: 'Jupiter',
                displayName: 'JUPITER',
                description: 'The largest planet, gas giant',
                image: '../images/jupiter.jpg',
                url: 'jupiter.html',
                keywords: ['largest', 'gas', 'giant', 'great', 'red', 'spot']
            },
            {
                name: 'Saturn',
                displayName: 'SATURN',
                description: 'The ringed planet, most beautiful',
                image: '../images/saturn.jpg',
                url: 'saturn.html',
                keywords: ['rings', 'beautiful', 'gas', 'giant']
            },
            {
                name: 'Uranus',
                displayName: 'URANUS',
                description: 'The ice giant, tilted on its side',
                image: '../images/uranus.jpg',
                url: 'uranus.html',
                keywords: ['ice', 'giant', 'tilted', 'sideways']
            },
            {
                name: 'Neptune',
                displayName: 'NEPTUNE',
                description: 'The windiest planet, deep blue',
                image: '../images/neptune.jpg',
                url: 'neptune.html',
                keywords: ['windy', 'blue', 'ice', 'giant', 'storms']
            }
        ];
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
                <img src="${planet.image}" alt="${planet.name}" class="result-image" onerror="this.src='../images/icon-192x192.png'">
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