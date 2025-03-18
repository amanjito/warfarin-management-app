import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { PtTest } from "@shared/schema";
import PTChart from "@/components/pt-tracker/PTChart";
import PTForm from "@/components/pt-tracker/PTForm";
import PTTable from "@/components/pt-tracker/PTTable";
import { apiRequest } from "@/lib/queryClient";
import { formatDateForApi } from "@/lib/dateUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PTTracker() {
  const [timeRange, setTimeRange] = useState("3");
  
  // Fetch PT tests
  const { data: ptTests, isLoading } = useQuery<PtTest[]>({
    queryKey: ['/api/pt-tests'],
  });
  
  // Create mutation for adding a new PT test
  const addPtTestMutation = useMutation({
    mutationFn: async (newTest: Omit<PtTest, 'id' | 'userId' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/pt-tests', newTest);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pt-tests'] });
    },
  });
  
  // Get latest PT test
  const getLatestPTTest = () => {
    if (!ptTests || ptTests.length === 0) return null;
    
    return ptTests[0]; // Assuming the API returns sorted tests
  };
  
  // Get status based on INR value
  const getInrStatus = (inrValue: number) => {
    if (inrValue >= 2.0 && inrValue <= 3.0) {
      return { label: "Within Target Range", color: "green" };
    } else if (inrValue < 2.0) {
      return { label: "Below Target Range", color: "yellow" };
    } else {
      return { label: "Above Target Range", color: "red" };
    }
  };
  
  // Filter tests based on time range (in months)
  const getFilteredTests = () => {
    if (!ptTests) {
      console.log("getFilteredTests: ptTests is undefined or null");
      return [];
    }
    
    console.log("getFilteredTests: Initial ptTests:", ptTests);
    
    if (timeRange === "all") {
      console.log("getFilteredTests: Returning all tests");
      return ptTests;
    }
    
    const months = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    console.log(`getFilteredTests: Filtering by ${months} months, cutoff date:`, cutoffDate);
    
    const filtered = ptTests.filter(test => new Date(test.testDate) >= cutoffDate);
    console.log("getFilteredTests: Filtered tests:", filtered);
    
    return filtered;
  };
  
  const latestTest = getLatestPTTest();
  const filteredTests = getFilteredTests();
  
  const handleSubmit = (data: any) => {
    addPtTestMutation.mutate({
      testDate: formatDateForApi(new Date(data.testDate)),
      inrValue: parseFloat(data.inrValue),
      notes: data.notes
    });
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading PT test data...</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">PT/INR Tracker</h2>
      
      {/* Current Status */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Current Status</h3>
          {latestTest ? (
            <div className="flex items-center">
              <div 
                className={`w-24 h-24 rounded-full border-8 flex items-center justify-center mr-4 ${
                  latestTest.inrValue >= 2.0 && latestTest.inrValue <= 3.0
                    ? "border-secondary"
                    : latestTest.inrValue < 2.0
                      ? "border-yellow-500"
                      : "border-red-500"
                }`}
              >
                <span className="text-2xl font-bold">{latestTest.inrValue.toFixed(1)}</span>
              </div>
              <div>
                <p className="font-medium">Latest INR</p>
                <p className="text-sm text-gray-500">
                  Measured: {format(new Date(latestTest.testDate), "MMM dd, yyyy")}
                </p>
                <div className="mt-1">
                  <Badge 
                    variant="outline" 
                    className={`px-2 py-1 ${
                      latestTest.inrValue >= 2.0 && latestTest.inrValue <= 3.0
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : latestTest.inrValue < 2.0
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                    }`}
                  >
                    <svg
                      className="mr-1 h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {latestTest.inrValue >= 2.0 && latestTest.inrValue <= 3.0 ? (
                        <>
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </>
                      ) : (
                        <>
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </>
                      )}
                    </svg>
                    {getInrStatus(latestTest.inrValue).label} (2.0-3.0)
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <p>No PT tests recorded yet.</p>
          )}
        </CardContent>
      </Card>
      
      {/* PT/INR History Chart */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">PT/INR History</h3>
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 Months</SelectItem>
                <SelectItem value="6">Last 6 Months</SelectItem>
                <SelectItem value="12">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <PTChart ptTests={filteredTests} />
          
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-primary inline-block mr-1"></span>
              <span>INR Value</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-200 inline-block mr-1"></span>
              <span>Target Range</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Record New PT Test */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Record New PT/INR Test</h3>
          <PTForm onSubmit={handleSubmit} isPending={addPtTestMutation.isPending} />
        </CardContent>
      </Card>
      
      {/* Recent Tests */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Recent Tests</h3>
          </div>
          
          <PTTable ptTests={ptTests || []} />
        </CardContent>
      </Card>
    </div>
  );
}
