import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Sample data for demo mode
import { User, PtTest, Medication, Reminder, MedicationLog, AssistantMessage } from "@shared/schema";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Check if we're in demo mode
const isDemoMode = () => localStorage.getItem('skipAuth') === 'true';

// Sample data for demo mode
const demoData = {
  '/api/users/1': {
    id: 1,
    username: 'demo_user',
    name: 'Demo User',
    email: 'demo@example.com',
    createdAt: new Date().toISOString()
  } as User,
  
  '/api/pt-tests': [
    {
      id: 1,
      userId: 1,
      testDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      inrValue: 1.8,
      notes: "Below target range"
    },
    {
      id: 2,
      userId: 1,
      testDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      inrValue: 2.2,
      notes: "Within target range"
    },
    {
      id: 3,
      userId: 1,
      testDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      inrValue: 2.5,
      notes: "Within target range"
    }
  ] as PtTest[],
  
  '/api/medications': [
    {
      id: 1,
      userId: 1,
      name: "Warfarin",
      dosage: "5mg",
      frequency: "Daily",
      quantity: "30 tablets",
      refillDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      prescriptionInfo: "Take with food"
    },
    {
      id: 2,
      userId: 1,
      name: "Vitamin K",
      dosage: "50mcg",
      frequency: "Daily",
      quantity: "60 tablets",
      refillDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days from now
      prescriptionInfo: "Take in the morning"
    }
  ] as Medication[],
  
  '/api/reminders': [
    {
      id: 1,
      userId: 1,
      medicationId: 1,
      time: "08:00",
      daysOfWeek: "1,2,3,4,5,6,7",
      active: true,
      notifyBefore: 15
    },
    {
      id: 2,
      userId: 1,
      medicationId: 2,
      time: "09:00",
      daysOfWeek: "1,2,3,4,5,6,7",
      active: true,
      notifyBefore: 15
    }
  ] as Reminder[],
  
  '/api/medication-logs': [
    {
      id: 1,
      userId: 1,
      medicationId: 1,
      reminderId: 1,
      taken: true,
      takenAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      notes: "Taken with breakfast"
    }
  ] as MedicationLog[],
  
  '/api/assistant-messages': [
    {
      id: 1,
      userId: 1,
      content: "Welcome to WarfarinTracker! How can I help you today?",
      isUser: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
    },
    {
      id: 2,
      userId: 1,
      content: "What should I do if I miss a dose?",
      isUser: true,
      timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString() // 29 minutes ago
    },
    {
      id: 3,
      userId: 1,
      content: "If you miss a dose, contact your healthcare provider right away. Do not take a double dose to make up for a missed dose unless instructed to do so by your doctor.",
      isUser: false,
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString() // 28 minutes ago
    }
  ] as AssistantMessage[]
};

// Create today's medication logs
const todayDate = new Date().toISOString().split('T')[0];
demoData[`/api/medication-logs?date=${todayDate}`] = [] as MedicationLog[];

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For demo mode, simulate successful responses
  if (isDemoMode()) {
    // For mutations (POST, PUT, PATCH, DELETE), return a success response
    // For real data retrieval, this would be handled by the query function below
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Normal API request for authenticated mode
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Check if we're in demo mode
    if (isDemoMode()) {
      const endpoint = queryKey[0] as string;
      const queryParams = queryKey[1] || {};
      
      // Check if this is a medication log with date parameter
      if (endpoint === '/api/medication-logs' && queryParams.date) {
        return demoData[`${endpoint}?date=${queryParams.date}`] || [];
      }
      
      // Return demo data if available
      if (demoData[endpoint]) {
        return demoData[endpoint];
      }
      
      // If no specific demo data is available, return an empty array or object
      return Array.isArray(demoData['/api/pt-tests']) ? [] : {};
    }
    
    // Normal API request for authenticated mode
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
