const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Helper: get auth token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? `Bearer ${user.token}` : null;
};

// 🔹 Helper: fetch wrapper
const request = async (url, method = 'GET', body = null, isAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (isAuth) {
    const token = getToken();
    if (token) headers.Authorization = token;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${url}`, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }

  return response.json();
};

// ================================
// 📜 Get Notices
// - latest=true → returns only 3 latest notices (for homepage)
// - excludeLatest=true → returns all notices excluding latest 3 (for notices page)
export const getNotices = async ({ latest = false, excludeLatest = false } = {}) => {
  let url = '/notices';

  if (latest) url += '?latest=true';
  else if (excludeLatest) url += '?excludeLatest=true';

  return await request(url, 'GET', null, true); // protected to track read/unread
};

// ================================
// 📢 Add New Notice (Admin Only)
export const addNotice = async (noticeData) => {
  return await request('/notices', 'POST', noticeData, true);
};

// ================================
// ✏️ Update Notice (Admin Only)
export const updateNotice = async (id, noticeData) => {
  return await request(`/notices/${id}`, 'PUT', noticeData, true);
};

// ================================
// 🗑️ Delete Notice (Admin Only)
export const deleteNotice = async (id) => {
  return await request(`/notices/${id}`, 'DELETE', null, true);
};

// ================================
// 👁️ Mark Single Notice as Read (User)
export const markAsRead = async (id) => {
  return await request(`/notices/${id}/read`, 'POST', null, true);
};

// ================================
// 🚫 Mark Single Notice as Unread (User)
export const markAsUnread = async (id) => {
  return await request(`/notices/${id}/unread`, 'POST', null, true);
};

// ================================
// 👁️ Mark All Notices as Read (User)
export const markAllAsRead = async () => {
  return await request('/notices/read/all', 'POST', null, true);
};
