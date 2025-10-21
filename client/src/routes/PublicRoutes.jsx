import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Admissions from '../pages/Admissions';
import Academics from '../pages/Academics';
import Gallery from '../pages/Gallery';
import Notices from '../pages/Notices';
import Contact from '../pages/Contact';
import StudentLogin from '../pages/Login';
import StudentRegister from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import { AuthContext } from '../context/AuthContext';
import ProtectedRoute from '../context/ProtectedRoute';

const PublicRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/academics" element={<Academics />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/notices" element={<Notices />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth pages: hide login/register if already logged in */}
      {!user && (
        <>
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </>
      )}

      {/* Profile: accessible only if logged in */}
      {user && (
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={['Admin', 'Student', 'Teacher']}>
              <Profile />
            </ProtectedRoute>
          }
        />
      )}
    
    </Routes>
  );
};

export default PublicRoutes;
