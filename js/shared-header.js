// js/shared-header.js

document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.querySelector('header');
    if (!headerElement) return;

    const currentPage = window.location.pathname.split('/').pop();
    const isPagesDirectory = window.location.pathname.includes('/pages/');
    const basePath = isPagesDirectory ? '' : 'pages/';
    const rootPath = isPagesDirectory ? '../' : './';

    const headerHTML = `
        <div class="header__content modern-header">
            <button id="menu-toggle" class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
            <a class="header__brand" href="index.html" aria-label="Home">
                <span class="brand__logo">🛰️</span>
                <div class="brand__text">
                    <h1 class="brand__title" data-i18n="main_title">SOLAR SYSTEM</h1>
                    <span class="brand__subtitle" data-i18n="subtitle">Explore with NASA data</span>
                </div>
            </a>

            <nav class="nav-links" aria-label="Primary">
                <a href="charts.html" class="nav-link" data-i18n="charts">Charts</a>
                <a href="education.html" class="nav-link" data-i18n="education">Education</a>
                <a href="api.html" class="nav-link" data-i18n="api">NASA API</a>
            </nav>

            <div class="header__search modern-search">
                <div class="search-box">
                    <input type="text" id="mainSearchInput" class="search-box__input" placeholder="Search everything..." autocomplete="off" data-i18n-placeholder="search_placeholder">
                    <button id="mainSearchButton" class="search-box__button" title="Search" aria-label="Search">🔍</button>
                </div>
                <div class="search-results" id="mainSearchResults" style="display: none;"></div>
            </div>

            <div class="header__actions">
                <button id="favoritesButton" class="btn btn--pill btn--favorites" aria-label="Favorites">
                    <span class="btn__icon">❤️</span>
                    <span class="btn__text" data-i18n="favorites">Favorites</span>
                    <span id="favoritesCount" class="btn__count">(0)</span>
                </button>
                <button id="language-switcher" class="btn btn--pill btn--language" aria-haspopup="true" aria-expanded="false">
                    <span id="lang-flag" class="btn__flag">🇺🇸</span>
                    <span id="lang-name" class="btn__text">English</span>
                </button>
                <button id="theme-toggle" class="btn btn--pill btn--theme theme-toggle" aria-label="Toggle theme">
                    <span class="btn__icon theme-icon">🌙</span>
                    <span class="btn__text theme-text" data-i18n="dark_mode">Dark</span>
                </button>
            </div>
        </div>
    `;

    headerElement.innerHTML = headerHTML;

    // Ensure global search is loaded on every page
    try {
        const alreadyLoaded = Array.from(document.scripts).some(s => (s.src || '').includes('/js/search.js'));
        if (!alreadyLoaded) {
            const s = document.createElement('script');
            s.src = rootPath + 'js/search.js?v=20250109';
            s.defer = true;
            document.body.appendChild(s);
        }
    } catch (e) { /* noop */ }

    // Create language menu lazily on first open
    let langMenuEl = null;
    // If language changes, remove any existing menu so it can be rebuilt with new data
    document.addEventListener('languageChanged', () => {
        try {
            if (langMenuEl) {
                langMenuEl.remove();
                langMenuEl = null;
            }
            updateLanguageSwitcherUI();
        } catch (e) { /* noop */ }
    });
    function buildLanguageMenu() {
        if (langMenuEl) return langMenuEl;
        // Ensure i18n is initialized so window.LANGUAGES / TRANSLATIONS are available
        if (typeof window.ensureLanguageManagerInitialized === 'function') {
            try { window.ensureLanguageManagerInitialized(); } catch (e) { /* ignore */ }
        }
        // Build a union of available language codes from global sources
        const availableSet = new Set();
        try {
            if (window.languageManager && typeof window.languageManager.getAvailableLanguages === 'function') {
                const fromManager = window.languageManager.getAvailableLanguages() || [];
                fromManager.forEach(item => {
                    const code = typeof item === 'string' ? item : item.code;
                    if (code) availableSet.add(code);
                });
            }
        } catch (e) {}
        try {
            if (window.LANGUAGES) Object.keys(window.LANGUAGES).forEach(k => availableSet.add(k));
        } catch (e) {}
        try {
            if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS) Object.keys(TRANSLATIONS).forEach(k => availableSet.add(k));
        } catch (e) {}
        // Ensure at least en and zh are present; also include es/fr/ja if metadata exists
        ['en', 'zh', 'es', 'fr', 'ja'].forEach(k => availableSet.add(k));
        const preferredOrder = ['zh', 'en'];
        const available = Array.from(availableSet).sort((a, b) => {
            const ia = preferredOrder.indexOf(a);
            const ib = preferredOrder.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
        });
        const langsMeta = (window.LANGUAGES || (typeof LANGUAGES !== 'undefined' ? LANGUAGES : null) ) || { en: { name: 'English', flag: '🇺🇸' }, zh: { name: '中文', flag: '🇨🇳' } };
        langMenuEl = document.createElement('div');
        langMenuEl.className = 'lang-menu';
        langMenuEl.setAttribute('role', 'menu');
        langMenuEl.innerHTML = available.map(code => {
            const info = langsMeta[code] || { name: code, flag: '🏳️' };
            return `<button class="lang-menu__item" data-lang="${code}" role="menuitem" tabindex="0">
                        <span class="lang-flag">${info.flag}</span>
                        <span class="lang-name">${info.name}</span>
                    </button>`;
        }).join('');
        document.body.appendChild(langMenuEl);

        // Click handler
        langMenuEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-menu__item');
            if (!btn) return;
            const lang = btn.getAttribute('data-lang');
            // ensure language manager exists before invoking
            if (typeof window.ensureLanguageManagerInitialized === 'function') {
                try { window.ensureLanguageManagerInitialized(); } catch (err) { /* ignore */ }
            }
            try {
                if (typeof window.setLanguage === 'function') {
                    window.setLanguage(lang);
                } else if (window.languageManager) {
                    window.languageManager.setLanguage(lang);
                }
            } finally {
                hideMenu();
            }
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
        // Ensure i18n ready before building/showing menu
        if (typeof window.ensureLanguageManagerInitialized === 'function') {
            try { window.ensureLanguageManagerInitialized(); } catch (e) { /* ignore */ }
        }
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

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const container = document.querySelector('.modern-header');
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            container?.classList.toggle('is-open');
        });
    }

    // Re-init dependencies
    addNavigationHandlers();
    if (typeof initializeTheme === 'function') initializeTheme();
    if (typeof updateFavoritesCount === 'function') updateFavoritesCount();
    // If languageManager exists, translate now; otherwise subscribe to languageChanged to translate later
    // Try to initialize or ensure languageManager is ready synchronously
    try {
        if (typeof window.ensureLanguageManagerInitialized === 'function') {
            window.ensureLanguageManagerInitialized();
        }
        if (window.languageManager) {
            try { window.languageManager.translatePage(); updateLanguageSwitcherUI(); } catch (err) { console.warn('LanguageManager exists but translation failed:', err); }
        } else {
            // fallback: subscribe to languageChanged once
            document.addEventListener('languageChanged', function onReadyOnce() { try { if (window.languageManager) { window.languageManager.translatePage(); updateLanguageSwitcherUI(); } } catch (e) {} finally { document.removeEventListener('languageChanged', onReadyOnce); } });
        }
    } catch (err) {
        console.warn('shared-header: failed ensuring languageManager ready', err);
    }

    // Listen for global language change events to re-translate header
    document.addEventListener('languageChanged', () => {
        try {
            // Prefer the global window.languageManager instance (assigned by languages.js)
            if (window.languageManager && typeof window.languageManager.translatePage === 'function') {
                window.languageManager.translatePage();
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
    // Use window.languageManager because some pages don't declare a global `languageManager` var
    if (langFlag && langName && window.languageManager) {
        const currentLangKey = window.languageManager.currentLanguage;
        const currentLangData = (typeof LANGUAGES !== 'undefined' && LANGUAGES[currentLangKey]) ? LANGUAGES[currentLangKey] : null;
        if (currentLangData) {
            langFlag.textContent = currentLangData.flag || '';
            langName.textContent = currentLangData.name || currentLangKey;
        } else {
            // Fallback: show code
            langFlag.textContent = '';
            langName.textContent = currentLangKey;
        }
    }
}

function onLanguageChange() {
    updateLanguageSwitcherUI();
}
