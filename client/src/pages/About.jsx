import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { FaBookOpen, FaFlask, FaBusAlt } from 'react-icons/fa';
import BannerImg from '../assets/images/Meeting.jpg'; // Top banner
import TeacherImg from '../assets/images/Teachers.jpg'; // Principal image

const About = () => {
  return (
    <div>
      <Navbar />

      {/* Top Banner Image */}
      <section className="w-full h-64 md:h-96">
        <img
          src={BannerImg}
          alt="R.K. Boarding School Banner"
          className="w-full h-full object-cover"
        />
      </section>

      {/* About Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 text-center md:text-left">
          <h2 className="text-4xl font-bold text-blue-900 mb-6 border-b-2 border-blue-800 inline-block pb-2">
            About Us
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            R.K. Boarding School, Mahattori is dedicated to providing quality education
            that nurtures intellectual growth, creativity, and character development.
            We strive to help every student realize their full potential and become
            lifelong learners.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Established in <strong>2010</strong>, our school combines modern teaching
            methodologies with strong moral foundations. With experienced teachers,
            excellent facilities, and active parental engagement, we aim to build a
            community of responsible and skilled individuals.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">
            Our Vision & Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg shadow">
              <h3 className="text-2xl font-semibold text-blue-800 mb-3">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become a leading educational institution that fosters innovation,
                discipline, and compassion — preparing students to meet global challenges
                with confidence and integrity.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow">
              <h3 className="text-2xl font-semibold text-blue-800 mb-3">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To deliver high-quality education that promotes academic excellence,
                ethical values, and holistic development through modern learning
                techniques and student-centered teaching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Principal’s Message
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={TeacherImg}
              alt="Principal"
              className="w-48 h-48 rounded-full shadow-md mx-auto md:mx-0 object-cover"
            />
            <p className="text-gray-700 leading-relaxed text-center md:text-left">
              “At R.K. Boarding School, we believe education is not only about achieving
              academic success but also about building strong character and empathy.
              Our dedicated team of teachers strives to create a nurturing environment
              where students learn, grow, and lead with confidence.”
              <br />
              <span className="block mt-4 font-semibold text-blue-800">
                – Mr. Ramesh Kumar Mahato, Principal
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">
            Our Facilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg shadow text-center">
              <FaBookOpen className="text-4xl text-blue-800 mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-blue-800">Library</h3>
              <p className="text-gray-600">
                Well-stocked library with books and digital resources for research.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg shadow text-center">
              <FaFlask className="text-4xl text-blue-800 mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-blue-800">Laboratories</h3>
              <p className="text-gray-600">
                Fully equipped labs for science and computer studies.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg shadow text-center">
              <FaBusAlt className="text-4xl text-blue-800 mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-blue-800">Hostel & Transport</h3>
              <p className="text-gray-600">
                Comfortable hostel accommodations and reliable transport facilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
