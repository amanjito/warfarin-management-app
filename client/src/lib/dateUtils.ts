import { format, formatDistanceToNow, parseISO, isToday, isYesterday, isTomorrow } from 'date-fns';
import jalaali from 'jalaali-js';

// Persian month names
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Convert to Persian (Shamsi) date
export function toPersianDate(date: Date | string | number): { jy: number; jm: number; jd: number } {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  return jalaali.toJalaali(dateObj);
}

// Format date for display
export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : (date instanceof Date ? date : new Date(date));
  
  if (isToday(dateObj)) {
    return 'امروز';
  } else if (isYesterday(dateObj)) {
    return 'دیروز';
  } else if (isTomorrow(dateObj)) {
    return 'فردا';
  }
  
  // Convert to Persian calendar
  const persianDate = toPersianDate(dateObj);
  
  // Convert to Persian digits
  const persianDay = convertToPersianDigits(persianDate.jd.toString());
  const persianYear = convertToPersianDigits(persianDate.jy.toString());
  
  return `${persianDay} ${persianMonths[persianDate.jm - 1]} ${persianYear}`;
}

// Format time for display
export function formatTime(timeString: string): string {
  // Expected format: "HH:MM" in 24-hour format (e.g. "14:30")
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  // Persian time format with Persian numbers and AM/PM
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'بعد از ظهر' : 'قبل از ظهر';
  
  // Convert to Persian digits
  const persianHour = convertToPersianDigits(hour12.toString());
  const persianMinutes = convertToPersianDigits(minutes.toString().padStart(2, '0'));
  
  return `${persianHour}:${persianMinutes} ${ampm}`;
}

// Convert western digits to Persian digits
export function convertToPersianDigits(text: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return text.replace(/[0-9]/g, match => persianDigits[parseInt(match)]);
}

// Format date for API requests
export function formatDateForApi(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

// Get relative time in Persian (e.g. "۲ ساعت پیش")
export function getRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
  
  // Replace English numbers with Persian numbers
  let persianRelativeTime = relativeTime;
  
  // Map for English to Persian time terms
  const timeTerms: Record<string, string> = {
    'less than a minute ago': 'کمتر از یک دقیقه پیش',
    'about 1 minute ago': 'حدود ۱ دقیقه پیش',
    'minutes ago': 'دقیقه پیش',
    'about 1 hour ago': 'حدود ۱ ساعت پیش',
    'hours ago': 'ساعت پیش',
    'about 1 day ago': 'حدود ۱ روز پیش',
    'days ago': 'روز پیش',
    'about 1 month ago': 'حدود ۱ ماه پیش',
    'months ago': 'ماه پیش',
    'about 1 year ago': 'حدود ۱ سال پیش',
    'years ago': 'سال پیش',
    'in less than a minute': 'کمتر از یک دقیقه دیگر',
    'in about 1 minute': 'حدود ۱ دقیقه دیگر',
    'in minutes': 'دقیقه دیگر',
    'in about 1 hour': 'حدود ۱ ساعت دیگر',
    'in hours': 'ساعت دیگر',
    'in about 1 day': 'حدود ۱ روز دیگر',
    'in days': 'روز دیگر',
    'in about 1 month': 'حدود ۱ ماه دیگر',
    'in months': 'ماه دیگر',
    'in about 1 year': 'حدود ۱ سال دیگر',
    'in years': 'سال دیگر'
  };
  
  // Replace English terms with Persian terms
  Object.keys(timeTerms).forEach(term => {
    if (relativeTime.includes(term)) {
      persianRelativeTime = relativeTime.replace(term, timeTerms[term]);
    }
  });
  
  // Extract numbers and convert to Persian
  return persianRelativeTime.replace(/\d+/g, match => convertToPersianDigits(match));
}

// Get day of week abbreviation in Persian
export function getDayAbbreviation(day: number): string {
  // Persian day abbreviations
  const persianDays = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];
  return persianDays[day];
}

// Get full day name in Persian
export function getPersianDayName(day: number): string {
  // Full Persian day names
  const persianDayNames = [
    'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
  ];
  return persianDayNames[day];
}

// Check if a date is in the past
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj < today;
}

// Check if a time is in the past on the current day
export function isPastTime(timeString: string): boolean {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const timeToCheck = new Date();
  timeToCheck.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  
  return timeToCheck < now;
}

// Format date as short Persian date (for charts)
export function formatPersianShortDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : (date instanceof Date ? date : new Date(date));
  
  // Convert to Persian calendar
  const persianDate = toPersianDate(dateObj);
  
  // Convert to Persian digits
  const persianDay = convertToPersianDigits(persianDate.jd.toString());
  
  // Use abbreviated month name
  const persianMonthAbbrev = persianMonths[persianDate.jm - 1].substring(0, 3);
  
  return `${persianMonthAbbrev} ${persianDay}`;
}
