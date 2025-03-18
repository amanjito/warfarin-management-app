import * as React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Activity, Bell, Info, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import MedicalHeart from "./icons/MedicalHeart";
import BloodDrop from "./icons/BloodDrop";

interface NavigationProps {
  activeTab: string;
}

export default function Navigation({ activeTab }: NavigationProps) {
  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: Activity,
    },
    {
      id: "pt-tracker",
      label: "PT Tests",
      href: "/pt-tracker",
      icon: BloodDrop,
      custom: true,
    },
    {
      id: "reminders",
      label: "Reminders",
      href: "/reminders",
      icon: Bell,
    },
    {
      id: "assistant",
      label: "Assistant",
      href: "/assistant",
      icon: MessageSquare,
    },
    {
      id: "medication-info",
      label: "Info",
      href: "/medication-info",
      icon: Info,
    },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/80 backdrop-blur-md border-t flex justify-between items-center px-6 h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              <motion.div
                className={cn(
                  "flex flex-col items-center justify-center rounded-md transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                whileTap={{ scale: 0.9 }}
              >
                {tab.custom ? (
                  tab.id === "pt-tracker" ? (
                    <BloodDrop 
                      size={24} 
                      colorClass={isActive ? "text-primary" : "text-muted-foreground"} 
                    />
                  ) : (
                    <MedicalHeart 
                      size={24} 
                      colorClass={isActive ? "text-primary" : "text-muted-foreground"} 
                      secondaryColorClass={isActive ? "text-secondary" : "text-muted-foreground"}
                    />
                  )
                ) : (
                  <tab.icon className="h-5 w-5" />
                )}
                
                <span className="text-xs mt-1">{tab.label}</span>
                
                {isActive && (
                  <motion.div
                    className="absolute -bottom-[16px] left-[10%] right-[10%] h-1 bg-primary rounded-t-full"
                    layoutId="bottomnav-indicator"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}