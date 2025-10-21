import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import BannerImg from '../assets/images/class.jpg';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pass email and password separately
      await login(form.email, form.password);

      // SweetAlert success
      await Swal.fire({
        title: 'Success!',
        text: 'Login Successful! Redirecting...',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
      });

      navigate('/');
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Invalid email or password',
        icon: 'error',
        confirmButtonText: 'OK',
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
            <img src={BannerImg} alt="Login Banner" className="w-full h-full object-cover" />
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Student Login</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center text-gray-700 text-sm">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  Remember Me
                </label>

                <span
                  className="text-blue-600 hover:underline cursor-pointer text-sm"
                  onClick={() => navigate('/forget-password')}
                >
                  Forgot Password?
                </span>
              </div>

              <Button
                type="submit"
                text="Login"
                className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition duration-300"
              />
            </form>

            <div className="mt-6 text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Register here
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
