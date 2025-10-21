const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Helper for auth headers (for admin routes)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    : { 'Content-Type': 'application/json' };
};

// Helper to parse response safely
const parseResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || 'Unexpected server response');
  }
};

const admissionService = {
  // Submit admission inquiry (student)
  submitAdmission: async (data) => {
    const res = await fetch(`${API_BASE}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // public route, no token
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to submit admission');
    }
    return parseResponse(res);
  },

  // Get all admissions (admin)
  getAdmissions: async () => {
    const res = await fetch(`${API_BASE}/admissions`, { headers: getAuthHeaders() });
    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to fetch admissions');
    }
    return parseResponse(res);
  },

  // Update admission status (admin)
  updateAdmission: async (id, body) => {
    const res = await fetch(`${API_BASE}/admissions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to update admission');
    }
    return parseResponse(res);
  },

  // Delete admission (admin)
  deleteAdmission: async (id) => {
    const res = await fetch(`${API_BASE}/admissions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to delete admission');
    }
    return parseResponse(res);
  },
};

export default admissionService;
