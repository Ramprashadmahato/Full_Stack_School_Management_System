import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BannerImg from '../assets/images/Playground.jpg';
import classService from '../services/classService.js'; // import service

const Academics = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch classes from backend on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getPublicClasses(); // Make sure backend route returns public classes
        setClasses(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load classes.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <Navbar />

      {/* Top Banner */}
      <section className="w-full h-64 md:h-96 relative">
        <img
          src={BannerImg}
          alt="Academics Banner"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Academics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-700 mb-12 text-lg md:text-xl">
            Our curriculum ensures holistic education, academic excellence, and extra-curricular opportunities.
          </p>

          {loading ? (
            <p className="text-center text-gray-500">Loading classes...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : classes.length === 0 ? (
            <p className="text-center text-gray-500">No classes available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {classes.map((cls) => (
                <div
                  key={cls._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="font-bold text-2xl text-blue-900 mb-4 border-b-2 border-blue-800 pb-2">
                    {cls.name}
                  </h2>

                  {/* Teacher Name */}
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Class Teacher:</span> {cls.teacher}
                  </p>

                  {/* Academic Year */}
                  {/* <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Academic Year:</span> {cls.academicYear}
                  </p> */}

                  {/* Number of Students */}
                  {/* <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Number of Students:</span> {cls.numberOfStudents}
                  </p> */}

                  {/* Status */}
                  {/* <p className={`mb-4 font-semibold ${cls.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {cls.status}
                  </p> */}

                  {/* Subjects */}
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {cls.subjects.map((subj, i) => (
                      <li key={i}>{subj}</li>
                    ))}
                  </ul>
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

export default Academics;
