import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: "primary" | "secondary" | "warning" | "accent";
}

export default function StatusCard({ title, value, subtitle, color }: StatusCardProps) {
  const colorClasses = {
    primary: "bg-blue-50 border-primary",
    secondary: "bg-green-50 border-secondary",
    warning: "bg-orange-50 border-warning",
    accent: "bg-pink-50 border-accent"
  };
  
  const textColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    warning: "text-warning",
    accent: "text-accent"
  };
  
  return (
    <div className={cn("rounded p-3 border-l-4", colorClasses[color])}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className={cn("text-xl font-semibold", textColorClasses[color])}>{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
