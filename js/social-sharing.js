// 社交分享功能模块
// Social sharing functionality module

class SocialSharingManager {
    constructor() {
        this.shareData = {
            title: 'Solar System Explorer',
            text: 'Explore our solar system with interactive 3D visualization and NASA data!',
            url: window.location.href
        };
        this.init();
    }
    
    init() {
        this.setupSocialButtons();
        this.addSocialStyles();
        this.createShareButtons();
    }
    
    // 创建分享按钮
    createShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share-container';
        shareContainer.innerHTML = `
            <div class="social-share-buttons">
                <button class="share-btn native-share" title="Share">
                    <span class="share-icon">📤</span>
                    <span class="share-text">Share</span>
                </button>
                <button class="share-btn twitter-share" title="Share on Twitter" data-platform="twitter">
                    <span class="share-icon">🐦</span>
                    <span class="share-text">Twitter</span>
                </button>
                <button class="share-btn facebook-share" title="Share on Facebook" data-platform="facebook">
                    <span class="share-icon">📘</span>
                    <span class="share-text">Facebook</span>
                </button>
                <button class="share-btn linkedin-share" title="Share on LinkedIn" data-platform="linkedin">
                    <span class="share-icon">💼</span>
                    <span class="share-text">LinkedIn</span>
                </button>
                <button class="share-btn reddit-share" title="Share on Reddit" data-platform="reddit">
                    <span class="share-icon">🤖</span>
                    <span class="share-text">Reddit</span>
                </button>
                <button class="share-btn copy-link" title="Copy Link">
                    <span class="share-icon">🔗</span>
                    <span class="share-text">Copy Link</span>
                </button>
            </div>
        `;
        
        // 添加到页面合适位置
        const targetElement = document.querySelector('.hero-section, main');
        if (targetElement) {
            targetElement.appendChild(shareContainer);
        }
    }
    
    setupSocialButtons() {
        document.addEventListener('click', (event) => {
            const shareBtn = event.target.closest('.share-btn');
            if (!shareBtn) return;
            
            event.preventDefault();
            
            if (shareBtn.classList.contains('native-share')) {
                this.nativeShare();
            } else if (shareBtn.classList.contains('copy-link')) {
                this.copyLink();
            } else if (shareBtn.dataset.platform) {
                this.shareToSocial(shareBtn.dataset.platform);
            }
        });
    }
    
    // 原生分享API
    async nativeShare() {
        if (navigator.share) {
            try {
                await navigator.share(this.shareData);
                this.showNotification('Shared successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.warn('Native share failed:', error);
                    this.fallbackShare();
                }
            }
        } else {
            this.fallbackShare();
        }
    }
    
    // 复制链接功能
    async copyLink() {
        try {
            await navigator.clipboard.writeText(this.shareData.url);
            this.showNotification('Link copied to clipboard!');
        } catch (error) {
            // 降级方案
            this.fallbackCopyLink();
        }
    }
    
    // 降级复制链接方案
    fallbackCopyLink() {
        const textArea = document.createElement('textarea');
        textArea.value = this.shareData.url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Link copied to clipboard!');
        } catch (error) {
            this.showNotification('Failed to copy link');
        }
        
        document.body.removeChild(textArea);
    }
    
    // 分享到社交平台
    shareToSocial(platform) {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.shareData.text)}&url=${encodeURIComponent(this.shareData.url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareData.url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareData.url)}`,
            reddit: `https://reddit.com/submit?url=${encodeURIComponent(this.shareData.url)}&title=${encodeURIComponent(this.shareData.title)}`
        };
        
        const shareUrl = urls[platform];
        if (shareUrl) {
            this.openShareWindow(shareUrl);
        }
    }
    
    // 打开分享窗口
    openShareWindow(url) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
            url,
            'shareWindow',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    }
    
    // 降级分享方案
    fallbackShare() {
        this.createShareModal();
    }
    
    // 创建分享模态框
    createShareModal() {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3>Share Solar System Explorer</h3>
                    <button class="share-modal-close">&times;</button>
                </div>
                <div class="share-modal-body">
                    <div class="share-url-container">
                        <input type="text" readonly value="${this.shareData.url}" class="share-url-input">
                        <button class="copy-url-btn">Copy</button>
                    </div>
                    <div class="social-platforms">
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(this.shareData.text)}&url=${encodeURIComponent(this.shareData.url)}" 
                           target="_blank" class="platform-link twitter">
                            🐦 Twitter
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareData.url)}" 
                           target="_blank" class="platform-link facebook">
                            📘 Facebook
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareData.url)}" 
                           target="_blank" class="platform-link linkedin">
                            💼 LinkedIn
                        </a>
                        <a href="https://reddit.com/submit?url=${encodeURIComponent(this.shareData.url)}&title=${encodeURIComponent(this.shareData.title)}" 
                           target="_blank" class="platform-link reddit">
                            🤖 Reddit
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 事件监听
        modal.querySelector('.share-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.copy-url-btn').addEventListener('click', () => {
            const urlInput = modal.querySelector('.share-url-input');
            urlInput.select();
            document.execCommand('copy');
            this.showNotification('Link copied!');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    addSocialStyles() {
        if (document.querySelector('#social-sharing-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'social-sharing-styles';
        style.textContent = `
            /* 社交分享容器 */
            .social-share-container {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
                background: var(--bg-card, #ffffff);
                border-radius: 12px;
                padding: 1rem;
                box-shadow: 0 4px 12px var(--shadow, rgba(0, 0, 0, 0.1));
                border: 1px solid var(--border-color, #dee2e6);
            }
            
            .social-share-buttons {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .share-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                border: none;
                border-radius: 6px;
                background: var(--bg-secondary, #f8f9fa);
                color: var(--text-primary, #212529);
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                text-decoration: none;
                min-width: 100px;
            }
            
            .share-btn:hover {
                background: var(--nasa-blue, #0B3D91);
                color: white;
                transform: translateX(-2px);
            }
            
            .share-icon {
                font-size: 1.2rem;
            }
            
            /* 特定平台颜色 */
            .twitter-share:hover {
                background: #1DA1F2;
            }
            
            .facebook-share:hover {
                background: #4267B2;
            }
            
            .linkedin-share:hover {
                background: #2867B2;
            }
            
            .reddit-share:hover {
                background: #FF4500;
            }
            
            .copy-link:hover {
                background: #28a745;
            }
            
            /* 分享模态框 */
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .share-modal-content {
                background: var(--bg-primary, #ffffff);
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            }
            
            .share-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .share-modal-header h3 {
                margin: 0;
                color: var(--text-primary, #212529);
            }
            
            .share-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary, #6c757d);
            }
            
            .share-url-container {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }
            
            .share-url-input {
                flex: 1;
                padding: 0.5rem;
                border: 1px solid var(--border-color, #dee2e6);
                border-radius: 4px;
                background: var(--bg-secondary, #f8f9fa);
                color: var(--text-primary, #212529);
            }
            
            .copy-url-btn {
                padding: 0.5rem 1rem;
                background: var(--nasa-blue, #0B3D91);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .social-platforms {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
            }
            
            .platform-link {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.75rem;
                border-radius: 6px;
                text-decoration: none;
                color: var(--text-primary, #212529);
                background: var(--bg-secondary, #f8f9fa);
                transition: all 0.3s ease;
            }
            
            .platform-link:hover {
                transform: translateY(-2px);
            }
            
            .platform-link.twitter:hover { background: #1DA1F2; color: white; }
            .platform-link.facebook:hover { background: #4267B2; color: white; }
            .platform-link.linkedin:hover { background: #2867B2; color: white; }
            .platform-link.reddit:hover { background: #FF4500; color: white; }
            
            /* 通知样式 */
            .share-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--nasa-blue, #0B3D91);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                z-index: 2001;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                .social-share-container {
                    right: 10px;
                    padding: 0.5rem;
                }
                
                .share-btn {
                    min-width: auto;
                    padding: 0.4rem;
                }
                
                .share-text {
                    display: none;
                }
                
                .social-platforms {
                    grid-template-columns: 1fr;
                }
            }
            
            @media (max-width: 480px) {
                .social-share-container {
                    position: relative;
                    right: auto;
                    top: auto;
                    transform: none;
                    margin: 1rem auto;
                    width: fit-content;
                }
                
                .social-share-buttons {
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 更新分享数据
    updateShareData(data) {
        this.shareData = { ...this.shareData, ...data };
    }
    
    // 获取页面特定的分享数据
    getPageShareData() {
        const pageTitle = document.querySelector('h1, h2')?.textContent || this.shareData.title;
        const pageDescription = document.querySelector('meta[name="description"]')?.content || 
                               document.querySelector('.hero-content p')?.textContent || 
                               this.shareData.text;
        
        return {
            title: pageTitle,
            text: pageDescription,
            url: window.location.href
        };
    }
}

// 全局社交分享管理器实例
let socialSharingManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    socialSharingManager = new SocialSharingManager();
    window.socialSharingManager = socialSharingManager;
    
    // 更新页面特定的分享数据
    const pageData = socialSharingManager.getPageShareData();
    socialSharingManager.updateShareData(pageData);
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SocialSharingManager };
}