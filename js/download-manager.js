/**
 * Download Manager for NASA API Images
 * Handles local file downloads with progress tracking and error handling
 */

class DownloadManager {
    constructor() {
        this.downloadQueue = [];
        this.isDownloading = false;
        this.downloadProgress = 0;
        this.init();
    }

    init() {
        // Create download progress UI
        this.createDownloadUI();
        this.bindEvents();
    }

    createDownloadUI() {
        // Create download progress overlay
        const downloadOverlay = document.createElement('div');
        downloadOverlay.id = 'downloadOverlay';
        downloadOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        downloadOverlay.innerHTML = `
            <div class="download-modal" style="
                background: rgba(255, 255, 255, 0.95);
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <div class="download-icon" style="
                    font-size: 3rem;
                    margin-bottom: 1rem;
                ">📥</div>
                <h3 id="downloadTitle" style="
                    margin: 0 0 1rem 0;
                    color: #333;
                ">Downloading Image...</h3>
                <div class="download-progress" style="
                    width: 100%;
                    height: 8px;
                    background: #eee;
                    border-radius: 4px;
                    overflow: hidden;
                    margin: 1rem 0;
                ">
                    <div id="downloadProgressBar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #4CAF50, #45a049);
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div id="downloadStatus" style="
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                ">Preparing download...</div>
                <button id="cancelDownload" style="
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">Cancel</button>
            </div>
        `;

        document.body.appendChild(downloadOverlay);
    }

    bindEvents() {
        // Cancel download button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'cancelDownload') {
                this.cancelDownload();
            }
        });
    }

    async downloadImage(imageUrl, fileName, title = '') {
        if (this.isDownloading) {
            this.showNotification('Another download is in progress. Please wait.', 'warning');
            return;
        }

        this.isDownloading = true;
        this.downloadProgress = 0;
        this.showDownloadUI(title);

        try {
            // Check file size first
            const fileSize = await this.getFileSize(imageUrl);
            if (fileSize) {
                const sizeText = this.formatFileSize(fileSize);
                this.updateDownloadStatus(`File size: ${sizeText}`);
            }

            // Start the download
            await this.performDownload(imageUrl, fileName);
            
            this.showNotification('Download completed successfully!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Download failed: ' + error.message, 'error');
        } finally {
            this.hideDownloadUI();
            this.isDownloading = false;
        }
    }

    async performDownload(imageUrl, fileName) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Track download progress
            xhr.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    this.downloadProgress = (event.loaded / event.total) * 100;
                    this.updateDownloadProgress();
                }
            });

            // Handle response
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        // Create blob from response
                        const blob = new Blob([xhr.response], { type: this.getMimeType(fileName) });
                        
                        // Save file using FileSaver.js or native method
                        this.saveFile(blob, fileName);
                        
                        resolve();
                    } catch (error) {
                        reject(new Error('Failed to process downloaded file'));
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                }
            });

            // Handle errors
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during download'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Download was cancelled'));
            });

            // Start the request
            xhr.open('GET', imageUrl);
            xhr.responseType = 'blob';
            xhr.send();
        });
    }

    saveFile(blob, fileName) {
        // Try using FileSaver.js if available
        if (typeof saveAs !== 'undefined') {
            saveAs(blob, fileName);
            return;
        }

        // Fallback to native download method
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }

    getMimeType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'bmp': 'image/bmp',
            'tiff': 'image/tiff'
        };
        
        return mimeTypes[extension] || 'image/jpeg';
    }

    showDownloadUI(title) {
        const overlay = document.getElementById('downloadOverlay');
        const titleElement = document.getElementById('downloadTitle');
        
        if (overlay) {
            overlay.style.display = 'flex';
            if (titleElement && title) {
                titleElement.textContent = title;
            }
        }
    }

    hideDownloadUI() {
        const overlay = document.getElementById('downloadOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    updateDownloadProgress() {
        const progressBar = document.getElementById('downloadProgressBar');
        const statusElement = document.getElementById('downloadStatus');
        
        if (progressBar) {
            progressBar.style.width = this.downloadProgress + '%';
        }
        
        if (statusElement) {
            const percentage = Math.round(this.downloadProgress);
            statusElement.textContent = `Downloading... ${percentage}%`;
        }
    }

    updateDownloadStatus(message) {
        const statusElement = document.getElementById('downloadStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    cancelDownload() {
        this.isDownloading = false;
        this.hideDownloadUI();
        this.showNotification('Download cancelled', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        
        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10001;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Download multiple images
    async downloadMultipleImages(images) {
        if (!Array.isArray(images) || images.length === 0) {
            this.showNotification('No images to download', 'warning');
            return;
        }

        this.showNotification(`Starting download of ${images.length} images...`, 'info');
        
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const fileName = this.generateFileName(image.title, image.date, i + 1);
            
            try {
                await this.downloadImage(image.url, fileName, image.title);
                
                // Add delay between downloads to avoid overwhelming the browser
                if (i < images.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error(`Failed to download image ${i + 1}:`, error);
            }
        }
        
        this.showNotification('All downloads completed!', 'success');
    }

    generateFileName(title, date, index = null) {
        // Clean title for filename
        const cleanTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
        const dateStr = date ? date.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');
        const indexStr = index ? `-${index}` : '';
        
        return `nasa-${cleanTitle}-${dateStr}${indexStr}.jpg`;
    }

    // Get file size before download
    async getFileSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            return contentLength ? parseInt(contentLength) : null;
        } catch (error) {
            console.error('Error getting file size:', error);
            return null;
        }
    }

    // Format file size for display
    formatFileSize(bytes) {
        if (!bytes) return 'Unknown size';
        
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Initialize download manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.downloadManager = new DownloadManager();
}); 