// 🔧 Solar System Explorer - 搜索功能修复脚本
// 直接在浏览器控制台运行此脚本来修复搜索功能

console.log('🚀 开始修复搜索功能...');

// 1. 修复主页集成搜索功能
function fixMainIntegrationSearch() {
    console.log('🔧 修复主页搜索功能...');
    
    // 创建完整的MainIntegration类
    class MainIntegration {
        constructor() {
            this.planets = [
                {
                    name: 'Sun',
                    displayName: 'SUN',
                    description: 'The center of our solar system, a massive star',
                    image: '../images/sun.jpg',
                    url: 'sun.html',
                    keywords: ['star', 'center', 'hot', 'fusion', 'energy', 'massive']
                },
                {
                    name: 'Mercury',
                    displayName: 'MERCURY',
                    description: 'The smallest and innermost planet',
                    image: '../images/mercury.jpg',
                    url: 'mercury.html',
                    keywords: ['smallest', 'closest', 'hot', 'fastest', 'cratered']
                },
                {
                    name: 'Venus',
                    displayName: 'VENUS',
                    description: 'The hottest planet with thick atmosphere',
                    image: '../images/venus.jpg',
                    url: 'venus.html',
                    keywords: ['hottest', 'thick', 'atmosphere', 'greenhouse', 'clouds']
                },
                {
                    name: 'Earth',
                    displayName: 'EARTH',
                    description: 'Our home planet with life and water',
                    image: '../images/earth.jpg',
                    url: 'earth.html',
                    keywords: ['home', 'life', 'water', 'blue', 'habitable', 'third']
                },
                {
                    name: 'Mars',
                    displayName: 'MARS',
                    description: 'The red planet with polar ice caps',
                    image: '../images/mars.jpg',
                    url: 'mars.html',
                    keywords: ['red', 'iron', 'oxide', 'polar', 'ice', 'rover', 'fourth']
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
            console.log('✅ 主页搜索功能已初始化');
        }

        initializeSearch() {
            // 创建搜索界面（如果不存在）
            this.createSearchInterface();
            
            const searchInput = document.getElementById('mainSearchInput');
            const searchButton = document.getElementById('mainSearchButton');
            const searchResults = document.getElementById('mainSearchResults');

            if (!searchInput || !searchResults) {
                console.warn('⚠️ 搜索元素未找到，已创建新的搜索界面');
                return;
            }

            // 搜索输入事件
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });

            // 搜索按钮点击
            if (searchButton) {
                searchButton.addEventListener('click', () => {
                    this.performSearch(searchInput.value);
                });
            }

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

        createSearchInterface() {
            // 检查是否已存在搜索界面
            if (document.getElementById('mainSearchInput')) return;

            // 创建搜索界面
            const header = document.querySelector('header') || document.querySelector('.header');
            if (!header) {
                console.warn('⚠️ 找不到header元素');
                return;
            }

            const searchContainer = document.createElement('div');
            searchContainer.className = 'main-search-container';
            searchContainer.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                z-index: 1000;
            `;

            searchContainer.innerHTML = `
                <div style="display: flex; position: relative;">
                    <input type="text" id="mainSearchInput" placeholder="Search planets..." 
                           style="width: 250px; padding: 0.5rem 1rem; border-radius: 20px; border: none; 
                                  background: rgba(255,255,255,0.1); color: white; backdrop-filter: blur(10px);">
                    <button id="mainSearchButton" 
                            style="margin-left: 0.5rem; padding: 0.5rem 1rem; border-radius: 20px; border: none; 
                                   background: rgba(255,215,0,0.2); color: #ffd700; cursor: pointer;">🔍</button>
                    <div id="mainSearchResults" style="
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(0, 0, 0, 0.9);
                        border-radius: 0 0 10px 10px;
                        max-height: 300px;
                        overflow-y: auto;
                        z-index: 1000;
                        display: none;
                        backdrop-filter: blur(10px);
                    "></div>
                </div>
            `;

            header.style.position = 'relative';
            header.appendChild(searchContainer);
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
                    <div class="search-result-item" style="padding: 1rem; color: white; text-align: center;">
                        <div style="font-weight: bold; color: #ffd700; margin-bottom: 0.25rem;">No results found</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">Try: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune</div>
                    </div>
                `;
            } else {
                searchResults.innerHTML = results.map(planet => `
                    <a href="${planet.url}" class="search-result-item" style="
                        padding: 1rem;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        color: white;
                        text-decoration: none;
                        display: block;
                        transition: background 0.2s ease;
                    " onmouseover="this.style.background='rgba(255, 215, 0, 0.1)'" 
                       onmouseout="this.style.background='transparent'">
                        <div style="font-weight: bold; color: #ffd700; margin-bottom: 0.25rem;">
                            ${this.highlightText(planet.name, query)}
                        </div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">
                            ${this.highlightText(planet.description, query)}
                        </div>
                    </a>
                `).join(''); // 🔧 修复：这里原来是 .joi
            }
            
            searchResults.style.display = 'block';
        }

        highlightText(text, query) {
            if (!query.trim()) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark style="background: #ffd700; color: #000; padding: 0 2px; border-radius: 2px;">$1</mark>');
        }
    }

    // 初始化主页搜索
    window.mainIntegration = new MainIntegration();
    window.mainIntegration.initialize();
}

// 2. 修复独立搜索页面
function fixSearchPage() {
    console.log('🔧 修复搜索页面功能...');
    
    class SearchEngine {
        constructor() {
            this.searchInput = document.getElementById('searchInput');
            this.searchButton = document.getElementById('searchButton');
            this.searchResults = document.getElementById('searchResults');
            
            if (this.searchInput && this.searchResults) {
                this.init();
            }
        }

        init() {
            this.planets = this.getLocalPlanets();
            this.bindEvents();
            this.displayAllPlanets();
            console.log('✅ 搜索页面功能已初始化');
        }

        bindEvents() {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            if (this.searchButton) {
                this.searchButton.addEventListener('click', () => {
                    this.handleSearch(this.searchInput.value);
                });
            }

            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(this.searchInput.value);
                }
            });
        }

        handleSearch(query) {
            if (!query.trim()) {
                this.displayAllPlanets();
                return;
            }

            this.showLoading();
            setTimeout(() => {
                const results = this.searchPlanets(query);
                this.displayResults(results, query);
            }, 100);
        }

        searchPlanets(query) {
            const searchTerm = query.toLowerCase().trim();
            
            return this.planets.filter(planet => {
                if (planet.name.toLowerCase().includes(searchTerm)) return true;
                if (planet.description.toLowerCase().includes(searchTerm)) return true;
                return planet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
            });
        }

        displayResults(results, query = '') {
            if (!results || results.length === 0) {
                this.searchResults.innerHTML = `
                    <div class="no-results" style="text-align: center; padding: 2rem; opacity: 0.7; color: white;">
                        <p>No results found for "${query}"</p>
                        <p style="font-size: 0.9rem; margin-top: 1rem;">Try: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune</p>
                    </div>
                `;
                return;
            }

            this.searchResults.innerHTML = results.map(planet => `
                <a href="${planet.url}" class="search-result-card" style="
                    display: flex;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 1rem;
                    text-decoration: none;
                    color: white;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                    margin-bottom: 1rem;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-3px)'" 
                   onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">
                    <img src="${planet.image}" alt="${planet.name}" style="
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin-right: 1rem;
                    " onerror="this.src='../images/placeholder.jpg'">
                    <div class="result-info">
                        <h3 style="margin: 0 0 0.5rem 0; color: #ffd700;">${this.highlightText(planet.name, query)}</h3>
                        <p style="margin: 0; opacity: 0.8; line-height: 1.4;">${this.highlightText(planet.description, query)}</p>
                    </div>
                </a>
            `).join('');
        }

        displayAllPlanets() {
            this.displayResults(this.planets, '');
        }

        getLocalPlanets() {
            return [
                {
                    name: 'Sun',
                    description: 'The center of our solar system, a massive star',
                    image: '../images/sun.jpg',
                    url: 'sun.html',
                    keywords: ['star', 'center', 'hot', 'fusion', 'energy', 'massive']
                },
                {
                    name: 'Mercury',
                    description: 'The smallest and innermost planet',
                    image: '../images/mercury.jpg',
                    url: 'mercury.html',
                    keywords: ['smallest', 'closest', 'hot', 'fastest', 'cratered']
                },
                {
                    name: 'Venus',
                    description: 'The hottest planet with thick atmosphere',
                    image: '../images/venus.jpg',
                    url: 'venus.html',
                    keywords: ['hottest', 'thick', 'atmosphere', 'greenhouse', 'clouds']
                },
                {
                    name: 'Earth',
                    description: 'Our home planet with life and water',
                    image: '../images/earth.jpg',
                    url: 'earth.html',
                    keywords: ['home', 'life', 'water', 'blue', 'habitable', 'third']
                },
                {
                    name: 'Mars',
                    description: 'The red planet with polar ice caps',
                    image: '../images/mars.jpg',
                    url: 'mars.html',
                    keywords: ['red', 'iron', 'oxide', 'polar', 'ice', 'rover', 'fourth']
                },
                {
                    name: 'Jupiter',
                    description: 'The largest planet, gas giant',
                    image: '../images/jupiter.jpg',
                    url: 'jupiter.html',
                    keywords: ['largest', 'gas', 'giant', 'great', 'red', 'spot', 'moons']
                },
                {
                    name: 'Saturn',
                    description: 'The ringed planet, most beautiful',
                    image: '../images/saturn.jpg',
                    url: 'saturn.html',
                    keywords: ['rings', 'beautiful', 'gas', 'giant', 'float', 'water']
                },
                {
                    name: 'Uranus',
                    description: 'The ice giant, tilted on its side',
                    image: '../images/uranus.jpg',
                    url: 'uranus.html',
                    keywords: ['ice', 'giant', 'tilted', 'sideways', 'cold', 'methane']
                },
                {
                    name: 'Neptune',
                    description: 'The windiest planet, deep blue',
                    image: '../images/neptune.jpg',
                    url: 'neptune.html',
                    keywords: ['windy', 'blue', 'ice', 'giant', 'storms', 'farthest']
                }
            ];
        }

        highlightText(text, query) {
            if (!query.trim()) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark style="background: #ffd700; color: #000; padding: 0 2px; border-radius: 2px;">$1</mark>');
        }

        showLoading() {
            this.searchResults.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: white;">
                    <div style="
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(255, 215, 0, 0.3);
                        border-radius: 50%;
                        border-top-color: #ffd700;
                        animation: spin 1s ease-in-out infinite;
                        margin: 2rem auto;
                    "></div>
                    <p>Searching...</p>
                </div>
            `;
        }
    }

    // 初始化搜索页面（仅在搜索页面）
    if (document.getElementById('searchInput')) {
        window.searchEngine = new SearchEngine();
    }
}

// 3. 添加CSS动画
function addCSSAnimations() {
    console.log('🎨 添加CSS动画...');
    
    // 检查是否已存在动画样式
    if (document.getElementById('search-animations')) return;

    const style = document.createElement('style');
    style.id = 'search-animations';
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .search-result-item:hover {
            background: rgba(255, 215, 0, 0.1) !important;
        }
        
        .search-result-card:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: translateY(-3px) !important;
        }
        
        mark {
            background: #ffd700 !important;
            color: #000 !important;
            padding: 0 2px !important;
            border-radius: 2px !important;
        }
        
        .main-search-container input:focus {
            outline: 2px solid rgba(255, 215, 0, 0.5);
            background: rgba(255, 255, 255, 0.15) !important;
        }
        
        .main-search-container button:hover {
            background: rgba(255, 215, 0, 0.3) !important;
            transform: scale(1.05);
        }
    `;
    
    document.head.appendChild(style);
}

// 4. 检查和修复路径问题
function fixPaths() {
    console.log('🔗 检查路径问题...');
    
    // 检查当前页面位置
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    
    // 修复图片路径
    document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('images/') && isInPagesFolder) {
            img.src = '../' + src;
            console.log(`🔧 修复图片路径: ${src} -> ../${src}`);
        }
    });
    
    // 修复链接路径
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
            if (isInPagesFolder && !href.startsWith('../') && href !== 'index.html') {
                // 如果在pages文件夹中，确保相对路径正确
                if (!href.includes('/')) {
                    // 这是同级页面链接，保持不变
                    console.log(`✅ 页面链接正确: ${href}`);
                }
            }
        }
    });
}

// 5. 主修复函数
function runSearchFix() {
    console.log('🚀 启动搜索功能修复...');
    
    try {
        // 修复路径问题
        fixPaths();
        
        // 添加CSS动画
        addCSSAnimations();
        
        // 修复主页搜索功能
        fixMainIntegrationSearch();
        
        // 修复搜索页面功能
        fixSearchPage();
        
        console.log('✅ 搜索功能修复完成！');
        console.log('🎯 请测试以下功能：');
        console.log('   1. 在主页搜索框输入 "earth"');
        console.log('   2. 访问 search.html 页面测试独立搜索');
        console.log('   3. 尝试搜索关键词: red, largest, rings');
        
        // 显示成功消息
        if (typeof showNotification === 'function') {
            showNotification('搜索功能修复完成！', 'success');
        } else {
            // 创建临时通知
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 255, 0, 0.8);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                z-index: 10000;
                backdrop-filter: blur(10px);
            `;
            notification.textContent = '✅ 搜索功能修复完成！';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
    } catch (error) {
        console.error('❌ 修复过程中出现错误:', error);
        alert('修复过程中出现错误，请查看控制台获取详细信息');
    }
}

// 6. 自动检测并运行修复
function autoDetectAndFix() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runSearchFix);
    } else {
        // DOM已加载，立即运行
        setTimeout(runSearchFix, 100);
    }
}

// 导出函数供手动调用
window.fixSearchFunction = runSearchFix;
window.searchFixUtils = {
    fixMainIntegrationSearch,
    fixSearchPage,
    addCSSAnimations,
    fixPaths,
    runSearchFix
};

console.log('📝 修复脚本已加载！');
console.log('🔧 自动修复将在DOM加载完成后运行');
console.log('💡 您也可以手动运行: window.fixSearchFunction()');

// 自动运行修复
autoDetectAndFix();