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
                <img class="brand__logo-img" src="${rootPath}images/logo.svg" alt="Solar System Explorer logo" width="28" height="28" />
                <div class="brand__text">
                    <h1 class="brand__title" data-i18n="main_title">Solar System Explorer</h1>
                    <span class="brand__subtitle" data-i18n="subtitle">NASA Data • Charts • Missions</span>
                </div>
            </a>

            <nav class="nav-links mega-nav" aria-label="Primary">
                <div class="mega-item">
                  <button class="mega-toggle" aria-expanded="false" aria-controls="mega-explore">Explore ▾</button>
                  <div id="mega-explore" class="mega-panel" hidden>
                    <div class="mega-grid">
                      <section class="mega-section">
                        <h4 class="mega-title">Planets</h4>
                        <a class="mega-link" href="mercury.html">Mercury</a>
                        <a class="mega-link" href="venus.html">Venus</a>
                        <a class="mega-link" href="earth.html">Earth</a>
                        <a class="mega-link" href="mars.html">Mars</a>
                        <a class="mega-link" href="jupiter.html">Jupiter</a>
                        <a class="mega-link" href="saturn.html">Saturn</a>
                        <a class="mega-link" href="uranus.html">Uranus</a>
                        <a class="mega-link" href="neptune.html">Neptune</a>
                        <a class="mega-link" href="sun.html">Sun</a>
                      </section>

                      <section class="mega-section">
                        <h4 class="mega-title">Tools</h4>
                        <a class="mega-link" href="3d-simulator.html">3D Simulator</a>
                        <a class="mega-link" href="search.html">Search</a>
                        <a class="mega-link" href="favorites.html">Favorites</a>
                      </section>
                    </div>
                  </div>
                </div>

                <div class="mega-item">
                  <button class="mega-toggle" aria-expanded="false" aria-controls="mega-learn">Learn ▾</button>
                  <div id="mega-learn" class="mega-panel" hidden>
                    <div class="mega-grid">
                      <section class="mega-section">
                        <h4 class="mega-title">Learning</h4>
                        <a class="mega-link" href="education.html">Education</a>
                        <a class="mega-link" href="charts.html">Charts</a>
                        <a class="mega-link" href="advanced-charts.html">Advanced Charts</a>
                      </section>
                    </div>
                  </div>
                </div>

                <div class="mega-item">
                  <button class="mega-toggle" aria-expanded="false" aria-controls="mega-data">Data ▾</button>
                  <div id="mega-data" class="mega-panel" hidden>
                    <div class="mega-grid">
                      <section class="mega-section">
                        <h4 class="mega-title">NASA APIs</h4>
                        <a class="mega-link" href="api.html">NASA API Console</a>
                      </section>
                    </div>
                  </div>
                </div>

                <div class="mega-item">
                  <button class="mega-toggle" aria-expanded="false" aria-controls="mega-about">About ▾</button>
                  <div id="mega-about" class="mega-panel" hidden>
                    <div class="mega-grid">
                      <section class="mega-section">
                        <h4 class="mega-title">Project</h4>
                        <a class="mega-link" href="about.html">About</a>
                        <a class="mega-link" href="blog.html">Blog</a>
                        <a class="mega-link" href="credits.html">Credits</a>
                        <a class="mega-link" href="faq.html">FAQ</a>
                        <a class="mega-link" href="contact.html">Contact</a>
                      </section>

                      <section class="mega-section mega-dynamic" id="mega-dynamic-news">
                        <h4 class="mega-title">News & Events</h4>
                        <div class="mega-columns">
                          <div class="mega-col">
                        <a class="mega-col-title" href="news.html" data-nav>Recently Published</a>
                            <ul id="mega-recent" class="mega-list"></ul>
                          </div>
                          <div class="mega-col">
                            <a class="mega-col-title" href="events.html" data-nav>Events</a>
                            <ul id="mega-events" class="mega-list"></ul>
                          </div>
                          <div class="mega-col">
                            <a class="mega-col-title" href="upcoming.html" data-nav>Upcoming</a>
                            <ul id="mega-upcoming" class="mega-list"></ul>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
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

    // Ensure global search is loaded on every page (defer to idle to reduce TTI)
    try {
        const alreadyLoaded = Array.from(document.scripts).some(s => (s.src || '').includes('/js/search.js'));
        if (!alreadyLoaded) {
            const loader = () => {
                const s = document.createElement('script');
                s.src = rootPath + 'js/search.js?v=20250109';
                s.defer = true;
                document.body.appendChild(s);
            };
            if ('requestIdleCallback' in window) requestIdleCallback(loader, { timeout: 1500 });
            else setTimeout(loader, 800);
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

    // Mega menu behavior (desktop overlay style)
    const toggles = Array.from(document.querySelectorAll('.mega-toggle'));
    function closeAllMega(exceptId) {
        toggles.forEach(btn => {
            const targetId = btn.getAttribute('aria-controls');
            if (!targetId) return;
            if (targetId === exceptId) return;
            const panel = document.getElementById(targetId);
            if (panel && !panel.hidden) panel.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        });
    }
    toggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('aria-controls');
            const panel = id ? document.getElementById(id) : null;
            if (!panel) return;
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                btn.setAttribute('aria-expanded', 'false');
                panel.hidden = true;
            } else {
                closeAllMega(id);
                btn.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
            }
        });
        // prevent overlay from blocking immediate clicks on inner anchors
        panelClickPassThrough(btn);
    });
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mega-item') || e.target.closest('.menu-toggle')) return;
        closeAllMega();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllMega();
    });

    // Ensure links inside mega panels navigate reliably (even if panel closes quickly)
    document.addEventListener('click', (e) => {
        const a = e.target.closest('.mega-panel a[href], .mega-col-title[href]');
        if (!a) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; // allow new-tab shortcuts
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        closeAllMega();
        // Defer a tick to let panel close then navigate
        setTimeout(() => { window.location.href = href; }, 0);
    });

    // Lazy-load dynamic NASA lists once when About panel first opens
    let megaNewsLoaded = false;
    const aboutToggle = document.querySelector('[aria-controls="mega-about"]');
    if (aboutToggle) {
        aboutToggle.addEventListener('click', () => {
            const isOpening = aboutToggle.getAttribute('aria-expanded') !== 'true';
            if (isOpening && !megaNewsLoaded) {
                megaNewsLoaded = true;
                populateMegaNews();
            }
        });
    }

    function panelClickPassThrough(toggleBtn){
        const id = toggleBtn.getAttribute('aria-controls');
        const panel = id ? document.getElementById(id) : null;
        if (!panel) return;
        panel.addEventListener('click', (e)=>{
            const link = e.target.closest('a[href]');
            if (link) {
                // Close immediately and allow navigation
                closeAllMega();
            }
        });
    }

    async function populateMegaNews() {
        const recentEl = document.getElementById('mega-recent');
        const eventsEl = document.getElementById('mega-events');
        const upcomingEl = document.getElementById('mega-upcoming');
        if (!recentEl || !eventsEl || !upcomingEl) return;
        try {
            recentEl.innerHTML = '<li class="mega-loading">Loading…</li>';
            eventsEl.innerHTML = '<li class="mega-loading">Loading…</li>';
            upcomingEl.innerHTML = '<li class="mega-loading">Loading…</li>';

            const results = await Promise.allSettled([
                fetchMediaLibraryRecent(),
                fetchEONETEvents(),
                fetchDONKIUpcoming()
            ]);
            const [recent, events, upcoming] = results.map(r => r.status === 'fulfilled' ? r.value : []);
            renderList(recentEl, recent);
            renderList(eventsEl, events);
            renderList(upcomingEl, upcoming);
        } catch (err) {
            console.warn('mega news failed', err);
        }
    }

    function getNasaApiKey() {
        try { return localStorage.getItem('nasa_api_key') || 'DEMO_KEY'; } catch (_) { return 'DEMO_KEY'; }
    }

    async function fetchMediaLibraryRecent(limit = 5) {
        const year = new Date().getFullYear() - 1; // last 1 year
        const url = `https://images-api.nasa.gov/search?q=NASA&media_type=image&year_start=${year}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const items = (data?.collection?.items || []).slice(0, 25);
        // Sort by date_created desc and take top N
        items.sort((a, b) => new Date(b.data?.[0]?.date_created || 0) - new Date(a.data?.[0]?.date_created || 0));
        const top = items.slice(0, limit).map(it => ({
            title: it.data?.[0]?.title || 'NASA Media',
            url: (it.data?.[0]?.nasa_id ? `https://images.nasa.gov/details-${encodeURIComponent(it.data[0].nasa_id)}` : (it.links?.[0]?.href || '#')),
            date: it.data?.[0]?.date_created || ''
        }));
        return top;
    }

    async function fetchEONETEvents(limit = 5) {
        const url = `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=${limit}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const events = (data?.events || []).map(ev => ({
            title: ev.title,
            url: ev.sources?.[0]?.url || 'https://eonet.gsfc.nasa.gov',
            date: ev.geometry?.[0]?.date || ''
        }));
        return events;
    }

    async function fetchDONKIUpcoming(limit = 5) {
        const now = new Date();
        const start = new Date(now.getTime() - 3 * 24 * 3600 * 1000);
        const end = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
        const fmt = (d) => d.toISOString().slice(0,10);
        const url = `https://api.nasa.gov/DONKI/notifications?startDate=${fmt(start)}&endDate=${fmt(end)}&type=all&api_key=${encodeURIComponent(getNasaApiKey())}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const items = Array.isArray(data) ? data : [];
        items.sort((a, b) => new Date(b.messageIssueTime || 0) - new Date(a.messageIssueTime || 0));
        return items.slice(0, limit).map(n => ({
            title: (n.messageType ? (n.messageType + ': ') : '') + (n.messageSummary || 'Notification'),
            url: n.messageURL || 'https://api.nasa.gov/',
            date: n.messageIssueTime || ''
        }));
    }

    function renderList(root, items) {
        if (!items || items.length === 0) { root.innerHTML = '<li class="mega-empty">No data</li>'; return; }
        root.innerHTML = items.map(it => {
            const date = it.date ? new Date(it.date).toLocaleDateString() : '';
            return `<li><a class="mega-item-link" href="${it.url}" target="_blank" rel="noopener">${it.title}</a><span class="mega-item-date">${date}</span></li>`;
        }).join('');
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
