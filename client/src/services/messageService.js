// src/services/messageService.js

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers for admin routes
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // JWT stored after admin login
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
    // If server returns HTML (like 404 page), include status
    throw new Error(
      `Server responded with status ${res.status}: ${text || 'Unknown error'}`
    );
  }
};

const messageService = {
  // Submit a new message (Student)
  submitMessage: async (data) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to send message');
    }
    return parseResponse(res);
  },

  // Get all messages (Admin)
  getMessages: async () => {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to fetch messages');
    }
    return parseResponse(res);
  },

  // Toggle read/unread (Admin)
  toggleRead: async (id) => {
    if (!id) throw new Error('Message ID is required');
    const res = await fetch(`${API_BASE}/messages/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to toggle read status');
    }
    return parseResponse(res);
  },

  // Delete message (Admin)
  deleteMessage: async (id) => {
    if (!id) throw new Error('Message ID is required');
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await parseResponse(res);
      throw new Error(err.message || 'Failed to delete message');
    }
    return parseResponse(res);
  },
};

export default messageService;
