import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import BannerImg from '../assets/images/class.jpg';

const ResetPassword = () => {
  const { token } = useParams(); // token from email
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext); // calls backend

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Password reset successfully! Redirecting to login...',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.message || 'Could not reset password. Token may be invalid or expired.',
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
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
          
          {/* Optional Left Image */}
          <div className="hidden md:block md:w-1/2">
            <img
              src={BannerImg}
              alt="Reset Password"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Reset Password
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>

              <Button
                type="submit"
                text="Reset Password"
                className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition duration-300"
              />
            </form>

            <div className="mt-6 text-center text-gray-600 text-sm">
              Remembered your password?{' '}
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

export default ResetPassword;
