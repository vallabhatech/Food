
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, ChatRequestStatus } from '../../types';
import { useData } from '../../contexts/DataContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { chatRequests } = useData();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = "text-gray-600 hover:bg-green-100 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeNavLinkClasses = "bg-green-200 text-green-900";

  const pendingRequestCount = currentUser 
    ? chatRequests.filter(r => r.toUserId === currentUser.id && r.status === ChatRequestStatus.Pending).length
    : 0;

  const renderNavLinks = () => (
    <>
      <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Home</NavLink>
      <NavLink to="/community" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Community</NavLink>
      <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>About</NavLink>
      <NavLink to="/contact" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Contact</NavLink>
      {currentUser?.role === UserRole.Admin && (
        <NavLink to="/admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Admin</NavLink>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
              <i className="fas fa-hand-holding-heart text-green-600 text-2xl"></i>
              <span className="text-xl font-bold text-green-800">NourishNet</span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {renderNavLinks()}
            </div>
          </div>
          <div className="hidden md:block">
            {currentUser ? (
              <div className="ml-4 flex items-center md:ml-6">
                <NavLink to="/chat" className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <i className="fas fa-comments text-xl"></i>
                    {pendingRequestCount > 0 && (
                       <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{pendingRequestCount}</span>
                    )}
                </NavLink>
                <NavLink to="/my-claims" className="relative ml-4 p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <i className="fas fa-shopping-cart text-xl"></i>
                </NavLink>

                <div className="ml-3 relative">
                  <div>
                    <button onClick={() => navigate('/dashboard')} className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src={currentUser.avatarUrl} alt="" />
                    </button>
                  </div>
                </div>
                <button onClick={handleLogout} className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                Login
              </NavLink>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks()}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {currentUser ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={currentUser.avatarUrl} alt="" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-gray-800">{currentUser.name}</div>
                  <div className="text-sm font-medium leading-none text-gray-500">{currentUser.email}</div>
                </div>
                <NavLink to="/chat" className="relative ml-auto flex-shrink-0 p-1 rounded-full text-gray-500 hover:text-gray-700">
                    <i className="fas fa-comments text-xl"></i>
                    {pendingRequestCount > 0 && (
                       <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{pendingRequestCount}</span>
                    )}
                </NavLink>
                 <NavLink to="/my-claims" className="relative ml-2 flex-shrink-0 p-1 rounded-full text-gray-500 hover:text-gray-700">
                    <i className="fas fa-shopping-cart text-xl"></i>
                </NavLink>
              </div>
            ) : (
               <div className="mt-3 px-2 space-y-1">
                 <NavLink to="/login" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">Login</NavLink>
               </div>
            )}
             <div className="mt-3 px-2 space-y-1">
                {currentUser && <NavLink to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100">Your Dashboard</NavLink>}
                {currentUser && <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100">Logout</button>}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;