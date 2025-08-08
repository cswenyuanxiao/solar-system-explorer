// 多语言配置和语言管理模块
// Multi-language configuration and language management module

const LANGUAGES = {
    zh: {
        name: '中文',
        flag: '🇨🇳',
        direction: 'ltr'
    },
    en: {
        name: 'English',
        flag: '🇺🇸',
        direction: 'ltr'
    }
};

// 翻译内容
const TRANSLATIONS = {
    zh: {
        // 导航和通用
        'home': '首页',
        'search': '搜索',
        'charts': '数据图表',
        'education': '教育资源',
        'api': 'NASA API',
        'language': '语言',
        'dark_mode': '深色模式',
        'light_mode': '浅色模式',
        'favorites': '收藏夹',
        '3d_simulator': '3D模拟器',
        'user_account': '用户账户',
        'accessibility': '无障碍功能',
        'advanced_charts': '高级图表',

        // 主页内容
        'main_title': '太阳系数据可视化',
        'subtitle': '交互式图表和比较',
        'hero_title': '探索我们的太阳系',
        'hero_subtitle': '穿越行星、卫星和天体，开启宇宙邻里的旅程。发现最新的NASA任务和科学发现。',
        'explore_button': '开始探索',
        'learn_more': '了解更多',
        'explore_all_planets': '探索所有行星',

        // 特色内容
        'featured_title': '特色任务',
        'size_comparison': '大小比较',
        'distance_comparison': '距离比较',
        'temperature_comparison': '温度比较',
        'moons_comparison': '卫星数量',

        // 星球信息
        'sun': '太阳',
        'mercury': '水星',
        'venus': '金星',
        'earth': '地球',
        'mars': '火星',
        'jupiter': '木星',
        'saturn': '土星',
        'uranus': '天王星',
        'neptune': '海王星',

        // 星球描述
        'sun_desc': '我们的恒星 - 太阳系的中心',
        'mercury_desc': '最小的行星，最靠近太阳',
        'venus_desc': '最热的行星，地球的"姐妹星"',
        'earth_desc': '我们的家园，蓝色的弹珠',
        'mars_desc': '红色星球，未来人类的目的地',
        'jupiter_desc': '最大的行星，气态巨行星',
        'saturn_desc': '拥有美丽光环的行星',
        'uranus_desc': '侧躺旋转的冰巨行星',
        'neptune_desc': '风最大的行星，深蓝色',

        // 搜索相关
        'search_placeholder': '搜索行星和任务...',
        'search_button': '搜索',
        'no_results': '未找到结果',
        'search_results': '搜索结果',

        // 收藏夹
        'my_favorites': '我的收藏',
        'add_to_favorites': '添加到收藏',
        'remove_from_favorites': '从收藏中移除',
        'clear_all_favorites': '清空所有收藏',
        'no_favorites': '暂无收藏',
        'favorites_count': '收藏数量',

        // 无障碍功能
        'accessibility_title': '无障碍功能',
        'high_contrast': '高对比度',
        'voice_control': '语音控制',
        'font_size': '字体大小',
        'keyboard_navigation': '键盘导航',
        'screen_reader': '屏幕阅读器',

        // 高级图表
        'advanced_charts_title': '高级数据可视化',
        'orbital_visualization': '轨道可视化',
        '3d_scatter_plot': '3D散点图',
        'interactive_timeline': '交互式时间线',
        'planet_comparison': '行星比较',
        'scientific_calculator': '科学计算器',

        // 任务信息
        'about_mission': '关于此任务',
        'mission_description': '这个太阳系探索器提供了穿越我们宇宙邻里的交互式旅程，包含来自NASA任务的实时数据和行星科学的最新发现。探索每个天体的详细信息，查看令人惊叹的图像，并发现最新的科学发现。',

        // 页脚
        'footer_text': '© 2024 太阳系探索器。所有图像和数据来自NASA。通过科学和发现探索宇宙。',

        // 通知消息
        'added_to_favorites': '已添加到收藏',
        'removed_from_favorites': '已从收藏中移除',
        'language_changed': '语言已切换',
        'theme_changed': '主题已切换',

        // 错误消息
        'error_loading': '加载错误',
        'error_search': '搜索时出错',
        'error_favorites': '收藏功能出错',
        'try_again': '请重试',
        
        // 打印和分享
        'print_page': '打印页面',
        'share_page': '分享页面',
        'install_app': '安装应用',

        // 语言测试页面
        'language_test_title': '语言测试 - 太阳系探索器',
        'language_test_hero': '语言测试页面',
        'language_test_desc': '此页面测试太阳系探索器的多语言功能。',
        'test_instructions': '测试说明',
        'test_step_1': '1. 点击页眉中的语言切换按钮',
        'test_step_2': '2. 观察文本从英文切换到中文',
        'test_step_3': '3. 再次点击切换回英文',
        'test_step_4': '4. 注意所有带有data-i18n属性的元素都被翻译了',
        'sample_content_title': '示例内容',
        'navigation_test': '导航测试',
        'navigation_desc': '所有导航元素在切换语言时都应该被翻译。',
        'buttons_test': '按钮测试',
        'buttons_desc': '按钮文本和标签应该随语言变化。',
        'forms_test': '表单测试',
        'forms_desc': '表单占位符和标签应该被翻译。',
        'current_language': '当前语言',
        'language_code': '语言代码',
        'language_name': '语言名称',
        'language_flag': '国旗'
    },
    en: {
        // Navigation and common
        'home': 'Home',
        'search': 'Search',
        'charts': 'Data Charts',
        'education': 'Education',
        'api': 'NASA API',
        'language': 'Language',
        'dark_mode': 'Dark Mode',
        'light_mode': 'Light Mode',
        'favorites': 'Favorites',
        '3d_simulator': '3D Simulator',
        'user_account': 'Account',
        'accessibility': 'Accessibility',
        'advanced_charts': 'Advanced Charts',
        
        // Main page content
        'main_title': 'Solar System Data Visualization',
        'subtitle': 'Interactive charts and comparisons',
        'hero_title': 'EXPLORE OUR SOLAR SYSTEM',
        'hero_subtitle': 'Journey through the planets, moons, and celestial bodies that make up our cosmic neighborhood. Discover the latest NASA missions and scientific discoveries.',
        'explore_button': 'EXPLORE',
        'learn_more': 'Learn More',
        'explore_all_planets': 'EXPLORE ALL PLANETS',

        // Featured content
        'featured_title': 'FEATURED MISSIONS',
        'size_comparison': 'Size Comparison',
        'distance_comparison': 'Distance from Sun',
        'temperature_comparison': 'Temperature',
        'moons_comparison': 'Number of Moons',

        // Planet names
        'sun': 'THE SUN',
        'mercury': 'MERCURY',
        'venus': 'VENUS',
        'earth': 'EARTH',
        'mars': 'MARS',
        'jupiter': 'JUPITER',
        'saturn': 'SATURN',
        'uranus': 'URANUS',
        'neptune': 'NEPTUNE',

        // Planet descriptions
        'sun_desc': 'Our star - the heart of the solar system',
        'mercury_desc': 'The smallest planet, closest to the Sun',
        'venus_desc': 'The hottest planet, Earth\'s twin',
        'earth_desc': 'Our home planet, the blue marble',
        'mars_desc': 'The red planet, future human destination',
        'jupiter_desc': 'The largest planet, gas giant',
        'saturn_desc': 'The ringed planet, most beautiful',
        'uranus_desc': 'The ice giant, tilted on its side',
        'neptune_desc': 'The windiest planet, deep blue',

        // Search related
        'search_placeholder': 'Search planets and missions...',
        'search_button': 'SEARCH',
        'no_results': 'No results found',
        'search_results': 'Search Results',

        // Favorites
        'my_favorites': 'My Favorites',
        'add_to_favorites': 'Add to Favorites',
        'remove_from_favorites': 'Remove from Favorites',
        'clear_all_favorites': 'Clear All Favorites',
        'no_favorites': 'No favorites yet',
        'favorites_count': 'Favorites Count',

        // Accessibility
        'accessibility_title': 'Accessibility Features',
        'high_contrast': 'High Contrast',
        'voice_control': 'Voice Control',
        'font_size': 'Font Size',
        'keyboard_navigation': 'Keyboard Navigation',
        'screen_reader': 'Screen Reader',

        // Advanced Charts
        'advanced_charts_title': 'Advanced Data Visualization',
        'orbital_visualization': 'Orbital Visualization',
        '3d_scatter_plot': '3D Scatter Plot',
        'interactive_timeline': 'Interactive Timeline',
        'planet_comparison': 'Planet Comparison',
        'scientific_calculator': 'Scientific Calculator',

        // Mission info
        'about_mission': 'ABOUT THIS MISSION',
        'mission_description': 'This Solar System Explorer provides an interactive journey through our cosmic neighborhood, featuring real-time data from NASA\'s missions and the latest discoveries in planetary science. Explore detailed information about each celestial body, view stunning imagery, and discover the latest scientific findings.',

        // Footer
        'footer_text': '© 2024 Solar System Explorer. All images and data from NASA. Exploring the universe through science and discovery.',

        // Notification messages
        'added_to_favorites': 'Added to favorites',
        'removed_from_favorites': 'Removed from favorites',
        'language_changed': 'Language changed',
        'theme_changed': 'Theme changed',

        // Error messages
        'error_loading': 'Error loading',
        'error_search': 'Error searching',
        'error_favorites': 'Error with favorites',
        'try_again': 'Please try again',
        
        // Print and sharing
        'print_page': 'Print Page',
        'share_page': 'Share Page',
        'install_app': 'Install App',

        // Language test page
        'language_test_title': 'Language Test - Solar System Explorer',
        'language_test_hero': 'Language Test Page',
        'language_test_desc': 'This page tests the multi-language functionality of the Solar System Explorer.',
        'test_instructions': 'Test Instructions',
        'test_step_1': '1. Click the language switcher button in the header',
        'test_step_2': '2. Watch the text change from English to Chinese',
        'test_step_3': '3. Click again to switch back to English',
        'test_step_4': '4. Notice how all elements with data-i18n attributes are translated',
        'sample_content_title': 'Sample Content',
        'navigation_test': 'Navigation Test',
        'navigation_desc': 'All navigation elements should be translated when you switch languages.',
        'buttons_test': 'Buttons Test',
        'buttons_desc': 'Button text and labels should change with the language.',
        'forms_test': 'Forms Test',
        'forms_desc': 'Form placeholders and labels should be translated.',
        'current_language': 'Current Language',
        'language_code': 'Language Code',
        'language_name': 'Language Name',
        'language_flag': 'Flag'
    }
};

// Add extra languages metadata (names/flags). Translations will fallback to runtime translation if not present.
Object.assign(LANGUAGES, {
    es: { name: 'Español', flag: '🇪🇸', direction: 'ltr' },
    fr: { name: 'Français', flag: '🇫🇷', direction: 'ltr' },
    ja: { name: '日本語', flag: '🇯🇵', direction: 'ltr' }
});

// Runtime translation fallback using a simple fetch to a free endpoint is not allowed here.
// Instead, implement a heuristic client-side dictionary fallback: if target language is not in TRANSLATIONS,
// we map keys from English and keep English text as placeholder. This enables UI language selection immediately.

function runtimeTranslate(key, targetLang) {
    // If translation exists, return
    if (TRANSLATIONS[targetLang] && TRANSLATIONS[targetLang][key]) return TRANSLATIONS[targetLang][key];
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    // Otherwise key
    return key;
}

// (runtimeTranslate will be used by LanguageManager.getText implementation)

// Expose global setter so header dropdown can invoke
window.setLanguage = function(lang) {
    if (window.languageManager) {
        window.languageManager.setLanguage(lang);
    } else {
        // Defer until initialized
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => window.languageManager && window.languageManager.setLanguage(lang), 100);
        });
    }
};

// 语言管理类
class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.detectLanguage();
        this.init();
    }
    
    init() {
        this.translatePage();
        this.setupLanguageSwitcher();
        this.updateDocumentLanguage();
        this.updateLanguageSwitcherUI(); // 确保初始化时更新UI
        this.notifyLanguageChange();
    }
    
    getStoredLanguage() {
        return localStorage.getItem('preferred_language');
    }
    
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        // 如果浏览器语言是中文，返回zh，否则返回en
        return shortLang === 'zh' ? 'zh' : 'en';
    }
    
    setLanguage(lang) {
        if (LANGUAGES[lang] && lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            localStorage.setItem('preferred_language', lang);
            console.debug(`i18n: setLanguage -> ${lang}`);
            this.translatePage();
            this.updateDocumentLanguage();
            this.notifyLanguageChange();
            this.showNotification(this.getText('language_changed'));
        }
    }
    
    getText(key) {
        // use runtimeTranslate which falls back to English when necessary
        const lang = this.currentLanguage || 'en';
        return runtimeTranslate(key, lang);
    }
    
    setupLanguageSwitcher() {
        document.addEventListener('click', (event) => {
            const switcher = event.target.closest('#language-switcher');
            if (switcher) {
                event.preventDefault();
                const newLang = this.currentLanguage === 'en' ? 'zh' : 'en';
                console.debug('i18n: language switcher clicked, toggling ->', newLang);
                this.setLanguage(newLang);
            }
        });
    }
    
    translatePage() {
        // translate text content
        const elements = document.querySelectorAll('[data-i18n]');
        let translated = 0;
        let missing = 0;
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getText(key);
            if (translation && translation !== key) {
                element.textContent = translation;
                translated++;
            } else {
                missing++;
            }
        });
        console.debug(`i18n: translatePage -> translated=${translated}, missing=${missing}`);
        // Update on-page debug overlay (if present)
        try {
            if (typeof updateI18nDebug === 'function') updateI18nDebug(translated, missing, this.currentLanguage);
        } catch (err) { /* noop */ }

        // translate attributes
        const attrMap = [
            { selector: '[data-i18n-placeholder]', attr: 'placeholder', dataAttr: 'data-i18n-placeholder' },
            { selector: '[data-i18n-title]', attr: 'title', dataAttr: 'data-i18n-title' },
            { selector: '[data-i18n-aria-label]', attr: 'aria-label', dataAttr: 'data-i18n-aria-label' }
        ];
        attrMap.forEach(({ selector, attr, dataAttr }) => {
            document.querySelectorAll(selector).forEach(el => {
                const key = el.getAttribute(dataAttr);
                const translation = this.getText(key);
                if (translation && translation !== key) {
                    el.setAttribute(attr, translation);
                }
            });
        });

        // translate <title>
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const titleKey = titleElement.getAttribute('data-i18n');
            const titleTranslation = this.getText(titleKey);
            if (titleTranslation && titleTranslation !== titleKey) {
                titleElement.textContent = titleTranslation;
            }
        }

        // update language switcher UI
        this.updateLanguageSwitcherUI();
    }
    
    updateLanguageSwitcherUI() {
        const langFlag = document.getElementById('lang-flag');
        const langName = document.getElementById('lang-name');
        
        if (langFlag && langName) {
            // 显示当前语言
            const currentLangData = LANGUAGES[this.currentLanguage];
            
            if (currentLangData) {
                langFlag.textContent = currentLangData.flag;
                langName.textContent = currentLangData.name;
            }
        }
    }
    
    updateDocumentLanguage() {
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = LANGUAGES[this.currentLanguage].direction;
    }
    
    notifyLanguageChange() {
        // 触发自定义事件
        const event = new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        });
        document.dispatchEvent(event);
        
        // 调用全局回调函数
        if (typeof window.onLanguageChange === 'function') {
            window.onLanguageChange(this.currentLanguage);
        }
    }
    
    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--nasa-blue);
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            z-index: 2000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 获取当前语言信息
    getCurrentLanguage() {
        return {
            code: this.currentLanguage,
            name: LANGUAGES[this.currentLanguage].name,
            flag: LANGUAGES[this.currentLanguage].flag
        };
    }
    
    // 获取所有可用语言
    getAvailableLanguages() {
        return Object.keys(LANGUAGES).map(code => ({
            code,
            name: LANGUAGES[code].name,
            flag: LANGUAGES[code].flag
        }));
    }
}

// 全局语言管理器实例
let languageManager;

// 页面加载完成后初始化及样式注入
// Initialize language manager immediately so other scripts (like shared-header)
// can rely on it being available. translatePage() is safe to call early.
languageManager = new LanguageManager();
window.languageManager = languageManager;

document.addEventListener('DOMContentLoaded', () => {
    // 添加CSS动画（仅在 DOM 就绪后插入样式）
    if (!document.querySelector('#language-animations')) {
        const style = document.createElement('style');
        style.id = 'language-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    // Ensure translation runs after DOM is ready (in case LanguageManager initialized earlier)
    try {
        if (window.languageManager && typeof window.languageManager.translatePage === 'function') {
            // small delay to ensure other dynamic content has been injected
            setTimeout(() => {
                console.debug('i18n: DOMContentLoaded -> running translatePage');
                window.languageManager.translatePage();
                window.languageManager.updateLanguageSwitcherUI();
            }, 50);
        }
    } catch (err) {
        console.warn('i18n: failed to run translatePage on DOMContentLoaded', err);
    }
});

// Also ensure translation runs on full load
window.addEventListener('load', () => {
    try {
        if (window.languageManager && typeof window.languageManager.translatePage === 'function') {
            console.debug('i18n: window.load -> running translatePage');
            window.languageManager.translatePage();
            window.languageManager.updateLanguageSwitcherUI();
        }
    } catch (err) {
        console.warn('i18n: failed to run translatePage on load', err);
    }
});

// Schedule a few retries after load in case other scripts overwrite text later
function scheduleTranslateRetries() {
    const times = [100, 500, 1000, 2000];
    times.forEach((t) => {
        setTimeout(() => {
            try {
                if (window.languageManager && typeof window.languageManager.translatePage === 'function') {
                    console.debug(`i18n: retry translatePage at ${t}ms`);
                    window.languageManager.translatePage();
                    window.languageManager.updateLanguageSwitcherUI();
                }
            } catch (err) {
                console.warn('i18n: retry translate failed', err);
            }
        }, t);
    });
}

if (document.readyState === 'complete') scheduleTranslateRetries();
else window.addEventListener('load', scheduleTranslateRetries);

// Re-run translation when languageChanged event fires (safety)
document.addEventListener('languageChanged', (e) => {
    try {
        console.debug('i18n: languageChanged event -> running translatePage', e && e.detail);
        if (window.languageManager && typeof window.languageManager.translatePage === 'function') {
            window.languageManager.translatePage();
            window.languageManager.updateLanguageSwitcherUI();
        }
    } catch (err) {
        console.warn('i18n: failed to run translatePage on languageChanged', err);
    }
});

// Observe DOM changes and translate newly inserted nodes that contain data-i18n attributes.
function initI18nMutationObserver() {
    if (!('MutationObserver' in window)) return;
    const observer = new MutationObserver((mutations) => {
        let needsRun = false;
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                    needsRun = true; break;
                }
                if (node.querySelector && node.querySelector('[data-i18n]')) { needsRun = true; break; }
            }
            if (needsRun) break;
        }
        if (needsRun && window.languageManager && typeof window.languageManager.translatePage === 'function') {
            // small debounce
            clearTimeout(window.__i18nObserverTimer);
            window.__i18nObserverTimer = setTimeout(() => {
                try { window.languageManager.translatePage(); } catch (err) { console.warn('i18n: mutation observer translate failed', err); }
            }, 40);
        }
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initI18nMutationObserver();
} else {
    document.addEventListener('DOMContentLoaded', initI18nMutationObserver);
}

// On-page debug overlay to help diagnose translation issues (only in dev)
function updateI18nDebug(translated = 0, missing = 0, lang = 'en') {
    try {
        let el = document.getElementById('i18n-debug');
        if (!el) {
            el = document.createElement('div');
            el.id = 'i18n-debug';
            el.style.cssText = 'position:fixed;right:12px;bottom:12px;background:rgba(11,61,145,0.95);color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;z-index:99999;box-shadow:0 6px 18px rgba(0,0,0,0.4)';
            document.body.appendChild(el);
        }
        el.textContent = `i18n: lang=${lang} translated=${translated} missing=${missing} @${new Date().toLocaleTimeString()}`;
        // auto-hide after 4s
        clearTimeout(window.__i18nDebugTimer);
        window.__i18nDebugTimer = setTimeout(() => { try { el.style.display = 'none'; } catch (e) {} }, 4000);
    } catch (err) { console.warn('i18n: updateI18nDebug failed', err); }
}

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageManager, TRANSLATIONS, LANGUAGES };
} 