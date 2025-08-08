// Configuration
const CONFIG = {
    animationDuration: 300,
    maxWidth: 1400
};

// Planet data
const planets = [
    {
        name: 'Mercury',
        description: 'The smallest planet in our solar system and closest to the Sun.',
        color: '#B8B8B8'
    },
    {
        name: 'Venus',
        description: 'Similar in size to Earth but with a toxic atmosphere of carbon dioxide.',
        color: '#E6C229'
    },
    {
        name: 'Earth',
        description: 'Our home planet, the only known place in the universe confirmed to host life.',
        color: '#6B93D6'
    },
    {
        name: 'Mars',
        description: 'The Red Planet, home to the tallest mountain in the solar system.',
        color: '#E27B58'
    },
    {
        name: 'Jupiter',
        description: 'The largest planet in our solar system, a gas giant with a Great Red Spot.',
        color: '#C88B3A'
    },
    {
        name: 'Saturn',
        description: 'Famous for its beautiful ring system made of ice and rock particles.',
        color: '#E4D191'
    },
    {
        name: 'Uranus',
        description: 'An ice giant that rotates on its side, with rings and many moons.',
        color: '#D1E7E7'
    },
    {
        name: 'Neptune',
        description: 'The windiest planet with the strongest winds in the solar system.',
        color: '#5B5DDF'
    }
];

// Solar System Explorer - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization - Use passive event listeners
    const opts = { passive: true };

    // Add click event listeners to planet cards using event delegation
    const planetsContainer = document.querySelector('.planets-container');
    if (planetsContainer) {
        planetsContainer.addEventListener('click', function(e) {
            const card = e.target.closest('.planet-card');
            if (card) {
                // Using requestAnimationFrame for better performance
                requestAnimationFrame(() => {
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            card.style.transform = '';
                        });
                    }, 150);
                });
            }
        }, opts);
    }

    // Add smooth scrolling for better navigation - using requestAnimationFrame
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    
    // Optimized smooth scroll implementation
    if (header && main) {
        header.addEventListener('click', function(e) {
            // Only trigger if the header itself is clicked, not child elements
            if (e.target === header) {
                const startPosition = window.pageYOffset;
                const targetPosition = main.offsetTop;
                const distance = targetPosition - startPosition;
                const duration = 300; // Shorter duration for better performance
                let startTime = null;
                
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const scrollY = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, scrollY);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                // Easing function - optimized version
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
            }
        }, opts);
    }

    // Add a loading animation with better performance
    if (planetsContainer) {
        // Use CSS to handle animations instead of JS
        planetsContainer.classList.add('fade-in');
    }

    // Keyboard navigation with debounce for better performance
    let keyDebounce = null;
    const keyDelay = 100; // 100ms debounce
    
    document.addEventListener('keydown', function(e) {
        if (keyDebounce) {
            clearTimeout(keyDebounce);
        }
        
        keyDebounce = setTimeout(() => {
            const cards = document.querySelectorAll('.planet-card');
            const currentIndex = Array.from(cards).findIndex(card => 
                card === document.activeElement || card.contains(document.activeElement)
            );
    
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % cards.length;
                    cards[nextIndex].focus();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? cards.length - 1 : currentIndex - 1;
                    cards[prevIndex].focus();
                    break;
            }
        }, keyDelay);
    }, opts);

    // Make cards focusable for accessibility - optimize by using fragment
    const planetCards = document.querySelectorAll('.planet-card');
    if (planetCards.length) {
        requestIdleCallback(() => {
            planetCards.forEach(card => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                const title = card.querySelector('h2');
                if (title) {
                    card.setAttribute('aria-label', title.textContent);
                }
            });
        }, { timeout: 1000 });
    }

    // Optimize scroll performance
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Handle any scroll effects here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Only add scroll listener if needed
    // window.addEventListener('scroll', onScroll, { passive: true });

    console.log('Solar System Explorer loaded with performance optimizations!');
});

// Add CSS class for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Globalize header search for all pages: attach lightweight binder if header search exists
document.addEventListener('DOMContentLoaded', () => {
    try {
        const input = document.getElementById('mainSearchInput');
        const button = document.getElementById('mainSearchButton');
        const results = document.getElementById('mainSearchResults');
        if (!input || !results) return;

        const planets = (window.planetData && window.planetData.getAllPlanets && window.planetData.getAllPlanets()) || [
            { name:'Sun', description:'The center of our solar system', url:'sun.html', keywords:['star'], image:'../images/sun.jpg' },
            { name:'Mercury', description:'The smallest and innermost planet', url:'mercury.html', keywords:['smallest'], image:'../images/mercury.jpg' },
            { name:'Venus', description:'The hottest planet with thick atmosphere', url:'venus.html', keywords:['hottest'], image:'../images/venus.jpg' },
            { name:'Earth', description:'Our home planet with life', url:'earth.html', keywords:['life'], image:'../images/earth.jpg' },
            { name:'Mars', description:'The red planet', url:'mars.html', keywords:['red'], image:'../images/mars.jpg' },
            { name:'Jupiter', description:'The largest planet', url:'jupiter.html', keywords:['largest'], image:'../images/jupiter.jpg' },
            { name:'Saturn', description:'The ringed planet', url:'saturn.html', keywords:['rings'], image:'../images/saturn.jpg' },
            { name:'Uranus', description:'The ice giant', url:'uranus.html', keywords:['ice'], image:'../images/uranus.jpg' },
            { name:'Neptune', description:'The windiest planet', url:'neptune.html', keywords:['windy'], image:'../images/neptune.jpg' }
        ];

        const highlight = (text, q) => {
            if (!q || !q.trim()) return text;
            return text.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
        };

        const search = (q) => {
            const term = (q||'').toLowerCase().trim();
            return planets.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || (p.keywords||[]).some(k => (k+'').toLowerCase().includes(term)));
        };

        const render = (items, q) => {
            if (!items.length) {
                results.innerHTML = `<div class="search-result-item"><div class="search-result-title">No results found</div><div class="search-result-description">Try: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune</div></div>`;
            } else {
                results.innerHTML = items.map(p => `<a href="${p.url}" class="search-result-item"><div class=\"search-result-title\">${highlight(p.name,q)}</div><div class=\"search-result-description\">${highlight(p.description,q)}</div></a>`).join('');
            }
            results.style.display = 'block';
        };

        const perform = (q) => {
            if (!q.trim()) { results.style.display = 'none'; return; }
            render(search(q), q);
        };

        input.addEventListener('input', e => perform(e.target.value));
        button && button.addEventListener('click', () => perform(input.value));
        input.addEventListener('keypress', e => { if (e.key === 'Enter') perform(input.value); });
        document.addEventListener('click', (e) => { if (!input.contains(e.target) && !results.contains(e.target)) results.style.display = 'none'; });
    } catch (err) { console.warn('global header search bind failed', err); }
});