import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRefs = useRef({});

  // Menu data
  const menus = {
    main: [
      { name: 'Dashboard', path: '/', count: 88 },
      { name: 'Ecommerce', path: '/ecommerce' }
    ],
    secondary: [
      { name: 'Calendar', path: '/calendar' },
      { name: 'User Profile', path: '/profile' }
    ],
    forms: [
      { name: 'Form Elements', path: '/forms' }
    ],
    tables: [
      { name: 'Basic Tables', path: '/tables' }
    ],
    pages: [
      { name: 'Blank Page', path: '/blank' },
      { name: '404 Error', path: '/404' }
    ]
  };

  const others = {
    charts: [
      { name: 'Line Chart', path: '/line-chart' },
      { name: 'Bar Chart', path: '/bar-chart' }
    ],
    elements: [
      { name: 'Alerts', path: '/alerts' },
      { name: 'Buttons', path: '/buttons' }
    ]
  };

  // Check active path
  const isActive = (path) => location.pathname === path;

  // Toggle menu
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Auto-expand active menu
  useEffect(() => {
    for (const [menu, items] of Object.entries({ ...menus, ...others })) {
      if (items.some(item => isActive(item.path))) {
        setActiveMenu(menu);
        break;
      }
    }
  }, [location]);

  // Set menu heights for animation
  useEffect(() => {
    if (activeMenu && menuRefs.current[activeMenu]) {
      menuRefs.current[activeMenu].style.height = 
        `${menuRefs.current[activeMenu].scrollHeight}px`;
    }
  }, [activeMenu]);

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white
      transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0 transition-transform duration-200
    `}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">ParkAdmin</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        {/* MENU Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-3 px-2">MENU</h3>
          
          {/* Dashboard */}
          <div className="mb-1">
            <NavLink
              to="/"
              className={({ isActive }) => `
                flex items-center justify-between p-3 rounded-lg
                ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
              `}
            >
              <div className="flex items-center">
                <span>Dashboard</span>
              </div>
              <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">88</span>
            </NavLink>
          </div>

          {/* Ecommerce */}
          <div className="mb-1">
            <NavLink
              to="/ecommerce"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg
                ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
              `}
            >
              <span>Ecommerce</span>
            </NavLink>
          </div>

          {/* Calendar */}
          <div className="mb-1">
            <NavLink
              to="/calendar"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg
                ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
              `}
            >
              <span>Calendar</span>
            </NavLink>
          </div>

          {/* User Profile */}
          <div className="mb-1">
            <NavLink
              to="/profile"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg
                ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
              `}
            >
              <span>User Profile</span>
            </NavLink>
          </div>
        </div>

        {/* Forms Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-3 px-2">FORMS</h3>
          <div className="mb-1">
            <NavLink
              to="/forms"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg
                ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
              `}
            >
              <span>Form Elements</span>
            </NavLink>
          </div>
        </div>

        {/* OTHERS Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-3 px-2">OTHERS</h3>
          
          {/* Charts */}
          <div className="mb-2">
            <button 
              onClick={() => toggleMenu('charts')}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-700"
            >
              <div className="flex items-center">
                <span>Charts</span>
              </div>
              <span className={`transition-transform ${activeMenu === 'charts' ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            <div
              ref={el => menuRefs.current['charts'] = el}
              className="overflow-hidden transition-all duration-300"
              style={{ height: activeMenu === 'charts' ? `${menuRefs.current['charts']?.scrollHeight || 0}px` : '0px' }}
            >
              <div className="pl-12 py-1">
                <NavLink
                  to="/line-chart"
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-lg text-sm
                    ${isActive ? 'text-blue-400' : 'hover:text-gray-300'}
                  `}
                >
                  Line Chart
                </NavLink>
                <NavLink
                  to="/bar-chart"
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-lg text-sm
                    ${isActive ? 'text-blue-400' : 'hover:text-gray-300'}
                  `}
                >
                  Bar Chart
                </NavLink>
              </div>
            </div>
          </div>

          {/* UI Elements */}
          <div>
            <button 
              onClick={() => toggleMenu('elements')}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-700"
            >
              <div className="flex items-center">
                <span>UI Elements</span>
              </div>
              <span className={`transition-transform ${activeMenu === 'elements' ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            <div
              ref={el => menuRefs.current['elements'] = el}
              className="overflow-hidden transition-all duration-300"
              style={{ height: activeMenu === 'elements' ? `${menuRefs.current['elements']?.scrollHeight || 0}px` : '0px' }}
            >
              <div className="pl-12 py-1">
                <NavLink
                  to="/alerts"
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-lg text-sm
                    ${isActive ? 'text-blue-400' : 'hover:text-gray-300'}
                  `}
                >
                  Alerts
                </NavLink>
                <NavLink
                  to="/buttons"
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-lg text-sm
                    ${isActive ? 'text-blue-400' : 'hover:text-gray-300'}
                  `}
                >
                  Buttons
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="border-t border-gray-700 pt-4">
          <NavLink
            to="/help"
            className={({ isActive }) => `
              flex items-center p-3 rounded-lg
              ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
            `}
          >
            <span>Help Center</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;