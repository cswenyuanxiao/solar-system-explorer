// 多语言配置
const LANGUAGES = {
    zh: {
        name: '中文',
        flag: '🇨🇳'
    },
    en: {
        name: 'English',
        flag: '🇺🇸'
    }
};

// 翻译内容
const TRANSLATIONS = {
    zh: {
        // 导航和通用
        'home': '首页',
        'search': '搜索',
        'charts': '图表',
        'education': '教育',
        'api': 'API',
        'language': '语言',
        'dark_mode': '深色模式',
        'light_mode': '浅色模式',
        
        // 主页内容
        'main_title': '太阳系数据可视化',
        'subtitle': '交互式图表和比较',
        'hero_title': '探索太阳系的奥秘',
        'hero_subtitle': '通过交互式数据可视化了解我们的宇宙邻居',
        'explore_button': '开始探索',
        'learn_more': '了解更多',
        
        // 特色内容
        'featured_title': '特色内容',
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
        'mercury_desc': '最靠近太阳的行星',
        'venus_desc': '地球的姐妹星球',
        'earth_desc': '我们的家园星球',
        'mars_desc': '红色星球',
        'jupiter_desc': '太阳系最大的行星',
        'saturn_desc': '美丽的环状行星',
        'uranus_desc': '冰巨行星',
        'neptune_desc': '遥远的蓝色星球',
        
        // 详情页内容
        'back_to_home': '返回首页',
        'add_to_favorites': '添加到收藏',
        'remove_from_favorites': '从收藏移除',
        'basic_info': '基本信息',
        'fun_facts': '有趣事实',
        'exploration': '探索历史',
        
        // 搜索
        'search_placeholder': '搜索星球、数据或信息...',
        'search_button': '搜索',
        'no_results': '没有找到结果',
        'search_results': '搜索结果',
        
        // 图表页面
        'charts_title': '数据图表',
        'charts_subtitle': '太阳系数据的可视化比较',
        'planet_size': '行星大小比较',
        'planet_distance': '行星距离比较',
        'planet_temperature': '行星温度比较',
        'planet_moons': '行星卫星数量',
        
        // 教育页面
        'education_title': '太阳系教育',
        'education_subtitle': '学习太阳系知识',
        'quiz_title': '知识测验',
        'start_quiz': '开始测验',
        'next_question': '下一题',
        'submit_answer': '提交答案',
        'score': '得分',
        'correct': '正确',
        'incorrect': '错误',
        
        // API页面
        'api_title': 'NASA API 集成',
        'api_subtitle': '实时太空数据和图片',
        'api_key': 'API密钥',
        'enter_key': '输入您的NASA API密钥',
        'save_key': '保存密钥',
        'space_weather': '太空天气',
        'daily_fact': '每日太空知识',
        'apod': '每日天文图片',
        'download_image': '下载图片',
        
        // 通用
        'loading': '加载中...',
        'error': '错误',
        'success': '成功',
        'cancel': '取消',
        'save': '保存',
        'close': '关闭',
        'more_info': '更多信息',
        'view_details': '查看详情'
    },
    
    en: {
        // Navigation and common
        'home': 'Home',
        'search': 'Search',
        'charts': 'Charts',
        'education': 'Education',
        'api': 'API',
        'language': 'Language',
        'dark_mode': 'Dark Mode',
        'light_mode': 'Light Mode',
        
        // Main page content
        'main_title': 'Solar System Data Visualization',
        'subtitle': 'Interactive charts and comparisons',
        'hero_title': 'Explore the Mysteries of the Solar System',
        'hero_subtitle': 'Learn about our cosmic neighbors through interactive data visualization',
        'explore_button': 'Start Exploring',
        'learn_more': 'Learn More',
        
        // Featured content
        'featured_title': 'Featured Content',
        'size_comparison': 'Size Comparison',
        'distance_comparison': 'Distance Comparison',
        'temperature_comparison': 'Temperature Comparison',
        'moons_comparison': 'Number of Moons',
        
        // Planet names
        'sun': 'Sun',
        'mercury': 'Mercury',
        'venus': 'Venus',
        'earth': 'Earth',
        'mars': 'Mars',
        'jupiter': 'Jupiter',
        'saturn': 'Saturn',
        'uranus': 'Uranus',
        'neptune': 'Neptune',
        
        // Planet descriptions
        'sun_desc': 'Our Star - The Heart of the Solar System',
        'mercury_desc': 'The planet closest to the Sun',
        'venus_desc': 'Earth\'s sister planet',
        'earth_desc': 'Our home planet',
        'mars_desc': 'The Red Planet',
        'jupiter_desc': 'The largest planet in our solar system',
        'saturn_desc': 'The beautiful ringed planet',
        'uranus_desc': 'The ice giant',
        'neptune_desc': 'The distant blue planet',
        
        // Detail page content
        'back_to_home': 'Back to Home',
        'add_to_favorites': 'Add to Favorites',
        'remove_from_favorites': 'Remove from Favorites',
        'basic_info': 'Basic Information',
        'fun_facts': 'Fun Facts',
        'exploration': 'Exploration History',
        
        // Search
        'search_placeholder': 'Search planets, data, or information...',
        'search_button': 'Search',
        'no_results': 'No results found',
        'search_results': 'Search Results',
        
        // Charts page
        'charts_title': 'Data Charts',
        'charts_subtitle': 'Visual comparisons of solar system data',
        'planet_size': 'Planet Size Comparison',
        'planet_distance': 'Planet Distance Comparison',
        'planet_temperature': 'Planet Temperature Comparison',
        'planet_moons': 'Planet Moon Count',
        
        // Education page
        'education_title': 'Solar System Education',
        'education_subtitle': 'Learn about the solar system',
        'quiz_title': 'Knowledge Quiz',
        'start_quiz': 'Start Quiz',
        'next_question': 'Next Question',
        'submit_answer': 'Submit Answer',
        'score': 'Score',
        'correct': 'Correct',
        'incorrect': 'Incorrect',
        
        // API page
        'api_title': 'NASA API Integration',
        'api_subtitle': 'Real-time space data and images',
        'api_key': 'API Key',
        'enter_key': 'Enter your NASA API key',
        'save_key': 'Save Key',
        'space_weather': 'Space Weather',
        'daily_fact': 'Daily Space Fact',
        'apod': 'Astronomy Picture of the Day',
        'download_image': 'Download Image',
        
        // Common
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success',
        'cancel': 'Cancel',
        'save': 'Save',
        'close': 'Close',
        'more_info': 'More Info',
        'view_details': 'View Details'
    }
};

// 语言管理类
class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'zh';
        this.init();
    }
    
    // 初始化
    init() {
        this.translatePage();
        this.setupLanguageSwitcher();
        if (typeof onLanguageChange === 'function') {
            onLanguageChange();
        }
    }
    
    // 获取存储的语言设置
    getStoredLanguage() {
        return localStorage.getItem('preferred_language') || 'zh';
    }
    
    // 设置语言
    setLanguage(lang) {
        if (LANGUAGES[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('preferred_language', lang);
            this.translatePage();
            // Call the global UI update function
            if (typeof onLanguageChange === 'function') {
                onLanguageChange();
            }
        }
    }
    
    // 获取翻译
    getText(key) {
        return TRANSLATIONS[this.currentLanguage][key] || key;
    }
    
    // 更新语言切换器UI
    updateLanguageUI() {
        const switcher = document.getElementById('language-switcher');
        if (switcher) {
            const currentLang = LANGUAGES[this.currentLanguage];
            switcher.innerHTML = `
                <span>${currentLang.flag}</span>
                <span>${currentLang.name}</span>
            `;
        }
    }
    
    // 设置语言切换器
    setupLanguageSwitcher() {
        // Use event delegation on the body in case the header is not yet loaded
        document.body.addEventListener('click', (event) => {
            const switcher = event.target.closest('#language-switcher');
            if (switcher) {
                const newLang = this.currentLanguage === 'zh' ? 'en' : 'zh';
                this.setLanguage(newLang);
            }
        });
    }
    
    // 翻译页面
    translatePage() {
        // 翻译所有带有data-i18n属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getText(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // 翻译placeholder
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getText(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
        
        // 翻译title属性
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.getText(key);
            if (translation) {
                element.title = translation;
            }
        });
    }
}

// 全局语言管理器实例
let languageManager;

// 初始化语言管理器
document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
});

// 导出供其他脚本使用
window.LanguageManager = LanguageManager;
window.languageManager = languageManager; 