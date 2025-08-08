// Daily Astronomy Picture Feature

class DailyAstronomy {
    constructor() {
        this.currentAPOD = null;
        this.apodHistory = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.setupAPODUI();
        this.loadTodayAPOD();
        this.bindEvents();
    }

    setupAPODUI() {
        const apodContainer = document.getElementById('dailyAstronomy');
        if (!apodContainer) return;

        apodContainer.innerHTML = `
            <div class="apod-container">
                <div class="apod-header">
                    <h2 data-i18n="apod_title">🌌 Astronomy Picture of the Day</h2>
                    <div class="apod-controls">
                        <button id="prevAPOD" class="apod-btn" data-i18n="apod_prev" disabled>◀ Previous</button>
                        <button id="nextAPOD" class="apod-btn" data-i18n="apod_next" disabled>Next ▶</button>
                        <button id="refreshAPOD" class="apod-btn" data-i18n="apod_refresh">🔄 Refresh</button>
                    </div>
                </div>
                
                <div class="apod-content">
                    <div class="apod-image-container">
                        <div class="apod-loading">
                            <div class="loader-spinner"></div>
                            <p>Loading NASA's daily image...</p>
                        </div>
                        <img id="apodImage" class="apod-image" style="display: none;" alt="Astronomy Picture of the Day">
                    </div>
                    
                    <div class="apod-info">
                        <div class="apod-title" id="apodTitle" data-i18n-html="apod_title"></div>
                        <div class="apod-date" id="apodDate"></div>
                        <div class="apod-explanation" id="apodExplanation" data-i18n-html=""></div>
                        <div class="apod-copyright" id="apodCopyright"></div>
                        
                        <div class="apod-actions">
                            <button id="downloadAPOD" class="apod-action-btn" data-i18n="apod_download">📥 Download</button>
                            <button id="shareAPOD" class="apod-action-btn" data-i18n="apod_share">📤 Share</button>
                            <button id="fullscreenAPOD" class="apod-action-btn" data-i18n="apod_fullscreen">🔍 Fullscreen</button>
                        </div>
                    </div>
                </div>
                
                
            </div>
        `;
    }

    async loadTodayAPOD() {
        try {
            this.showLoading(true);
            
            if (window.nasaAPI) {
                const apod = await window.nasaAPI.getAPOD();
                this.displayAPOD(apod);
                this.addToHistory(apod);
            } else {
                // Fallback if NASA API is not available
                this.displayAPOD(this.getFallbackAPOD());
            }
        } catch (error) {
            console.error('Error loading APOD:', error);
            this.displayAPOD(this.getFallbackAPOD());
        } finally {
            this.showLoading(false);
        }
    }

    async loadAPODRange(days = 7) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            if (window.nasaAPI) {
                const apods = await window.nasaAPI.getAPODRange(startDateStr, endDateStr);
                this.apodHistory = apods;
                this.updateGallery();
            }
        } catch (error) {
            console.error('Error loading APOD range:', error);
        }
    }

    displayAPOD(apod) {
        this.currentAPOD = apod;
        
        const image = document.getElementById('apodImage');
        const title = document.getElementById('apodTitle');
        const date = document.getElementById('apodDate');
        const explanation = document.getElementById('apodExplanation');
        const copyright = document.getElementById('apodCopyright');

        // Set image
        image.src = apod.url;
        image.alt = apod.title;
        image.style.display = 'block';

        // Set text content
        // APOD 标题与说明直接来自 NASA，不进行字典翻译；保留原文
        title.textContent = apod.title;
        date.textContent = this.formatDate(apod.date);
        explanation.textContent = apod.explanation;
        copyright.textContent = apod.copyright ? `© ${apod.copyright}` : '';

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    addToHistory(apod) {
        // Check if already exists
        const exists = this.apodHistory.find(item => item.date === apod.date);
        if (!exists) {
            this.apodHistory.unshift(apod);
            this.updateGallery();
        }
    }

    updateGallery() {
        const gallery = document.getElementById('apodGallery');
        if (!gallery) return;

        gallery.innerHTML = this.apodHistory.slice(0, 6).map((apod, index) => `
            <div class="gallery-item" data-index="${index}">
                <img src="${apod.url}" alt="${apod.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${apod.title}</h4>
                    <p>${this.formatDate(apod.date)}</p>
                </div>
            </div>
        `).join('');
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevAPOD');
        const nextBtn = document.getElementById('nextAPOD');

        if (prevBtn) prevBtn.disabled = this.currentIndex <= 0;
        if (nextBtn) nextBtn.disabled = this.currentIndex >= this.apodHistory.length - 1;
    }

    showLoading(show) {
        const loading = document.querySelector('.apod-loading');
        const image = document.getElementById('apodImage');

        if (show) {
            loading.style.display = 'flex';
            image.style.display = 'none';
        } else {
            loading.style.display = 'none';
            image.style.display = 'block';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getFallbackAPOD() {
        return {
            title: 'Hubble Space Telescope',
            explanation: 'The Hubble Space Telescope has been one of the most productive scientific instruments ever built. Astronomers using Hubble data have published more than 18,000 scientific papers, making it one of the most productive scientific instruments ever built.',
            url: 'images/background.jpg',
            hdurl: 'images/background.jpg',
            date: new Date().toISOString().split('T')[0],
            copyright: 'NASA',
            mediaType: 'image',
            serviceVersion: 'v1'
        };
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prevAPOD') {
                this.previousAPOD();
            } else if (e.target.id === 'nextAPOD') {
                this.nextAPOD();
            } else if (e.target.id === 'refreshAPOD') {
                this.loadTodayAPOD();
            } else if (e.target.id === 'downloadAPOD') {
                this.downloadAPOD();
            } else if (e.target.id === 'shareAPOD') {
                this.shareAPOD();
            } else if (e.target.id === 'fullscreenAPOD') {
                this.fullscreenAPOD();
            }
        });

        // Gallery item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item')) {
                const item = e.target.closest('.gallery-item');
                const index = parseInt(item.dataset.index);
                this.loadAPODFromHistory(index);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (!document.getElementById('prevAPOD').disabled) {
                        this.previousAPOD();
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (!document.getElementById('nextAPOD').disabled) {
                        this.nextAPOD();
                    }
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.loadTodayAPOD();
                    break;
            }
        });
    }

    previousAPOD() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.displayAPOD(this.apodHistory[this.currentIndex]);
        }
    }

    nextAPOD() {
        if (this.currentIndex < this.apodHistory.length - 1) {
            this.currentIndex++;
            this.displayAPOD(this.apodHistory[this.currentIndex]);
        }
    }

    loadAPODFromHistory(index) {
        if (index >= 0 && index < this.apodHistory.length) {
            this.currentIndex = index;
            this.displayAPOD(this.apodHistory[index]);
        }
    }

    async downloadAPOD() {
        if (!this.currentAPOD) return;
        const downloadBtn = document.getElementById('downloadAPOD');
        if (downloadBtn) {
            downloadBtn.classList.add('downloading');
            downloadBtn.disabled = true;
        }
        try {
            const imageUrl = this.currentAPOD.hdurl || this.currentAPOD.url;
            const fileName = `apod-${this.currentAPOD.date}.jpg`;
            
            // 方法1: 尝试直接下载（适用于同域或CORS允许的图片）
            try {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = fileName;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 如果直接下载失败，使用fetch方法
                setTimeout(() => {
                    this.downloadWithFetch(imageUrl, fileName);
                }, 100);
            } catch (error) {
                console.log('Direct download failed, trying fetch method...');
                this.downloadWithFetch(imageUrl, fileName);
            }
        } finally {
            if (downloadBtn) {
                downloadBtn.classList.remove('downloading');
                downloadBtn.disabled = false;
            }
        }
    }
    
    async downloadWithFetch(imageUrl, fileName) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 清理URL对象
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Download failed:', error);
            // 最后的备选方案：打开新窗口
            window.open(imageUrl, '_blank');
        }
    }

    shareAPOD() {
        if (!this.currentAPOD) return;

        const shareData = {
            title: this.currentAPOD.title,
            text: this.currentAPOD.explanation.substring(0, 200) + '...',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback: copy to clipboard
            const text = `${this.currentAPOD.title}\n\n${this.currentAPOD.explanation}\n\nImage: ${this.currentAPOD.url}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Link copied to clipboard!');
            });
        }
    }

    fullscreenAPOD() {
        const image = document.getElementById('apodImage');
        if (!image) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            image.requestFullscreen().catch(err => {
                console.error('Error entering fullscreen:', err);
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'apod-notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: #000;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 1000;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Get space weather info
    async getSpaceWeather() {
        if (window.nasaAPI) {
            return window.nasaAPI.getSpaceWeather();
        }
        return null;
    }

    // Get daily space fact
    async getDailySpaceFact() {
        if (window.nasaAPI) {
            return await window.nasaAPI.getDailySpaceFact();
        }
        return "The Sun contains 99.86% of the solar system's mass";
    }
}

// Initialize daily astronomy when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dailyAstronomy = new DailyAstronomy();
}); 