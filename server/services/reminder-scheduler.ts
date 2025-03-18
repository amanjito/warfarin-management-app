import { storage } from '../storage';
import { sendNotificationToUser } from './push-service';
import { Reminder, Medication } from '@shared/schema';

// The time interval in milliseconds to check for reminders (1 minute)
const CHECK_INTERVAL = 60 * 1000;

let isRunning = false;

/**
 * Start the reminder scheduler
 */
export function startReminderScheduler() {
  if (isRunning) {
    return;
  }
  
  isRunning = true;
  console.log('Starting reminder scheduler');
  
  // Initial check
  checkReminders();
  
  // Set up recurring checks
  setInterval(checkReminders, CHECK_INTERVAL);
}

/**
 * Check for reminders that need to be sent
 */
async function checkReminders() {
  try {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay(); // 0-6, starting with Sunday
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayName = dayNames[currentDay];
    
    console.log(`Checking reminders at ${currentTime} on ${currentDayName}`);
    
    // Get all active reminders
    const allReminders = await getAllActiveReminders();
    
    for (const reminder of allReminders) {
      // Parse the days string to get an array of days
      const reminderDays = reminder.days ? reminder.days.split(',') : [];
      
      // Check if the reminder should be sent today
      if (reminderDays.includes(currentDayName) || reminderDays.includes('daily')) {
        // Check if the reminder time matches the current time
        if (isTimeMatch(reminder.time, currentTime, reminder.notifyBefore || 0)) {
          // Get the medication info for this reminder
          const medication = await getMedicationInfo(reminder.medicationId);
          
          if (medication) {
            // Send the notification
            await sendReminderNotification(reminder, medication);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

/**
 * Check if a reminder time matches the current time, accounting for the notifyBefore setting
 */
function isTimeMatch(reminderTime: string, currentTime: string, notifyBefore: number): boolean {
  const [reminderHours, reminderMinutes] = reminderTime.split(':').map(Number);
  const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
  
  // Convert both times to minutes since midnight
  const reminderTotalMinutes = reminderHours * 60 + reminderMinutes;
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  
  // Calculate the difference in minutes
  const minutesDifference = reminderTotalMinutes - currentTotalMinutes;
  
  // If the reminder is set to notify X minutes before, check if we're at that point
  return minutesDifference <= notifyBefore && minutesDifference >= 0;
}

/**
 * Get all active reminders from all users
 */
async function getAllActiveReminders(): Promise<Reminder[]> {
  try {
    // Get all users (in a real app, this would be more efficient)
    const users = await getAllUsers();
    
    // Collect reminders from all users
    const reminders: Reminder[] = [];
    
    for (const user of users) {
      const userReminders = await storage.getReminders(user.id);
      reminders.push(...userReminders.filter(reminder => reminder.active));
    }
    
    return reminders;
  } catch (error) {
    console.error('Error getting active reminders:', error);
    return [];
  }
}

/**
 * Get all users from the database
 */
async function getAllUsers() {
  // In this example we're just using a hardcoded user with ID 1
  return [{ id: 1, username: 'testuser' }];
}

/**
 * Get medication info for a reminder
 */
async function getMedicationInfo(medicationId: number): Promise<Medication | undefined> {
  try {
    return await storage.getMedication(medicationId);
  } catch (error) {
    console.error('Error getting medication info:', error);
    return undefined;
  }
}

/**
 * Send a reminder notification to a user
 */
async function sendReminderNotification(reminder: Reminder, medication: Medication) {
  try {
    const result = await sendNotificationToUser(reminder.userId, {
      title: `Time for ${medication.name}`,
      body: `It's time to take ${medication.dosage} of ${medication.name}`,
      url: '/reminders',
      data: {
        reminderId: reminder.id,
        medicationId: medication.id
      }
    });
    
    console.log(`Sent reminder notification for ${medication.name} to user ${reminder.userId}:`, result);
    
    return result;
  } catch (error) {
    console.error('Error sending reminder notification:', error);
    return {
      success: false,
      sent: 0,
      failed: 0
    };
  }
}