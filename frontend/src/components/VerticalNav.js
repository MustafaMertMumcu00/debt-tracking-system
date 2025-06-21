import React from 'react';
import { NavLink } from 'react-router-dom';

const DashboardIcon = () => (
  <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
);

function VerticalNav() {
  const baseLinkClasses = "flex items-center px-4 py-3 rounded-lg text-lg transition-colors duration-200";
  const inactiveLinkClasses = "text-gray-400 hover:bg-white/5 hover:text-white";
  const activeLinkClasses = "bg-blue-600 text-white font-semibold shadow-lg";

  return (
    <aside className="w-64 bg-gray-900/40 backdrop-blur-xl h-screen p-4 flex flex-col sticky top-16 border-r border-gray-700/50">
      <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 px-2">Navİgasyon</h2>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => 
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <DashboardIcon />
              Kontrol Paneli
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default VerticalNav;