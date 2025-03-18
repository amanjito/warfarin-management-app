import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Medication, Reminder } from "@shared/schema";

// Reusing the same schema from Reminders.tsx
const editReminderSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time must be in the format HH:MM (24-hour)",
  }),
  notifyBefore: z.string().transform(val => parseInt(val, 10)),
  days: z.array(z.string()).min(1, {
    message: "Select at least one day",
  }),
});

type EditReminderFormValues = z.infer<typeof editReminderSchema>;

// Type for medication with reminders
type MedicationWithReminders = Medication & { reminders: Reminder[] };

interface EditReminderFormProps {
  selectedMedication: MedicationWithReminders | null;
  getEditFormDefaultValues: () => EditReminderFormValues;
  handleEditFormSubmit: (values: EditReminderFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export default function EditReminderForm({
  selectedMedication,
  getEditFormDefaultValues,
  handleEditFormSubmit,
  onClose,
  isPending
}: EditReminderFormProps) {
  // If no medication is selected, don't render anything
  if (!selectedMedication) return null;
  
  const form = useForm<EditReminderFormValues>({
    resolver: zodResolver(editReminderSchema),
    defaultValues: getEditFormDefaultValues(),
    mode: "onChange"
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                  placeholder="08:00" 
                />
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
              <FormLabel>Notify Before</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select when to be notified" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days</FormLabel>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={field.value.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const updatedDays = field.value.includes(day)
                        ? field.value.filter((d: string) => d !== day)
                        : [...field.value, day];
                      field.onChange(updatedDays);
                    }}
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}