import { useState } from 'react'

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 text-gray-500 focus:outline-none md:hidden"
          >
            <span className="material-icons">menu</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
            <span className="material-icons">notifications</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <span className="material-icons">person</span>
              </div>
              <span className="hidden md:inline-block">Admin</span>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header