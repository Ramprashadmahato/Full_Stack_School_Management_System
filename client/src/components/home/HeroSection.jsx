import React, { useEffect, useRef, useState } from 'react';
import HeroBackground from '../../assets/images/Background.jpg';
import { FaChevronDown } from 'react-icons/fa';
import settingService from '../../services/settingService'; // your settings API service

const HeroSection = () => {
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const [schoolData, setSchoolData] = useState({
    name: 'R.K. Boarding School',
    homepageText: 'Providing quality education and a nurturing environment for students to grow academically and personally.'
  });

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const data = await settingService.getSettings();
        if (data.length > 0) {
          const s = data[0];
          setSchoolData({
            name: s.schoolName || schoolData.name,
            homepageText: s.homepageText || schoolData.homepageText
          });
        }
      } catch (err) {
        console.error('Failed to fetch school data:', err);
      }
    };
    fetchSchoolData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Particle animation (black dots)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[600px] flex items-center justify-center text-center overflow-hidden px-4 md:px-16">
      {/* Background Image with dark gradient overlay */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.25)), url(${HeroBackground})`,
        }}
      ></div>

      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>

      {/* Floating gradient shapes */}
      <div className="absolute -top-20 -left-20 w-60 h-60 md:w-72 md:h-72 bg-gradient-to-tr from-blue-400 via-blue-200 to-blue-400 opacity-30 rounded-full animate-floatSlow"></div>
      <div className="absolute -bottom-28 -right-20 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-yellow-300 via-red-300 to-pink-400 opacity-30 rounded-full animate-float"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center space-y-4 md:space-y-6 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white animate-fadeIn hero-text-shadow">
          {schoolData.name}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 animate-fadeIn delay-200 hero-text-shadow">
          {schoolData.homepageText}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 animate-fadeIn delay-400 w-full sm:w-auto justify-center">
          <a
            href="/admissions"
            className="bg-gradient-to-r from-blue-600 to-blue-900 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:from-blue-700 hover:to-blue-950 text-sm sm:text-base"
          >
            Apply Now
          </a>
          <a
            href="/contact"
            className="bg-gradient-to-r from-white to-gray-100 text-blue-900 border border-blue-900 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:from-gray-100 hover:to-white text-sm sm:text-base"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="/" className="text-white">
          <FaChevronDown size={24} />
        </a>
      </div>

      {/* Animations and text shadow */}
      <style>
        {`
          .animate-fadeIn { animation: fadeIn 1s ease forwards; }
          .animate-fadeIn.delay-200 { animation-delay: 0.2s; }
          .animate-fadeIn.delay-400 { animation-delay: 0.4s; }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-bounce {
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .animate-float {
            animation: float 10s ease-in-out infinite;
          }
          .animate-floatSlow {
            animation: float 20s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
          }

          .hero-text-shadow {
            text-shadow:
              2px 2px 8px rgba(0,0,0,0.6),
              0 0 12px rgba(0,0,0,0.2);
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
