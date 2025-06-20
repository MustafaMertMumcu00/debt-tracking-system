import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3Z" className="fill-current text-blue-600"/>
    <path d="M13.5 19.5L10 16L11.41 14.59L13.5 16.67L20.59 9.59L22 11L13.5 19.5Z" className="fill-current text-white"/>
  </svg>
);

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900/60 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-gray-700/50">
      {/* Geniş ekranlarda içeriğin çok yayılmasını önlemek için max-w-7xl eklendi */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex-shrink-0 flex items-center gap-3 group">
              <Logo />
              <span className="text-2xl font-bold text-white tracking-wider group-hover:text-blue-400 transition-colors duration-200">
                Borç Takip Sistemi
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              // Gelişmiş Kullanıcı Menüsü (Giriş yapıldığında)
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="flex items-center gap-2 rounded-full bg-gray-800 p-1 text-sm text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors">
                    <span className="sr-only">Open user menu</span>
                    <FaUserCircle className="h-8 w-8" />
                    <span className="hidden sm:inline pr-2">{user?.name || 'My Account'}</span>
                  </MenuButton>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700">
                    <MenuItem>
                      {({ active }) => (
                        <a href="#" className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-sm text-gray-200`}>
                          Your Profile
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a href="#" className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-sm text-gray-200`}>
                          Settings
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${active ? 'bg-red-600/80' : ''} w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 font-semibold`}
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            ) : (
              // Giriş yapılmadığında gösterilecek butonlar
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-blue-500/20">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;