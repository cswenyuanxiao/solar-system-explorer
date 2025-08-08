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

// Ensure global placeholders exist so other scripts can safely reference them
if (typeof window !== 'undefined') {
    window.LanguageManager = window.LanguageManager || null;
    window.languageManager = window.languageManager || null;
}

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

        // APOD (Astronomy Picture of the Day)
        'apod_title': '每日天文图片',
        'apod_prev': '上一张',
        'apod_next': '下一张',
        'apod_refresh': '刷新',
        'apod_download': '下载',
        'apod_share': '分享',
        'apod_fullscreen': '全屏',

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

        // APOD (Astronomy Picture of the Day)
        'apod_title': 'Astronomy Picture of the Day',
        'apod_prev': 'Previous',
        'apod_next': 'Next',
        'apod_refresh': 'Refresh',
        'apod_download': 'Download',
        'apod_share': 'Share',
        'apod_fullscreen': 'Fullscreen',

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
    },
    // Minimal additional languages; missing keys will fallback to English
    es: {
        'home': 'Inicio',
        'search': 'Buscar',
        'charts': 'Gráficos',
        'education': 'Educación',
        'api': 'API',
        'language': 'Idioma',
        'dark_mode': 'Modo oscuro',
        'favorites': 'Favoritos',
        'main_title': 'Visualización de Datos del Sistema Solar',
        'subtitle': 'Gráficos interactivos y comparaciones',
        'hero_title': 'EXPLORA NUESTRO SISTEMA SOLAR',
        'hero_subtitle': 'Viaja por los planetas, lunas y cuerpos celestes de nuestro vecindario cósmico. Descubre las últimas misiones de la NASA y hallazgos científicos.',
        'featured_title': 'MISIONES DESTACADAS',
        // Header buttons
        'favorites': 'FAVORITOS',
        'dark_mode': 'MODO OSCURO'
    },
    fr: {
        'home': 'Accueil',
        'search': 'Recherche',
        'charts': 'Graphiques',
        'education': 'Éducation',
        'api': 'API',
        'language': 'Langue',
        'dark_mode': 'Mode sombre',
        'favorites': 'Favoris',
        'main_title': 'Visualisation des Données du Système Solaire',
        'subtitle': 'Graphiques et comparaisons interactifs',
        'hero_title': 'EXPLOREZ NOTRE SYSTÈME SOLAIRE',
        'hero_subtitle': 'Parcourez les planètes, les lunes et les corps célestes de notre voisinage cosmique. Découvrez les dernières missions de la NASA et découvertes scientifiques.',
        'featured_title': 'MISSIONS À LA UNE',
        'favorites': 'FAVORIS',
        'dark_mode': 'MODE SOMBRE'
    },
    ja: {
        'home': 'ホーム',
        'search': '検索',
        'charts': 'グラフ',
        'education': '教育',
        'api': 'API',
        'language': '言語',
        'dark_mode': 'ダークモード',
        'favorites': 'お気に入り',
        'main_title': '太陽系データの可視化',
        'subtitle': 'インタラクティブなグラフと比較',
        'hero_title': '太陽系を探検しよう',
        'hero_subtitle': '惑星や月などの天体を旅し、最新のNASAミッションと科学的発見を見つけましょう。',
        'featured_title': '注目のミッション',
        'favorites': 'お気に入り',
        'dark_mode': 'ダークモード'
    }
};

// Per-page detailed keys (Mars example)
const DETAIL_TRANSLATIONS = {
    zh: {
        mars_page_title: '火星 - 太阳系探索器',
        back_to_home: '← 返回太阳系',
        mars_subtitle: '红色星球 - 未来人类的目的地',
        mars_hero_title: '红色星球',
        mars_hero_desc: '火星是距离太阳第四颗、太阳系第二小的行星。由于表面的氧化铁而呈红色，是地球之外被探索最多的行星。',
        basic_facts: '基本信息',
        label_type: '类型:',
        label_distance: '与太阳距离:',
        label_diameter: '直径:',
        label_mass: '质量:',
        label_surface_temp: '表面温度:',
        label_orbital_period: '公转周期:',
        atmosphere_climate: '大气与气候',
        label_atmosphere: '大气:',
        label_surface_pressure: '表面气压:',
        label_dust_storms: '沙尘暴:',
        label_polar_caps: '极地冰盖:',
        label_wind_speed: '风速:',
        label_seasonal_changes: '季节变化:',
        surface_features: '地表特征',
        feature_olympus: '奥林帕斯山:',
        feature_valles: '水手谷:',
        feature_tharsis: '塔尔西斯隆起:',
        feature_craters: '撞击坑:',
        feature_dunes: '沙丘:',
        feature_riverbeds: '远古河床:',
        moons_satellites: '卫星与伴星',
        label_phobos: '福波斯:',
        label_deimos: '得摩斯:',
        label_origin: '起源:',
        label_future: '未来:',
        label_exploration: '探索:',
        exploration_history: '探索历史',
        probe_mariner4: '水手4号:',
        probe_viking: '海盗计划:',
        probe_pathfinder: '探路者:',
        probe_spirit: '勇气号 & 机遇号:',
        probe_curiosity: '好奇号:',
        probe_perseverance: '毅力号:',
        future_human_missions: '未来载人任务',
        mission_starship: 'SpaceX 星际飞船:',
        mission_artemis: 'NASA 阿尔忒弥斯:',
        mission_habitat: '栖息地设计:',
        mission_isru: '原位资源利用:',
        mission_radiation: '辐射防护:',
        mission_life_support: '生命保障:',
        fun_facts: '趣味知识',
        fact_tallest: '🗻 最高的山',
        fact_tallest_desc: '火星的奥林帕斯山是太阳系最高的山，高出珠穆朗玛峰三倍。',
        fact_oceans: '🌊 远古海洋',
        fact_oceans_desc: '火星曾有液态水，仍可见远古河床和湖床的证据。',
        fact_dust: '🌪️ 沙尘旋风',
        fact_dust_desc: '火星常见沙尘旋风，高可达 8 公里，持续数小时。',
        fact_rust: '🔴 铁锈表面',
        fact_rust_desc: '表面覆盖氧化铁使火星呈红色，因而得名“红色星球”。'
    },
    en: {
        mars_page_title: 'Mars - Solar System Explorer',
        back_to_home: '← Back to Solar System',
        mars_subtitle: 'The Red Planet - Future Human Destination',
        mars_hero_title: 'The Red Planet',
        mars_hero_desc: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Known as the Red Planet due to iron oxide on its surface, it\'s the most explored planet beyond Earth.',
        basic_facts: 'Basic Facts',
        label_type: 'Type:',
        label_distance: 'Distance from Sun:',
        label_diameter: 'Diameter:',
        label_mass: 'Mass:',
        label_surface_temp: 'Surface Temperature:',
        label_orbital_period: 'Orbital Period:',
        atmosphere_climate: 'Atmosphere & Climate',
        label_atmosphere: 'Atmosphere:',
        label_surface_pressure: 'Surface Pressure:',
        label_dust_storms: 'Dust Storms:',
        label_polar_caps: 'Polar Ice Caps:',
        label_wind_speed: 'Wind Speed:',
        label_seasonal_changes: 'Seasonal Changes:',
        surface_features: 'Surface Features',
        feature_olympus: 'Olympus Mons:',
        feature_valles: 'Valles Marineris:',
        feature_tharsis: 'Tharsis Bulge:',
        feature_craters: 'Impact Craters:',
        feature_dunes: 'Sand Dunes:',
        feature_riverbeds: 'Ancient Riverbeds:',
        moons_satellites: 'Moons & Satellites',
        label_phobos: 'Phobos:',
        label_deimos: 'Deimos:',
        label_origin: 'Origin:',
        label_future: 'Future:',
        label_exploration: 'Exploration:',
        exploration_history: 'Exploration History',
        probe_mariner4: 'Mariner 4:',
        probe_viking: 'Viking Program:',
        probe_pathfinder: 'Pathfinder:',
        probe_spirit: 'Spirit & Opportunity:',
        probe_curiosity: 'Curiosity:',
        probe_perseverance: 'Perseverance:',
        future_human_missions: 'Future Human Missions',
        mission_starship: 'SpaceX Starship:',
        mission_artemis: 'NASA Artemis:',
        mission_habitat: 'Habitat Design:',
        mission_isru: 'Resource Utilization:',
        mission_radiation: 'Radiation Protection:',
        mission_life_support: 'Life Support:',
        fun_facts: 'Fun Facts',
        fact_tallest: '🗻 Tallest Mountain',
        fact_tallest_desc: 'Olympus Mons on Mars is the tallest mountain in the solar system, three times higher than Mount Everest.',
        fact_oceans: '🌊 Ancient Oceans',
        fact_oceans_desc: 'Mars once had liquid water on its surface, with evidence of ancient riverbeds and lake beds.',
        fact_dust: '🌪️ Dust Devils',
        fact_dust_desc: 'Frequent dust devils can reach heights of 8 km and last for hours.',
        fact_rust: '🔴 Rusty Surface',
        fact_rust_desc: 'Iron oxide covers the surface giving Mars its red color.'
    },
    fr: {
        mars_page_title: 'Mars - Explorateur du Système Solaire',
        back_to_home: '← Retour au système solaire',
        mars_subtitle: 'La planète rouge - future destination humaine',
        mars_hero_title: 'La planète rouge',
        mars_hero_desc: "Mars est la quatrième planète à partir du Soleil et la deuxième plus petite du système solaire. Connue comme la planète rouge à cause de l'oxyde de fer à sa surface, c'est la planète la plus explorée au-delà de la Terre.",
        basic_facts: 'Faits essentiels',
        label_type: 'Type :',
        label_distance: 'Distance du Soleil :',
        label_diameter: 'Diamètre :',
        label_mass: 'Masse :',
        label_surface_temp: 'Température de surface :',
        label_orbital_period: 'Période orbitale :',
        atmosphere_climate: 'Atmosphère et climat',
        label_atmosphere: 'Atmosphère :',
        label_surface_pressure: 'Pression de surface :',
        label_dust_storms: 'Tempêtes de poussière :',
        label_polar_caps: 'Calottes polaires :',
        label_wind_speed: 'Vitesse du vent :',
        label_seasonal_changes: 'Changements saisonniers :',
        surface_features: 'Caractéristiques de surface',
        feature_olympus: 'Olympus Mons :',
        feature_valles: 'Valles Marineris :',
        feature_tharsis: 'Bombement de Tharsis :',
        feature_craters: 'Cratères d’impact :',
        feature_dunes: 'Dunes de sable :',
        feature_riverbeds: 'Anciens lits de rivières :',
        moons_satellites: 'Lunes et satellites',
        label_phobos: 'Phobos :',
        label_deimos: 'Deimos :',
        label_origin: 'Origine :',
        label_future: 'Futur :',
        label_exploration: 'Exploration :',
        exploration_history: "Historique de l'exploration",
        probe_mariner4: 'Mariner 4 :',
        probe_viking: 'Programme Viking :',
        probe_pathfinder: 'Pathfinder :',
        probe_spirit: 'Spirit et Opportunity :',
        probe_curiosity: 'Curiosity :',
        probe_perseverance: 'Perseverance :',
        future_human_missions: 'Futures missions humaines',
        mission_starship: 'SpaceX Starship :',
        mission_artemis: 'NASA Artemis :',
        mission_habitat: 'Conception des habitats :',
        mission_isru: 'Utilisation des ressources in situ :',
        mission_radiation: 'Protection contre les radiations :',
        mission_life_support: 'Systèmes de survie :',
        fun_facts: 'Le saviez-vous ?',
        fact_tallest: '🗻 Montagne la plus haute',
        fact_tallest_desc: "L’Olympus Mons sur Mars est la plus haute montagne du système solaire, trois fois l’Everest.",
        fact_oceans: '🌊 Océans antiques',
        fact_oceans_desc: "Mars a autrefois possédé de l’eau liquide en surface, avec des traces d’anciens lits de rivières et de lacs.",
        fact_dust: '🌪️ Diables de poussière',
        fact_dust_desc: 'Des tourbillons de poussière fréquents peuvent atteindre 8 km de hauteur et durer des heures.',
        fact_rust: '🔴 Surface rouillée',
        fact_rust_desc: 'L’oxyde de fer recouvre la surface, donnant à Mars sa couleur rouge.'
    },
    es: {
        mars_page_title: 'Marte - Explorador del Sistema Solar',
        back_to_home: '← Volver al sistema solar',
        mars_subtitle: 'El planeta rojo - futuro destino humano',
        mars_hero_title: 'El planeta rojo',
        mars_hero_desc: 'Marte es el cuarto planeta desde el Sol y el segundo más pequeño del sistema solar. Conocido como el planeta rojo por el óxido de hierro en su superficie, es el planeta más explorado más allá de la Tierra.',
        basic_facts: 'Datos básicos',
        label_type: 'Tipo:',
        label_distance: 'Distancia del Sol:',
        label_diameter: 'Diámetro:',
        label_mass: 'Masa:',
        label_surface_temp: 'Temperatura superficial:',
        label_orbital_period: 'Período orbital:',
        atmosphere_climate: 'Atmósfera y clima',
        label_atmosphere: 'Atmósfera:',
        label_surface_pressure: 'Presión superficial:',
        label_dust_storms: 'Tormentas de polvo:',
        label_polar_caps: 'Casquetes polares:',
        label_wind_speed: 'Velocidad del viento:',
        label_seasonal_changes: 'Cambios estacionales:',
        surface_features: 'Características de la superficie',
        feature_olympus: 'Olympus Mons:',
        feature_valles: 'Valles Marineris:',
        feature_tharsis: 'Abultamiento de Tharsis:',
        feature_craters: 'Cráteres de impacto:',
        feature_dunes: 'Dunas de arena:',
        feature_riverbeds: 'Antiguos cauces de ríos:',
        moons_satellites: 'Lunas y satélites',
        label_phobos: 'Fobos:',
        label_deimos: 'Deimos:',
        label_origin: 'Origen:',
        label_future: 'Futuro:',
        label_exploration: 'Exploración:',
        exploration_history: 'Historia de exploración',
        probe_mariner4: 'Mariner 4:',
        probe_viking: 'Programa Viking:',
        probe_pathfinder: 'Pathfinder:',
        probe_spirit: 'Spirit y Opportunity:',
        probe_curiosity: 'Curiosity:',
        probe_perseverance: 'Perseverance:',
        future_human_missions: 'Futuras misiones humanas',
        mission_starship: 'SpaceX Starship:',
        mission_artemis: 'NASA Artemis:',
        mission_habitat: 'Diseño de hábitats:',
        mission_isru: 'Utilización de recursos in situ:',
        mission_radiation: 'Protección contra radiación:',
        mission_life_support: 'Soporte vital:',
        fun_facts: 'Datos curiosos',
        fact_tallest: '🗻 Montaña más alta',
        fact_tallest_desc: 'El Olympus Mons en Marte es la montaña más alta del sistema solar, tres veces el Everest.',
        fact_oceans: '🌊 Océanos antiguos',
        fact_oceans_desc: 'Marte tuvo agua líquida en su superficie; hay evidencias de antiguos cauces y lechos de lago.',
        fact_dust: '🌪️ Diablos de polvo',
        fact_dust_desc: 'Torbellinos de polvo frecuentes pueden alcanzar 8 km de altura y durar horas.',
        fact_rust: '🔴 Superficie oxidada',
        fact_rust_desc: 'El óxido de hierro cubre la superficie, dando a Marte su color rojo.'
    }
};

// Merge detailed translations
TRANSLATIONS.zh = Object.assign({}, TRANSLATIONS.zh, DETAIL_TRANSLATIONS.zh);
TRANSLATIONS.en = Object.assign({}, TRANSLATIONS.en, DETAIL_TRANSLATIONS.en);
TRANSLATIONS.fr = Object.assign({}, TRANSLATIONS.fr || {}, DETAIL_TRANSLATIONS.fr || {});
TRANSLATIONS.es = Object.assign({}, TRANSLATIONS.es || {}, DETAIL_TRANSLATIONS.es || {});

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

// =====================
// Optional Auto-Translate (external service)
// =====================
// Configurable endpoint (LibreTranslate-compatible). You can self-host or change this URL.
window.I18N_AUTO_TRANSLATE = window.I18N_AUTO_TRANSLATE ?? true;
window.I18N_TRANSLATE_ENDPOINT = window.I18N_TRANSLATE_ENDPOINT || 'https://libretranslate.de/translate';
window.I18N_TRANSLATE_API_KEY = window.I18N_TRANSLATE_API_KEY || '';

function normalizeTextContent(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
}

function getAutoCacheKey(text, targetLang) {
    return `i18n.auto.${targetLang}.${normalizeTextContent(text)}`;
}

async function translateBatchAuto(texts, sourceLang, targetLang) {
    // Filter empty and pull from cache first
    const results = [];
    const toTranslate = [];
    const mapIndex = [];
    for (let i = 0; i < texts.length; i++) {
        const t = normalizeTextContent(texts[i]);
        if (!t) { results[i] = ''; continue; }
        const cached = localStorage.getItem(getAutoCacheKey(t, targetLang));
        if (cached) { results[i] = cached; continue; }
        mapIndex.push(i);
        toTranslate.push(t);
    }
    if (toTranslate.length === 0) return results;
    try {
        const body = {
            q: toTranslate,
            source: sourceLang || 'en',
            target: targetLang,
            format: 'text'
        };
        if (window.I18N_TRANSLATE_API_KEY) body.api_key = window.I18N_TRANSLATE_API_KEY;
        const resp = await fetch(window.I18N_TRANSLATE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        // LibreTranslate returns { translatedText } when single, or array when multiple (varies by instance)
        const translatedArray = Array.isArray(data) ? data.map(x => x.translatedText) : (data.translatedText ? [data.translatedText] : []);
        mapIndex.forEach((origIdx, j) => {
            const translated = translatedArray[j] || '';
            results[origIdx] = translated;
            try { localStorage.setItem(getAutoCacheKey(toTranslate[j], targetLang), translated); } catch (_) {}
        });
    } catch (err) {
        console.warn('i18n: auto-translate request failed', err);
        // leave missing entries undefined; caller will ignore
    }
    return results;
}

async function autoTranslatePageText(targetLang) {
    if (!window.I18N_AUTO_TRANSLATE) return;
    if (!targetLang || targetLang === 'en') return;
    // Prevent re-entrant runs
    if (window.__i18nTranslating) return;
    window.__i18nTranslating = true;
    const MAX_NODES = window.I18N_MAX_NODES || 400; // hard cap to avoid jank
    // Collect candidate nodes: visible text nodes within elements without data-i18n attributes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            const text = normalizeTextContent(node.nodeValue);
            if (!text) return NodeFilter.FILTER_REJECT;
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (/(SCRIPT|STYLE|CODE|PRE|NOSCRIPT|IFRAME)/.test(tag)) return NodeFilter.FILTER_REJECT;
            if (parent.closest('[data-i18n]')) return NodeFilter.FILTER_REJECT;
            if (parent.hasAttribute('data-i18n-auto')) return NodeFilter.FILTER_ACCEPT;
            // Only translate if the text contains ASCII letters (avoid numbers-only etc.)
            if (!/[A-Za-z]/.test(text)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    const nodes = [];
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
        if (nodes.length >= MAX_NODES) break;
    }
    if (nodes.length === 0) return;
    const originalTexts = nodes.map(n => {
        const t = normalizeTextContent(n.nodeValue);
        if (!n.parentElement.getAttribute('data-i18n-auto-en')) {
            n.parentElement.setAttribute('data-i18n-auto-en', t);
        }
        n.parentElement.setAttribute('data-i18n-auto', '1');
        return t;
    });
    // Batch in chunks to respect server limits
    const chunkSize = 25;
    for (let i = 0; i < originalTexts.length; i += chunkSize) {
        const slice = originalTexts.slice(i, i + chunkSize);
        const translated = await translateBatchAuto(slice, 'en', targetLang);
        translated.forEach((tr, idx) => {
            if (typeof tr === 'string' && tr.trim()) {
                const node = nodes[i + idx];
                if (node) node.nodeValue = tr;
            }
        });
    }

    // Special handling: translate values after labels in info cards (e.g., <li><strong>Label:</strong> Value>)
    try {
        const valueTextNodes = [];
        const valueOriginals = [];
        document.querySelectorAll('.info-card li').forEach(li => {
            // Find text nodes that are not inside <strong>
            const childNodes = Array.from(li.childNodes);
            childNodes.forEach(n => {
                if (n.nodeType === Node.TEXT_NODE) {
                    const t = normalizeTextContent(n.nodeValue);
                    if (/[A-Za-z]/.test(t)) {
                        valueTextNodes.push(n);
                        valueOriginals.push(t);
                    }
                }
            });
        });
        for (let i = 0; i < valueOriginals.length; i += chunkSize) {
            const slice = valueOriginals.slice(i, i + chunkSize);
            const translated = await translateBatchAuto(slice, 'en', targetLang);
            translated.forEach((tr, idx) => {
                const node = valueTextNodes[i + idx];
                if (node && typeof tr === 'string' && tr.trim()) node.nodeValue = ' ' + tr; // keep leading space
            });
        }
    } catch (e) { /* ignore */ }

    // Translate common attributes globally (placeholder, title, aria-label, alt, value for inputs/buttons)
    try {
        await autoTranslateAttributes(targetLang);
    } catch (e) {
        console.warn('i18n: autoTranslateAttributes failed', e);
    }
    window.__i18nTranslating = false;
}

// Translate common attributes across the whole document using batch requests
async function autoTranslateAttributes(targetLang) {
    const ATTRS = ['placeholder', 'aria-label', 'alt']; // drop title to reduce volume
    const VALUE_TAGS = new Set(['BUTTON', 'INPUT']);
    const MAX_ATTR = window.I18N_MAX_ATTR || 400;

    // Collect elements and texts
    const elements = [];
    const texts = [];
    const keys = [];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null);
    let node;
    while ((node = walker.nextNode())) {
        // Translate .value for buttons and inputs that show text to users
        if (VALUE_TAGS.has(node.tagName)) {
            const type = (node.getAttribute('type') || '').toLowerCase();
            const isTextButton = node.tagName === 'BUTTON' || ['button', 'submit', 'reset'].includes(type);
            if (isTextButton) {
                const val = node.tagName === 'BUTTON' ? (node.textContent || '') : (node.value || '');
                const norm = normalizeTextContent(val);
                if (/[A-Za-z]/.test(norm)) {
                    const k = `value`;
                    if (!node.getAttribute('data-i18n-auto-en-value')) node.setAttribute('data-i18n-auto-en-value', val);
                    elements.push({ el: node, attr: k, isButton: node.tagName === 'BUTTON' });
                    texts.push(norm);
                    keys.push(k);
                }
            }
        }
        // Translate common attributes
        for (const attr of ATTRS) {
            const raw = node.getAttribute(attr);
            if (!raw) continue;
            const norm = normalizeTextContent(raw);
            if (!/[A-Za-z]/.test(norm)) continue;
            const dataKey = `data-i18n-auto-en-${attr}`;
            if (!node.getAttribute(dataKey)) node.setAttribute(dataKey, raw);
            elements.push({ el: node, attr });
            texts.push(norm);
            keys.push(attr);
        }
        if (texts.length >= MAX_ATTR) break;
    }

    if (texts.length === 0) return;

    // Batch translate
    const chunkSize = 40;
    for (let i = 0; i < texts.length; i += chunkSize) {
        const slice = texts.slice(i, i + chunkSize);
        const translated = await translateBatchAuto(slice, 'en', targetLang);
        translated.forEach((tr, idx) => {
            const entry = elements[i + idx];
            if (!entry) return;
            if (typeof tr !== 'string' || !tr.trim()) return;
            if (entry.attr === 'value') {
                if (entry.isButton) entry.el.textContent = tr;
                else entry.el.value = tr;
            } else {
                entry.el.setAttribute(entry.attr, tr);
            }
        });
    }
}

// Expose global setter so header dropdown can invoke
window.setLanguage = function(lang) {
    // Prefer the requested language; fall back to English only if unsupported
    const isSupportedInMeta = !!(window.LANGUAGES && window.LANGUAGES[lang]);
    const isSupportedInTranslations = !!(TRANSLATIONS && TRANSLATIONS[lang]);
    const target = (isSupportedInMeta || isSupportedInTranslations) ? lang : 'en';
    console.debug('i18n: window.setLanguage requested', lang, '-> applying', target);
    if (window.languageManager) {
        window.languageManager.setLanguage(target);
    } else {
        // Defer until initialized
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => window.languageManager && window.languageManager.setLanguage(target), 100);
        });
    }
};

// 语言管理类 (assign to predeclared var to avoid TDZ when other scripts reference the symbol)
// Attach class to window to avoid TDZ issues when other scripts reference it
window.LanguageManager = class LanguageManager {
    constructor() {
        // Initialize basic properties but do NOT call init() here because
        // init() dispatches events. We must ensure the global reference
        // window.languageManager is assigned before init() runs to avoid
        // other modules (e.g., shared-header) receiving events while the
        // global is still null.
        this.currentLanguage = this.getStoredLanguage() || this.detectLanguage();
        // other setup done in init()
    }
    
    init() {
        this.translatePage();
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
        const target = LANGUAGES[lang] ? lang : 'en';
        if (target !== this.currentLanguage) {
            this.currentLanguage = target;
            try { localStorage.setItem('preferred_language', target); } catch (_) {}
            console.debug(`i18n: setLanguage -> ${target}`);
            this.translatePage();
            this.updateDocumentLanguage();
            this.notifyLanguageChange();
            this.showNotification(this.getText('language_changed'));
            // Auto-translate remaining page text nodes if enabled
            try { autoTranslatePageText(target); } catch (e) { console.warn('i18n: autoTranslatePageText failed', e); }
        }
    }
    
    getText(key) {
        // use runtimeTranslate which falls back to English when necessary
        const lang = this.currentLanguage || 'en';
        return runtimeTranslate(key, lang);
    }
    
    setupLanguageSwitcher() {
        // Delegated listener removed to avoid conflicts with shared-header's menu handling.
        // shared-header.js will call window.setLanguage(lang) when user selects a language.
    }
    
    translatePage() {
        // translate text content
        const elements = document.querySelectorAll('[data-i18n]');
        let translated = 0;
        let missing = 0;
        const missingKeys = new Map();
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getText(key);
            if (translation && translation !== key) {
                // support elements that need HTML insertion
                if (element.hasAttribute('data-i18n-html')) element.innerHTML = translation;
                else element.textContent = translation;
                translated++;
            } else {
                missing++;
                missingKeys.set(key, (missingKeys.get(key) || 0) + 1);
            }
        });
        console.debug(`i18n: translatePage -> translated=${translated}, missing=${missing}`);
        if (missing > 0) {
            const sample = Array.from(missingKeys.keys()).slice(0, 20);
            console.warn('i18n: missing translations for keys (sample up to 20):', sample);
        }
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
        // Also auto-translate on initial run when not English
        try {
            const lang = this.currentLanguage;
            if (lang && lang !== 'en') autoTranslatePageText(lang);
        } catch (e) { /* ignore */ }
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

// 页面加载完成后初始化及样式注入
function ensureLanguageManagerInitialized() {
    try {
        if (!window.languageManager) {
            // create instance and assign to global BEFORE running init()
            const instance = new window.LanguageManager();
            window.languageManager = instance;
            try {
                if (typeof instance.init === 'function') instance.init();
            } catch (innerErr) {
                console.warn('i18n: LanguageManager.init() failed', innerErr);
            }
            console.debug('i18n: LanguageManager initialized');
        }
    } catch (err) {
        console.warn('i18n: failed to initialize LanguageManager', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureLanguageManagerInitialized);
} else {
    // DOM already ready — initialize immediately
    ensureLanguageManagerInitialized();
}

// expose ensure function for other scripts (shared-header) to call synchronously
if (typeof window !== 'undefined') window.ensureLanguageManagerInitialized = ensureLanguageManagerInitialized;
    // 添加CSS动画（仅在 DOM 就绪后插入样式）
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
            // If nodes were added/removed or text changed, run translation
            if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.hasAttribute && node.hasAttribute('data-i18n')) { needsRun = true; break; }
                    if (node.querySelector && node.querySelector('[data-i18n]')) { needsRun = true; break; }
                }
            }
            if (m.type === 'characterData') {
                // text content changed somewhere; re-run translate to catch overwrites
                needsRun = true;
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
    // Observe childList, subtree and characterData (text changes) to catch scripts overwriting text nodes
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true, characterData: true });
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
    // Export the runtime-attached class to avoid TDZ issues in bundlers
    module.exports = { LanguageManager: window.LanguageManager, TRANSLATIONS, LANGUAGES };
}