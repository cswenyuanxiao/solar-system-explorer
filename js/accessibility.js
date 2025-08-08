// Accessibility Module for Solar System Explorer
// Screen reader support, keyboard navigation, high contrast mode, and voice control

class AccessibilityManager {
    constructor() {
        this.isHighContrast = false;
        this.isVoiceControlEnabled = false;
        this.currentFocusIndex = 0;
        this.focusableElements = [];
        this.speechRecognition = null;
        this.speechSynthesis = null;
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupHighContrastMode();
        this.setupVoiceControl();
        this.setupAccessibilityControls();
        this.announcePageLoad();
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Update focusable elements when DOM changes
        this.updateFocusableElements();
        
        // Observe DOM changes
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    updateFocusableElements() {
        this.focusableElements = Array.from(document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
    }

    handleKeyboardNavigation(e) {
        switch (e.key) {
            case 'Tab':
                // Let default tab behavior work
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                e.preventDefault();
                this.navigateVertically(e.key === 'ArrowUp' ? -1 : 1);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                e.preventDefault();
                this.navigateHorizontally(e.key === 'ArrowLeft' ? -1 : 1);
                break;
            case 'Enter':
            case ' ':
                if (document.activeElement.tagName === 'BUTTON' || 
                    document.activeElement.tagName === 'A') {
                    e.preventDefault();
                    document.activeElement.click();
                }
                break;
            case 'Escape':
                this.handleEscapeKey();
                break;
            case 'h':
            case 'H':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleHighContrast();
                }
                break;
            case 'v':
            case 'V':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleVoiceControl();
                }
                break;
        }
    }

    navigateVertically(direction) {
        const currentElement = document.activeElement;
        const currentIndex = this.focusableElements.indexOf(currentElement);
        
        if (currentIndex === -1) {
            this.focusableElements[0]?.focus();
            return;
        }

        const nextIndex = (currentIndex + direction + this.focusableElements.length) % this.focusableElements.length;
        this.focusableElements[nextIndex]?.focus();
    }

    navigateHorizontally(direction) {
        this.navigateVertically(direction);
    }

    handleEscapeKey() {
        // Close any open modals or dropdowns
        const modals = document.querySelectorAll('.modal, .dropdown');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    // Screen Reader Support
    setupScreenReaderSupport() {
        // Add ARIA labels and roles
        this.addAriaLabels();
        
        // Skip links disabled per UI request
        // this.addSkipLinks();
        
        // Add live regions for dynamic content
        this.addLiveRegions();
    }

    addAriaLabels() {
        // Add labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', button.title || 'Button');
            }
        });

        // Add labels to images
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            img.setAttribute('alt', 'Image');
        });

        // Add roles to custom elements
        const planetCards = document.querySelectorAll('.planet-card');
        planetCards.forEach(card => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
        });
    }

    addSkipLinks() {
        const skipLinks = `
            <div class="skip-links">
                <a href="#main-content" class="skip-link">Skip to main content</a>
                <a href="#navigation" class="skip-link">Skip to navigation</a>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', skipLinks);
    }

    addLiveRegions() {
        // Add live region for notifications
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.querySelector('[aria-live="polite"]');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // High Contrast Mode
    setupHighContrastMode() {
        // Check for user preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        this.isHighContrast = prefersHighContrast.matches;
        
        if (this.isHighContrast) {
            this.enableHighContrast();
        }

        // Listen for changes
        prefersHighContrast.addEventListener('change', (e) => {
            if (e.matches) {
                this.enableHighContrast();
            } else {
                this.disableHighContrast();
            }
        });
    }

    toggleHighContrast() {
        if (this.isHighContrast) {
            this.disableHighContrast();
        } else {
            this.enableHighContrast();
        }
    }

    enableHighContrast() {
        this.isHighContrast = true;
        document.body.classList.add('high-contrast');
        this.announceToScreenReader('High contrast mode enabled');
        this.saveAccessibilityPreference('highContrast', true);
    }

    disableHighContrast() {
        this.isHighContrast = false;
        document.body.classList.remove('high-contrast');
        this.announceToScreenReader('High contrast mode disabled');
        this.saveAccessibilityPreference('highContrast', false);
    }

    // Voice Control
    setupVoiceControl() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.setupSpeechRecognition();
        }

        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
        }
    }

    setupSpeechRecognition() {
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;
        this.speechRecognition.lang = 'en-US';

        this.speechRecognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.handleVoiceCommand(command);
        };

        this.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    }

    toggleVoiceControl() {
        if (this.isVoiceControlEnabled) {
            this.disableVoiceControl();
        } else {
            this.enableVoiceControl();
        }
    }

    enableVoiceControl() {
        this.isVoiceControlEnabled = true;
        this.speechRecognition?.start();
        this.announceToScreenReader('Voice control enabled. Say "help" for commands.');
        this.saveAccessibilityPreference('voiceControl', true);
    }

    disableVoiceControl() {
        this.isVoiceControlEnabled = false;
        this.speechRecognition?.stop();
        this.announceToScreenReader('Voice control disabled');
        this.saveAccessibilityPreference('voiceControl', false);
    }

    handleVoiceCommand(command) {
        console.log('Voice command:', command);

        if (command.includes('help')) {
            this.speak('Available commands: navigate, search, home, back, zoom in, zoom out');
        } else if (command.includes('navigate')) {
            this.handleNavigationCommand(command);
        } else if (command.includes('search')) {
            this.handleSearchCommand(command);
        } else if (command.includes('home')) {
            window.location.href = 'index.html';
        } else if (command.includes('back')) {
            window.history.back();
        } else if (command.includes('zoom')) {
            this.handleZoomCommand(command);
        } else {
            this.speak('Command not recognized. Say help for available commands.');
        }
    }

    handleNavigationCommand(command) {
        const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'];
        const planet = planets.find(p => command.includes(p));
        
        if (planet) {
            window.location.href = `${planet}.html`;
        } else {
            this.speak('Please specify a planet name');
        }
    }

    handleSearchCommand(command) {
        const searchTerm = command.replace('search', '').trim();
        if (searchTerm) {
            // Implement search functionality
            this.speak(`Searching for ${searchTerm}`);
        } else {
            this.speak('Please specify what to search for');
        }
    }

    handleZoomCommand(command) {
        if (command.includes('in')) {
            document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) + 0.1);
            this.speak('Zoomed in');
        } else if (command.includes('out')) {
            document.body.style.zoom = Math.max(0.5, parseFloat(document.body.style.zoom || 1) - 0.1);
            this.speak('Zoomed out');
        }
    }

    speak(text) {
        if (this.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            this.speechSynthesis.speak(utterance);
        }
    }

    // Accessibility Controls UI
    setupAccessibilityControls() {
        const controlsHTML = `
            <div class="accessibility-controls" role="toolbar" aria-label="Accessibility controls">
                <button class="accessibility-btn" id="highContrastBtn" aria-label="Toggle high contrast mode">
                    <span class="icon">🌙</span>
                    <span class="label">High Contrast</span>
                </button>
                <button class="accessibility-btn" id="voiceControlBtn" aria-label="Toggle voice control">
                    <span class="icon">🎤</span>
                    <span class="label">Voice Control</span>
                </button>
                <button class="accessibility-btn" id="fontSizeBtn" aria-label="Increase font size">
                    <span class="icon">🔍</span>
                    <span class="label">Font Size</span>
                </button>
                <button class="accessibility-btn" id="helpBtn" aria-label="Accessibility help">
                    <span class="icon">❓</span>
                    <span class="label">Help</span>
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        this.setupControlEvents();
    }

    setupControlEvents() {
        const highContrastBtn = document.getElementById('highContrastBtn');
        const voiceControlBtn = document.getElementById('voiceControlBtn');
        const fontSizeBtn = document.getElementById('fontSizeBtn');
        const helpBtn = document.getElementById('helpBtn');

        highContrastBtn?.addEventListener('click', () => this.toggleHighContrast());
        voiceControlBtn?.addEventListener('click', () => this.toggleVoiceControl());
        fontSizeBtn?.addEventListener('click', () => this.toggleFontSize());
        helpBtn?.addEventListener('click', () => this.showAccessibilityHelp());
    }

    toggleFontSize() {
        const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
        const newSize = currentSize >= 18 ? 14 : currentSize + 2;
        document.body.style.fontSize = `${newSize}px`;
        this.announceToScreenReader(`Font size changed to ${newSize} pixels`);
    }

    showAccessibilityHelp() {
        const helpText = `
            Accessibility Features:
            - Tab: Navigate through elements
            - Arrow keys: Navigate vertically/horizontally
            - Enter/Space: Activate buttons
            - Ctrl+H: Toggle high contrast
            - Ctrl+V: Toggle voice control
            - Escape: Close modals
            - Voice commands: navigate, search, home, back, zoom
        `;
        
        alert(helpText);
    }

    // Utility functions
    saveAccessibilityPreference(key, value) {
        try {
            localStorage.setItem(`accessibility_${key}`, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving accessibility preference:', error);
        }
    }

    loadAccessibilityPreferences() {
        try {
            const highContrast = JSON.parse(localStorage.getItem('accessibility_highContrast') || 'false');
            const voiceControl = JSON.parse(localStorage.getItem('accessibility_voiceControl') || 'false');
            
            if (highContrast) this.enableHighContrast();
            if (voiceControl) this.enableVoiceControl();
        } catch (error) {
            console.error('Error loading accessibility preferences:', error);
        }
    }

    announcePageLoad() {
        const pageTitle = document.title;
        const mainHeading = document.querySelector('h1');
        const headingText = mainHeading ? mainHeading.textContent : '';
        
        this.announceToScreenReader(`Page loaded: ${pageTitle}. ${headingText}`);
    }

    // Focus management
    focusFirstElement() {
        this.focusableElements[0]?.focus();
    }

    focusLastElement() {
        this.focusableElements[this.focusableElements.length - 1]?.focus();
    }

    // Error handling
    handleAccessibilityError(error) {
        console.error('Accessibility error:', error);
        this.announceToScreenReader('An accessibility error occurred');
    }
}

// Initialize accessibility when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
} 