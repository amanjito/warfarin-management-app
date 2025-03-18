import { apiRequest } from './queryClient';
import { queryClient } from './queryClient';

// Convert a base64 string to a Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Check if push notifications are supported
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Request permission for push notifications
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications not supported');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Register the service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushNotificationSupported()) {
    console.log('Service workers not supported');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service worker registered:', registration);
    
    // Set up a listener for messages from the service worker
    navigator.serviceWorker.addEventListener('message', event => {
      console.log('Received message from service worker:', event.data);
      
      // Handle medication taken message
      if (event.data && event.data.type === 'MEDICATION_TAKEN') {
        // Invalidate the medication logs to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['/api/medication-logs'] });
      }
    });
    
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

// Update an existing service worker
export async function updateServiceWorker(): Promise<void> {
  if (!isPushNotificationSupported()) {
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    
    if (registration.waiting) {
      // If there's a new service worker waiting, tell it to take over
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  } catch (error) {
    console.error('Error updating service worker:', error);
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(): Promise<boolean> {
  try {
    // Check for permission
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.log('Notification permission not granted');
      return false;
    }
    
    // Register service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      console.log('Service worker registration failed');
      return false;
    }
    
    // Get the server's public key
    const response = await fetch('/api/push/vapid-public-key', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to retrieve VAPID public key');
    }
    
    const data = await response.json();
    const publicKey = data.publicKey;
    
    // Get the subscription object
    let subscription = await registration.pushManager.getSubscription();
    
    // If no subscription exists, create one
    if (!subscription) {
      const applicationServerKey = urlBase64ToUint8Array(publicKey);
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }
    
    // Send the subscription to the server
    await apiRequest('POST', '/api/push/register', subscription);
    
    return true;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
}

// Send a test notification
export async function sendTestNotification(): Promise<boolean> {
  try {
    const response = await apiRequest('POST', '/api/push/send-test');
    const data = await response.json();
    return !!data.success;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
}

// Get the current subscription
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting current subscription:', error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const subscription = await getCurrentPushSubscription();
    
    if (subscription) {
      // Unregister from the server first
      try {
        await apiRequest('DELETE', '/api/push/unregister', { endpoint: subscription.endpoint });
      } catch (error) {
        console.error('Error unregistering subscription from server:', error);
      }
      
      // Then unsubscribe from the browser
      const success = await subscription.unsubscribe();
      if (success) {
        console.log('Successfully unsubscribed from push notifications');
      }
      return success;
    }
    
    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

// Initialize push notifications (call this when app starts)
export async function initializePushNotifications(): Promise<void> {
  if (!isPushNotificationSupported()) {
    return;
  }
  
  try {
    // Register service worker if it's not already registered
    if (!navigator.serviceWorker.controller) {
      await registerServiceWorker();
    }
    
    // Check for existing subscription and make sure it's registered on the server
    const subscription = await getCurrentPushSubscription();
    if (subscription) {
      try {
        // Check if the server recognizes this subscription
        const response = await apiRequest('POST', '/api/push/check', { endpoint: subscription.endpoint });
        const data = await response.json();
        
        // If not recognized, register it
        if (!data.registered) {
          await apiRequest('POST', '/api/push/register', subscription);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    }
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
}