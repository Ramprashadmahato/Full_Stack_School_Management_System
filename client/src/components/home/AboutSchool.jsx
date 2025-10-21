import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import aboutImg from '../../assets/images/Playground.jpg'; // ✅ make sure this path is correct

const AboutSchool = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Image */}
        <div className="relative">
          <img
            src={aboutImg}
            alt="Our School"
            className="w-full h-[420px] object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-blue-900/10 rounded-2xl"></div>
        </div>

        {/* Right: Content */}
        <div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4 leading-tight">
            Welcome to <span className="text-blue-600">Our School</span>
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our school is committed to providing a dynamic and inclusive learning environment 
            where every student is encouraged to explore their potential and pursue excellence. 
            We believe in nurturing well-rounded individuals by balancing academics, creativity, 
            leadership, and moral values.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            With a passionate team of educators and state-of-the-art facilities, we empower 
            students to become confident, responsible, and compassionate members of society, 
            ready to take on the challenges of tomorrow.
          </p>

          {/* Read More Button */}
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 bg-white border border-blue-300 hover:border-blue-500 text-blue-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            <span>Read More</span>
            <FaArrowRight className="text-blue-900" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSchool;
