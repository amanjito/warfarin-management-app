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
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  
  const tabs = [
    { id: "dashboard", label: "خانه", icon: Home, path: "/dashboard" },
    { id: "pt-tracker", label: "آزمایش PT", icon: Activity, path: "/pt-tracker" },
    { id: "medication", label: "داروها", icon: Pill, path: "/medication" },
    { id: "reminders", label: "یادآورها", icon: Clock, path: "/reminders" },
    { id: "assistant", label: "دستیار", icon: MessageSquare, path: "/assistant" },
  ];
  
  // Update indicator on mount and when active tab changes
  useEffect(() => {
    // Set mounted after first render
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

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
        "fixed bottom-4 left-4 right-4 z-40 h-[60px]",
        "rounded-xl shadow-lg border border-gray-200/30",
        "backdrop-blur-lg bg-white/80",
        "safe-area-bottom pb-safe"
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="h-full">
        <div className="flex justify-around items-center h-full relative">
          {/* Minimal navigation items */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.div 
                key={tab.id} 
                className="flex-1 h-full flex items-center justify-center"
                variants={tabVariants}
              >
                <Link href={tab.path} className="w-full h-full flex items-center justify-center">
                  <motion.div 
                    className={cn(
                      "relative flex flex-col items-center justify-center",
                      "w-full h-full",
                      "cursor-pointer transition-all duration-300",
                      isActive ? "text-primary" : "text-gray-400"
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active item background pill */}
                    {isActive && (
                      <motion.div 
                        className="absolute inset-0 m-auto w-11 h-11 bg-primary/10 rounded-full"
                        layoutId="activeNavBackground"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    <div className="flex flex-col items-center justify-center space-y-1 z-10">
                      <Icon 
                        className={cn(
                          "h-5 w-5 transition-all",
                          isActive && "stroke-[2px]"
                        )} 
                      />
                      <span className={cn(
                        "text-[10px] font-medium",
                        isActive ? "opacity-100" : "opacity-70"
                      )}>
                        {tab.label}
                      </span>
                    </div>
                    
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
