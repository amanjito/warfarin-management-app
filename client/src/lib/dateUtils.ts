import { format, formatDistanceToNow, parseISO, isToday, isYesterday, isTomorrow } from 'date-fns';

// Format date for display
export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }
  
  return format(dateObj, 'MMM dd, yyyy');
}

// Format time for display
export function formatTime(timeString: string): string {
  // Expected format: "HH:MM" in 24-hour format (e.g. "14:30")
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return format(date, 'h:mm a'); // Output: "2:30 PM"
}

// Format date for API requests
export function formatDateForApi(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

// Get relative time (e.g. "2 hours ago")
export function getRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Get day of week abbreviation (e.g. "Mon")
export function getDayAbbreviation(day: number): string {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days[day];
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
