import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import settingService from '../../services/settingService';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // New state for edit mode

  // Fetch settings on mount
  const fetchSettings = async () => {
    try {
      const data = await settingService.getSettings();
      if (data.length > 0) {
        setSettings(data[0]);
      } else {
        setSettings({
          schoolName: '',
          address: '',
          phone: '',
          email: '',
          logo: '',
          facebook: '',
          twitter: '',
          instagram: '',
          tiktok: '',
          homepageText: '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (!settings) return <div>Loading...</div>;

  // Handle input changes
  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setSettings({ ...settings, logo: URL.createObjectURL(file) }); // preview
    }
  };

  // Save or update settings
  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(settings).forEach((key) => {
        if (key !== 'logo') formData.append(key, settings[key]);
      });
      if (logoFile) formData.append('logo', logoFile);

      if (settings._id) {
        await settingService.updateSettings(settings._id, formData);
        alert('Settings updated successfully!');
      } else {
        await settingService.createSettings(formData);
        alert('Settings created successfully!');
      }

      setEditMode(false); // Exit edit mode after saving
      fetchSettings();
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete settings
  const handleDelete = async () => {
    if (!settings._id) return;
    const confirm = window.confirm('Are you sure you want to delete the settings?');
    if (!confirm) return;

    try {
      setLoading(true);
      await settingService.deleteSettings(settings._id);
      alert('Settings deleted successfully!');
      setSettings({
        schoolName: '',
        address: '',
        phone: '',
        email: '',
        logo: '',
        facebook: '',
        twitter: '',
        instagram: '',
        tiktok: '',
        homepageText: '',
      });
      setLogoFile(null);
      setEditMode(false);
    } catch (err) {
      console.error('Error deleting settings:', err);
      alert('Failed to delete settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Website Settings</h1>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-400 transition"
              >
                Edit
              </button>
            )}

            {editMode && (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Update'}
                </button>

                {settings._id && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-500 transition"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                )}

                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Form Inputs */}
          <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {['schoolName','address','phone','email','homepageText','facebook','twitter','instagram','tiktok'].map((field) => (
              <label className="flex flex-col" key={field}>
                <span className="font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={settings[field] || ''}
                  onChange={handleChange}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!editMode} // Disabled when not editing
                />
              </label>
            ))}

            {/* Logo Upload */}
            <label className="flex flex-col">
              <span className="font-medium mb-1">Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="p-2 border rounded mb-2"
                disabled={!editMode} // Disabled when not editing
              />
              {settings.logo && (
                <img
                  src={settings.logo.includes('http') ? settings.logo : settingService.getLogoUrl(settings.logo)}
                  alt="Logo Preview"
                  className="w-32 h-32 object-contain border rounded"
                />
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
