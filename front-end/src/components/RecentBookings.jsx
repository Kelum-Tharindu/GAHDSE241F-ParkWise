const RecentBookings = () => {
    const bookings = [
      { id: '#BK001', customer: 'John Doe', space: 'A2', start: '10:00 AM', end: '2:00 PM', status: 'active' },
      { id: '#BK002', customer: 'Jane Smith', space: 'B3', start: '9:00 AM', end: '5:00 PM', status: 'completed' },
      { id: '#BK003', customer: 'Robert Johnson', space: 'C2', start: '1:00 PM', end: '3:00 PM', status: 'active' },
      { id: '#BK004', customer: 'Emily Davis', space: 'A1', start: '11:00 AM', end: '12:00 PM', status: 'cancelled' },
      { id: '#BK005', customer: 'Michael Wilson', space: 'B2', start: '3:00 PM', end: '6:00 PM', status: 'upcoming' },
    ]
  
    const getStatusColor = (status) => {
      switch(status) {
        case 'active': return 'bg-blue-100 text-blue-800'
        case 'completed': return 'bg-green-100 text-green-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        case 'upcoming': return 'bg-purple-100 text-purple-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
  
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Bookings</h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.customer}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.space}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.start} - {booking.end}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  export default RecentBookings