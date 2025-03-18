// Service Worker for Warfarin Manager App

const APP_NAME = 'Warfarin Manager';
const CACHE_NAME = 'warfarin-manager-v1';

// Cache assets for offline use
self.addEventListener('install', (event) => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icons/medicine-icon-192.svg',
        '/icons/medicine-icon-192.png',
        '/icons/badge-72.svg',
        '/icons/badge-72.png'
      ]);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    })
  );
});

// Handle fetch requests - offline support
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Skip API requests
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response since it can only be consumed once
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
});

/**
 * Handle notification click events
 */
self.addEventListener('push', (event) => {
  let data = {};
  
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: APP_NAME,
      body: event.data ? event.data.text() : 'Medication reminder',
      icon: '/icons/medicine-icon-192.png',
      badge: '/icons/badge-72.png'
    };
  }
  
  const options = {
    body: data.body || 'Time to take your medication!',
    icon: data.icon || '/icons/medicine-icon-192.png',
    badge: data.badge || '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'taken',
        title: 'Mark as Taken'
      },
      {
        action: 'snooze',
        title: 'Snooze'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || APP_NAME, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'taken') {
    // Handle "Mark as Taken" action
    event.waitUntil(
      clients.openWindow('/api/reminders/taken?id=' + (event.notification.data.reminderId || ''))
    );
  } else if (event.action === 'snooze') {
    // Handle "Snooze" action (reschedule for 15 minutes later)
    event.waitUntil(
      clients.openWindow('/api/reminders/snooze?id=' + (event.notification.data.reminderId || ''))
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // If a window is already open, focus it
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
              break;
            }
          }
          return client.focus();
        }
        
        // Otherwise open a new window
        return clients.openWindow(event.notification.data.url || '/');
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification was closed', event);
});