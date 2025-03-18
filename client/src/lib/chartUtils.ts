import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,  // Important: register the controller
  Legend,
  Title,
  Tooltip,
  Filler,
  ChartOptions,
  ChartData,
  ChartType,
} from 'chart.js';

// Register ALL Chart.js components - this must be done once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,  // Important: register the controller
  Title,
  Tooltip,
  Legend,
  Filler
);

// Export the registered Chart class for use in components
export { ChartJS };
export type { ChartOptions, ChartData, ChartType };

/**
 * Creates a Line chart configuration for PT test data
 */
export function createPtChartConfig(
  labels: string[], 
  inrValues: number[],
  targetRangeMin: number[] = [], 
  targetRangeMax: number[] = []
) {
  // Create chart configuration
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
      }
    ]
  };
  
  // Add target range datasets if provided
  if (targetRangeMin.length > 0) {
    data.datasets.push({
      label: 'Target Range Min',
      data: targetRangeMin,
      borderColor: 'rgba(76, 175, 80, 0.5)',
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false
    });
  }
  
  if (targetRangeMax.length > 0) {
    data.datasets.push({
      label: 'Target Range Max',
      data: targetRangeMax,
      borderColor: 'rgba(76, 175, 80, 0.5)',
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false
    });
  }
  
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
  
  return { data, options };
}