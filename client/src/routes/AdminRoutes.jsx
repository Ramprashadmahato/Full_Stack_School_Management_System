import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageNotices from '../pages/admin/ManageNotices';
import ManageGallery from '../pages/admin/ManageGallery';
import ManageAdmissions from '../pages/admin/ManageAdmissions';
import ManageClasses from '../pages/admin/ManageClasses';
import ManageStudents from '../pages/admin/ManageStudents';
import ManageTeachers from '../pages/admin/ManageTeachers';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageMessages from '../pages/admin/ManageMessages';
import Settings from '../pages/admin/Settings';
import ProtectedRoute from '../context/ProtectedRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Redirect /admin to /admin/dashboard
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} /> */}

      {/* All Admin Pages wrapped in ProtectedRoute */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-notices"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageNotices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-gallery"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageGallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-admissions"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageAdmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-classes"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-students"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-teachers"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-messages"
        element={
          <ProtectedRoute roles={['Admin']}>
            <ManageMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute roles={['Admin']}>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
