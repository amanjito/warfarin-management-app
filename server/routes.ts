import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPtTestSchema, 
  insertMedicationSchema, 
  insertReminderSchema, 
  insertMedicationLogSchema,
  insertAssistantMessageSchema,
  insertPushSubscriptionSchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";
import { getVapidPublicKey, saveSubscription, sendNotificationToUser } from "./services/push-service";

// Create OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-demo", // Use environment variable or default to demo key
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // User Routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password to the client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Get the current user
  app.get("/api/users/current", async (req, res) => {
    // In a real app, you'd get userId from the session/auth
    const userId = 1;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password to the client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Update user profile
  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      // In a real app, verify user has permission to edit this profile
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't allow changing username or password via this endpoint
      const { username, password, id: userId, ...updateData } = req.body;
      
      // Update the user in storage
      // Note: In a real implementation with TypeScript strict null checking,
      // we would need proper null handling here
      const updatedUser = {
        ...user,
        ...updateData,
      };
      
      // Save the updated user
      // Note: We're simulating an update since MemStorage doesn't have a dedicated update method
      const savedUser = await storage.createUser(updatedUser);
      
      // Don't send the password back to the client
      const { password: _, ...userWithoutPassword } = savedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update user" });
      }
    }
  });
  
  // Submit medical history form after registration
  app.post("/api/users/:id/medical-history", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      // In a real app, verify user has permission to edit this profile
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update the medical history fields
      const updatedUser = {
        ...user,
        ...req.body,
        hasCompletedSetup: true // Mark setup as complete
      };
      
      // Save the updated user
      const savedUser = await storage.createUser(updatedUser);
      
      // Don't send the password back to the client
      const { password: _, ...userWithoutPassword } = savedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating medical history:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update medical history" });
      }
    }
  });

  // PT Tests Routes
  app.get("/api/pt-tests", async (req, res) => {
    // In a real app, you'd get userId from the session/auth
    const userId = 1;
    const tests = await storage.getPtTests(userId);
    res.json(tests);
  });

  app.post("/api/pt-tests", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const testData = insertPtTestSchema.parse({ ...req.body, userId });
      
      const newTest = await storage.createPtTest(testData);
      res.status(201).json(newTest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create PT test" });
      }
    }
  });

  app.get("/api/pt-tests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const test = await storage.getPtTest(id);
    if (!test) {
      return res.status(404).json({ message: "PT Test not found" });
    }
    
    res.json(test);
  });

  // Medications Routes
  app.get("/api/medications", async (req, res) => {
    const userId = 1; // In a real app, get from session/auth
    const medications = await storage.getMedications(userId);
    res.json(medications);
  });

  app.post("/api/medications", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const medicationData = insertMedicationSchema.parse({ ...req.body, userId });
      
      const newMedication = await storage.createMedication(medicationData);
      res.status(201).json(newMedication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create medication" });
      }
    }
  });

  app.put("/api/medications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      // We don't allow changing the userId
      const { userId, ...updateData } = req.body;
      
      const updated = await storage.updateMedication(id, updateData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update medication" });
      }
    }
  });

  app.delete("/api/medications/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const result = await storage.deleteMedication(id);
    if (!result) {
      return res.status(404).json({ message: "Medication not found" });
    }
    
    res.status(204).end();
  });

  // Reminders Routes
  app.get("/api/reminders", async (req, res) => {
    const userId = 1; // In a real app, get from session/auth
    const reminders = await storage.getReminders(userId);
    res.json(reminders);
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const reminderData = insertReminderSchema.parse({ ...req.body, userId });
      
      const newReminder = await storage.createReminder(reminderData);
      res.status(201).json(newReminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create reminder" });
      }
    }
  });

  app.put("/api/reminders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      // We don't allow changing the userId
      const { userId, ...updateData } = req.body;
      
      const updated = await storage.updateReminder(id, updateData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update reminder" });
      }
    }
  });

  app.delete("/api/reminders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const result = await storage.deleteReminder(id);
    if (!result) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    
    res.status(204).end();
  });

  // Medication Logs Routes
  app.get("/api/medication-logs", async (req, res) => {
    const userId = 1; // In a real app, get from session/auth
    const date = req.query.date as string;
    
    if (date) {
      const logs = await storage.getMedicationLogsByDate(userId, date);
      return res.json(logs);
    }
    
    const logs = await storage.getMedicationLogs(userId);
    res.json(logs);
  });

  app.post("/api/medication-logs", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const logData = insertMedicationLogSchema.parse({ ...req.body, userId });
      
      const newLog = await storage.createMedicationLog(logData);
      res.status(201).json(newLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create medication log" });
      }
    }
  });

  // Assistant Messages Routes
  app.get("/api/assistant-messages", async (req, res) => {
    const userId = 1; // In a real app, get from session/auth
    const messages = await storage.getAssistantMessages(userId);
    res.json(messages);
  });

  app.post("/api/assistant-messages", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const { content } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Content is required" });
      }
      
      // Store the user message
      const userMessageData = insertAssistantMessageSchema.parse({
        userId,
        content,
        isUser: true
      });
      
      await storage.createAssistantMessage(userMessageData);
      
      // Get all previous messages for context
      const previousMessages = await storage.getAssistantMessages(userId);
      
      // Format messages for OpenAI
      const formattedMessages = previousMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      }));
      
      // Add system message for context
      formattedMessages.unshift({
        role: "system",
        content: `You are a helpful medical assistant specializing in Warfarin medication information. 
        Provide accurate information about Warfarin, its usage, side effects, interactions, and general 
        anticoagulant therapy guidance. Keep responses concise but informative.
        DO NOT provide any personalized medical advice or dosing recommendations.
        Always suggest consulting healthcare providers for specific medical questions.`
      });
      
      // Call OpenAI API
      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: formattedMessages as any,
          max_tokens: 500,
        });
        
        const assistantResponse = response.choices[0].message.content;
        
        // Store the assistant's response
        const assistantMessageData = insertAssistantMessageSchema.parse({
          userId,
          content: assistantResponse,
          isUser: false
        });
        
        const savedAssistantMessage = await storage.createAssistantMessage(assistantMessageData);
        
        res.status(201).json(savedAssistantMessage);
      } catch (apiError) {
        console.error("OpenAI API error:", apiError);
        
        // Create a fallback response
        const fallbackMessage = insertAssistantMessageSchema.parse({
          userId,
          content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later or contact your healthcare provider for immediate assistance.",
          isUser: false
        });
        
        const savedFallbackMessage = await storage.createAssistantMessage(fallbackMessage);
        res.status(201).json(savedFallbackMessage);
      }
    } catch (error) {
      console.error("Error processing assistant message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to process message" });
      }
    }
  });

  // Push Notification Routes
  app.get("/api/push/vapid-public-key", (req, res) => {
    res.json({ publicKey: getVapidPublicKey() });
  });

  app.post("/api/push/register", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const subscription = req.body;
      
      if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({ message: "Invalid subscription object" });
      }
      
      const savedSubscription = await saveSubscription(userId, subscription);
      res.status(201).json(savedSubscription);
    } catch (error) {
      console.error("Error registering push subscription:", error);
      res.status(500).json({ message: "Failed to register push subscription" });
    }
  });

  app.post("/api/push/send-test", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      
      const result = await sendNotificationToUser(userId, {
        title: "Test Notification",
        body: "This is a test notification from your Warfarin Manager app!",
      });
      
      if (result.sent > 0) {
        res.json({ success: true, message: `Sent notifications to ${result.sent} devices` });
      } else {
        res.json({ success: false, message: "No active subscriptions found" });
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      res.status(500).json({ message: "Failed to send test notification" });
    }
  });
  
  app.post("/api/push/check", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const { endpoint } = req.body;
      
      if (!endpoint) {
        return res.status(400).json({ message: "Endpoint is required" });
      }
      
      const subscription = await storage.getPushSubscriptionByEndpoint(endpoint);
      res.json({ registered: !!subscription });
    } catch (error) {
      console.error("Error checking subscription:", error);
      res.status(500).json({ message: "Failed to check subscription" });
    }
  });
  
  app.delete("/api/push/unregister", async (req, res) => {
    try {
      const userId = 1; // In a real app, get from session/auth
      const { endpoint } = req.body;
      
      if (!endpoint) {
        return res.status(400).json({ message: "Endpoint is required" });
      }
      
      const subscription = await storage.getPushSubscriptionByEndpoint(endpoint);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Make sure the subscription belongs to the current user
      if (subscription.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const result = await storage.deletePushSubscription(subscription.id);
      
      if (result) {
        res.json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to delete subscription" });
      }
    } catch (error) {
      console.error("Error unregistering subscription:", error);
      res.status(500).json({ message: "Failed to unregister subscription" });
    }
  });
  
  // Handle medication taken from push notification
  app.get("/api/reminders/taken", async (req, res) => {
    try {
      const reminderId = parseInt(req.query.id as string);
      if (isNaN(reminderId)) {
        return res.status(400).json({ message: "Invalid reminder ID" });
      }
      
      const userId = 1; // In a real app, get from session/auth
      
      // Get the reminder
      const reminder = await storage.getReminder(reminderId);
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      // Create a medication log for this reminder
      const logData = insertMedicationLogSchema.parse({
        userId,
        reminderId,
        medicationId: reminder.medicationId
      });
      
      await storage.createMedicationLog(logData);
      
      // Redirect to the homepage or show a success page
      res.redirect('/');
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      res.status(500).send("An error occurred. Please try again.");
    }
  });
  
  // Handle notification snooze from push notification
  app.get("/api/reminders/snooze", async (req, res) => {
    try {
      const reminderId = parseInt(req.query.id as string);
      if (isNaN(reminderId)) {
        return res.status(400).json({ message: "Invalid reminder ID" });
      }
      
      // Get the reminder
      const reminder = await storage.getReminder(reminderId);
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      // In a real app, we would reschedule the reminder for later
      // For now, we'll just acknowledge the snooze request
      
      // Redirect to the homepage or show a success page
      res.redirect('/');
    } catch (error) {
      console.error("Error snoozing reminder:", error);
      res.status(500).send("An error occurred. Please try again.");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
