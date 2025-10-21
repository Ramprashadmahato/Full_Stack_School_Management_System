// src/services/galleryService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Directly include the uploads URL
const UPLOADS_URL = 'http://localhost:5000';

// 🔹 Get auth token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? `Bearer ${user.token}` : null;
};

// 🔹 Generic fetch wrapper
const request = async (url, method = 'GET', body = null, isAuth = false) => {
  const headers = {};

  if (isAuth) {
    const token = getToken();
    if (!token) throw new Error('Unauthorized');
    headers['Authorization'] = token;
  }

  const options = { method, headers };

  if (body) {
    if (body instanceof FormData) {
      options.body = body; // FormData automatically sets content-type
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, options);

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// 🔹 Normalize media URL (images & videos)
const normalizeMediaUrl = (media) => ({
  ...media,
  mediaUrl: media.mediaUrl.startsWith('http')
    ? media.mediaUrl
    : media.mediaUrl.startsWith('/uploads')
    ? `${UPLOADS_URL}${media.mediaUrl}` // e.g., /uploads/gallery/abc.jpg
    : `${UPLOADS_URL}/${media.mediaUrl}`, // fallback
});

// ================================
// 📜 Get gallery items
export const getGallery = async (latest = false, excludeLatest = false) => {
  const url = `/gallery?latest=${latest}&excludeLatest=${excludeLatest}`;
  const items = await request(url, 'GET');
  return items.map(normalizeMediaUrl);
};

// ================================
// 📢 Add new media (Admin)
export const addMedia = async (mediaData) => {
  const res = await request('/gallery', 'POST', mediaData, true);
  return {
    ...res,
    media: normalizeMediaUrl(res.media),
  };
};

// ================================
// ✏️ Update media (Admin)
export const updateMedia = async (id, mediaData) => {
  const res = await request(`/gallery/${id}`, 'PUT', mediaData, true);
  return {
    ...res,
    media: normalizeMediaUrl(res.media),
  };
};

// ================================
// 🗑️ Delete media (Admin)
export const deleteMedia = async (id) => {
  return await request(`/gallery/${id}`, 'DELETE', null, true);
};

export default {
  request,
  getGallery,
  addMedia,
  updateMedia,
  deleteMedia,
};
