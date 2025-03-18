import webpush from 'web-push';
import { PushSubscription } from '../../shared/schema';
import { storage } from '../storage';

// VAPID keys should be generated only once and stored securely
// In this example, we're generating new keys each time the server starts
// In a production environment, these should be stored in environment variables
const vapidKeys = webpush.generateVAPIDKeys();

const PUBLIC_KEY = vapidKeys.publicKey;
const PRIVATE_KEY = vapidKeys.privateKey;

// Configure web-push with our VAPID keys
webpush.setVapidDetails(
  'mailto:support@warfarinmanager.com', // contact email (should be real in production)
  PUBLIC_KEY,
  PRIVATE_KEY
);

/**
 * Returns the VAPID public key to be used in the client
 */
export function getVapidPublicKey(): string {
  return PUBLIC_KEY;
}

/**
 * Send a notification to a specific subscription
 */
export async function sendNotification(
  subscription: PushSubscription,
  payload: { title: string; body: string; url?: string; icon?: string; badge?: string; data?: any }
): Promise<boolean> {
  try {
    // Format the payload as expected by the client
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/',
      icon: payload.icon || '/icons/medicine-icon-192.png',
      badge: payload.badge || '/icons/badge-72.png',
      data: payload.data || {}
    });

    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth
        }
      },
      notificationPayload
    );

    return true;
  } catch (error) {
    // If we get a 410 error, the subscription is no longer valid
    // and should be removed from the database
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
      await storage.deletePushSubscription(subscription.id);
    }
    
    console.error('Error sending push notification:', error);
    return false;
  }
}

/**
 * Send notifications to all subscribers of a specific user
 */
export async function sendNotificationToUser(
  userId: number,
  payload: { title: string; body: string; url?: string; icon?: string; badge?: string; data?: any }
): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    const subscriptions = await storage.getPushSubscriptions(userId);
    
    if (subscriptions.length === 0) {
      return { success: true, sent: 0, failed: 0 };
    }
    
    let sent = 0;
    let failed = 0;
    
    for (const subscription of subscriptions) {
      const result = await sendNotification(subscription, payload);
      if (result) {
        sent++;
      } else {
        failed++;
      }
    }
    
    return {
      success: sent > 0,
      sent,
      failed
    };
  } catch (error) {
    console.error('Error sending notifications to user:', error);
    return {
      success: false,
      sent: 0,
      failed: 0
    };
  }
}

/**
 * Creates or updates a push subscription for a user
 */
export async function saveSubscription(
  userId: number,
  subscription: {
    endpoint: string;
    expirationTime: number | null;
    keys: {
      p256dh: string;
      auth: string;
    };
  }
): Promise<PushSubscription> {
  try {
    // Check if subscription already exists based on endpoint
    const existingSubscription = await storage.getPushSubscriptionByEndpoint(subscription.endpoint);
    
    if (existingSubscription) {
      // Update existing subscription if it belongs to the same user
      if (existingSubscription.userId === userId) {
        return existingSubscription;
      }
      
      // If it belongs to a different user, delete it first
      await storage.deletePushSubscription(existingSubscription.id);
    }
    
    // Create a new subscription
    const newSubscription = await storage.createPushSubscription({
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    });
    
    return newSubscription;
  } catch (error) {
    console.error('Error saving push subscription:', error);
    throw error;
  }
}