import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LogOut, User, Settings, Bell, Moon, Sun, Languages, Shield, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { requestNotificationPermission, 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications,
  isPushNotificationSupported } from "@/lib/pushNotifications";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // States for profile data
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; created_at: string } | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  // States for settings
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isRTL, setIsRTL] = useState(document.dir === 'rtl');
  const [language, setLanguage] = useState<"fa" | "en">("fa");
  
  // Load user data
  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser({
          email: user.email || "",
          created_at: user.created_at || "",
        });
      }
      setIsLoading(false);
    };
    
    getUserProfile();
    
    // Check if push notifications are enabled
    const checkPushNotificationStatus = async () => {
      if (isPushNotificationSupported()) {
        const permission = Notification.permission;
        setPushNotifications(permission === "granted");
      }
    };
    
    checkPushNotificationStatus();
  }, []);
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    
    // Toggle dark mode class on document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: newTheme === 'dark' ? "حالت تاریک فعال شد" : "حالت روشن فعال شد",
      description: "تنظیمات تم ذخیره شد",
    });
  };
  
  // Handle RTL toggle
  const handleRTLToggle = () => {
    const newDir = isRTL ? 'ltr' : 'rtl';
    setIsRTL(!isRTL);
    document.dir = newDir;
    
    toast({
      title: newDir === 'rtl' ? "چیدمان راست به چپ فعال شد" : "چیدمان چپ به راست فعال شد",
      description: "تنظیمات جهت ذخیره شد",
    });
  };
  
  // Handle language change
  const handleLanguageChange = (lang: "fa" | "en") => {
    setLanguage(lang);
    
    toast({
      title: lang === 'fa' ? "زبان فارسی انتخاب شد" : "English language selected",
      description: "تنظیمات زبان ذخیره شد",
    });
  };
  
  // Handle push notification toggle
  const handlePushNotificationToggle = async () => {
    if (!pushNotifications) {
      const granted = await requestNotificationPermission();
      if (granted) {
        const subscribed = await subscribeToPushNotifications();
        setPushNotifications(subscribed);
        
        if (subscribed) {
          toast({
            title: "اعلان‌ها فعال شدند",
            description: "اکنون اعلان‌های یادآوری دارو را دریافت خواهید کرد",
          });
        } else {
          toast({
            title: "فعال‌سازی اعلان‌ها ناموفق بود",
            description: "لطفاً دوباره تلاش کنید یا تنظیمات مرورگر خود را بررسی کنید",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "اجازه اعلان داده نشد",
          description: "لطفاً دسترسی اعلان‌ها را در تنظیمات مرورگر خود فعال کنید",
          variant: "destructive",
        });
      }
    } else {
      const unsubscribed = await unsubscribeFromPushNotifications();
      setPushNotifications(!unsubscribed);
      
      if (unsubscribed) {
        toast({
          title: "اعلان‌ها غیرفعال شدند",
          description: "دیگر اعلان‌های یادآوری دارو را دریافت نخواهید کرد",
        });
      }
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      setLocation("/auth");
      
      toast({
        title: "با موفقیت خارج شدید",
        description: "امیدواریم به زودی برگردید!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "خروج ناموفق بود",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">پروفایل کاربری</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile" className="text-base">
            <User className="w-4 h-4 ml-2" />
            پروفایل
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-base">
            <Settings className="w-4 h-4 ml-2" />
            تنظیمات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-none shadow-md dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="" alt="تصویر پروفایل" />
                <AvatarFallback className="text-lg bg-primary text-white">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user?.email?.split('@')[0] || "کاربر"}</CardTitle>
                <CardDescription>
                  {user?.email || "ایمیل در دسترس نیست"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">ایمیل</h3>
                <p className="font-medium">{user?.email || "ایمیل در دسترس نیست"}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">تاریخ عضویت</h3>
                <p className="font-medium">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('fa-IR')
                    : "تاریخ در دسترس نیست"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="ml-2 h-4 w-4" />
                خروج از حساب کاربری
              </Button>
            </CardFooter>
          </Card>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-right">چگونه داده‌های پروفایل خود را ویرایش کنم؟</AccordionTrigger>
              <AccordionContent>
                در حال حاضر، ویرایش اطلاعات پروفایل از طریق تنظیمات حساب Supabase امکان‌پذیر است. در نسخه‌های آینده، امکان ویرایش مستقیم اطلاعات پروفایل اضافه خواهد شد.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-right">چگونه می‌توانم رمز عبور خود را تغییر دهم؟</AccordionTrigger>
              <AccordionContent>
                برای تغییر رمز عبور، ابتدا از حساب خود خارج شوید. سپس، در صفحه ورود، روی گزینه "فراموشی رمز عبور" کلیک کنید و دستورالعمل‌های ارسال شده به ایمیل خود را دنبال کنید.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-right">آیا می‌توانم حساب کاربری خود را حذف کنم؟</AccordionTrigger>
              <AccordionContent>
                در حال حاضر، برای حذف حساب کاربری، لطفاً با پشتیبانی تماس بگیرید. ما به زودی امکان حذف حساب کاربری را مستقیماً در برنامه اضافه خواهیم کرد.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl">تنظیمات ظاهری</CardTitle>
              <CardDescription>
                تنظیمات مربوط به نحوه نمایش برنامه را تغییر دهید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">حالت تاریک</Label>
                  <p className="text-sm text-muted-foreground">
                    ظاهر تاریک برای استفاده در شب
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleThemeToggle}
                  />
                  <Moon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="rtl">جهت راست به چپ</Label>
                  <p className="text-sm text-muted-foreground">
                    تغییر جهت نمایش عناصر به راست به چپ
                  </p>
                </div>
                <Switch
                  id="rtl"
                  checked={isRTL}
                  onCheckedChange={handleRTLToggle}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <Label>زبان برنامه</Label>
                  <p className="text-sm text-muted-foreground">
                    انتخاب زبان برای متن‌های برنامه
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={language === "fa" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleLanguageChange("fa")}
                    className="flex-1"
                  >
                    فارسی
                  </Button>
                  <Button 
                    variant={language === "en" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleLanguageChange("en")}
                    className="flex-1"
                  >
                    English
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl">اعلان‌ها</CardTitle>
              <CardDescription>
                تنظیمات مربوط به اعلان‌های برنامه را مدیریت کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">اعلان‌های Push</Label>
                  <p className="text-sm text-muted-foreground">
                    دریافت اعلان برای یادآوری‌های مصرف دارو
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={handlePushNotificationToggle}
                  disabled={!isPushNotificationSupported()}
                />
              </div>
              
              {!isPushNotificationSupported() && (
                <div className="bg-amber-50 text-amber-700 p-3 rounded-md text-sm dark:bg-amber-950 dark:text-amber-300">
                  مرورگر شما از اعلان‌های Push پشتیبانی نمی‌کند. لطفاً از مرورگر دیگری استفاده کنید یا برنامه را روی گوشی خود نصب کنید.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl">حریم خصوصی و امنیت</CardTitle>
              <CardDescription>
                تنظیمات مربوط به حریم خصوصی و امنیت را مدیریت کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-collection">جمع‌آوری داده‌ها</Label>
                  <p className="text-sm text-muted-foreground">
                    به ما اجازه دهید داده‌های استفاده را برای بهبود برنامه جمع‌آوری کنیم
                  </p>
                </div>
                <Switch
                  id="data-collection"
                  defaultChecked={true}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-0.5">
                <Label>دسترسی به داده‌های شما</Label>
                <p className="text-sm text-muted-foreground">
                  مدیریت داده‌های ذخیره شده در برنامه
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Shield className="ml-2 h-4 w-4" />
                    دانلود داده‌های من
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl">پشتیبانی</CardTitle>
              <CardDescription>
                تماس با پشتیبانی و گزارش مشکلات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="secondary" className="w-full">
                <HelpCircle className="ml-2 h-4 w-4" />
                تماس با پشتیبانی
              </Button>
              
              <div className="space-y-2">
                <Label>نسخه برنامه</Label>
                <p className="text-sm text-muted-foreground">
                  واراترک نسخه 1.0.0
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}