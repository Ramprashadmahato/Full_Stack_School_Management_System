import React, { createContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const showAlert = (type, title, text, timer = 2000) => {
    Swal.fire({ icon: type, title, text, timer, showConfirmButton: false });
  };

  // Fetch user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ===== PROFILE =====
  const fetchProfile = async () => {
    try {
      const data = await api.fetchProfile();
      const profileUser = data.user || data;
      setUser(profileUser);
      localStorage.setItem('user', JSON.stringify(profileUser));
      return profileUser;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
      return null;
    }
  };

  const updateProfile = async (formData) => {
    try {
      const data = await api.updateProfile(formData);
      const updatedUser = data.user || data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showAlert('success', 'Profile Updated', data.message || 'Your profile has been updated');
      return updatedUser;
    } catch (error) {
      showAlert('error', 'Failed', error.message || 'Could not update profile');
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const data = await api.changePassword(oldPassword, newPassword);
      showAlert('success', 'Password Changed', data.message || 'Your password has been updated');
      return data;
    } catch (error) {
      showAlert('error', 'Failed', error.message || 'Could not change password');
      throw new Error(error.message || 'Failed to change password');
    }
  };

  // ===== AUTH =====
  const login = async (email, password) => {
    try {
      const data = await api.loginUser(email, password);
      const loggedInUser = data.user || data;

      if (!loggedInUser.token) throw new Error('No token returned from login');

      localStorage.setItem('token', loggedInUser.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      showAlert('success', 'Login Successful!', `Welcome back, ${loggedInUser.name || ''}`);
      return loggedInUser;
    } catch (error) {
      showAlert('error', 'Login Failed', error.message || 'Please check your credentials');
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (formData) => {
    try {
      // Send FormData to backend
      await api.registerUser(formData);

      // Auto-login after registration
      const email = formData.get('email');
      const password = formData.get('password');

      if (!email || !password) throw new Error('Email or password missing for auto-login');

      return await login(email, password);
    } catch (error) {
      showAlert('error', 'Registration Failed', error.message || 'Email may already exist');
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showAlert('info', 'Logged Out', 'You have been logged out', 1500);
  };

  const forgotPassword = async (email) => {
    try {
      const data = await api.forgotPassword(email);
      showAlert('success', 'Email Sent', data.message || 'Check your inbox for reset instructions', 2500);
      return data;
    } catch (error) {
      showAlert('error', 'Failed', error.message || 'Could not send reset email');
      throw new Error(error.message || 'Failed to send password reset email');
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const data = await api.resetPassword(token, newPassword);
      showAlert('success', 'Password Reset', data.message || 'Your password has been updated', 2500);
      return data;
    } catch (error) {
      showAlert('error', 'Failed', error.message || 'Could not reset password');
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchProfile,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
