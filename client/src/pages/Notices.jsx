import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import * as noticeService from '../services/noticeService';
import { AuthContext } from '../context/AuthContext';

const categories = ['All', 'Sports', 'Holidays', 'Meetings', 'Events'];

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        // Fetch notices excluding latest 3
        const data = await noticeService.getNotices({ excludeLatest: true });
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotices(sorted);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await noticeService.markAsRead(id);
      setNotices((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notice as read:', err);
    }
  };

  const filteredNotices = notices.filter(
    (notice) => selectedCategory === 'All' || notice.category === selectedCategory
  );

  return (
    <div>
      <Navbar />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">Notices</h1>
          <p className="text-center text-gray-700 mb-8 text-lg">
            Stay updated with the latest news, events, and announcements.
          </p>

          {/* Category Filter */}
          <div className="flex justify-center flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-blue-900 border border-blue-900 hover:bg-blue-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notices Grid */}
          {loading ? (
            <p className="text-center text-gray-500">Loading notices...</p>
          ) : filteredNotices.length === 0 ? (
            <p className="text-center text-gray-500">No notices found for the selected category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNotices.map((notice) => (
                <div
                  key={notice._id}
                  className={`bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300 relative overflow-hidden ${
                    !notice.isRead ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <span className="absolute top-4 right-4 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {new Date(notice.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">{notice.title}</h2>
                  <p className="text-gray-600 mb-2">
                    Category: <span className="font-semibold">{notice.category}</span>
                  </p>
                  <p className="text-gray-500 mb-4">{notice.description}</p>

                  {!notice.isRead && user && (
                    <button
                      onClick={() => handleMarkAsRead(notice._id)}
                      className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Notices;
