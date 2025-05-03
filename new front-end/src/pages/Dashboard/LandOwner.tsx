// import { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { 
//   Car, 
//   DollarSign, 
//   Users, 
//   Package, 
//   ChevronUp, 
//   ChevronDown,
//   MapPin,
//   Star
// } from 'lucide-react';

// const bookings = [
//   { user: 'John Smith', location: 'City Center Lot', date: '29 Apr 2025', duration: '4 hours', amount: '24.00', status: 'Completed' },
//   { user: 'Emily Johnson', location: 'Riverside Parking', date: '29 Apr 2025', duration: '2 hours', amount: '12.00', status: 'Active' },
//   { user: 'Michael Brown', location: 'Downtown Garage', date: '28 Apr 2025', duration: '8 hours', amount: '48.00', status: 'Completed' },
//   { user: 'Sarah Davis', location: 'Airport Lot B', date: '28 Apr 2025', duration: '3 days', amount: '72.00', status: 'Upcoming' },
//   { user: 'David Wilson', location: 'City Center Lot', date: '27 Apr 2025', duration: '5 hours', amount: '30.00', status: 'Completed' },
// ];

// const properties = [
//   { name: 'City Center Lot', location: 'Downtown, New York', spaces: 25, occupancy: 84, revenue: '1,245', rating: 4.8 },
//   { name: 'Riverside Parking', location: 'West End, Chicago', spaces: 15, occupancy: 92, revenue: '980', rating: 4.6 },
//   { name: 'Airport Lot B', location: 'International Airport', spaces: 42, occupancy: 76, revenue: '3,450', rating: 4.4 },
// ];

// interface StatCardProps {
//   title: string;
//   value: string;
//   change: string;
//   positive: boolean;
//   icon: React.ReactNode;
// }

// const StatCard = ({ title, value, change, positive, icon }: StatCardProps) => (
//   <div className="bg-gray-800 p-6 rounded-lg w-56 h-56 flex flex-col justify-between">
//     <div className="flex justify-between">
//       <div className="p-3 bg-gray-700 rounded-lg">
//         {icon}
//       </div>
//       <div className={`flex items-center px-3 py-1 rounded-full text-sm ${positive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
//         {positive ? (
//           <ChevronUp size={16} />
//         ) : (
//           <ChevronDown size={16} />
//         )}
//         <span>{change}</span>
//       </div>
//     </div>
//     <div className="mt-auto">
//       <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
//       <p className="text-3xl font-bold">{value}</p>
//     </div>
//   </div>
// );

// const LandownerDashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [calendarDate, setCalendarDate] = useState(new Date());

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Sidebar would go here in your project */}
//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-2xl font-bold">Landowner Dashboard</h1>
//             <p className="text-gray-400">Welcome back, Michael</p>
//           </div>
//           <div className="flex gap-4">
//             <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
//               Add New Parking Area...
//             </button>
//             <div className="relative">
//               <input 
//                 type="text"
//                 placeholder="Search..."
//                 className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </div>
        
//         {/* Navigation Tabs */}
//         <div className="flex gap-6 mb-8 border-b border-gray-700">
//           <button 
//             className={`pb-3 ${activeTab === 'overview' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button 
//             className={`pb-3 ${activeTab === 'properties' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//             onClick={() => setActiveTab('properties')}
//           >
//             My Properties
//           </button>
//           <button 
//             className={`pb-3 ${activeTab === 'bookings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//             onClick={() => setActiveTab('bookings')}
//           >
//             Bookings
//           </button>
//           <button 
//             className={`pb-3 ${activeTab === 'earnings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//             onClick={() => setActiveTab('earnings')}
//           >
//             Earnings
//           </button>
//           <button 
//             className={`pb-3 ${activeTab === 'analytics' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//             onClick={() => setActiveTab('analytics')}
//           >
//             Analytics
//           </button>
//         </div>
        
//         {/* Stats Cards Row */}
//         <div className="flex flex-wrap justify-between gap-4 mb-8">
//           <StatCard 
//             title="Registered Users" 
//             value="3,782" 
//             change="11.01%" 
//             positive={true}
//             icon={<Users className="text-blue-500" size={24} />}
//           />
//           <StatCard 
//             title="Parking Booking Count" 
//             value="5,359" 
//             change="9.05%" 
//             positive={false}
//             icon={<Package className="text-purple-500" size={24} />}
//           />
//           <StatCard 
//             title="Monthly Revenue" 
//             value="$8,942" 
//             change="7.32%" 
//             positive={true}
//             icon={<DollarSign className="text-green-500" size={24} />}
//           />
//           <StatCard 
//             title="Available Spaces" 
//             value="42" 
//             change="2.45%" 
//             positive={true} 
//             icon={<Car className="text-yellow-500" size={24} />}
//           />
//         </div>
        
//         {/* Bottom Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Recent Bookings */}
//           <div className="bg-gray-800 p-6 rounded-lg col-span-2">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Recent Bookings</h2>
//               <button className="text-blue-500 text-sm">View All</button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="text-left text-gray-400 border-b border-gray-700">
//                     <th className="pb-3">User</th>
//                     <th className="pb-3">Location</th>
//                     <th className="pb-3">Date</th>
//                     <th className="pb-3">Duration</th>
//                     <th className="pb-3">Amount</th>
//                     <th className="pb-3">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.map((booking, index) => (
//                     <tr key={index} className="border-b border-gray-700 text-sm">
//                       <td className="py-3">{booking.user}</td>
//                       <td className="py-3 flex items-center gap-1"><MapPin size={14} /> {booking.location}</td>
//                       <td className="py-3">{booking.date}</td>
//                       <td className="py-3">{booking.duration}</td>
//                       <td className="py-3">${booking.amount}</td>
//                       <td className="py-3">
//                         <span className={`inline-block px-2 py-1 rounded-full text-xs ${
//                           booking.status === 'Completed' ? 'bg-green-900 text-green-300' :
//                           booking.status === 'Active' ? 'bg-blue-900 text-blue-300' :
//                           'bg-yellow-900 text-yellow-300'
//                         }`}>
//                           {booking.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
          
//           {/* Properties Summary + Calendar */}
//           <div className="flex flex-col gap-6">
//             <div className="bg-gray-800 p-6 rounded-lg">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Your Properties</h2>
//                 <button className="text-blue-500 text-sm">Manage</button>
//               </div>
//               <div className="space-y-4">
//                 {properties.map((property, index) => (
//                   <div key={index} className="bg-gray-700 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{property.name}</h3>
//                       <div className="flex items-center text-yellow-400">
//                         <Star size={16} fill="currentColor" />
//                         <span className="ml-1 text-sm">{property.rating}</span>
//                       </div>
//                     </div>
//                     <div className="text-gray-400 text-sm flex items-center gap-1 mb-2">
//                       <MapPin size={14} /> {property.location}
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <div>
//                         <p className="text-gray-400">Spaces</p>
//                         <p>{property.spaces}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-400">Occupancy</p>
//                         <p>{property.occupancy}%</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-400">Revenue</p>
//                         <p>${property.revenue}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {/* Calendar Section */}
//             <div className="bg-gray-800 p-6 rounded-lg">
//               <h2 className="text-lg font-semibold mb-4">Booking Calendar</h2>
//               <div className="bg-white rounded-lg p-2">
//                 <Calendar
//                   onChange={setCalendarDate}
//                   value={calendarDate}
//                   className="border-0 w-full"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandownerDashboard;
