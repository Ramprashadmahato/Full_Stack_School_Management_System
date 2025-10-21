import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import Swal from 'sweetalert2';
import classService from '../../services/classService';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClass, setNewClass] = useState({ name: '', teacher: '', subjects: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingClass, setEditingClass] = useState({ name: '', teacher: '', subjects: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.listClasses();
      setClasses(data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Failed to fetch classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setNewClass({ ...newClass, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!newClass.name || !newClass.teacher || !newClass.subjects) {
      Swal.fire('Warning', 'Please fill all fields', 'warning');
      return;
    }

    try {
      const data = {
        name: newClass.name,
        teacher: newClass.teacher,
        subjects: newClass.subjects.split(',').map((s) => s.trim()),
      };
      const res = await classService.addClass(data);
      setClasses((prev) => [...prev, res.classObj]);
      setNewClass({ name: '', teacher: '', subjects: '' });

      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Class added successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Failed to add class', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This class will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      await classService.deleteClass(id);
      setClasses(classes.filter((cls) => cls._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Class has been deleted.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Failed to delete class', 'error');
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls._id);
    setEditingClass({
      name: cls.name,
      teacher: cls.teacher,
      subjects: cls.subjects.join(', '),
    });
  };

  const handleEditChange = (e) => {
    setEditingClass({ ...editingClass, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    if (!editingClass.name || !editingClass.teacher || !editingClass.subjects) {
      Swal.fire('Warning', 'Please fill all fields', 'warning');
      return;
    }

    try {
      const updatedData = {
        name: editingClass.name,
        teacher: editingClass.teacher,
        subjects: editingClass.subjects.split(',').map((s) => s.trim()),
      };
      const res = await classService.updateClass(id, updatedData);
      setClasses(classes.map((cls) => (cls._id === id ? res.classObj : cls)));
      setEditingId(null);

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Class updated successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Failed to update class', 'error');
    }
  };

  const handleCancel = () => setEditingId(null);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Classes</h1>

          {/* Add Class Form */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold text-lg mb-4">Add New Class</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="name"
                placeholder="Class Name (e.g., Grade 2)"
                value={newClass.name}
                onChange={handleChange}
                className="flex-1 p-3 border rounded"
              />
              <input
                type="text"
                name="teacher"
                placeholder="Class Teacher"
                value={newClass.teacher}
                onChange={handleChange}
                className="flex-1 p-3 border rounded"
              />
              <input
                type="text"
                name="subjects"
                placeholder="Subjects (comma separated)"
                value={newClass.subjects}
                onChange={handleChange}
                className="flex-1 p-3 border rounded"
              />
              <button
                onClick={handleAdd}
                className="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
              >
                Add Class
              </button>
            </div>
          </div>

          {/* Classes Table */}
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <h2 className="font-semibold text-lg mb-4">Existing Classes</h2>
            {loading ? (
              <p className="text-center text-gray-500">Loading classes...</p>
            ) : (
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">Class Name</th>
                    <th className="py-2 px-4 text-left">Teacher</th>
                    <th className="py-2 px-4 text-left">Subjects</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.length > 0 ? (
                    classes.map((cls, index) => (
                      <tr key={cls._id} className="border-b">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">
                          {editingId === cls._id ? (
                            <input
                              type="text"
                              name="name"
                              value={editingClass.name}
                              onChange={handleEditChange}
                              className="p-2 border rounded w-full"
                            />
                          ) : (
                            cls.name
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingId === cls._id ? (
                            <input
                              type="text"
                              name="teacher"
                              value={editingClass.teacher}
                              onChange={handleEditChange}
                              className="p-2 border rounded w-full"
                            />
                          ) : (
                            cls.teacher
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingId === cls._id ? (
                            <input
                              type="text"
                              name="subjects"
                              value={editingClass.subjects}
                              onChange={handleEditChange}
                              className="p-2 border rounded w-full"
                            />
                          ) : (
                            cls.subjects.join(', ')
                          )}
                        </td>
                        <td className="py-2 px-4 space-x-2">
                          {editingId === cls._id ? (
                            <>
                              <button
                                onClick={() => handleSave(cls._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 transition"
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
                                onClick={() => handleEdit(cls)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(cls._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No classes found.
                      </td>
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

export default ManageClasses;
