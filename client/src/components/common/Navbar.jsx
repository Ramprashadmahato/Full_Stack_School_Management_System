import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import * as noticeService from '../../services/noticeService';
import settingService from '../../services/settingService'; // ✅ default import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch unread notices count
  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return;
      try {
        const notices = await noticeService.getNotices();
        const unread = notices.filter(n => !n.isRead);
        setUnreadCount(unread.length);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
      }
    };
    fetchUnread();
  }, [user]);

  // Fetch logo from settings
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const data = await settingService.getSettings();
        if (data.length > 0 && data[0].logo) {
          setLogoUrl(settingService.getLogoUrl(data[0].logo));
        }
      } catch (err) {
        console.error('Failed to fetch logo:', err);
      }
    };
    fetchLogo();
  }, []);

  // Mark all as read
  const handleNoticeClick = async () => {
    if (!user) return;
    try {
      await noticeService.markAllAsRead();
      setUnreadCount(0);
      navigate('/notices');
    } catch (err) {
      console.error('Failed to mark notices as read:', err);
    }
  };

  const handleProfileClick = () => {
    if (user) navigate('/profile');
  };

  const handleUserIconClick = () => setShowAuthMenu(prev => !prev);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAuthMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-900 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/">
              {logoUrl ? (
                <img
                  className="h-12 w-12 border-2 rounded-full"
                  src={logoUrl}
                  alt="School Logo"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-300 rounded-full" /> // fallback
              )}
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className="hover:text-yellow-400">Home</NavLink>
            <NavLink to="/about" className="hover:text-yellow-400">About</NavLink>
            {user?.role === 'Admin' && (
              <NavLink to="/admin/dashboard" className="hover:text-yellow-400">Admin Dashboard</NavLink>
            )}
            {user && (
              <>
                <NavLink to="/contact" className="hover:text-yellow-400">Contact</NavLink>
                <NavLink to="/academics" className="hover:text-yellow-400">Academic</NavLink>
                <button
                  onClick={handleNoticeClick}
                  className="relative focus:outline-none"
                >
                  <BellIcon className="h-6 w-6 text-white hover:text-yellow-400 cursor-pointer" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}
            {!user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={handleUserIconClick} className="flex items-center focus:outline-none">
                  <FaUserCircle size={38} className="text-yellow-400 cursor-pointer" />
                </button>
                {showAuthMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                    <NavLink to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAuthMenu(false)}>Login</NavLink>
                    <NavLink to="/register" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAuthMenu(false)}>Register</NavLink>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleProfileClick} className="flex items-center focus:outline-none">
                {user.profileImage ? (
                  <img src={`${import.meta.env.VITE_UPLOADS_URL}/users/${user.profileImage}`} alt="Profile" className="h-10 w-10 rounded-full border-2 object-cover cursor-pointer" />
                ) : (
                  <FaUserCircle size={38} className="text-yellow-400 cursor-pointer" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-2">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-800 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 px-2 pt-2 pb-3 space-y-1">
          <NavLink to="/" className="block px-3 py-2 rounded hover:bg-blue-700">Home</NavLink>
          <NavLink to="/about" className="block px-3 py-2 rounded hover:bg-blue-700">About</NavLink>
          {user?.role === 'Admin' && <NavLink to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-blue-700">Admin Dashboard</NavLink>}
          {user && (
            <>
              <NavLink to="/contact" className="block px-3 py-2 rounded hover:bg-blue-700">Contact</NavLink>
              <NavLink to="/academics" className="block px-3 py-2 rounded hover:bg-blue-700">Academic</NavLink>
              <button onClick={handleNoticeClick} className="relative px-3 py-2 rounded hover:bg-blue-700 w-full">
                <BellIcon className="h-6 w-6 text-white hover:text-yellow-400 cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          )}
          {!user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={handleUserIconClick} className="flex items-center px-3 py-2 rounded hover:bg-blue-700 w-full">
                <FaUserCircle size={28} className="text-yellow-400 mr-2" />
                Menu
              </button>
              {showAuthMenu && (
                <div className="mt-1 bg-white text-black rounded shadow-lg z-50">
                  <NavLink to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAuthMenu(false)}>Login</NavLink>
                  <NavLink to="/register" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAuthMenu(false)}>Register</NavLink>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleProfileClick} className="flex items-center px-3 py-2 rounded hover:bg-blue-700 w-full">
              {user.profileImage ? (
                <img src={`${import.meta.env.VITE_UPLOADS_URL}/users/${user.profileImage}`} alt="Profile" className="h-8 w-8 rounded-full border-2 object-cover mr-2" />
              ) : (
                <FaUserCircle size={28} className="text-yellow-400 mr-2" />
              )}
              Profile
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
