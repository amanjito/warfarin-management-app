import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import StatusCard from "@/components/dashboard/StatusCard";
import QuickAction from "@/components/dashboard/QuickAction";
import MedicationSummary from "@/components/dashboard/MedicationSummary";
import PTSummary from "@/components/dashboard/PTSummary";
import { PtTest, Reminder, Medication, MedicationLog } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, convertToPersianDigits, toPersianDate, formatDateForApi, formatTime } from "@/lib/dateUtils";

// Define the MedicationWithStatus interface
interface MedicationWithStatus {
  id: number;
  name: string;
  dosage: string;
  quantity: string;
  time: string;
  isTaken: boolean;
}

export default function Dashboard() {
  const today = formatDate(new Date());
  const userId = 1; // In a real app, get from auth context
  
  // Fetch PT tests
  const { data: ptTests, isLoading: ptLoading } = useQuery<PtTest[]>({
    queryKey: ['/api/pt-tests'],
  });
  
  // Fetch reminders
  const { data: reminders, isLoading: remindersLoading } = useQuery<Reminder[]>({
    queryKey: ['/api/reminders'],
  });
  
  // Fetch medications
  const { data: medications, isLoading: medicationsLoading } = useQuery<Medication[]>({
    queryKey: ['/api/medications'],
  });
  
  // Fetch today's medication logs
  const { data: medicationLogs, isLoading: logsLoading } = useQuery<MedicationLog[]>({
    queryKey: ['/api/medication-logs', { date: formatDateForApi(new Date()) }],
  });
  
  // Calculate next PT test date (example implementation)
  const calculateNextPTTest = () => {
    if (!ptTests || ptTests.length === 0) return "زمان‌بندی نشده";
    
    // Sort tests by date, most recent first
    const sortedTests = [...ptTests].sort((a, b) => 
      new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
    );
    
    const mostRecent = sortedTests[0];
    const mostRecentDate = new Date(mostRecent.testDate);
    
    // Calculate next test date (typically every 2-4 weeks)
    // For this example, we'll use 2 weeks
    const nextTestDate = new Date(mostRecentDate);
    nextTestDate.setDate(nextTestDate.getDate() + 14);
    
    // Check if it's tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (nextTestDate.toDateString() === tomorrow.toDateString()) {
      return "فردا";
    }
    
    return formatDate(nextTestDate);
  };
  
  // Get medications for today with status
  const getTodaysMedications = () => {
    if (!medications || !reminders || !medicationLogs) return [];
    
    return reminders.map(reminder => {
      const medication = medications.find(m => m.id === reminder.medicationId);
      if (!medication) return null;
      
      const log = medicationLogs.find(l => l.reminderId === reminder.id);
      const isTaken = !!log?.taken;
      
      return {
        ...medication,
        time: reminder.time,
        reminderId: reminder.id,
        isTaken
      };
    }).filter(Boolean) as MedicationWithStatus[];
  };
  
  // Get the most recent INR value
  const getLatestINR = () => {
    if (!ptTests || ptTests.length === 0) return null;
    
    const sortedTests = [...ptTests].sort((a, b) => 
      new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
    );
    
    return sortedTests[0];
  };
  
  const latestTest = getLatestINR();
  const todaysMedications = getTodaysMedications();
  const nextTestDate = calculateNextPTTest();
  
  // Check if latest INR is within target range (2.0-3.0)
  const inrStatus = latestTest 
    ? (latestTest.inrValue >= 2.0 && latestTest.inrValue <= 3.0 
      ? "within" 
      : latestTest.inrValue < 2.0 
        ? "below" 
        : "above")
    : null;
  
  if (ptLoading || remindersLoading || medicationsLoading || logsLoading) {
    return <div className="p-8 text-center dark:text-white">در حال بارگذاری داده‌ها...</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-right dark:text-white">سارا، خوش آمدید</h2>
      
      {/* Today's Summary */}
      <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-right dark:text-white">خلاصه امروز</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{today}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusCard 
              title="دوز بعدی وارفارین"
              value={medications?.find(m => m.name === "Warfarin")?.dosage || "تنظیم نشده"}
              subtitle={medications?.find(m => m.name === "Warfarin") 
                ? `${formatTime("20:00")} امروز` 
                : "داروی وارفارین زمان‌بندی نشده"}
              color="primary"
            />
            
            <StatusCard 
              title="آزمایش PT بعدی"
              value={nextTestDate}
              subtitle={nextTestDate === "فردا" ? `وقت آزمایشگاه: ${formatTime("10:30")}` : ""}
              color="warning"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* PT Trend Summary */}
      <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-right dark:text-white">روند PT/INR</h3>
            <Link href="/pt-tracker" className="text-sm text-primary dark:text-blue-300">
              مشاهده جزئیات
            </Link>
          </div>
          
          <PTSummary ptTests={ptTests || []} />
          
          {inrStatus && (
            <div className="mt-3 text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                inrStatus === "within" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" 
                  : inrStatus === "below"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
              }`}>
                <svg
                  className={`mr-1 h-4 w-4 ${
                    inrStatus === "within" 
                      ? "text-green-600 dark:text-green-400" 
                      : inrStatus === "below" 
                        ? "text-yellow-600 dark:text-yellow-400" 
                        : "text-red-600 dark:text-red-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {inrStatus === "within" ? (
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  ) : (
                    <circle cx="12" cy="12" r="10"></circle>
                  )}
                  {inrStatus === "within" ? (
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  ) : inrStatus === "below" ? (
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                  ) : (
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                  )}
                  {inrStatus !== "within" && (
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  )}
                </svg>
                {inrStatus === "within" 
                  ? "در محدوده هدف" 
                  : inrStatus === "below"
                    ? "پایین‌تر از محدوده هدف"
                    : "بالاتر از محدوده هدف"
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <QuickAction 
          title="ثبت آزمایش PT"
          icon="chart"
          color="primary"
          path="/pt-tracker"
        />
        <QuickAction 
          title="تنظیم یادآور"
          icon="bell" 
          color="secondary"
          path="/reminders"
        />
        <QuickAction 
          title="اطلاعات دارو"
          icon="info"
          color="warning"
          path="/medication"
        />
        <QuickAction 
          title="پرسش از دستیار"
          icon="chat"
          color="accent"
          path="/assistant"
        />
      </div>
      
      {/* Today's Medications */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4 text-right dark:text-white">داروهای امروز</h3>
          <MedicationSummary medications={todaysMedications} />
        </CardContent>
      </Card>
    </div>
  );
}
