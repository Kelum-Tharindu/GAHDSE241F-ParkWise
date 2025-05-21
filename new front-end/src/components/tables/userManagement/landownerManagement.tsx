import React, { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaPlus,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMoon,
  FaSun,
  FaIdCard,
  FaClipboardList,
  FaArrowLeft,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaExternalLinkAlt,
  FaCar,
  FaBicycle,
  FaTruck,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from 'axios';

interface ParkingDetails {
  _id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: {
      No: string;
      street: string;
      city: string;
      province: string;
      country: string;
      postalCode: string;
    }
  };
  slotDetails: {
    car: {
      totalSlot: number;
      bookingSlot: number;
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    bicycle: {
      totalSlot: number;
      bookingSlot: number;
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    truck: {
      totalSlot: number;
      bookingSlot: number;
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
  };
  qrCode: string;
}

interface UserDetails {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  postalCode: string;
  taxId: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

interface Landowner {
  _id: string;
  username: string;
  userDocumentId: string;
  userDetails: UserDetails;
  parkingDetails: ParkingDetails[];
}

export default function LandownerManagementTable() {
  const [landowners, setLandowners] = useState<Landowner[]>([]);
  const [search, setSearch] = useState("");
  const [viewLandowner, setViewLandowner] = useState<Landowner | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLandowners();
  }, []);

  const fetchLandowners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/landowners/details');
      console.log('API Response Data:', response.data);
      setLandowners(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch landowners data');
      console.error('Error fetching landowners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this landowner?")) {
      try {
        await axios.delete(`http://localhost:5000/api/landowners/${id}`);
        setLandowners(prev => prev.filter(landowner => landowner._id !== id));
      } catch (err) {
        console.error('Error deleting landowner:', err);
        alert('Failed to delete landowner');
      }
    }
  };

  // Search by username or email
  const filteredLandowners = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return landowners;
    return landowners.filter((landowner) => 
      landowner.username.toLowerCase().includes(lower) ||
      landowner.userDetails.email.toLowerCase().includes(lower)
    );
  }, [landowners, search]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-outfit">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Theme toggle button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Landowner Management</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-700" />
            )}
          </button>
        </div>
        
        {viewLandowner ? (
          <div className="p-8">
            <button
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-xs font-medium"
              onClick={() => setViewLandowner(null)}
            >
              <FaArrowLeft /> Back to Table
            </button>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <FaUser className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {(viewLandowner.userDetails?.firstName || '') + ' ' + (viewLandowner.userDetails?.lastName || '') || 'No name available'}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                  Active
                </span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner._id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.userDetails?.email || 'No email available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.username || viewLandowner.userDetails?.username || 'No username available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.userDetails?.phone || 'No phone available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {(viewLandowner.userDetails?.city ? viewLandowner.userDetails.city : 'N/A') + 
                      (viewLandowner.userDetails?.country ? ', ' + viewLandowner.userDetails.country : '')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Parking Locations</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {Array.isArray(viewLandowner.parkingDetails) ? `${viewLandowner.parkingDetails.length} locations` : 'No locations'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parking Details Section */}
            {Array.isArray(viewLandowner.parkingDetails) && viewLandowner.parkingDetails.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Parking Locations</h3>
                <div className="grid grid-cols-1 gap-6">
                  {viewLandowner.parkingDetails.map((parking) => (
                    <div key={parking._id} className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">{parking.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {parking.location?.address?.No ? parking.location.address.No + ', ' : ''}
                            {parking.location?.address?.street || ''}, 
                            {parking.location?.address?.city || ''}
                            {parking.location?.address?.postalCode ? ', ' + parking.location.address.postalCode : ''}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="mr-4">Lat: {parking.location?.latitude?.toFixed(6) || 'N/A'}</span>
                            <span>Long: {parking.location?.longitude?.toFixed(6) || 'N/A'}</span>
                          </div>
                        </div>
                        {parking.qrCode && (
                          <div className="mt-3 md:mt-0">
                            <a 
                              href={parking.qrCode} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 text-xs flex items-center"
                            >
                              View QR Code <FaExternalLinkAlt className="ml-1" size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Parking Slot Details</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Car Slots */}
                          <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm">
                            <div className="flex items-center mb-3">
                              <FaCar className="text-blue-500 mr-2" />
                              <h6 className="font-medium text-gray-700 dark:text-gray-300">Car Slots</h6>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Available/Total</p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  {parking.slotDetails?.car ? 
                                    `${parking.slotDetails.car.availableSlot || 0}/${parking.slotDetails.car.totalSlot || 0}` : 
                                    'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Booked</p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  {parking.slotDetails?.car?.bookingSlot || 0}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <FaMoneyBillWave className="mr-1" size={10} /> 30 Min Price
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  ${parking.slotDetails?.car?.perPrice30Min?.toFixed(2) || 'N/A'}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <FaCalendarAlt className="mr-1" size={10} /> Day Price
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  ${parking.slotDetails?.car?.perDayPrice?.toFixed(2) || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bicycle Slots */}
                          <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm">
                            <div className="flex items-center mb-3">
                              <FaBicycle className="text-green-500 mr-2" />
                              <h6 className="font-medium text-gray-700 dark:text-gray-300">Bicycle Slots</h6>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Available/Total</p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  {parking.slotDetails?.bicycle ? 
                                    `${parking.slotDetails.bicycle.availableSlot || 0}/${parking.slotDetails.bicycle.totalSlot || 0}` : 
                                    'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Booked</p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  {parking.slotDetails?.bicycle?.bookingSlot || 0}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <FaMoneyBillWave className="mr-1" size={10} /> 30 Min Price
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  ${parking.slotDetails?.bicycle?.perPrice30Min?.toFixed(2) || 'N/A'}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <FaCalendarAlt className="mr-1" size={10} /> Day Price
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  ${parking.slotDetails?.bicycle?.perDayPrice?.toFixed(2) || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Truck Slots */}
                          <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm">
                            <div className="flex items-center mb-3">
                              <FaTruck className="text-orange-500 mr-2" />
                              <h6 className="font-medium text-gray-700 dark:text-gray-300">Truck Slots</h6>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Available/Total</p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  {parking.slotDetails?.truck ? 
                                    `${parking.slotDetails.truck.availableSlot || 0}/${parking.slotDetails.truck.totalSlot || 0}` : 
                                    'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Booked</p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  {parking.slotDetails?.truck?.bookingSlot || 0}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <FaMoneyBillWave className="mr-1" size={10} /> 30 Min Price
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  ${parking.slotDetails?.truck?.perPrice30Min?.toFixed(2) || 'N/A'}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                  <FaCalendarAlt className="mr-1" size={10} /> Day Price
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white text-sm">
                                  ${parking.slotDetails?.truck?.perDayPrice?.toFixed(2) || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Social Media Links */}
            {viewLandowner.userDetails?.socialLinks && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Social Media</h3>
                <div className="flex flex-wrap gap-4">
                  {viewLandowner.userDetails.socialLinks.facebook && (
                    <a 
                      href={viewLandowner.userDetails.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaFacebook className="mr-2" /> Facebook
                    </a>
                  )}
                  
                  {viewLandowner.userDetails.socialLinks.twitter && (
                    <a 
                      href={viewLandowner.userDetails.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <FaTwitter className="mr-2" /> Twitter
                    </a>
                  )}
                  
                  {viewLandowner.userDetails.socialLinks.linkedin && (
                    <a 
                      href={viewLandowner.userDetails.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      <FaLinkedin className="mr-2" /> LinkedIn
                    </a>
                  )}
                  
                  {viewLandowner.userDetails.socialLinks.instagram && (
                    <a 
                      href={viewLandowner.userDetails.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <FaInstagram className="mr-2" /> Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search and Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by username or email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none text-xs text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition text-xs font-medium"
                >
                  <FaFilter /> Filters
                </button>
                <button
                  className="flex items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-700 transition text-xs font-medium"
                >
                  <FaPlus /> Add Landowner
                </button>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parking Locations</th>
                    <th scope="col" className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">View</th>
                    <th scope="col" className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  {filteredLandowners.length === 0 ? (
                    <tr key="no-landowners-row">
                      <td colSpan={8} className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
                        No landowners found.
                      </td>
                    </tr>
                  ) : (
                    filteredLandowners.map((landowner) => {
                      // Debug info for each landowner
                      console.log('Landowner item:', landowner);
                      
                      // Try to safely access name fields
                      const firstName = landowner.userDetails?.firstName || '';
                      const lastName = landowner.userDetails?.lastName || '';
                      const fullName = firstName && lastName 
                        ? `${firstName} ${lastName}` 
                        : firstName || lastName || 'No name available';
                      
                      // Get username from the appropriate location
                      const username = landowner.username || landowner.userDetails?.username || 'N/A';
                      
                      return (
                        <tr key={landowner._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                          <td className="px-2 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{landowner._id}</td>
                          <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-white">{username}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                            {fullName}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                            {landowner.userDetails?.email || 'No email available'}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                            {landowner.userDetails?.phone || 'No phone available'}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                            {Array.isArray(landowner.parkingDetails) ? `${landowner.parkingDetails.length} locations` : 'No data'}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={() => setViewLandowner(landowner)}
                              className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              title="View landowner details"
                            >
                              <FaEye size={14} />
                            </button>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleDelete(landowner._id)}
                              className="inline-flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                              title="Delete landowner"
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
