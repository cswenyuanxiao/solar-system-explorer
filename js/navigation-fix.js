/**
 * Navigation Fix Script
 * 解决3D模拟器页面的路由问题
 */

(function() {
    'use strict';
    
    // 路由重置函数
    function resetNavigation() {
        console.log('🔧 重置导航状态...');
        
        // 清除可能的路由拦截
        window.removeEventListener('popstate', arguments.callee);
        
        // 确保所有链接正常工作
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.href) {
                const href = e.target.href;
                
                // 检查是否是内部链接
                if (href.includes(window.location.origin) && !href.includes('3d-simulator')) {
                    console.log('🔗 导航到:', href);
                    
                    // 对于内部链接，确保正常导航
                    if (!e.target.hasAttribute('data-external')) {
                        // 允许默认行为
                        return true;
                    }
                }
            }
        }, true);
        
        // 修复历史记录
        if (window.history && window.history.replaceState) {
            const currentPath = window.location.pathname;
            window.history.replaceState(null, null, currentPath);
        }
        
        // 重置滚动恢复
        if (window.history) {
            window.history.scrollRestoration = 'auto';
        }
    }
    
    // 页面加载完成后执行
    function initializeNavigationFix() {
        console.log('🚀 初始化导航修复...');
        
        // 重置导航状态
        resetNavigation();
        
        // 监听页面卸载事件
        window.addEventListener('beforeunload', function() {
            console.log('📤 页面即将卸载，清理导航状态...');
            resetNavigation();
        });
        
        // 监听页面隐藏事件
        window.addEventListener('pagehide', function() {
            console.log('👁️ 页面隐藏，重置路由状态...');
            if (window.history) {
                window.history.scrollRestoration = 'auto';
            }
        });
        
        // 监听页面显示事件
        window.addEventListener('pageshow', function() {
            console.log('👁️ 页面显示，确保导航正常...');
            resetNavigation();
        });
        
        // 修复shared-header.js的路径处理
        fixSharedHeaderPaths();
    }
    
    // 修复shared-header.js的路径处理
    function fixSharedHeaderPaths() {
        // 等待shared-header.js加载完成
        const checkHeader = setInterval(function() {
            const navLinks = document.querySelectorAll('.main-nav a');
            if (navLinks.length > 0) {
                clearInterval(checkHeader);
                console.log('🔧 修复导航链接路径...');
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        // 确保路径正确
                        if (href.startsWith('pages/') && window.location.pathname.includes('/pages/')) {
                            // 在pages目录下，移除pages/前缀
                            link.href = href.replace('pages/', '');
                        } else if (!href.startsWith('pages/') && !window.location.pathname.includes('/pages/')) {
                            // 在根目录下，添加pages/前缀
                            link.href = 'pages/' + href;
                        }
                    }
                });
            }
        }, 100);
        
        // 5秒后停止检查
        setTimeout(() => {
            clearInterval(checkHeader);
        }, 5000);
    }
    
    // 添加全局导航辅助函数
    window.navigationHelper = {
        // 安全导航到指定页面
        navigateTo: function(url) {
            console.log('🧭 安全导航到:', url);
            
            // 重置导航状态
            resetNavigation();
            
            // 使用window.location进行导航
            window.location.href = url;
        },
        
        // 重置当前页面导航
        resetCurrentPage: function() {
            resetNavigation();
        },
        
        // 检查导航状态
        checkNavigationState: function() {
            console.log('🔍 检查导航状态...');
            console.log('当前URL:', window.location.href);
            console.log('当前路径:', window.location.pathname);
            console.log('历史记录长度:', window.history.length);
        }
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNavigationFix);
    } else {
        initializeNavigationFix();
    }
    
    // 立即执行一次重置
    resetNavigation();
    
    console.log('✅ 导航修复脚本已加载');
})(); 