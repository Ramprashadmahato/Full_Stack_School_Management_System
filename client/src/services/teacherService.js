// src/services/teacherService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token'); // Make sure token is stored after login

const teacherService = {
  // List all teachers
  listTeachers: async () => {
    const res = await fetch(`${API_BASE_URL}/teachers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to fetch teachers');
    }

    return await res.json();
  },

  // Get single teacher by ID
  getTeacher: async (id) => {
    const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to fetch teacher');
    }

    return await res.json();
  },

  // Add new teacher
  addTeacher: async (teacherData) => {
    const res = await fetch(`${API_BASE_URL}/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(teacherData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to add teacher');
    }

    const data = await res.json();
    return data.teacher;
  },

  // Update teacher by ID
  updateTeacher: async (id, teacherData) => {
    const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(teacherData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update teacher');
    }

    const data = await res.json();
    return data.teacher;
  },

  // Delete teacher by ID
  deleteTeacher: async (id) => {
    const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to delete teacher');
    }

    return await res.json();
  },

  // List all classes (for dropdown)
  listClasses: async () => {
    const res = await fetch(`${API_BASE_URL}/classes`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to fetch classes');
    }

    return await res.json();
  },
};

export default teacherService;
