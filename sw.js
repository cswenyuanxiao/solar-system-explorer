// Service Worker for Solar System Explorer PWA
// Cache strategy and offline support

const CACHE_NAME = 'solar-system-explorer-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const API_CACHE = `${CACHE_NAME}-api`;

// Resources to cache (static assets)
const STATIC_ASSETS = [
  // Core pages
  '/pages/index.html',
  '/pages/3d-simulator.html',
  '/pages/charts.html',
  '/pages/education.html',
  '/pages/api.html',
  '/pages/search.html',
  
  '/pages/accessibility.html',
  '/pages/advanced-charts.html',
  
  // Planet pages
  '/pages/sun.html',
  '/pages/mercury.html',
  '/pages/venus.html', 
  '/pages/earth.html',
  '/pages/mars.html',
  '/pages/jupiter.html',
  '/pages/saturn.html',
  '/pages/uranus.html',
  '/pages/neptune.html',
  
  // CSS files
  '/css/style.css',
  '/css/shared-header.css',
  '/css/accessibility.css',
  '/css/scroll-optimized.css',
  '/css/charts.css',
  '/css/education.css',
  '/css/api-features.css',
  '/css/3d-simulator.css',
  '/css/planet-detail.css',
  '/css/search.css',
  
  '/css/user-system.css',
  '/css/advanced-charts.css',
  '/css/download-manager.css',
  '/css/loading-animations.css',
  
  // JavaScript files
  '/js/app.js',
  '/js/languages.js',
  '/js/shared-header.js',
  '/js/lazy-loading.js',
  '/js/loading-manager.js',
  '/js/planet-data.js',
  
  '/js/accessibility.js',
  '/js/main-integration.js',
  '/js/charts.js',
  '/js/3d-simulator.js',
  '/js/search.js',
  '/js/user-system.js',
  '/js/advanced-charts.js',
  '/js/theme-manager.js',
  '/js/social-sharing.js',
  
  // Image resources
  '/images/sun.jpg',
  '/images/mercury.jpg',
  '/images/venus.jpg',
  '/images/earth.jpg',
  '/images/mars.jpg',
  '/images/jupiter.jpg',
  '/images/saturn.jpg',
  '/images/uranus.jpg',
  '/images/neptune.jpg',
  '/images/background.jpg',
  
  // PWA icons (if present)
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  
  // Other resources
  '/manifest.json'
];

// Resources to fetch with network-first strategy
const NETWORK_FIRST_URLS = [
  'https://api.nasa.gov/',
  '/api/',
  '/pages/api.html'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
          cache: 'reload'
        })));
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
  
  // 强制激活新的 Service Worker
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('solar-system-explorer-') &&
                     cacheName !== STATIC_CACHE &&
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName !== API_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // 立即控制所有页面
        return self.clients.claim();
      })
  );
});

// Intercept network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳过 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
// API requests - network-first strategy
  if (isApiRequest(url)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
// Static assets - cache-first strategy
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
// HTML pages - network-first with fallback
  if (isHtmlPage(request)) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }
  
// Other requests - network-first strategy
  event.respondWith(networkFirstStrategy(request));
});

// Determine if API request
function isApiRequest(url) {
  return NETWORK_FIRST_URLS.some(pattern => url.href.includes(pattern)) ||
         url.hostname === 'api.nasa.gov';
}

// Determine if static asset
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Determine if HTML page
function isHtmlPage(request) {
  return request.destination === 'document' || 
         request.headers.get('Accept')?.includes('text/html');
}

// Cache-first strategy
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    return new Response('Offline content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-first strategy
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cacheName = isApiRequest(new URL(request.url)) ? API_CACHE : DYNAMIC_CACHE;
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network request failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return createOfflineResponse(request);
  }
}

// Network-first with fallback
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.warn('[SW] Network failed for HTML page:', error);
  }
  
  // 尝试从缓存获取
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // 返回离线页面
  const offlinePage = await caches.match('/pages/index.html');
  if (offlinePage) {
    return offlinePage;
  }
  
  return createOfflineResponse(request);
}

// Create offline response
function createOfflineResponse(request) {
  const url = new URL(request.url);
  
  if (isHtmlPage(request)) {
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Solar System Explorer</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #0B3D91 0%, #1e3c72 100%);
            color: white;
            text-align: center;
            padding: 2rem;
          }
          .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          .offline-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .offline-message {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          .retry-btn {
            background: #FFD700;
            color: #0B3D91;
            border: none;
            padding: 0.75rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .retry-btn:hover {
            background: #FFC107;
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="offline-icon">🚀</div>
        <h1 class="offline-title">You're Offline</h1>
        <p class="offline-message">
          The Solar System Explorer is currently unavailable.<br>
          Please check your internet connection and try again.
        </p>
        <button class="retry-btn" onclick="window.location.reload()">
          Retry
        </button>
        <script>
          // 监听网络状态变化
          window.addEventListener('online', () => {
            window.location.reload();
          });
        </script>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // 更新特定缓存
    updateCache(event.data.urls || []);
  }
});

// Update cache
async function updateCache(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await Promise.all(
      urls.map(url => {
        return fetch(url)
          .then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          })
          .catch(error => {
            console.warn('[SW] Failed to update cache for:', url, error);
          });
      })
    );
    console.log('[SW] Cache updated for:', urls);
  } catch (error) {
    console.error('[SW] Cache update failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New content available in Solar System Explorer',
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      image: data.image,
      tag: data.tag || 'solar-system-update',
      renotify: true,
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'dismiss', 
          title: 'Dismiss'
        }
      ],
      data: {
        url: data.url || '/pages/index.html'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Solar System Explorer',
        options
      )
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const url = event.notification.data?.url || '/pages/index.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 检查是否已有窗口打开
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // 打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('[SW] Service Worker loaded');