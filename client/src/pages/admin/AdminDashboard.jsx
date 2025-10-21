import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import DashboardCard from '../../components/admin/DashboardCard';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [stats, setStats] = useState([
    { title: 'Total Notices', count: 0 },
    { title: 'Total Messages', count: 0 },
    { title: 'Total Classes', count: 0 },
    { title: 'Total Students', count: 0 },
    { title: 'Total Teachers', count: 0 },
  ]);

  // ✅ Replace with your details
  const WHATSAPP_NUMBER = '9779826872678'; // Your WhatsApp number (no + or 0)
  const WHATSAPP_MESSAGE = 'Hello sir, how can I help you?';
  const MESSENGER_LINK = 'https://m.me/100052621389758'; // Replace with your real Messenger username/page link

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      const data = await res.json();

      setStats([
        { title: 'Total Notices', count: data.noticesCount || 0 },
        { title: 'Total Messages', count: data.messagesCount || 0 },
        { title: 'Total Classes', count: data.classesCount || 0 },
        { title: 'Total Students', count: data.studentsCount || 0 },
        { title: 'Total Teachers', count: data.teachersCount || 0 },
      ]);
    } catch (err) {
      console.error('❌ Failed to fetch dashboard stats:', err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dashboard Cards */}
        <div className="p-6 flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <DashboardCard key={index} title={stat.title} count={stat.count} />
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Floating Chat Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end">

        {/* Messenger Button */}
        <a
          href={MESSENGER_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center animate-pulse-messenger group"
          title="Chat on Messenger"
        >
          <FaFacebookMessenger className="text-3xl" />
          <span className="absolute right-full mr-3 bg-blue-600 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300">
            Messenger
          </span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center animate-pulse-whatsapp group"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-3xl" />
          <span className="absolute right-full mr-3 bg-green-500 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300">
            WhatsApp
          </span>
        </a>
      </div>

      {/* ✅ Custom Animation Styles */}
      <style jsx>{`
        @keyframes pulse-whatsapp {
          0% {
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.6);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(72, 187, 120, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
          }
        }

        @keyframes pulse-messenger {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 89, 152, 0.6);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(59, 89, 152, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 89, 152, 0);
          }
        }

        .animate-pulse-whatsapp {
          animation: pulse-whatsapp 1.5s infinite;
        }

        .animate-pulse-messenger {
          animation: pulse-messenger 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
