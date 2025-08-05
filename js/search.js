// Search functionality for Solar System Explorer
// Uses unified planet data source to avoid duplication

class SearchEngine {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.searchResults = document.getElementById('searchResults');
        
        this.initializeEventListeners();
        this.displayAllPlanets();
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
            // Search in name
            if (planet.name.toLowerCase().includes(searchTerm) ||
                planet.displayName.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in description
            if (planet.description.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in keywords
            return planet.keywords.some(keyword => 
                keyword.toLowerCase().includes(searchTerm)
            );
        });
    }

    // Fallback local planet data (for backward compatibility)
    getLocalPlanets() {
        return [
            {
                name: 'Sun',
                displayName: 'THE SUN',
                description: 'Our star - the heart of the solar system',
                image: '../images/sun.jpg',
                url: 'sun.html',
                keywords: ['star', 'solar', 'fusion', 'energy', 'light', 'heat']
            },
            {
                name: 'Mercury',
                displayName: 'MERCURY',
                description: 'The smallest planet, closest to the Sun',
                image: '../images/mercury.jpg',
                url: 'mercury.html',
                keywords: ['smallest', 'closest', 'hot', 'cold', 'extreme', 'temperature']
            },
            {
                name: 'Venus',
                displayName: 'VENUS',
                description: 'The hottest planet, Earth\'s twin',
                image: '../images/venus.jpg',
                url: 'venus.html',
                keywords: ['hottest', 'twin', 'greenhouse', 'thick', 'atmosphere', 'backwards']
            },
            {
                name: 'Earth',
                displayName: 'EARTH',
                description: 'Our home planet, the blue marble',
                image: '../images/earth.jpg',
                url: 'earth.html',
                keywords: ['home', 'blue', 'life', 'water', 'atmosphere', 'habitable']
            },
            {
                name: 'Mars',
                displayName: 'MARS',
                description: 'The red planet, future human destination',
                image: '../images/mars.jpg',
                url: 'mars.html',
                keywords: ['red', 'rust', 'future', 'human', 'colonization', 'rovers']
            },
            {
                name: 'Jupiter',
                displayName: 'JUPITER',
                description: 'The largest planet, gas giant',
                image: '../images/jupiter.jpg',
                url: 'jupiter.html',
                keywords: ['largest', 'gas', 'giant', 'great', 'red', 'spot', 'moons']
            },
            {
                name: 'Saturn',
                displayName: 'SATURN',
                description: 'The ringed planet, most beautiful',
                image: '../images/saturn.jpg',
                url: 'saturn.html',
                keywords: ['rings', 'beautiful', 'gas', 'giant', 'float', 'water']
            },
            {
                name: 'Uranus',
                displayName: 'URANUS',
                description: 'The ice giant, tilted on its side',
                image: '../images/uranus.jpg',
                url: 'uranus.html',
                keywords: ['ice', 'giant', 'tilted', 'sideways', 'cold', 'methane']
            },
            {
                name: 'Neptune',
                displayName: 'NEPTUNE',
                description: 'The windiest planet, deep blue',
                image: '../images/neptune.jpg',
                url: 'neptune.html',
                keywords: ['windy', 'blue', 'ice', 'giant', 'storms', 'farthest']
            }
        ];
    }

    displayResults(results, query = '') {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>No planets found for "${query}"</p>
                    <p>Try searching for: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune</p>
                </div>
            `;
            return;
        }

        this.searchResults.innerHTML = results.map(planet => `
            <a href="${planet.url}" class="search-result-card">
                <img src="${planet.image}" alt="${planet.name}" class="result-image" 
                     onerror="this.src='images/placeholder.jpg'">
                <div class="result-info">
                    <h3 class="result-title">${this.highlightText(planet.name, query)}</h3>
                    <p class="result-description">${this.highlightText(planet.description, query)}</p>
                </div>
            </a>
        `).join('');
    }

    displayAllPlanets() {
        this.displayResults(planets);
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