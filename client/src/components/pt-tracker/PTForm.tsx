import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForApi, formatDate, convertToPersianDigits } from "@/lib/dateUtils";
import jalaali from 'jalaali-js';
import { Calendar, DayValue } from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { motion } from "framer-motion";

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

interface PTFormProps {
  onSubmit: (data: FormData) => void;
  isPending: boolean;
}

export default function PTForm({ onSubmit, isPending }: PTFormProps) {
  // Get current date in Jalali format
  const today = new Date();
  const jalaliToday = jalaali.toJalaali(today);
  
  const [selectedDay, setSelectedDay] = useState<DayValue>({
    year: jalaliToday.jy,
    month: jalaliToday.jm,
    day: jalaliToday.jd
  });
  
  // Format Jalali date to string for display
  const formatJalaliDate = (date: DayValue | null): string => {
    if (!date) return "";
    
    const persianDay = convertToPersianDigits(date.day.toString());
    const persianMonth = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                         'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'][date.month - 1];
    const persianYear = convertToPersianDigits(date.year.toString());
    
    return `${persianDay} ${persianMonth} ${persianYear}`;
  };
  
  // Convert Jalali to Gregorian for API
  const jalaliToGregorian = (jalaliDate: DayValue): string => {
    if (!jalaliDate) return formatDateForApi(new Date());
    
    const gregorian = jalaali.toGregorian(jalaliDate.year, jalaliDate.month, jalaliDate.day);
    return formatDateForApi(new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd));
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testDate: formatDateForApi(today),
      inrValue: "",
      notes: ""
    }
  });
  
  // Update form when date changes
  const handleDateChange = (date: DayValue) => {
    setSelectedDay(date);
    if (date) {
      form.setValue('testDate', jalaliToGregorian(date));
    }
  };
  
  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    
    // Reset form fields except for date
    form.reset({
      testDate: jalaliToGregorian(selectedDay || {
        year: jalaliToday.jy,
        month: jalaliToday.jm,
        day: jalaliToday.jd
      }),
      inrValue: "",
      notes: ""
    });
  };
  
  // Custom calendar rendering
  const renderCustomInput = ({ ref }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        ref={ref}
        variant="outline"
        type="button"
        className="w-full text-right justify-between font-normal border-2 border-primary/20 hover:border-primary/40 bg-white"
      >
        <div className="flex items-center">
          <svg 
            className="h-5 w-5 ml-2 text-primary" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          {selectedDay ? formatJalaliDate(selectedDay) : "تاریخ را انتخاب کنید"}
        </div>
      </Button>
    </motion.div>
  );
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="testDate"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>تاریخ آزمایش</FormLabel>
                <FormControl>
                  <div className="pt-1">
                    {/* @ts-ignore */}
                    <Calendar
                      value={selectedDay}
                      onChange={handleDateChange}
                      renderInput={renderCustomInput}
                      shouldHighlightWeekends
                      locale="fa"
                      calendarClassName="responsive-calendar"
                      calendarSelectedDayClassName="selected-day"
                      colorPrimary="#ff3366"
                      maximumDate={{
                        year: jalaliToday.jy,
                        month: jalaliToday.jm,
                        day: jalaliToday.jd
                      }}
                    />
                  </div>
                </FormControl>
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
                    className="text-center border-2 border-primary/20 focus:border-primary"
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
                  className="resize-none text-right border-2 border-primary/20 focus:border-primary" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-start">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {isPending ? "در حال ذخیره..." : "ذخیره آزمایش"}
            </Button>
          </motion.div>
        </div>
      </form>

      {/* @ts-ignore */}
      <style jsx="true" global="true">{`
        .responsive-calendar {
          /* تنظیمات اصلی تقویم */
          font-family: 'Vazirmatn', sans-serif !important;
          width: 100% !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          padding: 16px !important;
          direction: rtl !important;
        }
        
        .Calendar__day {
          /* روزهای تقویم */
          color: #333 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          border-radius: 50% !important;
        }
        
        .Calendar__day:hover {
          /* حالت هاور روی روزها */
          background-color: rgba(255, 51, 102, 0.1) !important;
          color: #ff3366 !important;
        }
        
        .Calendar__day.-selected {
          /* روز انتخاب شده */
          background-color: #ff3366 !important;
          color: white !important;
          font-weight: bold !important;
          transform: scale(1.1) !important;
          box-shadow: 0 2px 10px rgba(255, 51, 102, 0.5) !important;
        }
        
        .Calendar__weekDays {
          /* روزهای هفته */
          color: #666 !important;
          font-weight: bold !important;
          font-size: 14px !important;
          margin-bottom: 8px !important;
        }
        
        .Calendar__header {
          /* هدر تقویم */
          padding: 10px 0 !important;
          margin-bottom: 10px !important;
        }
        
        .Calendar__monthArrowWrapper {
          /* دکمه‌های ماه قبل و بعد */
          background-color: rgba(255, 51, 102, 0.1) !important;
          border-radius: 50% !important;
          padding: 6px !important;
          transition: all 0.2s !important;
        }
        
        .Calendar__monthArrowWrapper:hover {
          background-color: rgba(255, 51, 102, 0.2) !important;
        }
        
        .Calendar__monthYear {
          /* نام ماه و سال */
          font-weight: bold !important;
          font-size: 16px !important;
          color: #333 !important;
        }
        
        /* حالت غیرفعال برای روزهای خارج از محدوده */
        .Calendar__day.-disabled {
          color: #ccc !important;
          cursor: not-allowed !important;
        }
      `}</style>
    </Form>
  );
}
