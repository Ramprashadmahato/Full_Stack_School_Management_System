import React from 'react';
import { FaUsers, FaBell, FaBook, FaChalkboardTeacher, FaEnvelope } from 'react-icons/fa';

const iconMap = {
  'Total Notices': <FaBell className="text-blue-500 text-3xl" />,
  'Total Messages': <FaEnvelope className="text-green-500 text-3xl" />,
  'Total Classes': <FaBook className="text-yellow-500 text-3xl" />,
  'Total Students': <FaUsers className="text-purple-500 text-3xl" />,
  'Total Teachers': <FaChalkboardTeacher className="text-red-500 text-3xl" />,
};

const DashboardCard = ({ title, count }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300">
      <div className="mb-4">{iconMap[title]}</div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold text-blue-900 mt-1">{count}</p>
    </div>
  );
};

export default DashboardCard;
