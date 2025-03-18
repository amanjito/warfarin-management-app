import { pgTable, text, serial, integer, boolean, timestamp, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  targetInrMin: real("target_inr_min").default(2.0),
  targetInrMax: real("target_inr_max").default(3.0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  targetInrMin: true,
  targetInrMax: true,
});

// PT test table
export const ptTests = pgTable("pt_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  testDate: date("test_date").notNull(),
  inrValue: real("inr_value").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPtTestSchema = createInsertSchema(ptTests).pick({
  userId: true,
  testDate: true,
  inrValue: true,
  notes: true,
});

// Medication table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  quantity: text("quantity").notNull(),
  instructions: text("instructions"),
});

export const insertMedicationSchema = createInsertSchema(medications).pick({
  userId: true,
  name: true,
  dosage: true,
  quantity: true,
  instructions: true,
});

// Medication reminder table
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  medicationId: integer("medication_id").notNull().references(() => medications.id),
  userId: integer("user_id").notNull().references(() => users.id),
  time: text("time").notNull(),
  days: text("days").notNull(), // comma-separated days (e.g., "1,2,3,4,5,6,7")
  active: boolean("active").default(true),
  notifyBefore: integer("notify_before").default(15), // minutes
});

export const insertReminderSchema = createInsertSchema(reminders).pick({
  medicationId: true,
  userId: true,
  time: true,
  days: true,
  active: true,
  notifyBefore: true,
});

// Medication log table
export const medicationLogs = pgTable("medication_logs", {
  id: serial("id").primaryKey(),
  reminderId: integer("reminder_id").notNull().references(() => reminders.id),
  userId: integer("user_id").notNull().references(() => users.id),
  takenAt: timestamp("taken_at").defaultNow(),
  scheduled: text("scheduled").notNull(),
  taken: boolean("taken").default(true),
});

export const insertMedicationLogSchema = createInsertSchema(medicationLogs).pick({
  reminderId: true,
  userId: true,
  scheduled: true,
  taken: true,
});

// Assistant messages table
export const assistantMessages = pgTable("assistant_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAssistantMessageSchema = createInsertSchema(assistantMessages).pick({
  userId: true,
  content: true,
  isUser: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PtTest = typeof ptTests.$inferSelect;
export type InsertPtTest = z.infer<typeof insertPtTestSchema>;

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

export type MedicationLog = typeof medicationLogs.$inferSelect;
export type InsertMedicationLog = z.infer<typeof insertMedicationLogSchema>;

export type AssistantMessage = typeof assistantMessages.$inferSelect;
export type InsertAssistantMessage = z.infer<typeof insertAssistantMessageSchema>;
