import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BannerImg from '../assets/images/Meeting.jpg';
import admissionService from '../services/admissionService';

const Admissions = () => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    parentContact: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await admissionService.submitAdmission(formData);
      setSuccess(response.message || 'Admission inquiry submitted successfully!');
      setFormData({ name: '', grade: '', parentContact: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit admission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Admission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

          {/* Left Image */}
          <div className="md:w-1/2 w-full">
            <img
              src={BannerImg}
              alt="Admissions Banner"
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Admissions Inquiry
            </h1>
            <p className="text-gray-700 mb-6 text-lg">
              Fill out the inquiry form below to start the admission process.
            </p>

            <form
              className="bg-white p-8 rounded-xl shadow-md space-y-6"
              onSubmit={handleSubmit}
            >
              {success && <p className="text-green-700 font-medium">{success}</p>}
              {error && <p className="text-red-600 font-medium">{error}</p>}

              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
                required
              />

              <input
                type="text"
                name="grade"
                placeholder="Grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
                required
              />

              <input
                type="text"
                name="parentContact"
                placeholder="Parent Contact"
                value={formData.parentContact}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
                required
              />

              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none h-32 resize-none"
              />

              <button
                type="submit"
                className={`w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admissions;
