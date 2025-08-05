/**
 * Navigation Monitor Script
 * 持续监控和修复导航问题
 */

(function() {
    'use strict';
    
    let navigationMonitor = null;
    let lastCheckTime = 0;
    const CHECK_INTERVAL = 3000; // 每3秒检查一次
    
    // 导航监控类
    class NavigationMonitor {
        constructor() {
            this.isMonitoring = false;
            this.lastResetTime = 0;
            this.resetCount = 0;
            this.maxResets = 10; // 最多重置10次
            
            this.startMonitoring();
        }
        
        startMonitoring() {
            if (this.isMonitoring) return;
            
            console.log('🔍 启动导航监控...');
            this.isMonitoring = true;
            
            // 立即检查一次
            this.checkNavigation();
            
            // 定期检查
            setInterval(() => {
                this.checkNavigation();
            }, CHECK_INTERVAL);
            
            // 监听页面可见性变化
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    console.log('👁️ 页面变为可见，检查导航状态...');
                    this.checkNavigation();
                }
            });
            
            // 监听焦点变化
            window.addEventListener('focus', () => {
                console.log('🎯 窗口获得焦点，检查导航状态...');
                this.checkNavigation();
            });
        }
        
        checkNavigation() {
            const now = Date.now();
            if (now - lastCheckTime < CHECK_INTERVAL) return;
            lastCheckTime = now;
            
            const navLinks = document.querySelectorAll('.main-nav a');
            if (navLinks.length === 0) return;
            
            let hasIssue = false;
            const currentPath = window.location.pathname;
            const isInPages = currentPath.includes('/pages/');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;
                
                // 检查路径是否正确
                if (isInPages && href.startsWith('pages/')) {
                    hasIssue = true;
                    console.log('⚠️ 检测到路径问题:', href);
                } else if (!isInPages && !href.startsWith('pages/') && !href.startsWith('http')) {
                    hasIssue = true;
                    console.log('⚠️ 检测到路径问题:', href);
                }
                
                // 检查点击事件是否正常工作
                const hasClickHandler = link.onclick || 
                    (link._listeners && link._listeners.length > 0);
                
                if (!hasClickHandler) {
                    hasIssue = true;
                    console.log('⚠️ 检测到点击事件缺失');
                }
            });
            
            if (hasIssue) {
                this.fixNavigation();
            }
        }
        
        fixNavigation() {
            const now = Date.now();
            
            // 防止频繁重置
            if (now - this.lastResetTime < 5000) return;
            if (this.resetCount >= this.maxResets) {
                console.log('⚠️ 已达到最大重置次数，停止监控');
                return;
            }
            
            console.log('🔧 修复导航问题...');
            this.lastResetTime = now;
            this.resetCount++;
            
            // 重新设置导航链接
            this.resetNavigationLinks();
            
            // 重新绑定点击事件
            this.bindClickEvents();
            
            // 重置浏览器状态
            this.resetBrowserState();
            
            console.log(`✅ 导航修复完成 (第${this.resetCount}次)`);
        }
        
        resetNavigationLinks() {
            const navLinks = document.querySelectorAll('.main-nav a');
            const isInPages = window.location.pathname.includes('/pages/');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;
                
                if (isInPages) {
                    // 在pages目录下，移除pages/前缀
                    if (href.startsWith('pages/')) {
                        link.href = href.replace('pages/', '');
                    }
                } else {
                    // 在根目录下，添加pages/前缀
                    if (!href.startsWith('pages/') && !href.startsWith('http')) {
                        link.href = 'pages/' + href;
                    }
                }
            });
        }
        
        bindClickEvents() {
            const navLinks = document.querySelectorAll('.main-nav a');
            
            navLinks.forEach(link => {
                // 移除所有现有的事件监听器
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                // 添加新的事件监听器
                newLink.addEventListener('click', (e) => {
                    const href = newLink.getAttribute('href');
                    if (href && !href.startsWith('http')) {
                        console.log('🔗 导航到:', href);
                        
                        // 使用window.location进行导航
                        window.location.href = href;
                        e.preventDefault();
                    }
                });
            });
        }
        
        resetBrowserState() {
            // 重置历史记录状态
            if (window.history && window.history.replaceState) {
                const currentPath = window.location.pathname;
                window.history.replaceState(null, null, currentPath);
            }
            
            // 重置滚动恢复
            if (window.history) {
                window.history.scrollRestoration = 'auto';
            }
            
            // 清理可能的事件监听器
            document.removeEventListener('click', this.globalClickHandler);
            
            // 添加全局点击处理
            this.globalClickHandler = (e) => {
                if (e.target.tagName === 'A' && e.target.href) {
                    const href = e.target.href;
                    
                    // 检查是否是内部链接且不是当前页面
                    if (href.includes(window.location.origin) && 
                        !href.includes('3d-simulator') &&
                        href !== window.location.href) {
                        
                        console.log('🔗 全局导航到:', href);
                        window.location.href = href;
                        e.preventDefault();
                    }
                }
            };
            
            document.addEventListener('click', this.globalClickHandler, true);
        }
        
        stopMonitoring() {
            this.isMonitoring = false;
            console.log('🛑 停止导航监控');
        }
    }
    
    // 页面加载完成后启动监控
    function startNavigationMonitor() {
        if (navigationMonitor) {
            navigationMonitor.stopMonitoring();
        }
        
        navigationMonitor = new NavigationMonitor();
        
        // 将监控器暴露到全局，方便调试
        window.navigationMonitor = navigationMonitor;
    }
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (navigationMonitor) {
            navigationMonitor.stopMonitoring();
        }
    });
    
    // 启动监控
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startNavigationMonitor);
    } else {
        startNavigationMonitor();
    }
    
    console.log('✅ 导航监控脚本已加载');
})(); 