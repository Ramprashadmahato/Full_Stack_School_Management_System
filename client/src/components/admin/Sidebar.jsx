import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBell,
  FaImage,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEnvelope,
  FaCogs,
  FaBook,
  FaBars
} from 'react-icons/fa';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // sidebar collapsed state

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Notices', path: '/admin/manage-notices', icon: <FaBell /> },
    { name: 'Gallery', path: '/admin/manage-gallery', icon: <FaImage /> },
    { name: 'Admissions', path: '/admin/manage-admissions', icon: <FaUserGraduate /> },
    { name: 'Classes', path: '/admin/manage-classes', icon: <FaBook /> },
    { name: 'Students', path: '/admin/manage-students', icon: <FaChalkboardTeacher /> },
    { name: 'Teachers', path: '/admin/manage-teachers', icon: <FaChalkboardTeacher /> },
    { name: 'Users', path: '/admin/manage-users', icon: <FaUserGraduate/> },
    { name: 'Messages', path: '/admin/manage-messages', icon: <FaEnvelope /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCogs /> },
  ];

  return (
    <div className={`bg-blue-900 text-white min-h-screen p-4 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Top toggle button */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && <h2 className="text-2xl font-bold">Admin Panel</h2>}
        <button
          className="text-white text-xl p-2 hover:bg-blue-800 rounded"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>
      </div>

      {/* Menu Links */}
      <ul className="flex-1 space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
                  isActive ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-800'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {!collapsed && <span className="ml-3">{link.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto text-center text-gray-200 text-sm">
          Logged in as <span className="font-semibold">Admin</span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
