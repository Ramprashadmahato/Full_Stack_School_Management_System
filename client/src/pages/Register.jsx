import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import BannerImg from '../assets/images/class.jpg';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', form.name);
      formDataObj.append('email', form.email);
      formDataObj.append('password', form.password);
      if (form.profileImage) {
        formDataObj.append('image', form.profileImage); // Must match backend multer field
      }

      await register(formDataObj);

      // SweetAlert success popup
      Swal.fire({
        title: 'Success!',
        text: 'Registration Successful! Redirecting to Home...',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        showCloseButton: true,
      });

      // Redirect after alert
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      // SweetAlert error popup
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Registration failed',
        icon: 'error',
        confirmButtonText: 'OK',
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Left Image */}
          <div className="md:w-1/2 h-64 md:h-auto">
            <img src={BannerImg} alt="Register Banner" className="w-full h-full object-cover" />
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Student Register</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                text="Register"
                className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition duration-300"
              />
            </form>

            <div className="mt-6 text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login here
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
