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