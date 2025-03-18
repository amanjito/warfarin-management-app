import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  isPushNotificationSupported, 
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getCurrentPushSubscription,
  sendTestNotification
} from '@/lib/pushNotifications';

export default function NotificationManager() {
  const { toast } = useToast();
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = isPushNotificationSupported();
      setNotificationsSupported(supported);
      
      if (supported) {
        const subscription = await getCurrentPushSubscription();
        setNotificationsEnabled(!!subscription);
      }
    };
    
    checkSupport();
  }, []);

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      
      if (enabled) {
        const permission = await requestNotificationPermission();
        
        if (!permission) {
          toast({
            title: 'Permission Denied',
            description: 'Please enable notifications in your browser settings to receive medication reminders.',
            variant: 'destructive'
          });
          setNotificationsEnabled(false);
          return;
        }
        
        const success = await subscribeToPushNotifications();
        
        if (success) {
          toast({
            title: 'Notifications Enabled',
            description: 'You will now receive medication reminders as notifications.',
          });
          setNotificationsEnabled(true);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to enable notifications. Please try again.',
            variant: 'destructive'
          });
          setNotificationsEnabled(false);
        }
      } else {
        const success = await unsubscribeFromPushNotifications();
        
        if (success) {
          toast({
            title: 'Notifications Disabled',
            description: 'You will no longer receive medication reminders as notifications.',
          });
          setNotificationsEnabled(false);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to disable notifications. Please try again.',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setTestingNotification(true);
      
      const success = await sendTestNotification();
      
      if (success) {
        toast({
          title: 'Test Notification Sent',
          description: 'Check your notifications to see if it arrived.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send test notification. Please make sure notifications are enabled.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setTestingNotification(false);
    }
  };

  if (!notificationsSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge to receive medication reminders.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Receive reminders when it's time to take your medication, even when the app is closed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">Enable Notifications</div>
            <div className="text-sm text-muted-foreground">
              Allow medication reminders to appear on your device
            </div>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
            disabled={isLoading}
          />
        </div>
        
        {notificationsEnabled && (
          <Button 
            variant="outline" 
            onClick={handleTestNotification}
            disabled={testingNotification || isLoading}
          >
            {testingNotification ? 'Sending...' : 'Send Test Notification'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}