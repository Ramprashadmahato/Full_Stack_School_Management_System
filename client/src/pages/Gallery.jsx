import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { getGallery } from '../services/galleryService';

// Match your backend categories exactly
const categories = ['All', 'events', 'Sport', 'Holiday program'];

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const items = await getGallery(false, true); // exclude latest
        setMediaItems(items);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch gallery:', err.message);
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? mediaItems
      : mediaItems.filter((item) => item.category === activeCategory);

  if (loading) return <p className="text-center py-10">Loading gallery...</p>;
  if (filteredItems.length === 0)
    return <p className="text-center py-10">No media found.</p>;

  return (
    <div>
      <Navbar />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
            Gallery
          </h1>
          <p className="text-center text-gray-700 mb-8 text-lg md:text-xl">
            Explore our school events, activities, and campus moments.
          </p>

          {/* Category Filter Buttons */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border transition ${
                  activeCategory === cat
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="relative overflow-hidden rounded-xl shadow-lg bg-white"
              >
                {item.mediaType === 'video' ? (
                  <video
                    src={item.mediaUrl}
                    className="w-full h-56 object-cover"
                    controls
                    title={item.title}
                  />
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                {/* Title & Description */}
                <div className="p-3">
                  <h3 className="text-blue-900 font-semibold text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
