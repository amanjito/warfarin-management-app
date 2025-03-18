import { useEffect, useRef } from "react";
import { PtTest } from "@shared/schema";
import { format } from "date-fns";

interface PTSummaryProps {
  ptTests: PtTest[];
}

export default function PTSummary({ ptTests }: PTSummaryProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  
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
    
    // Import Chart.js using dynamic import
    import('chart.js').then((ChartModule) => {
      const { Chart, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip } = ChartModule;
      
      // Register required components
      Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);
      
      // Destroy previous chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      // Create chart
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'INR Value',
              data: inrValues,
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Target Range Min',
              data: targetRangeMin,
              borderColor: 'rgba(76, 175, 80, 0.5)',
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false
            },
            {
              label: 'Target Range Max',
              data: targetRangeMax,
              borderColor: 'rgba(76, 175, 80, 0.5)',
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              min: 1,
              max: 4,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    });
    
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
