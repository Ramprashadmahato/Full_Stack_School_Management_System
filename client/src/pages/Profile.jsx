import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Swal from 'sweetalert2';
import api from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx'; // Import AuthContext

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Get logout function from context

  const [profile, setProfile] = useState({ name: '', email: '', profileImage: null });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

  // Fetch profile
  const getProfile = async () => {
    setLoading(true);
    try {
      const data = await api.fetchProfile();
      setProfile(data.user || data);
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to fetch profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Handle file change and set preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  // Update profile
  const handleProfileUpdate = async () => {
    if (!profile.name || !profile.email) {
      Swal.fire('Error', 'Name and Email are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      if (file) formData.append('image', file);

      const data = await api.updateProfile(formData);
      setProfile(data.user || data);
      setFile(null);
      setPreview(null);
      setIsEditing(false);
      Swal.fire('Success', 'Profile updated successfully', 'success');
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      Swal.fire('Error', 'Please fill all password fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.changePassword(passwords.oldPassword, passwords.newPassword);
      setPasswords({ oldPassword: '', newPassword: '' });
      setIsChangingPassword(false);
      Swal.fire('Success', data.message || 'Password changed successfully', 'success');
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout using AuthContext
  const handleLogout = () => {
    logout(); // clear user/token from context & localStorage
    navigate('/login'); // redirect to login page
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : profile.profileImage ? (
                  <img
                    src={`${import.meta.env.VITE_UPLOADS_URL}/users/${profile.profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-semibold text-lg sm:text-xl">
                    No Image
                  </div>
                )}
              </div>

              {/* Display or Edit Mode */}
              {!isEditing ? (
                <>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">{profile.name}</h2>
                  <p className="text-gray-500 sm:text-lg">{profile.email}</p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
                    <Button
                      text="Edit Profile"
                      className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                      onClick={() => setIsEditing(true)}
                    />
                    <Button
                      text="Change Password"
                      className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                      onClick={() => setIsChangingPassword(true)}
                    />
                    <Button
                      text="Logout"
                      className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 transition"
                      onClick={handleLogout} // ✅ Use AuthContext logout
                    />
                  </div>
                </>
              ) : (
                // Edit Profile Form
                <div className="w-full mt-6 flex flex-col gap-4 sm:w-3/4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Email"
                  />
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <Button
                      text="Save"
                      className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                      onClick={handleProfileUpdate}
                    />
                    <Button
                      text="Cancel"
                      className="flex-1 bg-gray-400 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-500 transition"
                      onClick={() => {
                        setIsEditing(false);
                        setPreview(null);
                        setFile(null);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Change Password */}
              {isChangingPassword && (
                <div className="w-full mt-8 p-6 sm:w-3/4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Change Password</h3>
                  <div className="flex flex-col gap-4">
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button
                      text="Save"
                      className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                      onClick={handlePasswordChange}
                    />
                    <Button
                      text="Cancel"
                      className="flex-1 bg-gray-400 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-500 transition"
                      onClick={() => setIsChangingPassword(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
