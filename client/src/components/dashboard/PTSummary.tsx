import { PtTest } from "@shared/schema";
import { formatDate, convertToPersianDigits } from "@/lib/dateUtils";
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
  // Get the latest INR test for display 
  const getLatestTest = () => {
    if (!ptTests || ptTests.length === 0) return null;
    
    return [...ptTests].sort((a, b) => 
      new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
    )[0];
  };

  const latestTest = getLatestTest();
  
  // Render the PT test value in a circle
  const renderPTCircle = () => {
    if (!latestTest) return null;
    
    return (
      <div className="flex items-center mb-4 justify-between">
        <div className="flex-1 text-right pr-4">
          <p className="font-medium">آخرین INR</p>
          <p className="text-sm text-gray-500">
            اندازه‌گیری شده: {formatDate(latestTest.testDate)}
          </p>
        </div>
        <div 
          className={`w-20 h-20 rounded-full border-8 flex items-center justify-center mr-12 ml-4 ${
            latestTest.inrValue >= 2.0 && latestTest.inrValue <= 3.0
              ? "border-green-500"
              : latestTest.inrValue < 2.0
                ? "border-yellow-500"
                : "border-red-500"
          }`}
        >
          <span className="text-2xl font-bold">{convertToPersianDigits(latestTest.inrValue.toFixed(1))}</span>
        </div>
      </div>
    );
  };
  
  if (!ptTests || ptTests.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">داده آزمایش PT موجود نیست</p>
      </div>
    );
  }
  
  // Get only the last 4 tests for the dashboard summary
  const recentTests = [...ptTests]
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
    .slice(0, 4)
    .reverse();
  
  // Prepare data for chart
  const labels = recentTests.map(test => formatDate(new Date(test.testDate)));
  const inrValues = recentTests.map(test => test.inrValue);
  
  // Create a target range dataset (constant values for min and max)
  const targetRangeMin = Array(labels.length).fill(2.0);
  const targetRangeMax = Array(labels.length).fill(3.0);
  
  // Chart data
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'مقدار INR',
        data: inrValues,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'حداقل محدوده هدف',
        data: targetRangeMin,
        borderColor: 'rgba(76, 175, 80, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      },
      {
        label: 'حداکثر محدوده هدف',
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
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += convertToPersianDigits(context.parsed.y.toFixed(1));
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        min: 1,
        max: 4,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'مقدار INR',
          font: {
            family: 'Vazirmatn'
          }
        },
        ticks: {
          callback: function(value) {
            return convertToPersianDigits(value.toString());
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'تاریخ',
          font: {
            family: 'Vazirmatn'
          }
        }
      }
    }
  };
  
  return (
    <div>
      {/* Display the latest INR value in a circle */}
      {renderPTCircle()}
      
      {/* Display the chart */}
      <div className="h-[180px] relative">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
