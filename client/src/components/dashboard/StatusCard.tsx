import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: "primary" | "secondary" | "warning" | "accent";
}

export default function StatusCard({ title, value, subtitle, color }: StatusCardProps) {
  const colorClasses = {
    primary: "bg-blue-50 dark:bg-blue-900/30 border-primary",
    secondary: "bg-green-50 dark:bg-green-900/30 border-secondary",
    warning: "bg-orange-50 dark:bg-orange-900/30 border-warning",
    accent: "bg-pink-50 dark:bg-pink-900/30 border-accent"
  };
  
  const textColorClasses = {
    primary: "text-primary dark:text-blue-300",
    secondary: "text-secondary dark:text-green-300",
    warning: "text-warning dark:text-orange-300",
    accent: "text-accent dark:text-pink-300"
  };
  
  return (
    <div className={cn("rounded p-3 border-l-4", colorClasses[color])}>
      <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
      <p className={cn("text-xl font-semibold", textColorClasses[color])}>{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}
