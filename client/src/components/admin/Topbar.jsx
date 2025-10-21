import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaHome } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // update context + localStorage
    navigate('/login', { replace: true }); // SPA navigation
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition"
        >
          <FaHome className="text-2xl" />
          <h1 className="text-xl font-bold">Home</h1>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-2xl text-blue-900" />
          <span className="text-gray-700 font-medium hidden sm:inline">
            {user?.name || 'Admin'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
