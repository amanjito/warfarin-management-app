// Service Worker for WarfarinTracker

const CACHE_NAME = 'warfarin-tracker-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png',
  '/icons/pill.png',
  '/icons/chart.png',
  '/icons/bell.png',
  '/icons/check.png',
  '/icons/snooze.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip for non-GET requests or browser sync requests
  if (event.request.method !== 'GET' || event.request.url.includes('chrome-extension://')) {
    return;
  }
  
  // Only cache same-origin requests
  if (new URL(event.request.url).origin !== location.origin) {
    return;
  }
  
  // Network first, falling back to cache strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response to store in cache
        const responseClone = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
        
        return response;
      })
      .catch(() => {
        console.log('Service Worker: Serving cached content for', event.request.url);
        return caches.match(event.request);
      })
  );
});

// Importing notification sound
importScripts('/sounds/notification.js');

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Service Worker: Push received but no data');
    return;
  }
  
  try {
    const data = event.data.json();
    console.log('Service Worker: Push received with data', data);
    
    const options = {
      body: data.body || 'Time to take your medication',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100, 200, 100, 50, 100],
      sound: notificationSound, // Use the imported notification sound
      silent: false, // Ensure sound is played
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || '/',
        reminderId: data.reminderId,
        medicationId: data.medicationId,
        sound: notificationSound // Pass sound to notification click handler
      },
      actions: [
        {
          action: 'take',
          title: 'Take Now',
          icon: '/icons/check.png'
        },
        {
          action: 'snooze',
          title: 'Snooze',
          icon: '/icons/snooze.png'
        }
      ]
    };
    
    event.waitUntil(
      // Show notification and play sound
      Promise.all([
        self.registration.showNotification(data.title || 'Medication Reminder', options),
        playNotificationSound()
      ])
    );
  } catch (err) {
    console.error('Service Worker: Error processing push notification', err);
  }
});

// Function to play notification sound independently
async function playNotificationSound() {
  try {
    // Use clients to find open windows
    const allClients = await self.clients.matchAll({ type: 'window' });
    
    // If there's an open window, send a message to play the sound
    if (allClients.length > 0) {
      allClients.forEach(client => {
        client.postMessage({
          type: 'PLAY_NOTIFICATION_SOUND',
          sound: notificationSound
        });
      });
    } else {
      // If no clients are open, we can't play a sound directly from the service worker
      console.log('Service Worker: No open windows to play sound');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Error playing notification sound', error);
    return Promise.resolve(); // Don't fail the notification if sound fails
  }
}

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.notification);
  
  event.notification.close();
  
  // Handle notification actions
  if (event.action === 'take') {
    const reminderId = event.notification.data.reminderId;
    const url = `/api/medication-logs`;
    
    // Record that medication was taken
    if (reminderId) {
      event.waitUntil(
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reminderId,
            scheduled: new Date().toISOString(),
            taken: true
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to record medication as taken');
            }
            return response.json();
          })
          .then(data => {
            console.log('Service Worker: Medication recorded as taken', data);
            return self.clients.matchAll({ type: 'window' })
              .then(clients => {
                if (clients.length) {
                  // Refresh open clients to show updated status
                  clients.forEach(client => client.postMessage({
                    type: 'MEDICATION_TAKEN',
                    reminderId
                  }));
                  return clients[0].focus();
                }
                return self.clients.openWindow('/reminders');
              });
          })
          .catch(error => {
            console.error('Service Worker: Error marking medication as taken', error);
          })
      );
    }
  } else if (event.action === 'snooze') {
    // Implement snooze functionality
    console.log('Service Worker: Snooze clicked, will remind again in 10 minutes');
    
    const reminderId = event.notification.data.reminderId;
    const medicationId = event.notification.data.medicationId;
    
    // Schedule a new notification in 10 minutes
    if (reminderId) {
      event.waitUntil(
        new Promise(resolve => {
          setTimeout(() => {
            Promise.all([
              self.registration.showNotification('Medication Reminder', {
                body: 'This is your snoozed reminder. Please take your medication now.',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                vibrate: [100, 50, 100, 200, 100, 50, 100],
                sound: notificationSound,
                silent: false,
                data: {
                  dateOfArrival: Date.now(),
                  primaryKey: 2,
                  url: '/reminders',
                  reminderId,
                  medicationId,
                  sound: notificationSound
                },
                actions: [
                  {
                    action: 'take',
                    title: 'Take Now',
                    icon: '/icons/check.png'
                  }
                ]
              }),
              playNotificationSound()
            ]);
            resolve();
          }, 10 * 60 * 1000); // 10 minutes
        })
      );
    }
  } else {
    // Default click action - open or focus app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        // If a window is already open, focus it
        if (clients.length > 0) {
          const url = event.notification.data.url || '/reminders';
          clients[0].navigate(url);
          return clients[0].focus();
        } else {
          // Otherwise open a new window
          return self.clients.openWindow(event.notification.data.url || '/reminders');
        }
      })
    );
  }
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});