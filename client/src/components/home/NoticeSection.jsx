import React, { useState, useEffect, useContext } from 'react';
import { FaRegBell, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as noticeService from '../../services/noticeService';
import { AuthContext } from '../../context/AuthContext';

const NoticeSection = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        // Fetch only the latest 3 notices for homepage
        const data = await noticeService.getNotices({ latest: true });
        setNotices(data);
      } catch (err) {
        console.error('Failed to fetch latest notices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [user]);

  return (
    <section className="py-16 bg-blue-50 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 z-10">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">Latest Notices</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading notices...</p>
        ) : notices.length === 0 ? (
          <p className="text-center text-gray-500">No notices available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="flex flex-col justify-between bg-white border-l-4 border-blue-900 p-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <FaRegBell className="text-blue-900 text-xl" />
                  <p className="text-lg font-semibold text-blue-900">{notice.title}</p>
                </div>
                <p className="text-gray-700 mb-2">{notice.description}</p>
                <span className="text-gray-500 text-sm font-medium">
                  {new Date(notice.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 ">
          <Link
            to="/notices"
            className="inline-flex items-center space-x-2 bg-white border border-blue-300 hover:border-blue-500 text-blue-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span>View All Notices</span>
            <FaArrowRight className="text-blue-900 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;
