// Global header search over visible DOM + standalone page fallback

class GlobalSearch {
  constructor(inputEl, resultsEl) {
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
    this.minLen = 2;
    this.maxItems = 15;
    this.bind();
  }

  bind() {
    if (!this.inputEl) return;
    this.inputEl.addEventListener('input', (e) => this.search(e.target.value));
    const btn = document.getElementById('mainSearchButton');
    if (btn) btn.addEventListener('click', () => this.search(this.inputEl.value));
    document.addEventListener('languageChanged', () => this.search(this.inputEl.value));
  }

  search(query) {
    const q = (query || '').trim();
    if (!q || q.length < this.minLen) {
      this.hide();
      return;
    }
    const items = this.scanVisibleText(q);
    this.render(items, q);
  }

  scanVisibleText(query) {
    const results = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (/(SCRIPT|STYLE|NOSCRIPT|IFRAME|CANVAS)/.test(tag)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('#mainSearchResults')) return NodeFilter.FILTER_REJECT;
        const style = parent.ownerDocument.defaultView.getComputedStyle(parent);
        if (style && (style.visibility === 'hidden' || style.display === 'none')) return NodeFilter.FILTER_REJECT;
        const text = node.nodeValue || '';
        if (!text.trim()) return NodeFilter.FILTER_REJECT;
        return text.toLowerCase().includes(query.toLowerCase()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      const snippet = this.contextSnippet(node.nodeValue, query, 60);
      const anchor = this.buildAnchor(el);
      results.push({ text: snippet, element: el, anchor });
      if (results.length >= 200) break;
    }
    const seen = new Set();
    return results.filter(r => {
      const key = (r.anchor || '') + '|' + r.text;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, this.maxItems);
  }

  buildAnchor(el) {
    const idEl = el.closest('[id]');
    if (idEl && idEl.id) return '#' + idEl.id;
    return '';
  }

  contextSnippet(text, query, span = 50) {
    const t = text || '';
    const idx = t.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return t.slice(0, span);
    const start = Math.max(0, idx - span);
    const end = Math.min(t.length, idx + query.length + span);
    const pre = start > 0 ? '…' : '';
    const post = end < t.length ? '…' : '';
    const raw = t.slice(start, end);
    return pre + this.highlight(raw, query) + post;
  }

  highlight(text, query) {
    const re = new RegExp('(' + this.escape(query) + ')', 'ig');
    return (text || '').replace(re, '<mark style="background:#ffd700;color:#000">$1</mark>');
  }

  escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  render(items) {
    if (!this.resultsEl) return;
    if (!items.length) { this.hide(); return; }
    const html = items.map((it, i) => `<a href="${it.anchor || 'javascript:void(0)'}" class="search-result-item" data-index="${i}">${it.text}</a>`).join('');
    this.resultsEl.innerHTML = html;
    this.resultsEl.style.display = 'block';
    this.resultsEl.querySelectorAll('a.search-result-item').forEach((a, idx) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const item = items[idx];
        if (item.element && item.element.scrollIntoView) {
          item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.flash(item.element);
        }
      });
    });
  }

  flash(el) {
    const original = el.style.outline;
    el.style.outline = '2px solid var(--color-primary)';
    setTimeout(() => { el.style.outline = original || 'none'; }, 1200);
  }

  hide() {
    if (this.resultsEl) { this.resultsEl.style.display = 'none'; this.resultsEl.innerHTML = ''; }
  }
}

// Header global search bootstrap
(function initHeaderSearch(){
  function boot(retry = 0){
    const input = document.getElementById('mainSearchInput');
    const results = document.getElementById('mainSearchResults');
    if (!input || !results) {
      if (retry < 40) setTimeout(() => boot(retry + 1), 50); // wait up to ~2s for header injection
      return;
    }
    // Avoid double init
    if (window.__globalSearchInited) return;
    window.__globalSearchInited = true;
    new GlobalSearch(input, results);
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') boot();
  else document.addEventListener('DOMContentLoaded', () => boot());
})();

// Standalone search page (planet dataset experience)
class SearchEngine {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.searchResults = document.getElementById('searchResults');
        if (!this.searchInput || !this.searchResults) return;
        
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
        this.searchInput.addEventListener('input', (e) => { this.performSearch(e.target.value); });

        // Search on button click
        if (this.searchButton) this.searchButton.addEventListener('click', () => { this.performSearch(this.searchInput.value); });

        // Search on Enter key
        this.searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.performSearch(this.searchInput.value); });
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
        return planets.filter(planet =>
            (planet.name && planet.name.toLowerCase().includes(searchTerm)) ||
            (planet.displayName && planet.displayName.toLowerCase().includes(searchTerm)) ||
            (planet.description && planet.description.toLowerCase().includes(searchTerm)) ||
            (Array.isArray(planet.keywords) && planet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
        );
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

// Initialize SearchEngine only on standalone page
(function initStandaloneSearch(){
  document.addEventListener('DOMContentLoaded', () => {
    const pageInput = document.getElementById('searchInput');
    const pageResults = document.getElementById('searchResults');
    if (pageInput && pageResults) new SearchEngine();
  });
})();