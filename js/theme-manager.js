// 主题管理器 - 深色/浅色模式切换
// Theme Manager - Dark/Light mode toggle

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.detectPreferredTheme();
        this.themes = {
            light: {
                name: 'Light',
                icon: '☀️',
                properties: {
                    '--bg-primary': '#f8fafc',
                    '--bg-secondary': '#ffffff',
                    '--bg-card': '#ffffff',
                    '--text-primary': '#1e293b',
                    '--text-secondary': '#475569',
                    '--border-color': '#e2e8f0',
                    '--shadow': 'rgba(15, 23, 42, 0.08)',
                    '--nasa-blue': '#1e40af',
                    '--nasa-red': '#dc2626',
                    '--accent-color': '#f59e0b'
                }
            },
            dark: {
                name: 'Dark',
                icon: '🌙',
                properties: {
                    '--bg-primary': '#1a1a1a',
                    '--bg-secondary': '#2d2d2d',
                    '--bg-card': '#333333',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#cccccc',
                    '--border-color': '#444444',
                    '--shadow': 'rgba(0, 0, 0, 0.3)',
                    '--nasa-blue': '#1E5AA8',
                    '--nasa-red': '#FF5733',
                    '--accent-color': '#FFD700'
                }
            }
        };
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggler();
        this.updateThemeToggleUI();
        this.addThemeStyles();
    }
    
    getStoredTheme() {
        return localStorage.getItem('preferred_theme');
    }
    
    detectPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    setTheme(themeName) {
        if (this.themes[themeName] && themeName !== this.currentTheme) {
            this.currentTheme = themeName;
            localStorage.setItem('preferred_theme', themeName);
            this.applyTheme(themeName);
            this.updateThemeToggleUI();
            this.notifyThemeChange();
            this.showNotification(this.getThemeText('theme_changed'));
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        const root = document.documentElement;
        
        // 应用CSS自定义属性
        Object.entries(theme.properties).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // 更新body类名
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
        
        // 更新meta主题颜色
        this.updateMetaThemeColor(theme.properties['--bg-primary']);
    }
    
    updateMetaThemeColor(color) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = color;
    }
    
    setupThemeToggler() {
        // 监听主题切换按钮点击
        document.addEventListener('click', (event) => {
            const toggler = event.target.closest('#theme-toggle, .theme-toggle');
            if (toggler) {
                event.preventDefault();
                this.toggleTheme();
            }
        });
        
        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    updateThemeToggleUI() {
        const toggleButtons = document.querySelectorAll('#theme-toggle, .theme-toggle');
        const themeIcons = document.querySelectorAll('.theme-icon');
        const themeTexts = document.querySelectorAll('.theme-text');
        
        const currentThemeData = this.themes[this.currentTheme];
        const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        const nextThemeData = this.themes[nextTheme];
        
        toggleButtons.forEach(button => {
            button.setAttribute('aria-label', `Switch to ${nextThemeData.name} theme`);
            button.setAttribute('title', `Switch to ${nextThemeData.name} theme`);
        });
        
        themeIcons.forEach(icon => {
            icon.textContent = nextThemeData.icon;
        });
        
        themeTexts.forEach(text => {
            text.textContent = `${nextThemeData.name} Mode`;
        });
    }
    
    addThemeStyles() {
        if (document.querySelector('#theme-manager-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'theme-manager-styles';
        style.textContent = `
            /* 主题切换动画 */
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
            
            /* 主题切换按钮样式 */
            .theme-toggle {
                background: var(--bg-card);
                color: var(--text-primary);
                border: 2px solid var(--border-color);
                border-radius: 8px;
                padding: 0.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.3s ease;
                text-decoration: none;
            }
            
            .theme-toggle:hover {
                background: var(--bg-secondary);
                border-color: var(--accent-color);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px var(--shadow);
            }
            
            .theme-toggle:active {
                transform: translateY(0);
            }
            
            /* 深色主题特定样式 */
            .theme-dark {
                --star-color: #ffffff;
            }
            
            .theme-dark .planet-card {
                background: var(--bg-card);
                box-shadow: 0 4px 12px var(--shadow);
            }
            
            .theme-dark .planet-card:hover {
                background: var(--bg-secondary);
            }
            
            .theme-dark .hero-section {
                background: linear-gradient(135deg, 
                    rgba(11, 61, 145, 0.9) 0%, 
                    rgba(29, 29, 29, 0.9) 50%, 
                    rgba(0, 0, 0, 0.9) 100%);
            }
            
            /* 浅色主题特定样式 */
            .theme-light {
                --star-color: #f59e0b;
            }
            
            .theme-light .hero-section {
                background: linear-gradient(135deg, 
                    rgba(30, 64, 175, 0.05) 0%, 
                    rgba(248, 250, 252, 0.95) 30%,
                    rgba(255, 255, 255, 0.98) 70%,
                    rgba(241, 245, 249, 0.9) 100%);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid var(--border-color);
            }
            
            .theme-light .planet-card {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                box-shadow: 0 2px 8px var(--shadow), 0 1px 3px rgba(15, 23, 42, 0.04);
            }
            
            .theme-light .planet-card:hover {
                box-shadow: 0 8px 25px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.06);
                transform: translateY(-2px);
                border-color: var(--nasa-blue);
            }
            
            .theme-light .featured-card {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                box-shadow: 0 1px 3px var(--shadow);
            }
            
            .theme-light .featured-card:hover {
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
                border-color: var(--accent-color);
            }
            
            .theme-light .action-button {
                background: var(--bg-card);
                border-color: var(--border-color);
                color: var(--text-primary);
                box-shadow: 0 1px 2px var(--shadow);
            }
            
            .theme-light .action-button:hover {
                background: var(--nasa-blue);
                color: white;
                border-color: var(--nasa-blue);
                box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
            }
            
            /* 通知样式 */
            .theme-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--nasa-blue);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                z-index: 2000;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                animation: slideInRight 0.3s ease;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                .theme-toggle {
                    padding: 0.4rem;
                    font-size: 0.8rem;
                }
                
                .theme-text {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    getThemeText(key) {
        // 如果语言管理器存在，使用它获取翻译
        if (window.languageManager) {
            return window.languageManager.getText(key);
        }
        
        // 默认翻译
        const defaultTexts = {
            'theme_changed': 'Theme changed',
            'dark_mode': 'Dark Mode',
            'light_mode': 'Light Mode'
        };
        
        return defaultTexts[key] || key;
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    notifyThemeChange() {
        // 触发自定义事件
        const event = new CustomEvent('themeChanged', {
            detail: { 
                theme: this.currentTheme,
                themeData: this.themes[this.currentTheme]
            }
        });
        document.dispatchEvent(event);
        
        // 调用全局回调
        if (typeof window.onThemeChange === 'function') {
            window.onThemeChange(this.currentTheme);
        }
    }
    
    // 获取当前主题信息
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            ...this.themes[this.currentTheme]
        };
    }
    
    // 获取所有可用主题
    getAvailableThemes() {
        return Object.keys(this.themes).map(name => ({
            name,
            ...this.themes[name]
        }));
    }
}

// 全局主题管理器实例
let themeManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    window.themeManager = themeManager;
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager };
}