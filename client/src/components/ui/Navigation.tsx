import { Home, TrendingUp, Pill, Clock, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface NavigationProps {
  activeTab: string;
}

export default function Navigation({ activeTab }: NavigationProps) {
  const [dimensions, setDimensions] = useState({ width: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "pt-tracker", label: "PT Tracker", icon: TrendingUp, path: "/pt-tracker" },
    { id: "medication", label: "Medication", icon: Pill, path: "/medication" },
    { id: "reminders", label: "Reminders", icon: Clock, path: "/reminders" },
    { id: "assistant", label: "Assistant", icon: MessageSquare, path: "/assistant" },
  ];
  
  // Function to update the indicator position
  const updateIndicator = () => {
    if (activeTabRef.current) {
      const { offsetWidth, offsetLeft } = activeTabRef.current;
      setDimensions({
        width: offsetWidth,
        left: offsetLeft,
      });
    }
  };
  
  // Update indicator on mount and when active tab changes
  useEffect(() => {
    // Set mounted after first render
    if (!mounted) {
      setMounted(true);
      return;
    }
    
    updateIndicator();
    
    // Update indicator on window resize
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab, mounted]);
  
  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-2xl overflow-hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-2">
        <div className="flex relative py-2" ref={navigationRef}>
          {/* Animated indicator */}
          {mounted && (
            <motion.div 
              className="absolute bottom-0 h-1 bg-primary rounded-full"
              initial={false}
              animate={{ width: dimensions.width, x: dimensions.left }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <div 
                key={tab.id} 
                className="flex-1"
                ref={isActive ? activeTabRef : null}
              >
                <Link href={tab.path}>
                  <motion.div 
                    className={`py-3 px-1 text-center font-medium flex flex-col items-center cursor-pointer transition-colors ${
                      isActive ? "text-primary" : "text-gray-500"
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div 
                      className="flex flex-col items-center justify-center w-full"
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className={`relative ${isActive ? "mb-2" : "mb-1.5"}`}
                        animate={isActive ? { scale: 1.1, y: -3 } : { scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              className="absolute -inset-1.5 bg-primary/10 rounded-full -z-10"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              layoutId="navBackground"
                            />
                          )}
                        </AnimatePresence>
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      <motion.span 
                        className="text-xs font-medium"
                        animate={isActive ? { fontWeight: 700 } : { fontWeight: 500 }}
                      >
                        {tab.label}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
