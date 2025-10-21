import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import * as noticeService from '../../services/noticeService';

const categories = ['Sports', 'Holidays', 'Meetings', 'Events'];

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNotice, setNewNotice] = useState({ title: '', date: '', category: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingNotice, setEditingNotice] = useState({ title: '', date: '', category: '', description: '' });

  // Fetch all notices
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await noticeService.getNotices();
      setNotices(data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch notices!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setNewNotice({ ...newNotice, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditingNotice({ ...editingNotice, [e.target.name]: e.target.value });

  // Add new notice
  const handleAdd = async () => {
    if (!newNotice.title || !newNotice.date || !newNotice.category) {
      Swal.fire({ icon: 'warning', title: 'Incomplete Data', text: 'Please fill all required fields!' });
      return;
    }
    try {
      const added = await noticeService.addNotice(newNotice);
      setNotices([added.notice, ...notices]);
      setNewNotice({ title: '', date: '', category: '', description: '' });
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Notice has been added successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed!', text: 'Could not add notice.' });
    }
  };

  // Start editing
  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setEditingNotice({
      title: notice.title,
      date: notice.date.split('T')[0],
      category: notice.category,
      description: notice.description || '',
    });
  };

  // Save edited notice
  const handleSave = async (id) => {
    if (!editingNotice.title || !editingNotice.date || !editingNotice.category) {
      Swal.fire({ icon: 'warning', title: 'Incomplete Data', text: 'Please fill all required fields!' });
      return;
    }
    try {
      const updated = await noticeService.updateNotice(id, editingNotice);
      setNotices(notices.map((n) => (n._id === id ? updated.notice : n)));
      setEditingId(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Notice has been updated successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed!', text: 'Could not update notice.' });
    }
  };

  const handleCancel = () => setEditingId(null);

  // Delete notice
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await noticeService.deleteNotice(id);
        setNotices(notices.filter((n) => n._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Notice has been deleted.',
          timer: 1500,
          showConfirmButton: false,
        });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed!', text: 'Could not delete notice.' });
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Notices</h1>

          {/* Add Notice Form */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold text-lg mb-4">Add New Notice</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" name="title" placeholder="Notice Title" value={newNotice.title} onChange={handleChange} className="flex-1 p-3 border rounded" />
              <input type="date" name="date" value={newNotice.date} onChange={handleChange} className="p-3 border rounded" />
              <select name="category" value={newNotice.category} onChange={handleChange} className="p-3 border rounded">
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="text" name="description" placeholder="Description" value={newNotice.description} onChange={handleChange} className="flex-1 p-3 border rounded" />
              <button onClick={handleAdd} className="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-700 transition">Add Notice</button>
            </div>
          </div>

          {/* Notices Table */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg mb-4">Existing Notices</h2>
            {loading ? <p>Loading notices...</p> : error ? <p className="text-red-500">{error}</p> : (
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">Title</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.length > 0 ? notices.map((notice, index) => (
                    <tr key={notice._id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{editingId === notice._id ? <input type="text" name="title" value={editingNotice.title} onChange={handleEditChange} className="p-2 border rounded w-full" /> : notice.title}</td>
                      <td className="py-2 px-4">{editingId === notice._id ? <input type="date" name="date" value={editingNotice.date} onChange={handleEditChange} className="p-2 border rounded w-full" /> : new Date(notice.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{editingId === notice._id ? <select name="category" value={editingNotice.category} onChange={handleEditChange} className="p-2 border rounded w-full">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select> : notice.category}</td>
                      <td className="py-2 px-4">{editingId === notice._id ? <input type="text" name="description" value={editingNotice.description} onChange={handleEditChange} className="p-2 border rounded w-full" /> : notice.description}</td>
                      <td className="py-2 px-4 space-x-2">
                        {editingId === notice._id ? (
                          <>
                            <button onClick={() => handleSave(notice._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400 transition">Save</button>
                            <button onClick={handleCancel} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-300 transition">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(notice)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400 transition">Edit</button>
                            <button onClick={() => handleDelete(notice._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition">Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">No notices found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNotices;
