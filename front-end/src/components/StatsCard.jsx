const StatsCard = ({ title, value, change, icon, color }) => {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          <span className="material-icons">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-center">
            <h3 className="text-xl font-bold">{value}</h3>
            {change && (
              <span className={`ml-2 text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  export default StatsCard