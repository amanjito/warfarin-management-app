import { 
  User, InsertUser, 
  PtTest, InsertPtTest, 
  Medication, InsertMedication, 
  Reminder, InsertReminder,
  MedicationLog, InsertMedicationLog,
  AssistantMessage, InsertAssistantMessage,
  PushSubscription, InsertPushSubscription
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // PT test operations
  getPtTests(userId: number): Promise<PtTest[]>;
  getPtTest(id: number): Promise<PtTest | undefined>;
  createPtTest(test: InsertPtTest): Promise<PtTest>;
  
  // Medication operations
  getMedications(userId: number): Promise<Medication[]>;
  getMedication(id: number): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication>;
  deleteMedication(id: number): Promise<boolean>;
  
  // Reminder operations
  getReminders(userId: number): Promise<Reminder[]>;
  getReminder(id: number): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder>;
  deleteReminder(id: number): Promise<boolean>;
  
  // Medication log operations
  getMedicationLogs(userId: number): Promise<MedicationLog[]>;
  createMedicationLog(log: InsertMedicationLog): Promise<MedicationLog>;
  getMedicationLogsByDate(userId: number, date: string): Promise<MedicationLog[]>;
  
  // Assistant message operations
  getAssistantMessages(userId: number): Promise<AssistantMessage[]>;
  createAssistantMessage(message: InsertAssistantMessage): Promise<AssistantMessage>;
  
  // Push notification operations
  getPushSubscriptions(userId: number): Promise<PushSubscription[]>;
  getPushSubscription(id: number): Promise<PushSubscription | undefined>;
  getPushSubscriptionByEndpoint(endpoint: string): Promise<PushSubscription | undefined>;
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  deletePushSubscription(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ptTests: Map<number, PtTest>;
  private medications: Map<number, Medication>;
  private reminders: Map<number, Reminder>;
  private medicationLogs: Map<number, MedicationLog>;
  private assistantMessages: Map<number, AssistantMessage>;
  private pushSubscriptions: Map<number, PushSubscription>;
  
  private userId: number;
  private ptTestId: number;
  private medicationId: number;
  private reminderId: number;
  private medicationLogId: number;
  private assistantMessageId: number;
  private pushSubscriptionId: number;
  
  constructor() {
    this.users = new Map();
    this.ptTests = new Map();
    this.medications = new Map();
    this.reminders = new Map();
    this.medicationLogs = new Map();
    this.assistantMessages = new Map();
    this.pushSubscriptions = new Map();
    
    this.userId = 1;
    this.ptTestId = 1;
    this.medicationId = 1;
    this.reminderId = 1;
    this.medicationLogId = 1;
    this.assistantMessageId = 1;
    this.pushSubscriptionId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Create a sample user
    const user: User = {
      id: 1,
      username: "sarah",
      password: "password123",
      name: "Sarah Johnson",
      firstName: "Sarah",
      lastName: "Johnson",
      gender: "female",
      birthDate: new Date("1985-06-15"),
      targetInrMin: 2.0,
      targetInrMax: 3.0,
    };
    this.users.set(user.id, user);
    
    // Create sample PT tests
    const ptTestDates = [
      "2023-03-02", "2023-03-16", "2023-03-30", 
      "2023-04-14", "2023-04-28", "2023-05-12"
    ];
    const ptTestValues = [2.5, 2.8, 3.2, 1.8, 2.1, 2.4];
    const ptTestNotes = [
      "Regular test", 
      "Within range", 
      "Slightly above range, doctor advised to adjust dosage", 
      "Below range after dose adjustment",
      "After dose increased to 5mg",
      "Regular test"
    ];
    
    for (let i = 0; i < ptTestDates.length; i++) {
      const test: PtTest = {
        id: i + 1,
        userId: user.id,
        testDate: new Date(ptTestDates[i]),
        inrValue: ptTestValues[i],
        notes: ptTestNotes[i],
        createdAt: new Date(),
      };
      this.ptTests.set(test.id, test);
      this.ptTestId = test.id + 1;
    }
    
    // Create sample medications
    const medications = [
      { name: "Warfarin", dosage: "5mg", quantity: "1 tablet", instructions: "Take in the evening" },
      { name: "Metoprolol", dosage: "25mg", quantity: "1 tablet", instructions: "Take in the morning" },
      { name: "Vitamin D", dosage: "1000IU", quantity: "1 tablet", instructions: "Take with food" },
      { name: "Simvastatin", dosage: "20mg", quantity: "1 tablet", instructions: "Take at bedtime" }
    ];
    
    medications.forEach((med, index) => {
      const medication: Medication = {
        id: index + 1,
        userId: user.id,
        name: med.name,
        dosage: med.dosage,
        quantity: med.quantity,
        instructions: med.instructions,
      };
      this.medications.set(medication.id, medication);
      this.medicationId = medication.id + 1;
    });
    
    // Create sample reminders
    const reminders = [
      { medicationId: 1, time: "20:00", days: "1,2,3,4,5,6,7" },  // Warfarin
      { medicationId: 2, time: "08:00", days: "1,2,3,4,5,6,7" },  // Metoprolol
      { medicationId: 3, time: "08:00", days: "1,2,3,4,5,6,7" },  // Vitamin D
      { medicationId: 4, time: "20:00", days: "1,2,3,4,5,6,7" }   // Simvastatin
    ];
    
    reminders.forEach((rem, index) => {
      const reminder: Reminder = {
        id: index + 1,
        userId: user.id,
        medicationId: rem.medicationId,
        time: rem.time,
        days: rem.days,
        active: true,
        notifyBefore: 15,
      };
      this.reminders.set(reminder.id, reminder);
      this.reminderId = reminder.id + 1;
    });
    
    // Create sample medication logs (today's medications)
    const today = new Date().toISOString().split('T')[0];
    
    // Metoprolol and Vitamin D are taken (morning meds)
    [2, 3].forEach((remId, index) => {
      const log: MedicationLog = {
        id: index + 1,
        reminderId: remId,
        userId: user.id,
        takenAt: new Date(),
        scheduled: "08:00",
        taken: true,
      };
      this.medicationLogs.set(log.id, log);
      this.medicationLogId = log.id + 1;
    });
    
    // Sample assistant messages
    const assistantConversation = [
      { content: "Hello! I'm your Warfarin Assistant. I can answer questions about your medication, potential interactions, and help you understand your treatment. What would you like to know today?", isUser: false },
      { content: "What foods should I avoid while taking Warfarin?", isUser: true },
      { content: "Great question! While on Warfarin, it's important to maintain a consistent intake of vitamin K, as it can affect how well your medication works. Foods high in vitamin K that you should consume consistently (not necessarily avoid) include: green leafy vegetables (kale, spinach, collard greens), brussels sprouts, broccoli, cabbage, and green tea. Sudden changes in vitamin K intake can affect your INR levels. The key is consistency in your diet. Would you like more information about food interactions?", isUser: false },
      { content: "What should I do if I miss a dose?", isUser: true },
      { content: "If you miss a dose of Warfarin: take it as soon as you remember on the same day, if you don't remember until the next day, skip the missed dose, never take a double dose to make up for a missed dose, and if you miss more than one dose, contact your healthcare provider. Always keep track of any missed doses and inform your healthcare provider at your next appointment, as they may need to adjust your dosing schedule or monitor your INR more closely.", isUser: false }
    ];
    
    assistantConversation.forEach((msg, index) => {
      const message: AssistantMessage = {
        id: index + 1,
        userId: user.id,
        content: msg.content,
        isUser: msg.isUser,
        timestamp: new Date(Date.now() - (assistantConversation.length - index) * 60000),
      };
      this.assistantMessages.set(message.id, message);
      this.assistantMessageId = message.id + 1;
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // PT test methods
  async getPtTests(userId: number): Promise<PtTest[]> {
    return Array.from(this.ptTests.values())
      .filter(test => test.userId === userId)
      .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
  }
  
  async getPtTest(id: number): Promise<PtTest | undefined> {
    return this.ptTests.get(id);
  }
  
  async createPtTest(test: InsertPtTest): Promise<PtTest> {
    const id = this.ptTestId++;
    const newTest: PtTest = { 
      ...test, 
      id, 
      testDate: new Date(test.testDate),
      createdAt: new Date()
    };
    this.ptTests.set(id, newTest);
    return newTest;
  }
  
  // Medication methods
  async getMedications(userId: number): Promise<Medication[]> {
    return Array.from(this.medications.values())
      .filter(med => med.userId === userId);
  }
  
  async getMedication(id: number): Promise<Medication | undefined> {
    return this.medications.get(id);
  }
  
  async createMedication(medication: InsertMedication): Promise<Medication> {
    const id = this.medicationId++;
    const newMedication: Medication = { ...medication, id };
    this.medications.set(id, newMedication);
    return newMedication;
  }
  
  async updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication> {
    const existing = this.medications.get(id);
    if (!existing) {
      throw new Error("Medication not found");
    }
    
    const updated: Medication = { ...existing, ...medication };
    this.medications.set(id, updated);
    return updated;
  }
  
  async deleteMedication(id: number): Promise<boolean> {
    return this.medications.delete(id);
  }
  
  // Reminder methods
  async getReminders(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values())
      .filter(rem => rem.userId === userId);
  }
  
  async getReminder(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }
  
  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const id = this.reminderId++;
    const newReminder: Reminder = { ...reminder, id };
    this.reminders.set(id, newReminder);
    return newReminder;
  }
  
  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder> {
    const existing = this.reminders.get(id);
    if (!existing) {
      throw new Error("Reminder not found");
    }
    
    const updated: Reminder = { ...existing, ...reminder };
    this.reminders.set(id, updated);
    return updated;
  }
  
  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }
  
  // Medication log methods
  async getMedicationLogs(userId: number): Promise<MedicationLog[]> {
    return Array.from(this.medicationLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime());
  }
  
  async createMedicationLog(log: InsertMedicationLog): Promise<MedicationLog> {
    const id = this.medicationLogId++;
    const newLog: MedicationLog = { ...log, id, takenAt: new Date() };
    this.medicationLogs.set(id, newLog);
    return newLog;
  }
  
  async getMedicationLogsByDate(userId: number, date: string): Promise<MedicationLog[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return Array.from(this.medicationLogs.values())
      .filter(log => {
        const logDate = new Date(log.takenAt);
        return log.userId === userId && 
               logDate >= targetDate && 
               logDate < nextDay;
      });
  }
  
  // Assistant message methods
  async getAssistantMessages(userId: number): Promise<AssistantMessage[]> {
    return Array.from(this.assistantMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async createAssistantMessage(message: InsertAssistantMessage): Promise<AssistantMessage> {
    const id = this.assistantMessageId++;
    const newMessage: AssistantMessage = { 
      ...message, 
      id, 
      timestamp: new Date() 
    };
    this.assistantMessages.set(id, newMessage);
    return newMessage;
  }
  
  // Push subscription methods
  async getPushSubscriptions(userId: number): Promise<PushSubscription[]> {
    return Array.from(this.pushSubscriptions.values())
      .filter(sub => sub.userId === userId);
  }
  
  async getPushSubscription(id: number): Promise<PushSubscription | undefined> {
    return this.pushSubscriptions.get(id);
  }
  
  async getPushSubscriptionByEndpoint(endpoint: string): Promise<PushSubscription | undefined> {
    return Array.from(this.pushSubscriptions.values())
      .find(sub => sub.endpoint === endpoint);
  }
  
  async createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription> {
    const id = this.pushSubscriptionId++;
    const newSubscription: PushSubscription = {
      ...subscription,
      id,
      createdAt: new Date()
    };
    this.pushSubscriptions.set(id, newSubscription);
    return newSubscription;
  }
  
  async deletePushSubscription(id: number): Promise<boolean> {
    return this.pushSubscriptions.delete(id);
  }
}

export const storage = new MemStorage();
