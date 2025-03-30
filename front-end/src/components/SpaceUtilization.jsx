import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const SpaceUtilization = () => {
  const data = {
    labels: ['Occupied', 'Available', 'Maintenance'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4">Space Utilization</h3>
      <div className="h-64">
        <Pie data={data} />
      </div>
    </div>
  )
}

export default SpaceUtilization