import { useState, useEffect } from "react";
import { Bell, UserCircle, LogOut, Settings, Heart, Menu, X, Search, ActivitySquare, Pill, Clock, MessageSquare } from "lucide-react";
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
import { cn } from "@/lib/utils";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
      setLocation('/auth');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem signing you out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
      setSideMenuOpen(false);
    }
  };

  const userInitials = userData?.email ? userData.email.substring(0, 2).toUpperCase() : "WT";

  return (
    <>
      <motion.header 
        className={cn(
          "fixed top-0 left-0 right-0 z-40 text-white transition-all duration-300",
          scrolled 
            ? "bg-primary/95 backdrop-blur-md shadow-lg" 
            : "bg-primary"
        )}
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
              className="mr-3 bg-secondary p-2 rounded-full flex items-center justify-center" 
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Heart className="h-5 w-5" fill="white" />
            </motion.div>
            <h1 className="text-xl font-bold hidden sm:block">WarfarinTracker</h1>
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
                  placeholder="Search..."
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
                  placeholder="Search..."
                  className="bg-primary/40 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-white/70" />
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
                    <span className="hidden sm:inline-block font-medium">Account</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
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
                  <Heart className="h-5 w-5 mr-2" fill="currentColor" />
                  WarfarinTracker
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
                    <p className="text-sm text-muted-foreground">Account Settings</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </Button>
              </div>
              <div className="mt-auto pt-4 text-xs text-center text-muted-foreground">
                WarfarinTracker v1.0.0
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
