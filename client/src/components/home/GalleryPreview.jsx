import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { getGallery } from '../../services/galleryService';

const GalleryPreview = () => {
  const [latestMedia, setLatestMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const items = await getGallery(true, false); // latest=true
        setLatestMedia(items);
      } catch (err) {
        console.error('❌ Failed to fetch latest gallery:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) return <p className="text-center py-10">Loading gallery...</p>;
  if (latestMedia.length === 0) return <p className="text-center py-10">No media found.</p>;

  const handleImageError = (e) => {
    e.target.src = '/fallback-image.png'; // optional fallback image in public folder
  };

  return (
    <section className="py-20 bg-blue-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Top Section Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-3">Gallery</h2>
          <p className="text-gray-700 text-lg">
            A glimpse into our vibrant events, achievements, and student life.
          </p>
        </div>

        {/* Latest Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestMedia.map((item) => (
            <div
              key={item._id}
              className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              {item.mediaType === 'video' ? (
                <video
                  src={item.mediaUrl}
                  className="w-full h-56 object-cover"
                  controls
                />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  onError={handleImageError}
                  className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">View</span>
              </div>

              {/* Title & Description */}
              <div className="p-3 bg-white border-t mt-0">
                <h3 className="text-blue-900 font-semibold text-lg">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Gallery Button */}
        <div className="mt-12">
          <Link
            to="/gallery"
            className="inline-flex items-center space-x-2 bg-white border border-blue-300 hover:border-blue-500 text-blue-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span>View Full Gallery</span>
            <FaArrowRight className="text-blue-900 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
