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
    message: "زمان باید در قالب HH:MM (24 ساعته) باشد",
  }),
  notifyBefore: z.string(), // Keep as string to avoid type errors
  days: z.array(z.string()).min(1, {
    message: "حداقل یک روز را انتخاب کنید",
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
              <FormLabel>زمان</FormLabel>
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
              <FormLabel>زمان اطلاع‌رسانی</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="زمان اطلاع‌رسانی را انتخاب کنید" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">۵ دقیقه قبل</SelectItem>
                  <SelectItem value="10">۱۰ دقیقه قبل</SelectItem>
                  <SelectItem value="15">۱۵ دقیقه قبل</SelectItem>
                  <SelectItem value="30">۳۰ دقیقه قبل</SelectItem>
                  <SelectItem value="60">۱ ساعت قبل</SelectItem>
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
              <FormLabel>روزها</FormLabel>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "Mon", label: "دو" },
                  { key: "Tue", label: "سه" },
                  { key: "Wed", label: "چه" },
                  { key: "Thu", label: "پن" },
                  { key: "Fri", label: "جم" },
                  { key: "Sat", label: "شن" },
                  { key: "Sun", label: "یک" }
                ].map((day) => (
                  <Button
                    key={day.key}
                    type="button"
                    variant={field.value.includes(day.key) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const updatedDays = field.value.includes(day.key)
                        ? field.value.filter((d: string) => d !== day.key)
                        : [...field.value, day.key];
                      field.onChange(updatedDays);
                    }}
                  >
                    {day.label}
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
            انصراف
          </Button>
          <Button 
            type="submit"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}