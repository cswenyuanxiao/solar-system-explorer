// js/shared-header.js

document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.querySelector('header');
    if (!headerElement) return;

    const currentPage = window.location.pathname.split('/').pop();
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
                <button id="language-switcher" class="btn btn--language" aria-haspopup="true" aria-expanded="false">
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

    // Create language menu lazily on first open
    let langMenuEl = null;
    function buildLanguageMenu() {
        if (langMenuEl) return langMenuEl;
        // Only show languages for which we have TRANSLATIONS (avoid showing incomplete languages)
        const available = (typeof TRANSLATIONS !== 'undefined') ? Object.keys(TRANSLATIONS) : ['en', 'zh'];
        const langsMeta = (typeof LANGUAGES !== 'undefined') ? LANGUAGES : { en: { name: 'English', flag: '🇺🇸' }, zh: { name: '中文', flag: '🇨🇳' } };
        langMenuEl = document.createElement('div');
        langMenuEl.className = 'lang-menu';
        langMenuEl.setAttribute('role', 'menu');
        langMenuEl.innerHTML = available.map(code => {
            const info = langsMeta[code] || { name: code, flag: '🏳️' };
            return `<button class="lang-menu__item" data-lang="${code}" role="menuitem">${info.flag} ${info.name}</button>`;
        }).join('');
        document.body.appendChild(langMenuEl);

        // Click handler
        langMenuEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-menu__item');
            if (!btn) return;
            const lang = btn.getAttribute('data-lang');
            if (typeof window.setLanguage === 'function') {
                window.setLanguage(lang);
            } else if (window.languageManager) {
                window.languageManager.setLanguage(lang);
            }
            hideMenu();
        });
        return langMenuEl;
    }

    function positionMenu(button) {
        const rect = button.getBoundingClientRect();
        langMenuEl.style.minWidth = rect.width + 'px';
        langMenuEl.style.top = (window.scrollY + rect.bottom + 6) + 'px';
        langMenuEl.style.left = (window.scrollX + rect.left) + 'px';
    }

    function showMenu(button) {
        buildLanguageMenu();
        positionMenu(button);
        langMenuEl.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        document.addEventListener('click', onDocClick);
        window.addEventListener('resize', onWindow);
        window.addEventListener('scroll', onWindow, { passive: true });
    }

    function hideMenu() {
        if (!langMenuEl) return;
        langMenuEl.classList.remove('is-open');
        document.getElementById('language-switcher')?.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', onDocClick);
        window.removeEventListener('resize', onWindow);
        window.removeEventListener('scroll', onWindow);
    }

    function onDocClick(e) {
        const button = document.getElementById('language-switcher');
        if (!button) return;
        if (e.target.closest('#language-switcher') || (langMenuEl && e.target.closest('.lang-menu'))) return;
        hideMenu();
    }

    function onWindow() {
        const button = document.getElementById('language-switcher');
        if (button && langMenuEl && langMenuEl.classList.contains('is-open')) positionMenu(button);
    }

    const langBtn = document.getElementById('language-switcher');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            // prevent LanguageManager's global click handler from also toggling language
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (langMenuEl && langMenuEl.classList.contains('is-open')) hideMenu();
            else showMenu(langBtn);
        });
    }

    // Re-init dependencies
    addNavigationHandlers();
    if (typeof initializeTheme === 'function') initializeTheme();
    if (typeof updateFavoritesCount === 'function') updateFavoritesCount();
    if (typeof languageManager !== 'undefined') {
        // If languageManager already exists, ensure header is translated
        try {
            languageManager.translatePage();
            updateLanguageSwitcherUI();
        } catch (err) {
            console.warn('LanguageManager exists but translation failed:', err);
        }
    }

    // Listen for global language change events to re-translate header
    document.addEventListener('languageChanged', () => {
        try {
            if (typeof languageManager !== 'undefined') {
                languageManager.translatePage();
            }
            updateLanguageSwitcherUI();
        } catch (err) {
            console.warn('Failed to update header on languageChanged:', err);
        }
    });
});

function addNavigationHandlers() {
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http')) {
                window.location.href = href;
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

function onLanguageChange() {
    updateLanguageSwitcherUI();
}
