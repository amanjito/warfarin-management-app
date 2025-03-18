// Service worker for push notifications in Warfarin Manager

/**
 * Handle push notifications received from the server
 */
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push received.');

  let notificationData = {};
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      console.error('Could not parse notification data', e);
      notificationData = {
        notification: {
          title: 'Warfarin Manager',
          body: 'You have a new notification',
          icon: '/icons/medicine-icon-192.png',
          badge: '/icons/badge-72.png',
        }
      };
    }
  }

  const notification = notificationData.notification;
  
  // Keep the service worker alive until the notification is displayed
  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      tag: notification.tag,
      data: notification.data,
      actions: notification.actions,
      vibrate: [100, 50, 100],
      requireInteraction: notification.requireInteraction || false,
    })
  );
});

/**
 * Handle notification click events
 */
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click received.');

  // Close the notification
  event.notification.close();

  // Handle notification click based on action (if any)
  if (event.action) {
    console.log(`User clicked on action "${event.action}"`);
    // Handle different actions here if needed
  } else {
    console.log('User clicked on the notification body');
  }

  // Get the URL from notification data if available, or default to reminders page
  const urlToOpen = (event.notification.data && event.notification.data.url) || '/reminders';

  // Navigate to the desired URL
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(function(clientList) {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // If a window is already open, focus it and navigate to the desired URL
          return client.focus().then(function(client) {
            return client.navigate(urlToOpen);
          });
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});