import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import api from '../../services/api'; // Your generic request API

const roles = ['Student', 'Teacher', 'Admin'];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Start editing a user
  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditedUser({ ...user });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditedUser({});
  };

  // Save updated user to backend and update local table immediately
  const handleSave = async () => {
    try {
      const updatedUser = await api.updateUserByAdmin(editingId, {
        name: editedUser.name,
        email: editedUser.email,
        role: editedUser.role,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingId
            ? {
                ...u,
                name: editedUser.name,
                email: editedUser.email,
                role: editedUser.role,
                ...updatedUser, // merge if backend returns additional fields
              }
            : u
        )
      );

      setEditingId(null);
      setEditedUser({});
    } catch (err) {
      console.error('Failed to update user:', err.message);
      alert('Failed to update user. Check console for details.');
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUserByAdmin(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err.message);
      alert('Failed to delete user. Check console for details.');
    }
  };

  // Handle form changes while editing
  const handleEditChange = (e) =>
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Users</h1>

          <div className="bg-white p-4 rounded shadow">
            {loading ? (
              <p className="text-gray-600">Loading users...</p>
            ) : (
              <>
                <h2 className="font-semibold text-lg mb-4">User List</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-blue-900 text-white">
                      <tr>
                        <th className="py-2 px-4">#</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Role</th>
                        <th className="py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, index) => (
                        <tr key={u._id} className="text-center border-b">
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4">
                            {editingId === u._id ? (
                              <input
                                type="text"
                                name="name"
                                value={editedUser.name}
                                onChange={handleEditChange}
                                className="p-1 border rounded w-full"
                              />
                            ) : (
                              u.name
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {editingId === u._id ? (
                              <input
                                type="email"
                                name="email"
                                value={editedUser.email}
                                onChange={handleEditChange}
                                className="p-1 border rounded w-full"
                              />
                            ) : (
                              u.email
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {editingId === u._id ? (
                              <select
                                name="role"
                                value={editedUser.role}
                                onChange={handleEditChange}
                                className="p-1 border rounded w-full"
                              >
                                {roles.map((role) => (
                                  <option key={role} value={role}>
                                    {role}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              u.role
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {editingId === u._id ? (
                              <>
                                <button
                                  onClick={handleSave}
                                  className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-500 transition"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-300 transition"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(u)}
                                  className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(u._id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-4 text-gray-500">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
