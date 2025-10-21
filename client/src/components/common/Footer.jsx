import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import settingService from '../../services/settingService';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingService.getSettings();
        if (data.length > 0) {
          const s = data[0];
          setSettings({
            logo: settingService.getLogoUrl(s.logo),
            phone: s.phone || '+977 1234567890',
            email: s.email || 'info@rkboardingschool.edu.np',
            address: s.address || 'Mahattori, Nepal',
            facebook: s.facebook || 'https://facebook.com',
            twitter: s.twitter || 'https://twitter.com',
            instagram: s.instagram || 'https://instagram.com',
            tiktok: s.tiktok || 'https://tiktok.com',
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-blue-900 text-white mt-10">
      <div className="max-w-7xl h-60 mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-start space-y-4">
          {settings?.logo ? (
            <img
              src={settings.logo}
              alt="School Logo"
              className="h-16 w-16 rounded-full border-2"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-300 rounded-full border-2" />
          )}
          <p className="text-gray-300 text-sm leading-relaxed">
            R.K. Boarding School, Mahattori, Nepal. Dedicated to academic excellence and holistic development since 1990.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-yellow-400 font-semibold mb-3">Quick Links</h3>
          <a href="/" className="hover:text-yellow-400 transition-colors">Home</a>
          <a href="/about" className="hover:text-yellow-400 transition-colors">About</a>
          <a href="/admissions" className="hover:text-yellow-400 transition-colors">Admissions</a>
          <a href="/academics" className="hover:text-yellow-400 transition-colors">Academics</a>
          <a href="/contact" className="hover:text-yellow-400 transition-colors">Contact</a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-yellow-400 font-semibold mb-3">Contact Us</h3>
          <p className="flex items-center text-gray-300 space-x-2">
            <FaMapMarkerAlt /> <span>{settings?.address || 'Mahattori, Nepal'}</span>
          </p>
          <p className="flex items-center text-gray-300 space-x-2">
            <FaPhoneAlt /> <span>{settings?.phone || '+977 1234567890'}</span>
          </p>
          <p className="flex items-center text-gray-300 space-x-2">
            <FaEnvelope /> <span>{settings?.email || 'info@rkboardingschool.edu.np'}</span>
          </p>
        </div>

        {/* Social Media */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-yellow-400 font-semibold mb-3">Follow Us</h3>
          <p className="text-gray-300 text-sm mt-2">
            Stay connected! Follow us on social media for the latest news, upcoming events, and school updates.
          </p>
          <div className="flex space-x-4">
            <a href={settings?.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition-colors">
              <FaFacebookF size={22} />
            </a>
            <a href={settings?.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition-colors">
              <FaTwitter size={22} />
            </a>
            <a href={settings?.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition-colors">
              <FaInstagram size={22} />
            </a>
            <a href={settings?.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition-colors">
              <FaTiktok size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-blue-800 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400 text-sm">
          &copy; 2025 R.K. Boarding School. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
