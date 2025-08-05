/**
 * Scroll Optimizer
 * Improves scrolling performance by:
 * 1. Detecting scroll events and throttling handlers
 * 2. Adding/removing scroll-specific classes
 * 3. Optimizing animations during scrolling
 * 4. Creating a scroll progress indicator
 */

class ScrollOptimizer {
  constructor() {
    // Configuration
    this.config = {
      scrollThrottle: 100,
      scrollActiveClass: 'is-scrolling',
      scrollProgressEnabled: true,
      disableHoverDuringScroll: true,
      disableAnimationsDuringScroll: true,
      scrollEndDelay: 150
    };
    
    // State
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.lastScrollTop = 0;
    this.scrollDirection = 'down';
    this.ticking = false;
    
    // Elements
    this.progressBar = null;
    
    // Bind 'this' to methods
    this.handleScroll = this.handleScroll.bind(this);
    this.updateScrollProgressBar = this.updateScrollProgressBar.bind(this);
    
    this.init();
  }
  
  init() {
    // Ensure this runs only once
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    // Create scroll progress bar if enabled
    if (this.config.scrollProgressEnabled) {
      this.createScrollProgressBar();
    }
    
    // Add scroll event listener with passive flag for better performance
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    
    // Add resize listener for progress bar updates
    window.addEventListener('resize', this.updateScrollProgressBar, { passive: true });
  }
  
  handleScroll() {
    // Track scroll direction
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
    this.lastScrollTop = scrollTop;
    
    // Mark as scrolling and update UI
    if (!this.ticking) {
      requestAnimationFrame(() => {
        if (!this.isScrolling) {
          document.body.classList.add(this.config.scrollActiveClass);
          this.isScrolling = true;
        }
        
        // Update scroll progress if enabled
        if (this.config.scrollProgressEnabled) {
          this.updateScrollProgressBar();
        }
        
        this.ticking = false;
      });
      this.ticking = true;
    }
    
    // Clear previous timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    // Set a timeout to remove the scrolling class
    this.scrollTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove(this.config.scrollActiveClass);
        this.isScrolling = false;
      });
    }, this.config.scrollEndDelay);
  }
  
  createScrollProgressBar() {
    // Create container
    const container = document.createElement('div');
    container.className = 'scroll-progress-container';
    
    // Create progress bar
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    
    // Append to DOM
    container.appendChild(bar);
    document.body.appendChild(container);
    
    // Store reference
    this.progressBar = bar;
  }
  
  updateScrollProgressBar() {
    if (!this.progressBar) return;
    
    // Calculate scroll progress percentage
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    // Update progress bar using transform for better performance
    this.progressBar.style.transform = `scaleX(${scrollPercent})`;
  }
  
  // Helper to determine if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    );
  }
}

// Initialize the scroll optimizer
if (typeof window !== 'undefined') {
  // Use requestIdleCallback for non-critical initialization, with a fallback
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      new ScrollOptimizer();
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    window.addEventListener('load', () => {
      new ScrollOptimizer();
    });
  }
}