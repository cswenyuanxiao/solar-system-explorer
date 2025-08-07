// js/shared-header.js

document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.querySelector('header');
    if (!headerElement) return;

    // Get current page to set 'active' class on the correct link
    const currentPage = window.location.pathname.split('/').pop();

    // 简化的路径处理逻辑
    const isPagesDirectory = window.location.pathname.includes('/pages/');
    const basePath = isPagesDirectory ? '' : 'pages/';
    const rootPath = isPagesDirectory ? '../' : './';

    const headerHTML = `
        <div class="header__content">
            <div class="header__logo">
                <h1 class="header__title" data-i18n="main_title">SOLAR SYSTEM EXPLORER</h1>
                <p class="header__subtitle" data-i18n="subtitle">Exploring the cosmos through NASA's lens</p>
            </div>
            
            <div class="header__search">
                <div class="search-box">
                    <input type="text" id="mainSearchInput" class="search-box__input" placeholder="Search planets and missions..." autocomplete="off" data-i18n-placeholder="search_placeholder">
                    <button id="mainSearchButton" class="search-box__button" data-i18n="search_button">SEARCH</button>
                </div>
                <div class="search-results" id="mainSearchResults" style="display: none;"></div>
            </div>
            
            <div class="header__actions">
                <a href="charts.html" class="btn" data-i18n="charts">DATA VISUALIZATION</a>
                <a href="education.html" class="btn" data-i18n="education">LEARNING RESOURCES</a>
                <a href="api.html" class="btn" data-i18n="api">NASA API</a>
                <button id="favoritesButton" class="btn btn--favorites">
                    <span class="btn__icon">❤️</span>
                    <span class="btn__text">Favorites</span>
                    <span id="favoritesCount" class="btn__count">(0)</span>
                </button>
                <button id="language-switcher" class="btn btn--language">
                    <span id="lang-flag" class="btn__flag">🇺🇸</span>
                    <span id="lang-name" class="btn__text">English</span>
                </button>
                <button id="theme-toggle" class="btn btn--theme">
                    <span class="btn__icon">🌙</span>
                    <span class="btn__text" data-i18n="dark_mode">Dark Mode</span>
                </button>
            </div>
        </div>
    `;

    headerElement.innerHTML = headerHTML;
    
    // 添加导航链接点击事件处理
    addNavigationHandlers();
    
    // After creating the header, re-initialize components that depend on it
    if (typeof initializeTheme === 'function') {
        initializeTheme();
    }
    if (typeof updateFavoritesCount === 'function') {
        updateFavoritesCount();
    }
    if (typeof languageManager !== 'undefined') {
        languageManager.translatePage();
        updateLanguageSwitcherUI(); // A new function to update our new switcher
    }
});

// 添加导航处理函数
function addNavigationHandlers() {
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 确保导航正常工作
            if (href && !href.startsWith('http')) {
                console.log('🔗 导航到:', href);
                
                // 使用window.location进行导航，确保页面完全重新加载
                window.location.href = href;
                
                // 阻止默认行为，使用我们的导航逻辑
                e.preventDefault();
            }
        });
    });
}

function updateLanguageSwitcherUI() {
    const langFlag = document.getElementById('lang-flag');
    const langName = document.getElementById('lang-name');

    if (langFlag && langName && typeof languageManager !== 'undefined') {
        const currentLangKey = languageManager.currentLanguage;
        const currentLangData = LANGUAGES[currentLangKey];
        if (currentLangData) {
            langFlag.textContent = currentLangData.flag;
            langName.textContent = currentLangData.name;
        }
    }
}

// We need to update the language switcher on language change.
// This requires modifying the LanguageManager in languages.js
function onLanguageChange() {
    updateLanguageSwitcherUI();
}
