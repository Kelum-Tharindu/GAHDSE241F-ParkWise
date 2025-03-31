import { useState } from 'react';
import Sidebar from '@components/Sidebar';
import Header from '@components/Header';
import StatsCard from '@components/StatsCard';
import RevenueChart from '@components/RevenueChart';
import SpaceUtilization from '@components/SpaceUtilization';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Revenue" 
              value="$12,345" 
              icon="payments" 
              color="bg-[#1F7D53]"
            />
            <StatsCard 
              title="Total Bookings" 
              value="156" 
              change="+8%" 
              icon="event_available" 
              color="bg-[#1F7D53]"
            />
            <StatsCard 
              title="Active Spaces" 
              value="42" 
              change="-3%" 
              icon="local_parking" 
              color="bg-[#1F7D53]"
            />
            <StatsCard 
              title="Customer Satisfaction" 
              value="94%" 
              icon="sentiment_satisfied" 
              color="bg-[#1F7D53]"
            />
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-[#013220] text-white rounded-md hover:bg-[#024a2d] transition-colors">
                  Monthly
                </button>
                <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                  Weekly
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
                <RevenueChart />
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-medium mb-4">Space Utilization</h3>
                <SpaceUtilization />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;