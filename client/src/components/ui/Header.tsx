import { useState, useEffect } from "react";
import { Bell, UserCircle, LogOut, Settings, Heart, Menu, X, Search, AlertCircle, Download } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MedicalHeart from "./icons/MedicalHeart";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
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
    // Check if deferredPrompt is defined in the window object
    // @ts-ignore - deferredPrompt is added by our event listener in main.tsx
    const deferredPrompt = window.deferredPrompt;
    
    if (deferredPrompt) {
      // Show the prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to the install prompt: ${outcome}`);
      
      // Clear the deferredPrompt variable
      // @ts-ignore
      window.deferredPrompt = null;
      
      // Update UI
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

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 ${
          scrolled ? "bg-primary/95 backdrop-blur-md shadow-lg" : "bg-primary"
        } text-white transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo and title */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              className="ml-3 bg-white/20 p-2 rounded-full flex items-center justify-center" 
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <MedicalHeart className="h-5 w-5" fill="white" />
            </motion.div>
            <h1 className="text-xl font-bold hidden sm:block">پایشگر وارفارین</h1>
          </motion.div>

          {/* Search bar (expands on mobile) */}
          <AnimatePresence>
            {isMobile && searchActive ? (
              <motion.div
                className="absolute left-0 top-0 w-full h-full bg-primary px-4 py-3 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input 
                  type="search" 
                  placeholder="جستجو..."
                  className="bg-primary/40 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                  autoFocus
                />
                <Button variant="ghost" size="icon" className="text-white ml-2"
                  onClick={() => setSearchActive(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            ) : !isMobile && (
              <motion.div 
                className="hidden md:flex relative"
                initial={{ opacity: 0, width: 100 }}
                animate={{ opacity: 1, width: 250 }}
                transition={{ duration: 0.3 }}
              >
                <Input 
                  type="search" 
                  placeholder="جستجو..."
                  className="bg-primary/40 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/70" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center">
            {isMobile && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white mr-1"
                  onClick={() => setSearchActive(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 mr-1 text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </motion.div>
            
            {/* Install button - only visible when app is installable */}
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
                  className="border-white/30 text-white hover:bg-white/20 hover:text-white mr-2 hidden sm:flex"
                  onClick={handleInstall}
                >
                  <Download className="h-4 w-4 ml-1.5" />
                  نصب برنامه
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  id="install-button-mobile"
                  className="hover:bg-white/20 mr-1 text-white sm:hidden"
                  onClick={handleInstall}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-white/20 text-white flex items-center gap-2"
                  >
                    <Avatar className="h-7 w-7 border border-white/30">
                      <AvatarImage src={userData?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary-foreground text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block font-medium">حساب کاربری</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>حساب کاربری من</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="ml-2 h-4 w-4 rtl-icon" />
                  <span>تنظیمات</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="ml-2 h-4 w-4 rtl-icon" />
                  <span>{isLoggingOut ? "در حال خروج..." : "خروج"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            {isMobile && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-white/20 ml-1 text-white md:hidden"
                  onClick={() => setSideMenuOpen(!sideMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile side menu */}
      <AnimatePresence>
        {sideMenuOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSideMenuOpen(false)}
            />
            <motion.div 
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white z-50 shadow-xl p-6 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary flex items-center">
                  <MedicalHeart className="h-5 w-5 ml-2" fill="currentColor" />
                  پایشگر وارفارین
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSideMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-2 flex-1">
                <div className="p-4 bg-primary/10 rounded-lg flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/30">
                    <AvatarImage src={userData?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userData?.email}</p>
                    <p className="text-sm text-muted-foreground">تنظیمات حساب کاربری</p>
                  </div>
                </div>
                <Separator className="my-4" />
                
                {isInstallable && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mb-2" 
                    onClick={handleInstall}
                  >
                    <Download className="ml-2 h-4 w-4 rtl-icon" />
                    نصب برنامه
                  </Button>
                )}
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="ml-2 h-4 w-4 rtl-icon" />
                  {isLoggingOut ? "در حال خروج..." : "خروج"}
                </Button>
              </div>
              <div className="mt-auto pt-4 text-xs text-center text-muted-foreground">
                پایشگر وارفارین نسخه ۱.۰.۰
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* This div creates space below the fixed header */}
      <div className="h-14" />
    </>
  );
}
