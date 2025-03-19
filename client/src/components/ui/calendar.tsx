
import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import jalaali from 'jalaali-js'
import { convertToPersianDigits, toGregorianDate } from "@/lib/dateUtils"

// نام‌های ماه‌های شمسی
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// روزهای هفته در ایران به ترتیب از شنبه تا جمعه
const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

interface PersianCalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  mode?: "single" | "range" | "multiple";
}

export function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  mode = "single",
}: PersianCalendarProps) {
  // ماه و سال فعلی به شمسی
  const today = new Date();
  const todayJalaali = jalaali.toJalaali(today);
  
  const [currentMonth, setCurrentMonth] = useState(todayJalaali.jm);
  const [currentYear, setCurrentYear] = useState(todayJalaali.jy);
  const [selectedDay, setSelectedDay] = useState<{ year: number, month: number, day: number } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // اگر یک تاریخ از قبل انتخاب شده باشد، آن را تنظیم می‌کنیم
  useEffect(() => {
    if (selected) {
      const jDate = jalaali.toJalaali(selected);
      setSelectedDay({ year: jDate.jy, month: jDate.jm, day: jDate.jd });
      setCurrentMonth(jDate.jm);
      setCurrentYear(jDate.jy);
    }
  }, [selected]);

  // تعداد روزهای ماه شمسی را محاسبه می‌کند
  const getDaysInMonth = (year: number, month: number) => {
    return jalaali.jalaaliMonthLength(year, month);
  };

  // روز اول ماه شمسی چه روزی از هفته است (شنبه = 0، جمعه = 6)
  const getFirstDayOfMonth = (year: number, month: number) => {
    // تبدیل تاریخ شمسی به میلادی برای محاسبه روز هفته
    const gDate = jalaali.toGregorian(year, month, 1);
    const date = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
    
    // تنظیم شنبه به عنوان روز اول هفته (0)
    let dayOfWeek = date.getDay() - 6;
    if (dayOfWeek < 0) dayOfWeek += 7;
    
    return dayOfWeek;
  };

  // ماه قبل
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // ماه بعد
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // انتخاب روز
  const handleDayClick = (day: number) => {
    const newSelectedDay = { year: currentYear, month: currentMonth, day };
    setSelectedDay(newSelectedDay);
    
    // تبدیل به تاریخ میلادی برای برگرداندن به کامپوننت والد
    if (onSelect) {
      console.log("انتخاب شده شمسی:", currentYear, currentMonth, day);
      
      // تبدیل مستقیم با تابع jalaali
      const gDate = jalaali.toGregorian(currentYear, currentMonth, day);
      console.log("تبدیل شده به میلادی توسط jalaali:", gDate);
      
      // ایجاد تاریخ میلادی - با تنظیم ساعت به 12 ظهر برای جلوگیری از مشکلات منطقه زمانی
      const gregorianDate = new Date(gDate.gy, gDate.gm - 1, gDate.gd, 12, 0, 0);
      console.log("تاریخ میلادی نهایی:", gregorianDate);
      
      onSelect(gregorianDate);
    }
  };

  // آیا روز امروز است؟
  const isToday = (day: number) => {
    return (
      day === todayJalaali.jd &&
      currentMonth === todayJalaali.jm &&
      currentYear === todayJalaali.jy
    );
  };

  // آیا روز انتخاب شده است؟
  const isSelected = (day: number) => {
    return (
      selectedDay?.day === day &&
      selectedDay?.month === currentMonth &&
      selectedDay?.year === currentYear
    );
  };

  // آیا روز غیرفعال است؟
  const isDisabledDay = (day: number) => {
    if (disabled) {
      const date = toGregorianDate(currentYear, currentMonth, day);
      return disabled(date);
    }
    return false;
  };

  // ایجاد روزهای خالی قبل از شروع ماه
  const createEmptyDays = () => {
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    return Array.from({ length: firstDayOfMonth }, (_, i) => (
      <div key={`empty-${i}`} className="h-9 w-9 p-0" />
    ));
  };

  // ایجاد روزهای ماه
  const createDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isDisabled = isDisabledDay(day);
      
      return (
        <button
          key={`day-${day}`}
          onClick={() => !isDisabled && handleDayClick(day)}
          disabled={isDisabled}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            isToday(day) && !isSelected(day) && "bg-accent text-accent-foreground",
            isDisabled && "text-muted-foreground opacity-50",
          )}
        >
          {convertToPersianDigits(day.toString())}
        </button>
      );
    });
  };

  return (
    <div ref={calendarRef} className={cn("p-3", className)} dir="rtl">
      <div className="flex justify-center pt-1 relative items-center">
        <button
          onClick={goToPreviousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {persianMonths[currentMonth - 1]} {convertToPersianDigits(currentYear.toString())}
        </div>
        <button
          onClick={goToNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mt-4">
        <div className="flex w-full">
          {persianWeekDays.map((day, index) => (
            <div key={index} className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap">
          {createEmptyDays()}
          {createDays()}
        </div>
      </div>
    </div>
  );
}

Calendar.displayName = "PersianCalendar";
