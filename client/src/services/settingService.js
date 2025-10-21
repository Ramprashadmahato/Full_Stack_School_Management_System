const API_BASE = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL;

// ========== Helper for requests ==========
const request = async (url, options = {}) => {
  const token = localStorage.getItem('token'); // if you use auth
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Don't set Content-Type if body is FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ========== CRUD METHODS ==========
const getSettings = () => request('/setting', { method: 'GET' });

const createSettings = (formData) =>
  request('/setting', { method: 'POST', body: formData });

const updateSettings = (id, formData) =>
  request(`/setting/${id}`, { method: 'PUT', body: formData });

const deleteSettings = (id) =>
  request(`/setting/${id}`, { method: 'DELETE' });

// ========== Helper to get full image URL ==========
const getLogoUrl = (filename) => {
  if (!filename) return null;
  return `${UPLOADS_BASE}/users/${filename}`; // match your upload folder
};

export default {
  getSettings,
  createSettings,
  updateSettings,
  deleteSettings,
  getLogoUrl,
};
