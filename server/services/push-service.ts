import webpush from 'web-push';
import { PushSubscription } from '@shared/schema';
import { storage } from '../storage';

// Generate VAPID keys using: webpush.generateVAPIDKeys()
// These should be moved to environment variables in production
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BFnXYDUYH0Cv_zqcmIYkcvuK4WR5irCa1nRgLdS_pfbCriwYQxdozJAwFEYV2qKhMKA-5s7nY9CpJ5S4tMEWgDI';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'N3UvTmDV3Tb0Ez9CuKq6RHR78Ml2YnN1fbvxKIZqsU8';

// Configure web-push
webpush.setVapidDetails(
  'mailto:support@warfarinapp.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY;
}

/**
 * Send a notification to a specific subscription
 */
export async function sendNotification(
  subscription: PushSubscription,
  payload: { title: string; body: string; tag?: string; actions?: { action: string; title: string }[] }
): Promise<boolean> {
  try {
    // Format the payload according to the Push API spec
    const notificationPayload = JSON.stringify({
      notification: {
        title: payload.title,
        body: payload.body,
        icon: '/icons/medicine-icon-192.png',
        badge: '/icons/badge-72.png',
        tag: payload.tag || 'medication-reminder',
        actions: payload.actions || [],
        data: {
          url: '/reminders',
        },
      },
    });

    // Send the notification using web-push
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      notificationPayload
    );

    return true;
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    
    // If the subscription is no longer valid (404 or 410), remove it
    // 404: Not Found, 410: Gone (both indicate an expired or revoked subscription)
    if (
      error.statusCode === 404 ||
      error.statusCode === 410
    ) {
      await storage.deletePushSubscription(subscription.id);
    }
    
    return false;
  }
}

/**
 * Send notifications to all subscribers of a specific user
 */
export async function sendNotificationToUser(
  userId: number,
  payload: { title: string; body: string; tag?: string; actions?: { action: string; title: string }[] }
): Promise<number> {
  const subscriptions = await storage.getPushSubscriptions(userId);
  let successCount = 0;
  
  for (const subscription of subscriptions) {
    const success = await sendNotification(subscription, payload);
    if (success) successCount++;
  }
  
  return successCount;
}

/**
 * Creates or updates a push subscription for a user
 */
export async function saveSubscription(
  userId: number,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<PushSubscription> {
  // Check if this subscription already exists
  const existingSub = await storage.getPushSubscriptionByEndpoint(subscription.endpoint);
  
  // If exists and belongs to the same user, we're done
  if (existingSub && existingSub.userId === userId) {
    return existingSub;
  }
  
  // If exists but different user, delete old one
  if (existingSub) {
    await storage.deletePushSubscription(existingSub.id);
  }
  
  // Create new subscription
  return await storage.createPushSubscription({
    userId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
  });
}