import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaBook, FaImages, FaBell, FaPhoneAlt } from 'react-icons/fa';

const links = [
  { name: 'Admissions', path: '/admissions', icon: <FaGraduationCap />, desc: 'Apply for enrollment and explore our admission process.' },
  { name: 'Academics', path: '/academics', icon: <FaBook />, desc: 'Check our curriculum, courses, and academic programs.' },
  { name: 'Gallery', path: '/gallery', icon: <FaImages />, desc: 'Explore photos and memories from school events.' },
  { name: 'Notices', path: '/notices', icon: <FaBell />, desc: 'Stay updated with latest announcements and circulars.' },
  { name: 'Contact', path: '/contact', icon: <FaPhoneAlt />, desc: 'Get in touch with us for any queries or support.' },
];

const QuickLinks = () => {
  return (
    <section id="quick-links" className="py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
          Quick Links
        </h2>
        <p className="text-gray-700 text-lg mb-12">
          Navigate quickly to important sections of our school website and get the information you need.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="flex flex-col justify-between bg-white border border-blue-200 hover:border-blue-400 shadow-md hover:shadow-xl rounded-xl px-6 py-6 transition-all hover:-translate-y-1 hover:bg-blue-50"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-blue-900 text-2xl">{link.icon}</span>
                <span className="text-xl font-semibold text-blue-900">{link.name}</span>
              </div>
              <p className="text-gray-600 text-sm">{link.desc}</p>
              <div className="mt-4 text-right">
                <FaArrowRight className="text-blue-900 inline-block transition-transform hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
