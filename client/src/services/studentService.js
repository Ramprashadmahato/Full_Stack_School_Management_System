const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STUDENT_URL = `${API_BASE_URL}/students`;
const CLASS_URL = `${API_BASE_URL}/classes`;

// ✅ Helper to include JWT token for protected requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const studentService = {
  // 🔹 Get all students (Admin protected)
  listStudents: async () => {
    const res = await fetch(STUDENT_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  // 🔹 Get single student by ID (Admin protected)
  getStudent: async (id) => {
    const res = await fetch(`${STUDENT_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch student');
    return res.json();
  },

  // 🔹 Add new student (Admin only)
  addStudent: async (data) => {
    const res = await fetch(STUDENT_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add student');
    return res.json();
  },

  // 🔹 Update student (Admin only)
  updateStudent: async (id, data) => {
    const res = await fetch(`${STUDENT_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },

  // 🔹 Delete student (Admin only)
  deleteStudent: async (id) => {
    const res = await fetch(`${STUDENT_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  },

  // 🔹 Get all classes for dropdown (public)
  listClasses: async () => {
    const res = await fetch(`${CLASS_URL}/public`, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
  },
};

export default studentService;
