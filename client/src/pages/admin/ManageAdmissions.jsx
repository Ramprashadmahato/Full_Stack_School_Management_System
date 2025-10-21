import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import admissionService from '../../services/admissionService';

const ManageAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch admissions from backend
  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const data = await admissionService.getAdmissions();
      setAdmissions(data);
    } catch (err) {
      console.error('Failed to fetch admissions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // Update status
  const handleStatusChange = async (id, status) => {
    try {
      const updated = await admissionService.updateAdmission(id, { status });
      setAdmissions((prev) =>
        prev.map((adm) => (adm._id === id ? updated.admission : adm))
      );
    } catch (err) {
      console.error('Failed to update admission:', err.message);
    }
  };

  // Delete admission
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admission inquiry?')) return;
    try {
      await admissionService.deleteAdmission(id);
      setAdmissions((prev) => prev.filter((adm) => adm._id !== id));
    } catch (err) {
      console.error('Failed to delete admission:', err.message);
    }
  };

  // Export admissions with messages to CSV
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Grade', 'Parent Contact', 'Status', 'Message'], // Header
      ...admissions.map((adm) => [
        `"${adm.name}"`,
        `"${adm.grade}"`,
        `"${adm.parentContact}"`,
        `"${adm.status}"`,
        `"${adm.message?.replace(/"/g, '""') || ''}"` // escape quotes in message
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'admissions_with_messages.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered admissions based on search
  const filteredAdmissions = useMemo(() => {
    if (!search) return admissions;
    return admissions.filter(
      (adm) =>
        adm.name.toLowerCase().includes(search.toLowerCase()) ||
        adm.grade.toLowerCase().includes(search.toLowerCase()) ||
        adm.parentContact.includes(search)
    );
  }, [search, admissions]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Topbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Admissions</h1>

          {/* Search and Export */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <input
              type="text"
              placeholder="Search by name, grade, or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
            >
              Export CSV 
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            {loading ? (
              <p className="text-gray-600">Loading admissions...</p>
            ) : (
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Grade</th>
                    <th className="py-2 px-4 text-left">Parent Contact</th>
                    <th className="py-2 px-4 text-left">Status</th>

                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.length ? (
                    filteredAdmissions.map((adm, index) => (
                      <tr key={adm._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{adm.name}</td>
                        <td className="py-2 px-4">{adm.grade}</td>
                        <td className="py-2 px-4">{adm.parentContact}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded ${
                              adm.status === 'Approved'
                                ? 'bg-green-200 text-green-800'
                                : adm.status === 'Rejected'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {adm.status}
                          </span>
                        </td>
                     
                        <td className="py-2 px-4 space-x-2">
                          <button
                            onClick={() => handleStatusChange(adm._id, 'Approved')}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(adm._id, 'Rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDelete(adm._id)}
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        No admission inquiries found.
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

export default ManageAdmissions;
