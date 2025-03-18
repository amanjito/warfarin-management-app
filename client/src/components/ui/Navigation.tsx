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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20 rounded-full overflow-hidden max-w-md w-11/12"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Curved shape for the top edge */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/50 to-transparent"></div>
      
      <div className="w-full px-2">
        <div className="flex relative py-2" ref={navigationRef}>
          {/* Animated indicator background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-50"></div>
          
          {/* Animated indicator */}
          {mounted && (
            <>
              <motion.div 
                className="absolute bottom-0 h-1.5 bg-gradient-to-r from-primary/90 to-primary rounded-full"
                initial={false}
                animate={{ width: dimensions.width, x: dimensions.left }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              <motion.div 
                className="absolute bottom-0 h-1.5 bg-white/30 blur-sm rounded-full"
                initial={false}
                animate={{ width: dimensions.width * 1.2, x: dimensions.left - dimensions.width * 0.1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </>
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
                              className="absolute -inset-2.5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full -z-10"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              layoutId="navBackground"
                            />
                          )}
                        </AnimatePresence>
                        <motion.div
                          className="relative w-6 h-6 flex items-center justify-center"
                          animate={isActive 
                            ? { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" } 
                            : { filter: "none" }
                          }
                        >
                          <Icon className="w-5 h-5" />
                          {isActive && (
                            <motion.div 
                              className="absolute inset-0 bg-primary opacity-10 blur-md rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1.5 }}
                              exit={{ scale: 0 }}
                            />
                          )}
                        </motion.div>
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
