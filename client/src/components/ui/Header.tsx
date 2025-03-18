import * as React from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import MedicalHeart from "./icons/MedicalHeart";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Determine if we're on the auth page
  const isAuthPage = location === "/auth" || location === "/";
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleProfileClick = () => {
    toast({
      title: "Coming Soon",
      description: "Profile settings will be available in the next update",
      variant: "default",
    });
  };
  
  const handleLogout = () => {
    // For now just redirect to auth page
    // In a real app we would call logout API
    window.location.href = "/auth";
  };
  
  const menuItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "PT Tracker", href: "/pt-tracker" },
    { label: "Reminders", href: "/reminders" },
    { label: "Assistant", href: "/assistant" },
  ];
  
  return (
    <header className="relative z-50">
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-30">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href={isAuthPage ? "/" : "/dashboard"} className="flex items-center">
              <MedicalHeart size={28} className="mr-2" colorClass="text-primary" secondaryColorClass="text-secondary" />
              <span className="font-semibold text-lg text-foreground">WarfarinTracker</span>
            </Link>
          </div>
          
          {!isMobile && !isAuthPage && (
            <nav className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "font-medium transition-colors duration-200 hover:text-primary relative py-2",
                    location === item.href 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                  {location === item.href && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}
          
          {!isAuthPage && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                className="relative rounded-full p-2" 
                onClick={handleProfileClick}
              >
                <span className="sr-only">User menu</span>
                <div className="rounded-full bg-secondary h-8 w-8 flex items-center justify-center text-secondary-foreground">
                  <span className="text-sm font-medium">JD</span>
                </div>
              </Button>
              
              {!isMobile && (
                <Button onClick={handleLogout} variant="secondary" size="sm">
                  Sign out
                </Button>
              )}
              
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-background"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center h-16 px-4 border-b">
                <div className="flex items-center gap-2">
                  <MedicalHeart size={28} className="mr-2" colorClass="text-primary" secondaryColorClass="text-secondary" />
                  <span className="font-semibold text-lg">WarfarinTracker</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto py-8 px-4">
                <nav className="flex flex-col space-y-6">
                  {menuItems.map((item, idx) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        className={cn(
                          "flex items-center py-3 text-lg font-medium transition-colors",
                          location === item.href 
                            ? "text-primary" 
                            : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
              
              <div className="p-4 border-t">
                <Button onClick={handleLogout} className="w-full">
                  Sign out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}