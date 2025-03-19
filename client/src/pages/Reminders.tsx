import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReminderForm from "@/components/reminders/ReminderForm";
import ReminderItem from "@/components/reminders/ReminderItem";
import EditReminderForm from "@/components/reminders/EditReminderForm";
import NotificationManager from "@/components/reminders/NotificationManager";
import { Medication, Reminder, MedicationLog } from "@shared/schema";
import { BellRing, ChevronRight, Trash2, X, Edit, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Form validation schema for editing alarm time
const editReminderSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "زمان باید در قالب HH:MM (24 ساعته) باشد",
  }),
  notifyBefore: z.string(), // Keep as string to avoid type errors
  days: z.array(z.string()).min(1, {
    message: "حداقل یک روز را انتخاب کنید",
  }),
});

type EditReminderFormValues = z.infer<typeof editReminderSchema>;

export default function Reminders() {
  const today = format(new Date(), "MMM dd, yyyy");
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<number | null>(null);
  
  // Define type for medication with reminders
  type MedicationWithReminders = Medication & { reminders: Reminder[] };
  
  const [selectedMedication, setSelectedMedication] = useState<MedicationWithReminders | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  // Fetch medications
  const { data: medications, isLoading: medicationsLoading } = useQuery<Medication[]>({
    queryKey: ['/api/medications'],
  });
  
  // Fetch reminders
  const { data: reminders, isLoading: remindersLoading } = useQuery<Reminder[]>({
    queryKey: ['/api/reminders'],
  });
  
  // Fetch medication logs
  const { data: medicationLogs, isLoading: logsLoading } = useQuery<MedicationLog[]>({
    queryKey: ['/api/medication-logs', { date: format(new Date(), 'yyyy-MM-dd') }],
  });
  
  // Create mutation for adding a medication log (taking medication)
  const takeMedicationMutation = useMutation({
    mutationFn: async (log: { reminderId: number, scheduled: string, taken: boolean }) => {
      const response = await apiRequest('POST', '/api/medication-logs', log);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medication-logs'] });
    },
  });
  
  // Create mutation for adding a new medication
  const createMedicationMutation = useMutation({
    mutationFn: async (newMedication: Omit<Medication, 'id' | 'userId'>) => {
      const response = await apiRequest('POST', '/api/medications', newMedication);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
    },
  });

  // Create mutation for adding a new reminder
  const addReminderMutation = useMutation({
    mutationFn: async (newReminder: Omit<Reminder, 'id' | 'userId'>) => {
      const response = await apiRequest('POST', '/api/reminders', newReminder);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
  });
  
  // Create mutation for deleting a medication
  const deleteMedicationMutation = useMutation({
    mutationFn: async (medicationId: number) => {
      const response = await apiRequest('DELETE', `/api/medications/${medicationId}`);
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
  });
  
  // Create mutation for updating a reminder
  const updateReminderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Reminder> }) => {
      const response = await apiRequest('PUT', `/api/reminders/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      setEditModalOpen(false);
    },
  });
  
  // Get today's reminders with medication info
  const getTodaysReminders = () => {
    if (!medications || !reminders) return [];
    
    return reminders.map(reminder => {
      const medication = medications.find(m => m.id === reminder.medicationId);
      if (!medication) return null;
      
      const log = medicationLogs?.find(l => l.reminderId === reminder.id);
      const taken = !!log?.taken;
      
      return {
        ...reminder,
        medication,
        taken
      };
    }).filter(Boolean);
  };
  
  // Get all medications with their reminders
  const getAllMedicationsWithReminders = () => {
    if (!medications || !reminders) return [];
    
    return medications.map(medication => {
      const medicationReminders = reminders.filter(r => r.medicationId === medication.id);
      
      return {
        ...medication,
        reminders: medicationReminders
      };
    });
  };
  
  const handleTakeMedication = (reminderId: number, scheduled: string) => {
    takeMedicationMutation.mutate({
      reminderId,
      scheduled,
      taken: true
    });
  };
  
  const handleFormSubmit = (data: any) => {
    // Convert days array to comma-separated string
    const daysString = data.days.join(',');
    
    // First create a new medication
    createMedicationMutation.mutate({
      name: data.medicationName,
      dosage: data.medicationDosage || "",
      quantity: data.medicationQuantity || "",
      instructions: data.notes || null
    }, {
      onSuccess: (newMedication) => {
        // Then create a reminder for this medication
        addReminderMutation.mutate({
          medicationId: newMedication.id,
          time: data.time,
          days: daysString,
          active: true,
          notifyBefore: parseInt(data.notifyBefore || "15")
        });
      }
    });
  };
  
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };
  
  const handleDeleteMedication = (medicationId: number) => {
    setMedicationToDelete(medicationId);
    setConfirmOpen(true);
  };
  
  const getMedicationName = (medicationId: number | null): string => {
    if (!medicationId || !medications) return "";
    const medication = medications.find(med => med.id === medicationId);
    return medication ? medication.name : "";
  };
  
  const confirmDelete = () => {
    if (medicationToDelete) {
      deleteMedicationMutation.mutate(medicationToDelete);
    }
    setConfirmOpen(false);
    setMedicationToDelete(null);
  };
  
  const cancelDelete = () => {
    setConfirmOpen(false);
    setMedicationToDelete(null);
  };
  
  // Handle opening the edit dialog for a medication
  const handleEditMedication = (medication: MedicationWithReminders) => {
    setSelectedMedication(medication);
    setEditModalOpen(true);
  };
  
  // Get default values for the edit form
  const getEditFormDefaultValues = (): EditReminderFormValues => {
    if (!selectedMedication || selectedMedication.reminders.length === 0) {
      return {
        time: "08:00",
        notifyBefore: "15", // Already a string as expected by the form
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      };
    }
    
    const reminder = selectedMedication.reminders[0];
    return {
      time: reminder.time,
      notifyBefore: String(reminder.notifyBefore || 15), // Convert to string for the form
      days: reminder.days ? reminder.days.split(',') : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    };
  };
  
  // Handle edit form submission
  const handleEditFormSubmit = (values: EditReminderFormValues) => {
    if (!selectedMedication) return;
    
    // Convert days array to comma-separated string
    const daysString = values.days.join(',');
    
    if (selectedMedication.reminders.length > 0) {
      // Update existing reminder
      const reminderId = selectedMedication.reminders[0].id;
      updateReminderMutation.mutate({
        id: reminderId,
        data: {
          time: values.time,
          days: daysString,
          notifyBefore: parseInt(values.notifyBefore),
          active: true
        }
      });
    } else {
      // Create new reminder for this medication
      addReminderMutation.mutate({
        medicationId: selectedMedication.id,
        time: values.time,
        days: daysString,
        active: true,
        notifyBefore: parseInt(values.notifyBefore)
      });
      setEditModalOpen(false);
    }
  };
  
  const todaysReminders = getTodaysReminders();
  const allMedications = getAllMedicationsWithReminders();
  
  if (medicationsLoading || remindersLoading || logsLoading) {
    return <div className="p-8 text-center dark:text-white">در حال بارگذاری اطلاعات یادآورها...</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">یادآورهای دارویی</h2>
      
      {/* Today's Schedule */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium dark:text-white">برنامه امروز</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{today}</span>
          </div>
          
          <div className="space-y-4">
            {todaysReminders.length > 0 ? (
              todaysReminders.map((reminder: any, index: number) => (
                <ReminderItem 
                  key={reminder.id}
                  reminder={reminder}
                  onTakeMedication={() => handleTakeMedication(reminder.id, reminder.time)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">برای امروز دارویی در برنامه نیست</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Settings */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BellRing className="h-5 w-5 text-primary dark:text-primary/90" />
          <h3 className="font-medium dark:text-white">اعلان‌ها</h3>
        </div>
        <NotificationManager />
      </div>
      
      {/* Create New Reminder */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4 dark:text-white">ایجاد یادآور جدید</h3>
          <ReminderForm 
            medications={medications || []} 
            onSubmit={handleFormSubmit}
            isPending={addReminderMutation.isPending}
          />
        </CardContent>
      </Card>
      
      {/* All Medications */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium dark:text-white">همه داروها</h3>
            <button 
              className="text-sm text-primary dark:text-primary/90 flex items-center gap-1"
              onClick={toggleEditMode}
            >
              {isEditMode ? (
                <>
                  <Check className="h-4 w-4" />
                  تمام
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  ویرایش لیست
                </>
              )}
            </button>
          </div>
          
          <ul className="divide-y divide-gray-200 dark:divide-slate-700">
            {allMedications.map((medication) => (
              <li key={medication.id} className="py-3">
                <div className="flex items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center mr-6 ${
                    medication.name === "Warfarin" 
                      ? "bg-blue-100 dark:bg-blue-900/50" 
                      : medication.name === "Metoprolol"
                        ? "bg-green-100 dark:bg-green-900/50"
                        : medication.name === "Vitamin D"
                          ? "bg-yellow-100 dark:bg-yellow-900/50"
                          : "bg-purple-100 dark:bg-purple-900/50"
                  }`}>
                    <svg 
                      className={`h-6 w-6 ${
                        medication.name === "Warfarin" 
                          ? "text-primary dark:text-primary/90" 
                          : medication.name === "Metoprolol"
                            ? "text-secondary dark:text-secondary/90"
                            : medication.name === "Vitamin D"
                              ? "text-yellow-500 dark:text-yellow-400"
                              : "text-purple-500 dark:text-purple-400"
                      }`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      {/* Pill/Capsule shape */}
                      <path d="M8,8 L16,16 A5.657,5.657 0 0 0 16,8 A5.657,5.657 0 0 0 8,8 A5.657,5.657 0 0 0 8,16 A5.657,5.657 0 0 0 16,16" />
                      
                      {/* Central line dividing the pill */}
                      <line x1="12" y1="10" x2="12" y2="14" transform="rotate(45, 12, 12)" strokeDasharray="1 0.5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium dark:text-white text-lg">{medication.name}</p>
                    <div className="flex text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <p>
                        {medication.dosage} - 
                        {medication.reminders.length > 0 
                          ? ` روزانه در ساعت ${medication.reminders[0].time}`
                          : " یادآوری تنظیم نشده است"}
                      </p>
                    </div>
                  </div>
                  {isEditMode ? (
                    <button 
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2" 
                      onClick={() => handleDeleteMedication(medication.id)}
                      disabled={deleteMedicationMutation.isPending}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  ) : (
                    <button 
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 p-2"
                      onClick={() => handleEditMedication(medication as MedicationWithReminders)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">حذف {getMedicationName(medicationToDelete)}</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              این عملیات <strong className="dark:text-white">{getMedicationName(medicationToDelete)}</strong> و تمامی یادآورهای مرتبط با آن را به طور دائمی حذف خواهد کرد.
              این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">انصراف</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
              disabled={deleteMedicationMutation.isPending}
            >
              {deleteMedicationMutation.isPending ? "در حال حذف..." : "حذف دارو"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Medication Reminder Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">ویرایش یادآور {selectedMedication?.name}</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              زمان و تناوب مصرف این دارو را به‌روزرسانی کنید
            </DialogDescription>
          </DialogHeader>
          
          <EditReminderForm 
            selectedMedication={selectedMedication}
            handleEditFormSubmit={handleEditFormSubmit}
            getEditFormDefaultValues={getEditFormDefaultValues}
            onClose={() => setEditModalOpen(false)}
            isPending={updateReminderMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}