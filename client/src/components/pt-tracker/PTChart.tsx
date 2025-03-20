import { PtTest } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import { formatPersianShortDate, convertToPersianDigits } from "@/lib/dateUtils";
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
        <p className="text-gray-500">اطلاعات آزمایش <span className="unicode-bidi">PT</span> موجود نیست</p>
      </div>
    );
  }
  
  // Sort tests by date (oldest to newest)
  const sortedTests = [...ptTests].sort((a, b) => 
    new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
  );
  
  console.log("PTChart sortedTests:", sortedTests);
  
  // Prepare data for chart
  const labels = sortedTests.map(test => formatPersianShortDate(test.testDate));
  const inrValues = sortedTests.map(test => test.inrValue);
  
  // Create a target range dataset (constant values for min and max)
  const targetRangeMin = Array(labels.length).fill(2.0);
  const targetRangeMax = Array(labels.length).fill(3.0);
  
  // Chart data
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'مقدار INR'.replace("INR", "<span class='unicode-bidi'>INR</span>"),
        data: inrValues,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        label: 'کف محدوده هدف',
        data: targetRangeMin,
        borderColor: 'rgba(76, 175, 80, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      },
      {
        label: 'سقف محدوده هدف',
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
        title: {
          display: true,
          text: 'مقدار INR'.replace("INR", "<span class='unicode-bidi'>INR</span>")
        },
        ticks: {
          callback: function(value) {
            return convertToPersianDigits(value.toString());
          }
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
