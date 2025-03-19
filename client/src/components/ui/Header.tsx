import { useState, useEffect } from "react";
import { Bell, LogOut, Settings, Menu, X, Download, Home, Calendar, ChevronDown, Activity, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MedicalHeart from "./icons/MedicalHeart";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set current path
    setCurrentPath(window.location.pathname);
    
    // Get user data
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserData(data.user);
      }
    };
    
    getUserData();
    
    // Add scroll listener
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check if app is installable
    const detectInstallable = () => {
      // @ts-ignore - deferredPrompt is added by our event listener in main.tsx
      setIsInstallable(!!window.deferredPrompt);
    };
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', () => {
      setIsInstallable(true);
    });
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
    });
    
    // Check initially
    detectInstallable();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeinstallprompt', detectInstallable);
      window.removeEventListener('appinstalled', () => setIsInstallable(false));
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast({
        title: "خروج موفقیت‌آمیز",
        description: "از حساب کاربری خود خارج شدید",
      });
      setLocation('/auth');
    } catch (error) {
      toast({
        title: "خطا در خروج",
        description: "مشکلی در خروج از حساب کاربری وجود داشت",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
      setSideMenuOpen(false);
    }
  };
  
  const handleInstall = async () => {
    // @ts-ignore - deferredPrompt is added by our event listener in main.tsx
    const deferredPrompt = window.deferredPrompt;
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      // @ts-ignore
      window.deferredPrompt = null;
      setIsInstallable(false);
      
      if (outcome === 'accepted') {
        toast({
          title: "نصب برنامه",
          description: "برنامه با موفقیت به دستگاه شما اضافه شد",
        });
      }
    }
  };

  const userInitials = userData?.email ? userData.email.substring(0, 2).toUpperCase() : "WT";
  
  // Navigation items
  const navItems = [
    { path: '/', label: 'داشبورد', icon: <Home className="h-4 w-4 ml-2" /> },
    { path: '/pt-tracker', label: 'آزمایش PT/INR', icon: <Activity className="h-4 w-4 ml-2" /> },
    { path: '/reminders', label: 'یادآوری داروها', icon: <Bell className="h-4 w-4 ml-2" /> },
    { path: '/assistant', label: 'دستیار هوشمند', icon: <MedicalHeart className="h-4 w-4 ml-2" fill="currentColor" /> },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.includes(path)) return true;
    return false;
  };

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 ${
          scrolled 
            ? "bg-white backdrop-blur-md shadow-sm border-b border-slate-200/80" 
            : "bg-white border-b border-slate-200/60"
        } transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto flex flex-col items-stretch">
          {/* Top bar with logo and controls */}
          <div className="flex justify-between items-center py-2 px-4">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                className="ml-1.5 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center" 
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Heart className="h-4 w-4 text-white" />
              </motion.div>
              <h1 className="text-lg font-semibold text-slate-900">وارفارین</h1>
              <Badge variant="outline" className="mr-2 bg-primary/5 text-primary text-[10px] h-5 hidden sm:flex">v1.0</Badge>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-0.5">
              {/* Notification button */}
              {!isMobile && (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-500 hover:bg-slate-100 mr-1 rounded-full"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
              
              {/* Install button */}
              {isInstallable && (
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    variant="outline"
                    size="sm"
                    id="install-button"
                    className="border-slate-200 text-slate-700 hover:bg-slate-100 mr-1.5 hidden sm:flex"
                    onClick={handleInstall}
                  >
                    <Download className="h-4 w-4 ml-1.5" />
                    نصب برنامه
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    id="install-button-mobile"
                    className="hover:bg-slate-100 mr-1 text-slate-500 sm:hidden rounded-full"
                    onClick={handleInstall}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-slate-100 text-slate-700 flex items-center gap-2 rounded-full px-2 py-1 h-9"
                    >
                      <Avatar className="h-7 w-7 border border-slate-200">
                        <AvatarImage src={userData?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs bg-slate-100 text-slate-500">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <span className="hidden md:inline-block font-medium text-xs ml-0.5">
                          {userData?.email?.split('@')[0] || 'کاربر'}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </div>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 py-2">
                  <DropdownMenuLabel className="text-xs text-slate-500 font-normal py-1.5 pr-3">
                    حساب کاربری من
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2 pr-3 text-sm">
                    <User className="ml-2 h-4 w-4 rtl-icon text-slate-500" />
                    <span>پروفایل</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 pr-3 text-sm">
                    <Settings className="ml-2 h-4 w-4 rtl-icon text-slate-500" />
                    <span>تنظیمات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    className="py-2 pr-3 text-sm"
                  >
                    <LogOut className="ml-2 h-4 w-4 rtl-icon text-red-500" />
                    <span className="text-red-500">{isLoggingOut ? "در حال خروج..." : "خروج"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              {isMobile && (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-slate-100 mr-1 text-slate-500 md:hidden rounded-full"
                    onClick={() => setSideMenuOpen(!sideMenuOpen)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Navigation bar (desktop) */}
          {!isMobile && (
            <motion.nav 
              className="flex px-3 -ml-3 overflow-x-auto scrollbar-none" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive(item.path)
                      ? 'text-primary font-medium bg-primary/5'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon}
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </div>
      </motion.header>

      {/* Mobile side menu */}
      <AnimatePresence>
        {sideMenuOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSideMenuOpen(false)}
            />
            <motion.div 
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white z-50 shadow-xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center ml-2">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-slate-900">پایشگر وارفارین</h2>
                    <p className="text-xs text-slate-500">سلامتی شما، اولویت ماست</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSideMenuOpen(false)}
                  className="text-slate-500 hover:bg-slate-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* User section */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src={userData?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-slate-100 text-slate-500">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">{userData?.email?.split('@')[0] || 'کاربر'}</p>
                    <p className="text-xs text-slate-500">{userData?.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="p-2 flex-1 overflow-y-auto">
                <div className="pt-2 pb-1">
                  <p className="text-xs text-slate-500 px-3 py-1">منو اصلی</p>
                </div>
                
                {navItems.map((item) => (
                  <motion.a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-md text-sm transition-colors my-1 ${
                      isActive(item.path)
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSideMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </motion.a>
                ))}
                
                <div className="pt-4 pb-1">
                  <p className="text-xs text-slate-500 px-3 py-1">تنظیمات</p>
                </div>
                
                <motion.a
                  href="/settings"
                  className="flex items-center px-3 py-2.5 rounded-md text-sm transition-colors my-1 text-slate-700 hover:bg-slate-100"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSideMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 ml-2 text-slate-500" />
                  تنظیمات
                </motion.a>
                
                {isInstallable && (
                  <motion.button
                    className="w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors my-1 text-slate-700 hover:bg-slate-100"
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInstall}
                  >
                    <Download className="h-4 w-4 ml-2 text-slate-500" />
                    نصب برنامه
                  </motion.button>
                )}
                
                <motion.button
                  className="w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors my-1 text-red-500 hover:bg-red-50"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  {isLoggingOut ? "در حال خروج..." : "خروج از حساب کاربری"}
                </motion.button>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t text-xs text-center text-slate-500">
                <p>نسخه ۱.۰.۰ | &copy; ۱۴۰۳ پایشگر وارفارین</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* This div creates space below the fixed header */}
      <div className={`${isMobile ? 'h-[64px]' : 'h-[96px]'}`} />
    </>
  );
}
