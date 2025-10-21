// controllers/galleryController.js
import Gallery from '../models/Gallery.js';
import fs from 'fs';
import path from 'path';

// ================================
// 📢 Add New Media (Admin Only)
// ================================
export const addMedia = async (req, res) => {
  try {
    const { title, description, category, mediaType, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const mediaUrl = `/uploads/gallery/${req.file.filename}`;

    const newMedia = new Gallery({
      title,
      description,
      category,
      mediaType: mediaType || (req.file.mimetype.startsWith('video/') ? 'video' : 'image'),
      mediaUrl,
      date: date || Date.now(),
      createdBy: req.user._id, // logged-in admin
    });

    await newMedia.save();
    res.status(201).json({ message: 'Media added successfully', media: newMedia });
  } catch (err) {
    console.error('❌ Error adding media:', err);
    res.status(500).json({ message: 'Server error while adding media' });
  }
};

// ================================
// 📜 Get Gallery Items
// latest=true → latest 3 for homepage
// excludeLatest=true → all except latest 3 (for gallery page)
// ================================
export const listGallery = async (req, res) => {
  try {
    const { latest, excludeLatest } = req.query;

    // Fetch all gallery items sorted by date descending
    const allItems = await Gallery.find()
      .sort({ date: -1 })
      .populate('createdBy', 'name email role'); // populate admin info

    if (latest === 'true') return res.json(allItems.slice(0, 3));
    if (excludeLatest === 'true') return res.json(allItems.slice(3));

    res.json(allItems);
  } catch (err) {
    console.error('❌ Error fetching gallery items:', err);
    res.status(500).json({ message: 'Server error while fetching gallery items' });
  }
};

// ================================
// ✏️ Update Media (Admin Only)
// ================================
export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, mediaType, date } = req.body;

    const media = await Gallery.findById(id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    // Replace media file if uploaded
    if (req.file) {
      const oldPath = path.resolve('uploads/gallery', path.basename(media.mediaUrl));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      media.mediaUrl = `/uploads/gallery/${req.file.filename}`;
      media.mediaType = mediaType || (req.file.mimetype.startsWith('video/') ? 'video' : 'image');
    }

    if (title) media.title = title;
    if (description) media.description = description;
    if (category) media.category = category;
    if (date) media.date = date;

    await media.save();
    res.json({ message: 'Media updated successfully', media });
  } catch (err) {
    console.error('❌ Error updating media:', err);
    res.status(500).json({ message: 'Server error while updating media' });
  }
};

// ================================
// 🗑️ Delete Media (Admin Only)
// ================================
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Gallery.findById(id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    // Delete media file from server
    const filePath = path.resolve('uploads/gallery', path.basename(media.mediaUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await media.deleteOne();
    res.json({ message: 'Media deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting media:', err);
    res.status(500).json({ message: 'Server error while deleting media' });
  }
};
