import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const RevenueChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [5000, 7000, 8500, 9200, 10500, 12000, 11000, 12500, 14000, 15000, 16500, 18000],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Target',
        data: [8000, 8000, 8000, 8000, 10000, 10000, 10000, 12000, 12000, 14000, 14000, 16000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderDash: [5, 5],
        tension: 0,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value
          }
        }
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Revenue Overview</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-md">Monthly</button>
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">Weekly</button>
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default RevenueChart