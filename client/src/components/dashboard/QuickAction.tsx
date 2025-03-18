import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LineChart, Bell, BookOpen, MessagesSquare } from "lucide-react";

interface QuickActionProps {
  title: string;
  icon: "chart" | "bell" | "info" | "chat";
  color: "primary" | "secondary" | "warning" | "accent";
  path: string;
}

export default function QuickAction({ title, icon, color, path }: QuickActionProps) {
  const bgColorClasses = {
    primary: "bg-blue-100",
    secondary: "bg-green-100",
    warning: "bg-orange-100",
    accent: "bg-pink-100"
  };
  
  const textColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    warning: "text-warning",
    accent: "text-accent"
  };
  
  const getIcon = () => {
    switch (icon) {
      case "chart":
        return <LineChart className={cn("h-6 w-6", textColorClasses[color])} />;
      case "bell":
        return <Bell className={cn("h-6 w-6", textColorClasses[color])} />;
      case "info":
        return <BookOpen className={cn("h-6 w-6", textColorClasses[color])} />;
      case "chat":
        return <MessagesSquare className={cn("h-6 w-6", textColorClasses[color])} />;
    }
  };
  
  return (
    <Link href={path} className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-2", bgColorClasses[color])}>
        {getIcon()}
      </div>
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
}
