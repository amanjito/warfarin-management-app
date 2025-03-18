import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import ReminderForm from "@/components/reminders/ReminderForm";
import ReminderItem from "@/components/reminders/ReminderItem";
import { Medication, Reminder, MedicationLog } from "@shared/schema";
import { ChevronRight } from "lucide-react";

export default function Reminders() {
  const today = format(new Date(), "MMM dd, yyyy");
  
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
    
    addReminderMutation.mutate({
      medicationId: parseInt(data.medicationId),
      time: data.time,
      days: daysString,
      active: true,
      notifyBefore: parseInt(data.notifyBefore || "15")
    });
  };
  
  const todaysReminders = getTodaysReminders();
  const allMedications = getAllMedicationsWithReminders();
  
  if (medicationsLoading || remindersLoading || logsLoading) {
    return <div className="p-8 text-center">Loading reminders data...</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Medication Reminders</h2>
      
      {/* Today's Schedule */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Today's Schedule</h3>
            <span className="text-sm text-gray-500">{today}</span>
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
              <p className="text-center text-gray-500 py-4">No medications scheduled for today</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Create New Reminder */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Create New Reminder</h3>
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
            <h3 className="font-medium">All Medications</h3>
            <button className="text-sm text-primary">Edit List</button>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {allMedications.map((medication) => (
              <li key={medication.id} className="py-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    medication.name === "Warfarin" 
                      ? "bg-blue-100" 
                      : medication.name === "Metoprolol"
                        ? "bg-green-100"
                        : medication.name === "Vitamin D"
                          ? "bg-yellow-100"
                          : "bg-purple-100"
                  }`}>
                    <svg 
                      className={`h-5 w-5 ${
                        medication.name === "Warfarin" 
                          ? "text-primary" 
                          : medication.name === "Metoprolol"
                            ? "text-secondary"
                            : medication.name === "Vitamin D"
                              ? "text-yellow-500"
                              : "text-purple-500"
                      }`} 
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
                    <p className="font-medium">{medication.name}</p>
                    <div className="flex text-sm text-gray-500">
                      <p>
                        {medication.dosage} - 
                        {medication.reminders.length > 0 
                          ? ` Daily at ${medication.reminders[0].time}`
                          : " No reminders set"}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-500">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
