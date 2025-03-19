import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Medication } from "@shared/schema";
import { Toggle } from "@/components/ui/toggle";

// Create a schema for form validation
const formSchema = z.object({
  medicationId: z.string().nonempty({ message: "انتخاب دارو الزامی است" }),
  time: z.string().nonempty({ message: "زمان مصرف الزامی است" }),
  days: z.array(z.string()).min(1, { message: "حداقل یک روز هفته باید انتخاب شود" }),
  notifyBefore: z.string().optional(),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface ReminderFormProps {
  medications: Medication[];
  onSubmit: (data: FormData) => void;
  isPending: boolean;
}

export default function ReminderForm({ medications, onSubmit, isPending }: ReminderFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(["1", "2", "3", "4", "5", "6", "7"]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicationId: "",
      time: "",
      days: selectedDays,
      notifyBefore: "15",
      notes: ""
    }
  });
  
  const toggleDay = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        const newDays = prev.filter(d => d !== day);
        form.setValue("days", newDays);
        return newDays;
      } else {
        const newDays = [...prev, day];
        form.setValue("days", newDays);
        return newDays;
      }
    });
  };
  
  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    
    // Reset form
    form.reset({
      medicationId: "",
      time: "",
      days: ["1", "2", "3", "4", "5", "6", "7"],
      notifyBefore: "15",
      notes: ""
    });
    setSelectedDays(["1", "2", "3", "4", "5", "6", "7"]);
  };
  
  const days = [
    { value: "7", label: "ی" },
    { value: "1", label: "د" },
    { value: "2", label: "س" },
    { value: "3", label: "چ" },
    { value: "4", label: "پ" },
    { value: "5", label: "ج" },
    { value: "6", label: "ش" }
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="medicationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {medications.map(medication => (
                    <SelectItem key={medication.id} value={medication.id.toString()}>
                      {medication.name} ({medication.dosage})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notifyBefore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder Notification</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="0">At time of dose</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days of Week</FormLabel>
              <div className="flex space-x-2">
                {days.map(day => (
                  <Toggle
                    key={day.value}
                    pressed={selectedDays.includes(day.value)}
                    onPressedChange={() => toggleDay(day.value)}
                    variant="outline"
                    className="w-8 h-8 p-0 data-[state=on]:bg-primary data-[state=on]:text-white border-primary text-primary"
                  >
                    {day.label}
                  </Toggle>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional information (e.g., take with food)" 
                  className="resize-none" 
                  rows={2}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Reminder"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
