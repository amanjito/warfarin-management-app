import { Home, TrendingUp, Pill, Clock, MessageSquare } from "lucide-react";
import { Link } from "wouter";

interface NavigationProps {
  activeTab: string;
}

export default function Navigation({ activeTab }: NavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "pt-tracker", label: "PT Tracker", icon: TrendingUp, path: "/pt-tracker" },
    { id: "medication", label: "Medication", icon: Pill, path: "/medication" },
    { id: "reminders", label: "Reminders", icon: Clock, path: "/reminders" },
    { id: "assistant", label: "Assistant", icon: MessageSquare, path: "/assistant" },
  ];
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <Link key={tab.id} href={tab.path}>
                <a className={`flex-1 py-4 px-2 text-center font-medium flex flex-col items-center ${
                  isActive 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-500"
                }`}>
                  <tab.icon className="mb-1" />
                  <span>{tab.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
