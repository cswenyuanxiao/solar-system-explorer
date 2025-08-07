// breadcrumbs.js - Lightweight breadcrumb injector

(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    const page = window.location.pathname.split('/').pop() || 'index.html';

    const labelMap = {
      'index.html': 'Home',
      'charts.html': 'Data Charts',
      'education.html': 'Education',
      'api.html': 'NASA API',
      'favorites.html': 'Favorites',
      'search.html': 'Search',
      '3d-simulator.html': '3D Simulator',
      'sun.html': 'Sun',
      'mercury.html': 'Mercury',
      'venus.html': 'Venus',
      'earth.html': 'Earth',
      'mars.html': 'Mars',
      'jupiter.html': 'Jupiter',
      'saturn.html': 'Saturn',
      'uranus.html': 'Uranus',
      'neptune.html': 'Neptune'
    };

    // Build breadcrumb segments
    const segments = [];
    const isPagesDirectory = window.location.pathname.includes('/pages/');
    const baseHref = isPagesDirectory ? '' : 'pages/';

    // Root
    segments.push({ label: 'Home', href: baseHref + 'index.html' });

    // Section
    const planetPages = new Set(['sun.html','mercury.html','venus.html','earth.html','mars.html','jupiter.html','saturn.html','uranus.html','neptune.html']);
    if (planetPages.has(page)) {
      segments.push({ label: 'Planets', href: baseHref + 'index.html#planets' });
    }

    // Current page
    const currentLabel = labelMap[page] || document.title || page;
    segments.push({ label: currentLabel, href: null });

    // Create breadcrumb element
    const nav = document.createElement('nav');
    nav.className = 'breadcrumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');

    nav.innerHTML = segments.map((seg, idx) => {
      if (seg.href && idx < segments.length - 1) {
        return `<a href="${seg.href}" class="breadcrumbs__link">${seg.label}</a>`;
      }
      return `<span class="breadcrumbs__current">${seg.label}</span>`;
    }).join('<span class="breadcrumbs__sep">/</span>');

    // Insert at top of main
    mainEl.insertAdjacentElement('afterbegin', nav);
  });
})();
