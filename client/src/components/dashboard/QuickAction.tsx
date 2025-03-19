import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Pill, Syringe, TestTube, Stethoscope, Droplets } from "lucide-react";

interface QuickActionProps {
  title: string;
  icon: "chart" | "bell" | "info" | "chat";
  color: "primary" | "secondary" | "warning" | "accent";
  path: string;
}

export default function QuickAction({ title, icon, color, path }: QuickActionProps) {
  const bgColorClasses = {
    primary: "bg-blue-100 dark:bg-blue-900/40",
    secondary: "bg-green-100 dark:bg-green-900/40",
    warning: "bg-orange-100 dark:bg-orange-900/40",
    accent: "bg-pink-100 dark:bg-pink-900/40"
  };
  
  const textColorClasses = {
    primary: "text-primary dark:text-blue-300",
    secondary: "text-secondary dark:text-green-300",
    warning: "text-warning dark:text-orange-300",
    accent: "text-accent dark:text-pink-300"
  };
  
  const getIcon = () => {
    switch (icon) {
      case "chart":
        return <TestTube className={cn("h-6 w-6", textColorClasses[color])} />;
      case "bell":
        return <Syringe className={cn("h-6 w-6", textColorClasses[color])} />;
      case "info":
        return <Pill className={cn("h-6 w-6", textColorClasses[color])} />;
      case "chat":
        return <Stethoscope className={cn("h-6 w-6", textColorClasses[color])} />;
    }
  };
  
  return (
    <Link href={path} className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow dark:border dark:border-slate-700">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-2", bgColorClasses[color])}>
        {getIcon()}
      </div>
      <span className="text-sm font-medium dark:text-white">{title}</span>
    </Link>
  );
}
