// 主页面集成功能 - 搜索、收藏、主题切换

class MainPageIntegration {
    constructor() {
        // Use unified planet data if available, otherwise fall back to local data
        this.planets = window.planetData ? window.planetData.getAllPlanets() : this.getLocalPlanets();

        this.favoritesManager = null;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.initialize();
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

    initialize() {
        this.initializeSearch();
        // Favorites removed
        this.initializeTheme();
        this.addFavoriteIndicators();
        this.updateFavoritesCount();
    }

    // 搜索功能
    initializeSearch() {
        const searchInput = document.getElementById('mainSearchInput');
        const searchButton = document.getElementById('mainSearchButton');
        const searchResults = document.getElementById('mainSearchResults');

        if (!searchInput || !searchResults) return;

        // 搜索输入事件
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // 搜索按钮点击
        searchButton.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });

        // 回车键搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });

        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    performSearch(query) {
        const searchResults = document.getElementById('mainSearchResults');
        if (!searchResults) return;

        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        const results = this.searchPlanets(query);
        this.displaySearchResults(results, query);
    }

    searchPlanets(query) {
        const searchTerm = query.toLowerCase().trim();
        
        return this.planets.filter(planet => {
            if (planet.name.toLowerCase().includes(searchTerm)) return true;
            if (planet.description.toLowerCase().includes(searchTerm)) return true;
            return planet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
        });
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('mainSearchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-title">No results found</div>
                    <div class="search-result-description">Try searching for: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune</div>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(planet => `
                <a href="${planet.url}" class="search-result-item">
                    <div class="search-result-title">${this.highlightText(planet.name, query)}</div>
                    <div class="search-result-description">${this.highlightText(planet.description, query)}</div>
                </a>
            `).join('');
        }

        searchResults.style.display = 'block';
    }

    highlightText(text, query) {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: #ffd700; color: #000;">$1</mark>');
    }

    // Favorites removed: drop related methods

    // 主题切换
    initializeTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            this.applyTheme();
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    applyTheme() {
        document.body.className = this.currentTheme + '-theme';
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.currentTheme === 'dark' ? '🌙' : '☀️';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    // 通知功能
    showNotification(message) {
        const notification = document.createElement('div');
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
        notification.textContent = message;

        // 添加动画样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// 初始化主页面集成
document.addEventListener('DOMContentLoaded', () => {
    new MainPageIntegration();
}); 