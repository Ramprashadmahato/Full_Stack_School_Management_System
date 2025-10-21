import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import {
  getGallery,
  addMedia,
  updateMedia,
  deleteMedia,
} from '../../services/galleryService';

const ManageGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [newMedia, setNewMedia] = useState({
    title: '',
    category: '',
    description: '',
    file: null,
    preview: '',
  });
  const [editMediaId, setEditMediaId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const items = await getGallery();
      setGallery(items);
      setLoading(false);
    } catch (err) {
      console.error('❌ Failed to fetch gallery:', err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle input changes
  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setGallery((prev) =>
        prev.map((item) =>
          item._id === editMediaId ? { ...item, [name]: value } : item
        )
      );
    } else {
      setNewMedia({ ...newMedia, [name]: value });
    }
  };

  // Handle file changes
  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    if (isEdit) {
      setGallery((prev) =>
        prev.map((item) =>
          item._id === editMediaId ? { ...item, file, preview: previewUrl } : item
        )
      );
    } else {
      setNewMedia({ ...newMedia, file, preview: previewUrl });
    }
  };

  // Pause all other videos when one plays
  const handleVideoPlay = (e) => {
    const videos = document.querySelectorAll('video');
    videos.forEach((v) => {
      if (v !== e.target) v.pause();
    });
  };

  // Add new media
  const handleAdd = async () => {
    if (!newMedia.title || !newMedia.category || !newMedia.file) {
      Swal.fire('Warning', 'Please fill title, category and select a file', 'warning');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newMedia.title);
      formData.append('category', newMedia.category);
      if (newMedia.description) formData.append('description', newMedia.description);
      formData.append('media', newMedia.file);

      const res = await addMedia(formData);
      setGallery([res.media, ...gallery]);
      setNewMedia({ title: '', category: '', description: '', file: null, preview: '' });

      Swal.fire('Success', 'Media added successfully', 'success');
    } catch (err) {
      console.error('❌ Failed to add media:', err.message);
      Swal.fire('Error', 'Failed to add media', 'error');
    }
  };

  // Edit media
  const handleEditSave = async (item) => {
    try {
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('category', item.category);
      if (item.description) formData.append('description', item.description);
      if (item.file) formData.append('media', item.file);

      const res = await updateMedia(item._id, formData);
      setGallery((prev) => prev.map((g) => (g._id === item._id ? res.media : g)));
      setEditMediaId(null);

      Swal.fire('Success', 'Media updated successfully', 'success');
    } catch (err) {
      console.error('❌ Failed to update media:', err.message);
      Swal.fire('Error', 'Failed to update media', 'error');
    }
  };

  // Delete media
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the media permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMedia(id);
          setGallery(gallery.filter((item) => item._id !== id));
          Swal.fire('Deleted!', 'Media has been deleted.', 'success');
        } catch (err) {
          console.error('❌ Failed to delete media:', err.message);
          Swal.fire('Error', 'Failed to delete media', 'error');
        }
      }
    });
  };

  // Start / cancel edit
  const handleEditStart = (item) => setEditMediaId(item._id);
  const handleEditCancel = () => {
    setEditMediaId(null);
    fetchGallery();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Gallery</h1>

          {/* Add Media Form */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold text-lg mb-4">Add New Media</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newMedia.title}
                onChange={handleChange}
                className="flex-1 p-3 border rounded"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newMedia.category}
                onChange={handleChange}
                className="flex-1 p-3 border rounded"
              />
              <input
                type="text"
                name="description"
                placeholder="Description (optional)"
                value={newMedia.description}
                onChange={handleChange}
                className="flex-1 p-3 border rounded"
              />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="p-3 border rounded"
              />
              {newMedia.preview && (
                <div className="w-32 h-32 overflow-hidden rounded border">
                  {newMedia.file.type.startsWith('video/') ? (
                    <video
                      src={newMedia.preview}
                      className="w-full h-full object-cover"
                      controls
                      onPlay={handleVideoPlay}
                    />
                  ) : (
                    <img
                      src={newMedia.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              <button
                onClick={handleAdd}
                className="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg mb-4">Existing Media</h2>
            {loading ? (
              <p>Loading gallery...</p>
            ) : gallery.length === 0 ? (
              <p className="text-gray-500">No media found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => {
                  const isEditing = editMediaId === item._id;
                  return (
                    <div
                      key={item._id}
                      className="bg-gray-50 rounded shadow p-2 flex flex-col items-center"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name="title"
                            value={item.title}
                            onChange={(e) => handleChange(e, true)}
                            className="w-full p-1 border rounded mb-1"
                          />
                          <input
                            type="text"
                            name="category"
                            value={item.category}
                            onChange={(e) => handleChange(e, true)}
                            className="w-full p-1 border rounded mb-1"
                          />
                          <input
                            type="text"
                            name="description"
                            value={item.description || ''}
                            onChange={(e) => handleChange(e, true)}
                            className="w-full p-1 border rounded mb-1"
                          />
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => handleFileChange(e, true)}
                            className="w-full mb-1"
                          />
                          {item.preview && (
                            <div className="w-full h-32 overflow-hidden rounded border mb-1">
                              {item.file?.type.startsWith('video/') ? (
                                <video
                                  src={item.preview}
                                  className="w-full h-full object-cover"
                                  controls
                                  onPlay={handleVideoPlay}
                                />
                              ) : (
                                <img
                                  src={item.preview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          )}
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => handleEditSave(item)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {item.mediaType === 'video' ? (
                            <video
                              src={item.mediaUrl}
                              className="w-full h-32 object-cover rounded mb-2"
                              controls
                              onPlay={handleVideoPlay}
                            />
                          ) : (
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                          <p className="font-semibold text-blue-900">{item.title}</p>
                          <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditStart(item)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGallery;
