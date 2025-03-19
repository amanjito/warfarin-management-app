import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { formatDateForApi, toPersianDate, convertToPersianDigits } from "@/lib/dateUtils";
import { PtTest } from "@shared/schema";

// Create a schema for form validation
const formSchema = z.object({
  testDate: z.string().nonempty({ message: "تاریخ آزمایش الزامی است" }),
  inrValue: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "مقدار INR باید یک عدد مثبت باشد" }
  ),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface EditPTFormProps {
  ptTest: PtTest | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: FormData) => void;
  isPending: boolean;
}

export default function EditPTForm({ ptTest, isOpen, onClose, onSubmit, isPending }: EditPTFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Convert Gregorian date to Persian date for display
  const formatPersianDate = (date: Date | null | undefined): string => {
    if (!date) return "";
    
    const persianDate = toPersianDate(date);
    const persianDay = convertToPersianDigits(persianDate.jd.toString());
    const persianMonth = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                          'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'][persianDate.jm - 1];
    const persianYear = convertToPersianDigits(persianDate.jy.toString());
    
    return `${persianDay} ${persianMonth} ${persianYear}`;
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testDate: "",
      inrValue: "",
      notes: ""
    }
  });
  
  // Update form values when ptTest changes
  useEffect(() => {
    if (ptTest) {
      const testDate = format(new Date(ptTest.testDate), "yyyy-MM-dd");
      setSelectedDate(new Date(ptTest.testDate));
      
      form.reset({
        testDate: testDate,
        inrValue: ptTest.inrValue.toString(),
        notes: ptTest.notes || ""
      });
    }
  }, [ptTest, form]);
  
  const handleSubmit = (data: FormData) => {
    if (ptTest) {
      onSubmit(ptTest.id, data);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-right">ویرایش آزمایش PT/INR</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="testDate"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel>تاریخ آزمایش</FormLabel>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full text-right justify-start font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? formatPersianDate(new Date(field.value)) : "تاریخ را انتخاب کنید"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date) {
                              setSelectedDate(date);
                              field.onChange(formatDateForApi(date));
                              setIsCalendarOpen(false);
                            }
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="inrValue"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel>مقدار INR</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        placeholder="مثال: ۲/۵" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>یادداشت‌ها</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="هر گونه توضیحات اضافی درباره این آزمایش" 
                      className="resize-none text-right" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="sm:justify-start">
              <Button type="submit" disabled={isPending}>
                {isPending ? "در حال بروزرسانی..." : "بروزرسانی آزمایش"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                انصراف
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}