// js/shared-header.js

document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.querySelector('header');
    if (!headerElement) return;

    // Get current page to set 'active' class on the correct link
    const currentPage = window.location.pathname.split('/').pop();

    // Determine the correct base path for links and scripts
    // For local dev, path is relative from 'pages'. For deployed, it's from root.
    const isPagesDirectory = window.location.pathname.includes('/pages/');
    const basePath = isPagesDirectory ? '' : 'pages/';
    const rootPath = isPagesDirectory ? '../' : './';

    const headerHTML = `
        <div class="header-content-new">
            <div class="logo-section">
                <a href="${rootPath}index.html" class="logo-link">Solar System</a>
            </div>
            
            <nav class="main-nav">
                <a href="${basePath}3d-simulator.html" class="nav-link ${currentPage === '3d-simulator.html' ? 'active' : ''}" data-i18n="3d_simulator">3D Simulator</a>
                <a href="${basePath}charts.html" class="nav-link ${currentPage === 'charts.html' ? 'active' : ''}" data-i18n="charts">Charts</a>
                <a href="${basePath}education.html" class="nav-link ${currentPage === 'education.html' ? 'active' : ''}" data-i18n="education">Education</a>
                <a href="${basePath}api.html" class="nav-link ${currentPage === 'api.html' ? 'active' : ''}" data-i18n="api">API</a>
                <a href="${basePath}search.html" class="nav-link ${currentPage === 'search.html' ? 'active' : ''}" data-i18n="search">Search</a>
                <a href="${basePath}user-system.html" class="nav-link ${currentPage === 'user-system.html' ? 'active' : ''}" data-i18n="user_account">Account</a>
            </nav>

            <div class="header-actions-new">
                <button id="favoritesButton" class="action-button-new">
                    <span class="icon">⭐</span>
                    <span class="text" data-i18n="favorites">Favorites</span>
                    (<span id="favoritesCount">0</span>)
                </button>

                <button id="language-switcher" class="action-button-new">
                    <span id="lang-flag">🇨🇳</span>
                    <span id="lang-name" class="text" data-i18n="language">中文</span>
                </button>

                <button id="themeToggle" class="action-button-new">
                    <span class="icon">🌙</span>
                </button>
            </div>
        </div>
    `;

    headerElement.innerHTML = headerHTML;
    
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
