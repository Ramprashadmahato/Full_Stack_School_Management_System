import React, { useState, useContext } from 'react';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import BannerImg from '../assets/images/class.jpg';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); // Track if email is sent

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true); // Mark email as sent
      setEmail(''); // Clear input

      Swal.fire({
        title: 'Email Sent!',
        text: 'Check your inbox for the password reset link.',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to send reset email',
        icon: 'error',
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
            <img
              src={BannerImg}
              alt="Forgot Password Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Forgot Password
            </h1>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  text={loading ? 'Sending...' : 'Send Reset Link'}
                  className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition duration-300"
                  disabled={loading}
                />
              </form>
            ) : (
              <div className="text-center text-green-600 text-lg font-medium">
                ✅ Password reset link sent! Check your inbox.
              </div>
            )}

            <div className="mt-6 text-center text-gray-600 text-sm">
              Remembered your password?{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => window.location.href = '/login'}
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

export default ForgotPassword;
