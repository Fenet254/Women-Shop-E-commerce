// PWA Features for Girls Shop
// Service worker for offline support, install prompt, caching

class PWA {
  constructor() {
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOfflineDetection();
  }

  // Register service worker
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  // Setup install prompt
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.hideInstallButton();
    });
  }

  // Show install button
  showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.innerHTML = '📱 Install App';
    installBtn.style.position = 'fixed';
    installBtn.style.bottom = '80px';
    installBtn.style.right = '20px';
    installBtn.style.background = 'var(--primary-color)';
    installBtn.style.color = 'white';
    installBtn.style.border = 'none';
    installBtn.style.borderRadius = '25px';
    installBtn.style.padding = '10px 20px';
    installBtn.style.cursor = 'pointer';
    installBtn.style.boxShadow = 'var(--shadow)';
    installBtn.style.zIndex = '1000';
    installBtn.addEventListener('click', () => this.installApp());
    document.body.appendChild(installBtn);
  }

  // Hide install button
  hideInstallButton() {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.remove();
  }

  // Install app
  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      this.deferredPrompt = null;
      this.hideInstallButton();
    }
  }

  // Setup offline detection
  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.showNotification('You are back online! 🎉');
    });

    window.addEventListener('offline', () => {
      this.showNotification('You are offline. Some features may not work. 📶');
    });
  }

  // Notification
  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '25px';
    notification.style.boxShadow = 'var(--shadow)';
    notification.style.zIndex = '1001';
    notification.style.animation = 'slideIn 0.3s ease';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Create service worker file
const swContent = `
const CACHE_NAME = 'girls-shop-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/js/products.js',
  '/js/ai.js',
  '/js/chatbot.js',
  '/js/analytics.js',
  '/js/pwa.js',
  '/image/dressimage/dress.png',
  '/image/skirtimage/skirt1.png',
  '/image/suitimage/suit1.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
`;

// Create sw.js if not exists
if (!localStorage.getItem('sw-created')) {
  fetch('../sw.js')
    .then(() => console.log('SW exists'))
    .catch(() => {
      // Create sw.js
      const blob = new Blob([swContent], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sw.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      localStorage.setItem('sw-created', 'true');
    });
}

// Initialize PWA
document.addEventListener('DOMContentLoaded', () => {
  new PWA();
});
