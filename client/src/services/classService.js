const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/classes`;

// ✅ Helper to include JWT token in all requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // token saved after login
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const classService = {
  // ===============================
  // Public APIs (for users)
  // ===============================

  // Get all active classes (public)
  getPublicClasses: async () => {
    const res = await fetch(`${BASE_URL}/public`); // public endpoint
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json(); // backend already returns only Active classes
  },

  // ===============================
  // Admin APIs (requires auth)
  // ===============================

  // Get all classes (Admin protected)
  listClasses: async () => {
    const res = await fetch(BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
  },

  // Get single class by ID (Admin protected)
  getClass: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch class details');
    return res.json();
  },

  // Add new class (Admin only)
  addClass: async (data) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add class');
    return res.json();
  },

  // Update existing class (Admin only)
  updateClass: async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update class');
    return res.json();
  },

  // Delete class (Admin only)
  deleteClass: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete class');
    return res.json();
  },
};

export default classService;
