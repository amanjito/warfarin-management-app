import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/dateUtils";
import { motion } from "framer-motion";

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
          bgColor: "bg-blue-100 dark:bg-blue-900/40",
          iconColor: "text-primary dark:text-blue-400"
        };
      case "متوپرولول":
      case "Metoprolol":
        return {
          bgColor: "bg-green-100 dark:bg-green-900/40",
          iconColor: "text-secondary dark:text-green-400"
        };
      case "ویتامین د":
      case "Vitamin D":
        return {
          bgColor: "bg-yellow-100 dark:bg-yellow-900/40",
          iconColor: "text-yellow-500 dark:text-yellow-400"
        };
      default:
        return {
          bgColor: "bg-purple-100 dark:bg-purple-900/40",
          iconColor: "text-purple-500 dark:text-purple-400"
        };
    }
  };
  
  const iconStyles = getIconStyles();
  
  return (
    <motion.div 
      className={`flex items-center p-3 rounded-lg ${
        reminder.taken 
          ? 'bg-gray-50 dark:bg-slate-800/50' 
          : 'bg-blue-50 dark:bg-blue-900/20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className={`ml-4 w-12 h-12 ${iconStyles.bgColor} rounded-full flex items-center justify-center`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.svg 
          className={`h-6 w-6 ${iconStyles.iconColor}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          whileHover={{ scale: 1.2 }}
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
        </motion.svg>
      </motion.div>
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex justify-between">
          <p className="font-medium dark:text-white">{reminder.medication.name}</p>
          <motion.p 
            className={`text-sm font-medium ${
              reminder.taken 
                ? 'text-gray-500 dark:text-gray-400' 
                : 'text-primary dark:text-primary/90'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {formatTime(reminder.time)}
          </motion.p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {reminder.medication.dosage} - {reminder.medication.quantity}
        </p>
      </motion.div>
      {reminder.taken ? (
        <motion.div 
          className="mr-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Check className="h-5 w-5" />
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            onClick={onTakeMedication}
            className="mr-2 bg-primary text-white w-8 h-8 p-0 rounded-full"
            title="مصرف دارو"
          >
            <Check className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
