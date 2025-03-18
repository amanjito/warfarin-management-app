import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, BellOff } from 'lucide-react';
import { 
  isPushNotificationSupported, 
  initializePushNotifications, 
  requestNotificationPermission, 
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  sendTestNotification,
  getCurrentPushSubscription
} from '@/lib/pushNotifications';

export default function NotificationManager() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);

  // Check if push notifications are supported and initialize
  useEffect(() => {
    const supported = isPushNotificationSupported();
    setIsSupported(supported);

    if (supported) {
      // Get current permission status
      setPermissionStatus(Notification.permission);
      
      // Initialize push notifications
      initializePushNotifications().catch(console.error);
      
      // Check if already subscribed
      getCurrentPushSubscription().then(subscription => {
        setIsSubscribed(!!subscription);
      }).catch(console.error);
    }
  }, []);

  // Request permission and subscribe
  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const permission = await requestNotificationPermission();
      setPermissionStatus(Notification.permission);
      
      if (permission) {
        const subscribed = await subscribeToPushNotifications();
        setIsSubscribed(subscribed);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe from notifications
  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      const unsubscribed = await unsubscribeFromPushNotifications();
      if (unsubscribed) {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a test notification
  const handleSendTestNotification = async () => {
    setIsLoading(true);
    try {
      const sent = await sendTestNotification();
      setTestSent(sent);
      
      // Reset the test sent status after 3 seconds
      setTimeout(() => {
        setTestSent(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </CardTitle>
        <CardDescription>
          Receive reminders when it's time to take your medication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <p className="text-sm text-muted-foreground">
              {isSubscribed
                ? "Notifications are enabled"
                : permissionStatus === "denied"
                ? "Notifications are blocked in your browser settings"
                : "Enable notifications to get medication reminders"}
            </p>
          </div>
          <Switch
            id="notifications"
            checked={isSubscribed}
            onCheckedChange={isSubscribed ? handleDisableNotifications : handleEnableNotifications}
            disabled={isLoading || permissionStatus === "denied"}
          />
        </div>

        {permissionStatus === "denied" && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Permission Denied</AlertTitle>
            <AlertDescription>
              You've blocked notifications for this site. Please update your browser settings to enable notifications.
            </AlertDescription>
          </Alert>
        )}

        {isSubscribed && (
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={handleSendTestNotification} 
              disabled={isLoading}
              className="w-full"
            >
              {testSent ? "Test Notification Sent!" : "Send Test Notification"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}