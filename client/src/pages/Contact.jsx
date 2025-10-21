import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import messageService from '../services/messageService'; // <-- Import service

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const res = await messageService.submitMessage(formData); // Call backend
      setSuccess(res.message || 'Message sent successfully');
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Contact Section: Map Left with Overlay, Form Right */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start gap-8">

          {/* Left: Google Map */}
          <div className="md:w-1/2 w-full h-[500px] relative rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="R.K. Boarding School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.123456789!2d85.324567!3d27.708912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb193f1234567%3A0xabcdef1234567890!2sR.K.%20Boarding%20School%2C%20Mahattori!5e0!3m2!1sen!2snp!4v1234567890"
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Right: Contact Form */}
          <div className="md:w-1/2 w-full h-[500px]">
            <div className="bg-white rounded-xl shadow-xl p-8 h-full flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                Contact Us
              </h1>
              <p className="text-gray-700 mb-6 text-lg">
                Have any questions or want to reach us? Fill out the form below.
              </p>

              {success && <p className="text-green-600 mb-4">{success}</p>}

              <form className="space-y-6 flex-1 flex flex-col justify-between" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
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
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
