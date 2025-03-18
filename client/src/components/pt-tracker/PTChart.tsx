import { PtTest } from "@shared/schema";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PTChartProps {
  ptTests: PtTest[];
}

export default function PTChart({ ptTests }: PTChartProps) {
  console.log("PTChart received ptTests:", ptTests);
  
  if (!ptTests || ptTests.length === 0) {
    console.log("No PT tests available to render");
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No PT test data available</p>
      </div>
    );
  }
  
  // Sort tests by date (oldest to newest)
  const sortedTests = [...ptTests].sort((a, b) => 
    new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
  );
  
  console.log("PTChart sortedTests:", sortedTests);
  
  // Prepare data for chart
  const labels = sortedTests.map(test => format(new Date(test.testDate), "MMM d"));
  const inrValues = sortedTests.map(test => test.inrValue);
  
  // Create a target range dataset (constant values for min and max)
  const targetRangeMin = Array(labels.length).fill(2.0);
  const targetRangeMax = Array(labels.length).fill(3.0);
  
  // Chart data
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'INR Value',
        data: inrValues,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8
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
  };
  
  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      y: {
        min: 1,
        max: 4,
        title: {
          display: true,
          text: 'INR Value'
        },
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
  };
  
  return (
    <div className="h-[300px] relative">
      <Line data={data} options={options} />
    </div>
  );
}
