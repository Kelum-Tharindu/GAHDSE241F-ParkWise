import { useState } from 'react'

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const primaryColor = '#1F7D53';
  const primaryHover = '#1A6D48';

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
          <div className="flex items-center">
            <span className="material-icons mr-2" style={{ color: primaryColor }}>assessment</span>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none relative"
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            <span className="material-icons">trending_up</span>
          </button>
          
          <button 
            className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none relative"
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            <span className="material-icons">insert_chart</span>
          </button>
          
          <button 
            className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none relative"
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            <span className="material-icons">notifications</span>
            <span className="absolute top-0 right-0 h-2 w-2" style={{ backgroundColor: primaryColor }}></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div 
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="material-icons">account_circle</span>
                <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-white"></span>
              </div>
              <span className="hidden md:inline-block">Admin</span>
            </button>
            
            {profileOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
                style={{ borderColor: primaryLight }}
              >
                <a 
                  href="#" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                >
                  <span className="material-icons mr-2">person</span>
                  Your Profile
                </a>
                <a 
                  href="#" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                >
                  <span className="material-icons mr-2">settings</span>
                  Settings
                </a>
                <a 
                  href="#" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                >
                  <span className="material-icons mr-2">exit_to_app</span>
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header