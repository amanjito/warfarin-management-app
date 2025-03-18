import { useEffect, useRef } from "react";
import { PtTest } from "@shared/schema";
import { format } from "date-fns";
import { ChartJS, createPtChartConfig } from "@/lib/chartUtils";

interface PTSummaryProps {
  ptTests: PtTest[];
}

export default function PTSummary({ ptTests }: PTSummaryProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  
  useEffect(() => {
    if (!ptTests || ptTests.length === 0 || !chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Get only the last 4 tests for the dashboard summary
    const recentTests = [...ptTests]
      .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
      .slice(0, 4)
      .reverse();
    
    // Prepare data for chart
    const labels = recentTests.map(test => format(new Date(test.testDate), "MMM d"));
    const inrValues = recentTests.map(test => test.inrValue);
    
    // Create a target range dataset (constant values for min and max)
    const targetRangeMin = Array(labels.length).fill(2.0);
    const targetRangeMax = Array(labels.length).fill(3.0);
    
    // Destroy previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    // Use our shared chart configuration utility
    const { data, options } = createPtChartConfig(labels, inrValues, targetRangeMin, targetRangeMax);
    
    try {
      // Create new chart instance
      chartInstanceRef.current = new ChartJS(ctx, {
        type: 'line',
        data,
        options
      });
    } catch (error) {
      console.error("Chart creation error:", error);
    }
    
    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [ptTests]);
  
  if (!ptTests || ptTests.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No PT test data available</p>
      </div>
    );
  }
  
  return (
    <div className="h-[200px] relative">
      <canvas ref={chartRef} />
    </div>
  );
}
