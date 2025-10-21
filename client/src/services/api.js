const API_BASE = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL;

// Generic request handler
const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Don't set Content-Type if body is FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ===== Generic Helpers =====
export const get = (url) => request(url, { method: 'GET' });
export const post = (url, body, options = {}) => request(url, { method: 'POST', body, ...options });
export const put = (url, body, options = {}) => request(url, { method: 'PUT', body, ...options });
export const del = (url) => request(url, { method: 'DELETE' });

// ===== AUTH =====
export const loginUser = (email, password) =>
  post('/auth/login', JSON.stringify({ email, password }), { headers: { 'Content-Type': 'application/json' } });

export const registerUser = (formData) =>
  post('/auth/register', formData); // FormData for file uploads

export const logoutUser = () => get('/auth/logout');

export const forgotPassword = (email) =>
  post('/auth/forgotpassword', JSON.stringify({ email }), { headers: { 'Content-Type': 'application/json' } });

export const resetPassword = (token, newPassword) =>
  put(`/auth/resetpassword/${token}`, JSON.stringify({ newPassword }), { headers: { 'Content-Type': 'application/json' } });

// ===== PROFILE =====
export const fetchProfile = () => get('/users/profile');

export const updateProfile = (formData) => put('/users/update-profile', formData);

export const changePassword = (oldPassword, newPassword) =>
  put('/users/change-password', JSON.stringify({ oldPassword, newPassword }), { headers: { 'Content-Type': 'application/json' } });

// ===== ADMIN =====
export const getAllUsers = () => get('/users');

export const updateUserByAdmin = (id, data) => put(`/users/${id}`, data);

export const deleteUserByAdmin = (id) => del(`/users/${id}`);

// ===== HELPER =====
export const getImageUrl = (filename, type = 'images') => {
  if (!filename) return null;
  return `${UPLOADS_BASE}/${type}/${filename}`;
};

export default {
  request,
  get,
  post,
  put,
  del,
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  fetchProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getImageUrl,
};
