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
      <div className="text-center py-6 text-gray-500">
        No medications scheduled for today
      </div>
    );
  }
  
  return (
    <ul className="divide-y divide-gray-200">
      {medications.map((medication) => (
        <li key={medication.id} className="py-3">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{medication.name}</p>
              <p className="text-sm text-gray-500">{medication.dosage} - {medication.quantity}</p>
            </div>
            <div className="text-right">
              {medication.isTaken ? (
                <>
                  <p className="text-sm font-medium text-green-600">✓ Taken</p>
                  <p className="text-xs text-gray-500">{formatTime(medication.time)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-primary">{formatTime(medication.time)}</p>
                  <p className="text-xs text-gray-500">Reminder set</p>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
