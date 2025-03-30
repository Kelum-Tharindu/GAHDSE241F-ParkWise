const ParkingSpaces = () => {
    const spaces = [
      { id: 'A1', status: 'available', type: 'Standard' },
      { id: 'A2', status: 'booked', type: 'Standard' },
      { id: 'A3', status: 'available', type: 'Standard' },
      { id: 'B1', status: 'maintenance', type: 'Premium' },
      { id: 'B2', status: 'available', type: 'Premium' },
      { id: 'B3', status: 'booked', type: 'Premium' },
      { id: 'C1', status: 'available', type: 'Disabled' },
      { id: 'C2', status: 'booked', type: 'Disabled' },
    ]
  
    const getStatusColor = (status) => {
      switch(status) {
        case 'available': return 'bg-green-100 text-green-800'
        case 'booked': return 'bg-blue-100 text-blue-800'
        case 'maintenance': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
  
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Parking Spaces</h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {spaces.map((space) => (
            <div key={space.id} className="border rounded-lg p-3 text-center">
              <div className="text-lg font-medium">{space.id}</div>
              <div className="text-xs text-gray-500 mb-2">{space.type}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(space.status)}`}>
                {space.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default ParkingSpaces