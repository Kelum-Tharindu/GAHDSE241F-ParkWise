import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRefs = useRef({});

  // Menu data with icons
  const menuSections = {
    management: {
      title: "Management",
      icon: "manage_accounts",
      items: [
        { name: 'Users', path: '/users', icon: 'people' },
        { name: 'Landowners', path: '/landowners', icon: 'home_work' }
      ]
    },
    parking: {
      title: "Parking Control",
      icon: "directions_car",
      items: [
        { name: 'Parking Slots', path: '/parking-slots', icon: 'local_parking' },
        { name: 'Zones', path: '/zones', icon: 'map' }
      ]
    },
    operations: {
      title: "Operations",
      icon: "business_center",
      items: [
        { name: 'Bookings', path: '/bookings', icon: 'event_available' },
        { name: 'Transactions', path: '/transactions', icon: 'payments' },
        { name: 'Refunds', path: '/refunds', icon: 'assignment_return' }
      ]
    },
    monitoring: {
      title: "Monitoring",
      icon: "monitor_heart",
      items: [
        { name: 'IoT Devices', path: '/iot-devices', icon: 'sensors' },
        { name: 'Alerts', path: '/alerts', icon: 'notifications_active' },
        { name: 'Audit Logs', path: '/audit-logs', icon: 'history' }
      ]
    },
    analytics: {
      title: "Analytics",
      icon: "insights",
      items: [
        { name: 'Usage', path: '/analytics/usage', icon: 'show_chart' },
        { name: 'Revenue', path: '/analytics/revenue', icon: 'bar_chart' },
        { name: 'User Growth', path: '/analytics/user-growth', icon: 'trending_up' }
      ]
    },
    system: {
      title: "System",
      icon: "settings",
      items: [
        { name: 'Configuration', path: '/settings', icon: 'tune' },
        { name: 'Backup', path: '/backup', icon: 'cloud_done' }
      ]
    }
  };

  // Check if path is active
  const isActive = (path) => location.pathname === path;

  // Toggle menu section
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Auto-expand active menu on route change
  useEffect(() => {
    for (const [menu, section] of Object.entries(menuSections)) {
      if (section.items.some(item => isActive(item.path))) {
        setActiveMenu(menu);
        break;
      }
    }
  }, [location]);

  // Set menu heights for smooth animation
  useEffect(() => {
    if (activeMenu && menuRefs.current[activeMenu]) {
      menuRefs.current[activeMenu].style.height = 
        `${menuRefs.current[activeMenu].scrollHeight}px`;
    }
  }, [activeMenu]);

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64
      transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0 transition-transform duration-200
      flex flex-col
      bg-white text-gray-800 shadow-lg
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-[#013220]">local_parking</span>
          <h1 className="text-xl font-bold">ParkWise Admin</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Scrollable Menu Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {/* Dashboard (Always visible) */}
        <div className="mb-3">
          <NavLink
            to="/"
            className={({ isActive }) => `
              flex items-center p-3 rounded-lg mb-1
              ${isActive ? 'bg-[#013220] text-white' : 'hover:bg-[#013220] hover:text-white text-gray-700'}
              transition-colors duration-200
            `}
          >
            <span className="material-icons mr-3">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
        </div>

        {/* Dynamic Menu Sections */}
        {Object.entries(menuSections).map(([key, section]) => (
          <div key={key} className="mb-3">
            <button 
              onClick={() => toggleMenu(key)}
              className={`
                flex items-center justify-between w-full p-3 rounded-lg
                hover:bg-[#013220] hover:text-white text-gray-700
                transition-colors duration-200
              `}
            >
              <div className="flex items-center">
                <span className="material-icons mr-3">{section.icon}</span>
                <span>{section.title}</span>
              </div>
              <span className={`material-icons transition-transform ${activeMenu === key ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            <div
              ref={el => menuRefs.current[key] = el}
              className="overflow-hidden transition-all duration-300"
              style={{ height: activeMenu === key ? `${menuRefs.current[key]?.scrollHeight || 0}px` : '0px' }}
            >
              <div className="pl-12 py-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center p-2 rounded-lg text-sm mb-1
                      ${isActive ? 'bg-[#013220] text-white' : 'hover:bg-[#013220] hover:text-white text-gray-600'}
                      transition-colors duration-200
                    `}
                  >
                    <span className="material-icons mr-2 text-sm">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section with Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleSignOut}
          className={`
            flex items-center w-full p-3 rounded-lg
            hover:bg-[#013220] hover:text-white text-gray-700
            transition-colors duration-200
          `}
        >
          <span className="material-icons mr-3">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;