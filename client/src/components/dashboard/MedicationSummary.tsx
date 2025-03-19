import { formatTime } from "@/lib/dateUtils";
import { Separator } from "@/components/ui/separator";

interface MedicationWithStatus {
  id: number;
  name: string;
  dosage: string;
  quantity: string;
  time: string;
  isTaken: boolean;
}

interface MedicationSummaryProps {
  medications: MedicationWithStatus[];
}

export default function MedicationSummary({ medications }: MedicationSummaryProps) {
  if (!medications || medications.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        هیچ دارویی برای امروز زمان‌بندی نشده است
      </div>
    );
  }
  
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {medications.map((medication) => (
        <li key={medication.id} className="py-3">
          <div className="flex justify-between">
            <div>
              <p className="font-medium dark:text-white">{medication.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{medication.dosage} - {medication.quantity}</p>
            </div>
            <div className="text-right">
              {medication.isTaken ? (
                <>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ مصرف شده</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(medication.time)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-primary dark:text-blue-300">{formatTime(medication.time)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">یادآور تنظیم شده</p>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
