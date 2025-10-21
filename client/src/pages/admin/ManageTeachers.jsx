import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import teacherService from '../../services/teacherService';
import classService from '../../services/classService';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subject: '',
    contact: '',
    classId: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editedTeacher, setEditedTeacher] = useState({
    name: '',
    subject: '',
    contact: '',
    classId: '',
  });

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.listTeachers();
      setTeachers(data);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Oops...', text: err.message || 'Failed to fetch teachers!' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes for dropdown
  const fetchClasses = async () => {
    try {
      const data = await classService.listClasses();
      setClasses(data);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to fetch classes!' });
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  // Input handlers
  const handleChange = (e) => setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditedTeacher({ ...editedTeacher, [e.target.name]: e.target.value });

  // Add teacher
  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.subject || !newTeacher.contact || !newTeacher.classId) {
      Swal.fire({ icon: 'warning', title: 'Incomplete Data', text: 'Please fill in all required fields!' });
      return;
    }

    try {
      const selectedClass = classes.find(cls => cls._id === newTeacher.classId);
      const added = await teacherService.addTeacher(newTeacher);

      // Add class object for immediate display
      setTeachers([...teachers, { ...added, classId: selectedClass }]);
      setNewTeacher({ name: '', subject: '', contact: '', classId: '' });

      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Teacher has been added successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Failed!', text: 'Could not add teacher.' });
    }
  };

  // Edit teacher
  const handleEdit = (teacher) => {
    setEditingId(teacher._id);
    setEditedTeacher({
      name: teacher.name,
      subject: teacher.subject,
      contact: teacher.contact,
      classId: teacher.classId?._id || '',
    });
  };

  // Save edited teacher
  const handleSave = async () => {
    if (!editedTeacher.name || !editedTeacher.subject || !editedTeacher.contact || !editedTeacher.classId) {
      Swal.fire({ icon: 'warning', title: 'Incomplete Data', text: 'Please fill in all required fields!' });
      return;
    }

    try {
      const selectedClass = classes.find(cls => cls._id === editedTeacher.classId);
      const updated = await teacherService.updateTeacher(editingId, {
        ...editedTeacher,
        classId: selectedClass._id,
      });

      // Update local state with full class object for display
      setTeachers(teachers.map(t => t._id === editingId ? { ...updated, classId: selectedClass } : t));

      setEditingId(null);
      setEditedTeacher({});

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Teacher details have been updated.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Failed!', text: 'Could not update teacher.' });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditedTeacher({});
  };

  // Delete teacher
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

    if (!result.isConfirmed) return;

    try {
      await teacherService.deleteTeacher(id);
      setTeachers(teachers.filter(t => t._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Teacher has been deleted.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Failed!', text: 'Could not delete teacher.' });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Teachers</h1>

          {/* Add Teacher Form */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold text-lg mb-4">Add New Teacher</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input type="text" name="name" placeholder="Teacher Name" value={newTeacher.name} onChange={handleChange} className="p-2 border rounded flex-1" />
              <input type="text" name="subject" placeholder="Subject" value={newTeacher.subject} onChange={handleChange} className="p-2 border rounded flex-1" />
              <input type="text" name="contact" placeholder="Contact Number" value={newTeacher.contact} onChange={handleChange} className="p-2 border rounded flex-1" />
              <select name="classId" value={newTeacher.classId} onChange={handleChange} className="p-2 border rounded flex-1">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <button onClick={handleAddTeacher} className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Add</button>
            </div>
          </div>

          {/* Teachers Table */}
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <h2 className="font-semibold text-lg mb-4">Existing Teachers</h2>
            {loading ? <p>Loading teachers...</p> : (
              <table className="min-w-full border-collapse table-auto text-center">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4">#</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Subject</th>
                    <th className="py-2 px-4">Contact</th>
                    <th className="py-2 px-4">Class</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length > 0 ? teachers.map((t, index) => (
                    <tr key={t._id} className="border-b">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        {editingId === t._id ? (
                          <input type="text" name="name" value={editedTeacher.name} onChange={handleEditChange} className="p-2 border rounded w-full" />
                        ) : t.name}
                      </td>
                      <td className="py-2 px-4">
                        {editingId === t._id ? (
                          <input type="text" name="subject" value={editedTeacher.subject} onChange={handleEditChange} className="p-2 border rounded w-full" />
                        ) : t.subject}
                      </td>
                      <td className="py-2 px-4">
                        {editingId === t._id ? (
                          <input type="text" name="contact" value={editedTeacher.contact} onChange={handleEditChange} className="p-2 border rounded w-full" />
                        ) : t.contact}
                      </td>
                      <td className="py-2 px-4">
                        {editingId === t._id ? (
                          <select name="classId" value={editedTeacher.classId} onChange={handleEditChange} className="p-2 border rounded w-full">
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                        ) : t.classId?.name || '-'}
                      </td>
                      <td className="py-2 px-4 space-x-2">
                        {editingId === t._id ? (
                          <>
                            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500">Save</button>
                            <button onClick={handleCancel} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-300">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(t)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400">Edit</button>
                            <button onClick={() => handleDelete(t._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500">Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-gray-500">No teachers found.</td>
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

export default ManageTeachers;
