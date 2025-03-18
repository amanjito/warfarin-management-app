import { useState, useEffect, useRef } from "react";
import { Bell, LogOut, Settings, Menu, X, Search, BarChart4, Sparkles, Calendar, Shield, Heart, Pill, Clock, Activity, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { CurvedShape, HeartbeatShape, HeartPulseIcon, WarfarinLogo } from "./svg/CurvedShape";
import { cn } from "@/lib/utils";
import { Wave } from "./icons/Wave";
import { MedicalHeart } from "./icons/MedicalHeart";
import { BloodDrop } from "./icons/BloodDrop";

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

  // Define silver gradients for our app bar
  const silverGradient = "bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300";
  const silverGradientScrolled = "bg-gradient-to-b from-gray-200/95 via-gray-300/95 to-gray-400/95 backdrop-blur-md";
  
  // Random INR value for display purposes - this would normally come from your data
  const latestInr = "2.4";
  const inrStatus = parseFloat(latestInr) >= 2 && parseFloat(latestInr) <= 3 ? "in-range" : "out-of-range";
  
  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 ${
          scrolled ? silverGradientScrolled : silverGradient
        } text-gray-800 transition-all duration-300 shadow-md h-[80px] overflow-hidden`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Silver reflective pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent opacity-50"></div>
          
          {/* Wave pattern at bottom */}
          <div className="absolute -bottom-1 left-0 right-0 h-24 transform rotate-180 opacity-20">
            <Wave variant="header" fill="white" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-3 flex flex-col h-full">
          {/* Top row with logo and actions */}
          <div className="flex justify-between items-center mb-1 relative z-10">
            {/* Logo and title */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/dashboard">
                <div className="flex items-center">
                  <motion.div
                    className="mr-2 bg-white p-1.5 rounded-full shadow-md flex items-center justify-center border border-gray-100" 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <MedicalHeart className="h-6 w-6" primaryColor="#ef4444" secondaryColor="#ef4444" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                      <span className="hidden sm:inline">Warfarin</span>
                      <span className="sm:hidden">W</span>
                      <span className="text-primary font-extrabold">Tracker</span>
                    </h1>
                    <div className="hidden sm:flex items-center text-xs text-gray-500 -mt-1">
                      <span>Your INR Companion</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Quick status pill */}
            <motion.div 
              className="hidden md:flex items-center bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BloodDrop className="h-5 w-5 mr-2" color="#ef4444" />
              <div className="flex flex-col">
                <div className="text-xs text-gray-500">Latest INR</div>
                <div className="font-bold text-gray-800 -mt-0.5 flex items-center">
                  {latestInr}
                  <Badge 
                    className={`ml-2 text-[10px] ${
                      inrStatus === "in-range" 
                        ? "bg-green-500/20 text-green-700 hover:bg-green-500/20" 
                        : "bg-amber-500/20 text-amber-700 hover:bg-amber-500/20"
                    }`}
                  >
                    {inrStatus === "in-range" ? "IN RANGE" : "MONITOR"}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Search bar (expands on mobile) */}
            <AnimatePresence>
              {isMobile && searchActive ? (
                <motion.div
                  className="absolute left-0 top-0 w-full h-full px-4 py-3 flex items-center bg-gray-200/95 backdrop-blur-md z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input 
                    type="search" 
                    placeholder="Search medications, tests..."
                    className="bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary/30"
                    autoFocus
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-700 ml-2"
                    onClick={() => setSearchActive(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              ) : !isMobile && (
                <motion.div 
                  className="hidden lg:flex relative ml-4"
                  initial={{ opacity: 0, width: 100 }}
                  animate={{ opacity: 1, width: 220 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input 
                    type="search" 
                    placeholder="Search..."
                    className="bg-white/60 backdrop-blur-sm border-gray-300 text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary/30"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {isMobile && (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-700 hover:bg-gray-800/5"
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
                  className="hover:bg-gray-800/5 text-gray-700 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.9 }} className="hidden sm:block">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-gray-800/5 text-gray-700"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </motion.div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-gray-800/5 text-gray-800 flex items-center gap-1.5 ml-1"
                    >
                      <Avatar className="h-8 w-8 border border-gray-200 shadow-sm">
                        <AvatarImage src={userData?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start leading-none">
                        <span className="font-medium text-sm">{userData?.email?.split('@')[0] || 'User'}</span>
                        <span className="text-xs text-gray-500">Patient</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4 text-blue-500" />
                    <span>Privacy Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
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
                    className="hover:bg-gray-800/5 text-gray-700 ml-1 md:hidden"
                    onClick={() => setSideMenuOpen(!sideMenuOpen)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Second row with navigation tabs - visible on larger screens */}
          <div className="hidden md:flex items-center space-x-4 mt-auto relative z-10">
            {[
              { label: "Dashboard", icon: <Activity className="h-4 w-4" />, path: "/dashboard" },
              { label: "PT Tests", icon: <BloodDrop color="#6b7280" className="h-4 w-4" />, path: "/pt-tracker" },
              { label: "Medications", icon: <Pill className="h-4 w-4" />, path: "/medication" },
              { label: "Reminders", icon: <Clock className="h-4 w-4" />, path: "/reminders" }
            ].map((item) => {
              const isActive = window.location.pathname === item.path;
              return (
                <Link href={item.path} key={item.label}>
                  <motion.button
                    className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-primary text-white" 
                        : "text-gray-700 hover:bg-white/80 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                  </motion.button>
                </Link>
              );
            })}
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
      <div className="h-20" />
    </>
  );
}