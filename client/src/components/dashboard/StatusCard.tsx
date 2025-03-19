import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: "primary" | "secondary" | "warning" | "accent";
  onClick?: () => void;
  isEditable?: boolean;
  onUpdate?: (date: Date) => void;
  type?: string;
}

export default function StatusCard({ 
  title, 
  value, 
  subtitle, 
  color,
  onClick,
  isEditable = false,
  onUpdate,
  type
}: StatusCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
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
  
  const handleSave = () => {
    if (selectedDate && onUpdate) {
      onUpdate(selectedDate);
      setOpen(false);
      toast({
        title: "تاریخ به‌روزرسانی شد",
        description: "تاریخ آزمایش بعدی با موفقیت به‌روزرسانی شد",
      });
    }
  };
  
  const statusCardContent = (
    <div className={cn(
      "rounded p-3 border-l-4", 
      colorClasses[color],
      isEditable ? "cursor-pointer hover:shadow-md transition-shadow" : ""
    )}
    onClick={onClick}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className={cn("text-xl font-semibold", textColorClasses[color])}>{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
  
  if (isEditable && type === "pt-test") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {statusCardContent}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-right">انتخاب تاریخ آزمایش بعدی</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto"
              disabled={(date) => date < new Date()}
            />
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!selectedDate}>
                ذخیره تاریخ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return statusCardContent;
}
