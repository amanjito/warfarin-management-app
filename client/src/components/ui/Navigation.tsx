import { Home, TrendingUp, Pill, Clock, MessageSquare, Activity, Plus } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MedicalHeart from "./icons/MedicalHeart";
import BloodDrop from "./icons/BloodDrop";

interface NavigationProps {
  activeTab: string;
}

export default function Navigation({ activeTab }: NavigationProps) {
  const [dimensions, setDimensions] = useState({ width: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const tabs = [
    { id: "dashboard", label: "خانه", icon: Home, path: "/dashboard" },
    { id: "pt-tracker", label: "آزمایش PT", icon: BloodDrop, path: "/pt-tracker" },
    { id: "medication", label: "داروها", icon: MedicalHeart, path: "/medication" },
    { id: "reminders", label: "یادآورها", icon: Clock, path: "/reminders" },
    { id: "assistant", label: "دستیار", icon: MessageSquare, path: "/assistant" },
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

  // Variants for the container animation
  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        staggerChildren: 0.05,
        delayChildren: 0.1
      } 
    }
  };

  // Variants for the tab items
  const tabVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 500 }
    }
  };
  
  return (
    <motion.nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 h-[70px] bg-white dark:bg-gray-900",
        "shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.1)]",
        "border-t border-gray-200 dark:border-gray-800",
        "backdrop-blur-md bg-white/90 dark:bg-gray-900/90",
        "safe-area-bottom pb-safe"
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto h-full px-2">
        <div className="flex justify-between items-center h-full relative" ref={navigationRef}>
          {/* Bottom Glass Effect */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80 -z-10" />
          
          {/* Animated indicator - pill style */}
          {mounted && (
            <motion.div 
              className="absolute bottom-[60px] h-1 bg-primary rounded-full"
              initial={false}
              animate={{ width: dimensions.width, x: dimensions.left }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.div 
                key={tab.id} 
                className="flex-1 h-full flex items-center justify-center"
                ref={isActive ? activeTabRef : null}
                variants={tabVariants}
              >
                <Link href={tab.path} className="w-full h-full flex items-center justify-center">
                  <motion.div 
                    className={cn(
                      "relative py-2 px-1 flex flex-col items-center justify-center rounded-2xl",
                      "w-full max-w-[76px] h-full",
                      "cursor-pointer transition-all duration-200",
                      isActive 
                        ? "text-primary" 
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                    )}
                    whileTap={{ scale: 0.9 }}
                    whileHover="hover"
                  >
                    <motion.div 
                      className="flex flex-col items-center justify-center w-full"
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="relative mb-1 flex items-center justify-center"
                        animate={isActive 
                          ? { y: isMobile ? -4 : -6, scale: isMobile ? 1.1 : 1.2 } 
                          : { y: 0, scale: 1 }
                        }
                        variants={{
                          hover: { y: -2, scale: 1.1, transition: { duration: 0.2 } }
                        }}
                        transition={{ type: "spring", stiffness: 600, damping: 20 }}
                      >
                        <AnimatePresence mode="wait">
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-primary/15 rounded-full -z-10"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1.5 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              layoutId="navItemBackground"
                            />
                          )}
                        </AnimatePresence>
                        
                        {/* Icon with conditional fill for active state */}
                        <Icon 
                          className={cn(
                            "h-[22px] w-[22px] transition-all",
                            isActive && "stroke-[2.5px]",
                            !isActive && "stroke-[1.75px]"
                          )} 
                          fill={isActive ? "rgba(var(--primary), 0.2)" : "none"}
                        />
                      </motion.div>
                      
                      <motion.span 
                        className={cn(
                          "text-[11px] tracking-tight whitespace-nowrap",
                          isActive ? "font-bold" : "font-medium"
                        )}
                        animate={isActive ? { y: -2 } : { y: 0 }}
                        variants={{
                          hover: { y: -1, transition: { duration: 0.2 } }
                        }}
                      >
                        {tab.label}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
          
          {/* Center floating action button (optional) */}
          {false && (
            <motion.div 
              className="absolute -top-6 left-1/2 transform -translate-x-1/2"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
            >
              <motion.button
                className="bg-primary text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
