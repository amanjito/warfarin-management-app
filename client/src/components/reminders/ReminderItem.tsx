import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/dateUtils";

interface ReminderItemProps {
  reminder: {
    id: number;
    medication: {
      name: string;
      dosage: string;
      quantity: string;
    };
    time: string;
    taken: boolean;
  };
  onTakeMedication: () => void;
}

export default function ReminderItem({ reminder, onTakeMedication }: ReminderItemProps) {
  const getIconStyles = () => {
    switch (reminder.medication.name) {
      case "وارفارین":
      case "Warfarin":
        return {
          bgColor: "bg-blue-100",
          iconColor: "text-primary"
        };
      case "متوپرولول":
      case "Metoprolol":
        return {
          bgColor: "bg-green-100",
          iconColor: "text-secondary"
        };
      case "ویتامین د":
      case "Vitamin D":
        return {
          bgColor: "bg-yellow-100",
          iconColor: "text-yellow-500"
        };
      default:
        return {
          bgColor: "bg-purple-100",
          iconColor: "text-purple-500"
        };
    }
  };
  
  const iconStyles = getIconStyles();
  
  return (
    <div className={`flex items-center p-3 rounded-lg ${reminder.taken ? 'bg-gray-50' : 'bg-blue-50'}`}>
      <div className={`mr-4 w-12 h-12 ${iconStyles.bgColor} rounded-full flex items-center justify-center`}>
        <svg 
          className={`h-6 w-6 ${iconStyles.iconColor}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M18 14v1" />
          <path d="M18 21v1" />
          <path d="M22 18h-1" />
          <path d="M15 18h-1" />
          <path d="m21 15-.88.88" />
          <path d="M15.88 20.12 15 21" />
          <path d="m21 21-.88-.88" />
          <path d="M15.88 15.88 15 15" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium">{reminder.medication.name}</p>
          <p className={`text-sm font-medium ${reminder.taken ? 'text-gray-500' : 'text-primary'}`}>
            {formatTime(reminder.time)}
          </p>
        </div>
        <p className="text-sm text-gray-600">
          {reminder.medication.dosage} - {reminder.medication.quantity}
        </p>
      </div>
      {reminder.taken ? (
        <div className="ml-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5" />
        </div>
      ) : (
        <Button 
          onClick={onTakeMedication}
          className="ml-2 bg-primary text-white w-8 h-8 p-0 rounded-full"
        >
          <Check className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
