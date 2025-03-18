import { PtTest } from "@shared/schema";
import { format } from "date-fns";
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

// Make sure Chart.js components are registered
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

interface PTSummaryProps {
  ptTests: PtTest[];
}

export default function PTSummary({ ptTests }: PTSummaryProps) {
  if (!ptTests || ptTests.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No PT test data available</p>
      </div>
    );
  }
  
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
    <div className="h-[200px] relative">
      <Line data={data} options={options} />
    </div>
  );
}
