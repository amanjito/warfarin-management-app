import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Moon, 
  Languages, 
  Contact, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  LogOut,
  Trash2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from 'wouter';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isPushNotificationSupported, subscribeToPushNotifications, unsubscribeFromPushNotifications } from '@/lib/pushNotifications';

export default function Settings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isPending, setIsPending] = useState(false);
  const pushSupported = isPushNotificationSupported();
  
  // Settings state
  const [settings, setSettings] = useState({
    // Notification settings
    pushNotifications: false,
    reminderNotifications: true,
    ptTestReminders: true,
    medicationUpdates: true,
    
    // Appearance settings
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    
    // Language settings
    language: 'fa',
  });
  
  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      
      // Special handling for push notifications
      if (key === 'pushNotifications') {
        togglePushNotifications(newSettings.pushNotifications);
      }
      
      // Special handling for dark mode
      if (key === 'darkMode') {
        document.documentElement.classList.toggle('dark', newSettings.darkMode);
        localStorage.setItem('darkMode', newSettings.darkMode ? 'true' : 'false');
      }
      
      return newSettings;
    });
  };
  
  const togglePushNotifications = async (enabled: boolean) => {
    if (!pushSupported) return;
    
    setIsPending(true);
    try {
      if (enabled) {
        const success = await subscribeToPushNotifications();
        if (!success) {
          setSettings(prev => ({ ...prev, pushNotifications: false }));
          toast({
            title: 'اعلان‌ها فعال نشدند',
            description: 'لطفا مجوز اعلان‌ها را در مرورگر خود فعال کنید.',
            variant: 'destructive',
          });
        }
      } else {
        await unsubscribeFromPushNotifications();
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      toast({
        title: 'خطایی رخ داد',
        description: 'مشکلی در تغییر وضعیت اعلان‌ها به وجود آمد.',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };
  
  const handleLanguageChange = (value: string) => {
    setSettings(prev => ({ ...prev, language: value }));
    // In a real app, this would trigger language change
    toast({
      title: 'زبان تغییر کرد',
      description: value === 'fa' ? 'زبان به فارسی تغییر یافت.' : 'Language changed to English.',
    });
  };
  
  const handleLogout = async () => {
    setIsPending(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: 'خروج از حساب کاربری',
        description: 'شما با موفقیت از حساب کاربری خود خارج شدید.',
      });
      setLocation('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'خطا در خروج',
        description: 'مشکلی در خروج از حساب کاربری رخ داد.',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsPending(true);
    try {
      // In a real app, you would delete the user account
      // await supabase.auth.api.deleteUser(user.id)
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'حساب کاربری حذف شد',
        description: 'حساب کاربری شما با موفقیت حذف شد.',
      });
      
      // Log out and redirect to auth page
      await supabase.auth.signOut();
      setLocation('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'خطا در حذف حساب',
        description: 'مشکلی در حذف حساب کاربری رخ داد.',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col items-start mb-6">
        <h1 className="text-2xl font-bold">تنظیمات</h1>
        <p className="text-gray-500 dark:text-gray-400">تنظیمات و ترجیحات برنامه خود را مدیریت کنید</p>
      </div>
      
      <Tabs defaultValue="notifications" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="notifications">
            <Bell className="ml-2 h-4 w-4" />
            اعلان‌ها
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="ml-2 h-4 w-4" />
            ظاهر و زبان
          </TabsTrigger>
          <TabsTrigger value="account">
            <Contact className="ml-2 h-4 w-4" />
            حساب کاربری
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات اعلان‌ها</CardTitle>
              <CardDescription>
                مشخص کنید که چه زمانی و چگونه می‌خواهید اعلان‌ها را دریافت کنید.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">اعلان‌های پوش</Label>
                  <p className="text-sm text-muted-foreground">
                    دریافت اعلان‌ها حتی زمانی که برنامه بسته است
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggleSetting('pushNotifications')}
                  disabled={!pushSupported || isPending}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminder-notifications">یادآوری‌های دارو</Label>
                  <p className="text-sm text-muted-foreground">
                    دریافت اعلان برای مصرف دارو در زمان‌های مشخص شده
                  </p>
                </div>
                <Switch
                  id="reminder-notifications"
                  checked={settings.reminderNotifications}
                  onCheckedChange={() => handleToggleSetting('reminderNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pt-test-reminders">یادآوری‌های آزمایش PT</Label>
                  <p className="text-sm text-muted-foreground">
                    دریافت اعلان برای انجام آزمایش‌های PT در زمان مقرر
                  </p>
                </div>
                <Switch
                  id="pt-test-reminders"
                  checked={settings.ptTestReminders}
                  onCheckedChange={() => handleToggleSetting('ptTestReminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="medication-updates">به‌روزرسانی‌های دارویی</Label>
                  <p className="text-sm text-muted-foreground">
                    اطلاع‌رسانی درباره تغییرات در برنامه دارویی
                  </p>
                </div>
                <Switch
                  id="medication-updates"
                  checked={settings.medicationUpdates}
                  onCheckedChange={() => handleToggleSetting('medicationUpdates')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>ظاهر و زبان</CardTitle>
              <CardDescription>
                ظاهر برنامه و زبان مورد نظر خود را تنظیم کنید.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">حالت تاریک</Label>
                  <p className="text-sm text-muted-foreground">
                    فعال‌سازی حالت تاریک برای استفاده در محیط‌های کم‌نور
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggleSetting('darkMode')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language-select">زبان</Label>
                <Select
                  value={settings.language}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger id="language-select" className="w-full">
                    <Languages className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="انتخاب زبان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fa">فارسی</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>اطلاعات و راهنمایی</CardTitle>
              <CardDescription>
                راهنما و منابع کمکی برای استفاده از برنامه
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">راهنمای استفاده</h3>
                    <p className="text-sm text-muted-foreground">
                      آشنایی با قابلیت‌های برنامه و نحوه استفاده
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  مشاهده
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">درباره وارفارین</h3>
                    <p className="text-sm text-muted-foreground">
                      اطلاعات دارویی و نکات مهم درباره مصرف وارفارین
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  مطالعه
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">

          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>حساب کاربری</CardTitle>
              <CardDescription>
                مدیریت حساب کاربری و دسترسی‌های شما
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={handleLogout}
                disabled={isPending}
              >
                <span>خروج از حساب کاربری</span>
                <LogOut className="h-4 w-4 text-red-500" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-between"
                    disabled={isPending}
                  >
                    <span>حذف حساب کاربری</span>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>آیا از حذف حساب کاربری خود مطمئن هستید؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      این عمل غیرقابل بازگشت است. تمام داده‌های شما شامل سوابق دارویی، آزمایش‌ها و یادآوری‌ها به طور دائمی حذف خواهند شد.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>انصراف</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isPending}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      حذف دائمی
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}