import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import studentService from '../../services/studentService.js';
import classService from '../../services/classService.js';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    classId: '',
    rollNumber: '',
    parentName: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsData = await studentService.listStudents();
      const classesData = await classService.getPublicClasses();
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch students or classes!',
      });
    }
  };

  const handleChange = (e) =>
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!newStudent.name || !newStudent.classId || !newStudent.rollNumber) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Data',
        text: 'Please fill in all required fields!',
      });
      return;
    }
    try {
      await studentService.addStudent(newStudent);
      setNewStudent({ name: '', classId: '', rollNumber: '', parentName: '' });
      fetchData();
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Student has been added successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Could not add student.',
      });
    }
  };

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
        await studentService.deleteStudent(id);
        fetchData();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Student has been deleted.',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Could not delete student.',
        });
      }
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditedStudent({
      ...student,
      classId: student.classId?._id || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedStudent({});
  };

  const handleSave = async () => {
    try {
      await studentService.updateStudent(editingId, editedStudent);
      setEditingId(null);
      setEditedStudent({});
      fetchData();
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Student details have been updated.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Could not update student.',
      });
    }
  };

  const handleEditChange = (e) =>
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Students</h1>

          {/* Add Student Form */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold text-lg mb-4">Add New Student</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={newStudent.name}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <select
                name="classId"
                value={newStudent.classId}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="rollNumber"
                placeholder="Roll Number"
                value={newStudent.rollNumber}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="parentName"
                placeholder="Parent Name"
                value={newStudent.parentName}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <button
                onClick={handleAdd}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-1 md:col-span-1"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* Students List */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg mb-4">Existing Students</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="py-2 px-4">#</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Class</th>
                    <th className="py-2 px-4">Roll No</th>
                    <th className="py-2 px-4">Parent</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((s, index) => (
                      <tr key={s._id} className="text-center border-b">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">
                          {editingId === s._id ? (
                            <input
                              type="text"
                              name="name"
                              value={editedStudent.name}
                              onChange={handleEditChange}
                              className="p-1 border rounded w-full"
                            />
                          ) : (
                            s.name
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingId === s._id ? (
                            <select
                              name="classId"
                              value={editedStudent.classId}
                              onChange={handleEditChange}
                              className="p-1 border rounded w-full"
                            >
                              {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                  {cls.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            s.classId?.name || ''
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingId === s._id ? (
                            <input
                              type="number"
                              name="rollNumber"
                              value={editedStudent.rollNumber}
                              onChange={handleEditChange}
                              className="p-1 border rounded w-full"
                            />
                          ) : (
                            s.rollNumber
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingId === s._id ? (
                            <input
                              type="text"
                              name="parentName"
                              value={editedStudent.parentName}
                              onChange={handleEditChange}
                              className="p-1 border rounded w-full"
                            />
                          ) : (
                            s.parentName
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingId === s._id ? (
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
                                onClick={() => handleEdit(s)}
                                className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(s._id)}
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
                      <td colSpan="6" className="py-4 text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
