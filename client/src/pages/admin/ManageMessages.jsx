import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import messageService from '../../services/messageService';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Toggle read/unread
  const toggleRead = async (id) => {
    if (!id) return;
    try {
      const updatedMsg = await messageService.toggleRead(id);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? updatedMsg.message : msg))
      );
    } catch (err) {
      console.error('Failed to toggle read status:', err.message);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await messageService.deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Messages</h1>

          {loading ? (
            <p className="text-gray-600">Loading messages...</p>
          ) : (
            <div className="bg-white p-4 rounded shadow overflow-x-auto">
              <table className="min-w-full border border-gray-200 table-auto">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4 text-left w-[50px]">ID</th>
                    <th className="py-2 px-4 text-left w-[120px]">Name</th>
                    <th className="py-2 px-4 text-left w-[180px]">Email</th>
                    <th className="py-2 px-4 text-left">Message</th>
                    <th className="py-2 px-4 text-left w-[100px]">Status</th>
                    <th className="py-2 px-4 text-left w-[160px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <tr
                        key={msg._id}
                        className={`border-b hover:bg-gray-50 transition ${
                          !msg.read ? 'bg-yellow-50' : 'bg-gray-100'
                        }`}
                      >
                        <td className="py-2 px-4 whitespace-nowrap">{index + 1}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{msg.name}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{msg.email}</td>
                        <td
                          className="py-2 px-4 break-words max-w-[250px]"
                          title={msg.message}
                        >
                          {msg.message.length > 50
                            ? msg.message.slice(0, 50) + '...'
                            : msg.message}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded font-medium text-sm ${
                              msg.read
                                ? 'bg-green-200 text-green-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {msg.read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="py-2 px-4 flex flex-col md:flex-row gap-2 md:gap-1 whitespace-nowrap">
                          <button
                            onClick={() => toggleRead(msg._id)}
                            className={`px-3 py-1 rounded text-white text-sm md:text-base transition ${
                              msg.read
                                ? 'bg-gray-600 hover:bg-gray-500'
                                : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                          >
                            Mark {msg.read ? 'Unread' : 'Read'}
                          </button>
                          <button
                            onClick={() => handleDelete(msg._id)}
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500 text-sm md:text-base transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;
