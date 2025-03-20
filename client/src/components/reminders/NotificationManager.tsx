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
  
  // Setup event listener for playing notification sounds
  useEffect(() => {
    // Function to play notification sound
    const playNotificationSound = (type: string = 'medication') => {
      try {
        // Use the global function from medication-reminder.js if available
        if (window.playMedicationReminderSound) {
          window.playMedicationReminderSound();
        } else {
          // Fallback to playing the sound directly
          const audio = new Audio('/sounds/medication-reminder.mp3');
          audio.volume = 0.7;
          audio.play().catch(error => {
            console.error('Error playing notification sound:', error);
          });
        }
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    };

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is to play a notification sound
      if (event.data && event.data.type === 'PLAY_NOTIFICATION_SOUND') {
        console.log('Received request to play notification sound:', event.data);
        playNotificationSound(event.data.notificationType);
      }
    };
    
    // Add event listener
    navigator.serviceWorker.addEventListener('message', handleMessage);
    
    // Cleanup function
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
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
  
  // Test just the sound
  const handleTestSound = () => {
    try {
      if (window.playMedicationReminderSound) {
        window.playMedicationReminderSound();
      } else {
        const audio = new Audio('/sounds/medication-reminder.mp3');
        audio.volume = 0.7;
        audio.play().catch(error => {
          console.error('Error playing test sound:', error);
        });
      }
    } catch (error) {
      console.error('Error testing sound:', error);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            اعلان‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>پشتیبانی نمی‌شود</AlertTitle>
            <AlertDescription>
              اعلان‌های پیش‌رو در مرورگر شما پشتیبانی نمی‌شوند. لطفاً از یک مرورگر مدرن مانند کروم، فایرفاکس یا اج استفاده کنید.
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
          اعلان‌ها
        </CardTitle>
        <CardDescription>
          زمانی که وقت مصرف داروی شماست، یادآوری دریافت کنید
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">فعال‌سازی اعلان‌ها</Label>
            <p className="text-sm text-muted-foreground">
              {isSubscribed
                ? "اعلان‌ها فعال هستند"
                : permissionStatus === "denied"
                ? "اعلان‌ها در تنظیمات مرورگر شما مسدود شده‌اند"
                : "برای دریافت یادآورهای دارویی، اعلان‌ها را فعال کنید"}
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
            <AlertTitle>دسترسی رد شده</AlertTitle>
            <AlertDescription>
              شما اعلان‌ها را برای این سایت مسدود کرده‌اید. لطفاً تنظیمات مرورگر خود را برای فعال‌سازی اعلان‌ها به‌روزرسانی کنید.
            </AlertDescription>
          </Alert>
        )}

        {isSubscribed && (
          <div className="pt-4 space-y-2">
            <Button 
              variant="outline" 
              onClick={handleSendTestNotification} 
              disabled={isLoading}
              className="w-full"
            >
              {testSent ? "اعلان آزمایشی ارسال شد!" : "ارسال اعلان آزمایشی"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestSound} 
              className="w-full flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              تست صدای اعلان
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}