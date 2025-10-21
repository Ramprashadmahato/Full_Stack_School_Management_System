import Notice from '../models/Notice.js';

// ================================
// 📢 Add New Notice (Admin Only)
// ================================
export const addNotice = async (req, res) => {
  try {
    const { title, date, category, description } = req.body;

    const newNotice = new Notice({
      title,
      date,
      category,
      description,
      createdBy: req.user?._id,
    });

    await newNotice.save();
    res.status(201).json({ message: 'Notice added successfully', notice: newNotice });
  } catch (err) {
    console.error('❌ Error adding notice:', err);
    res.status(500).json({ message: 'Server error while adding notice' });
  }
};

// ================================
// 📜 Get Notices (User + Admin)
// - latest=true → return only latest 3 notices
// - latest=false → return all notices
// ================================
export const listNotices = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { latest, excludeLatest } = req.query;

    let noticesQuery = Notice.find().populate('createdBy', 'name email role').sort({ date: -1 });

    if (latest === 'true') {
      noticesQuery = noticesQuery.limit(3);
    }

    let notices = await noticesQuery;

    // If excludeLatest=true, remove the top 3 from full list
    if (excludeLatest === 'true') {
      const allNotices = await Notice.find().sort({ date: -1 });
      notices = allNotices.slice(3);
    }

    // Add read/unread info
    const formatted = notices.map((n) => ({
      ...n.toObject(),
      isRead: n.readBy.some((r) => r.user?.toString() === userId?.toString()),
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching notices:', err);
    res.status(500).json({ message: 'Server error while fetching notices' });
  }
};

// ================================
// ✏️ Update Notice (Admin Only)
// ================================
export const updateNotice = async (req, res) => {
  try {
    const { title, date, category, description } = req.body;
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (title) notice.title = title;
    if (date) notice.date = date;
    if (category) notice.category = category;
    if (description) notice.description = description;

    await notice.save();
    res.json({ message: 'Notice updated successfully', notice });
  } catch (err) {
    console.error('❌ Error updating notice:', err);
    res.status(500).json({ message: 'Server error while updating notice' });
  }
};

// ================================
// 🗑️ Delete Notice (Admin Only)
// ================================
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting notice:', err);
    res.status(500).json({ message: 'Server error while deleting notice' });
  }
};

// ================================
// 👁️ Mark Notice as Read (User)
// ================================
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    const alreadyRead = notice.readBy.some((entry) => entry.user.toString() === userId.toString());

    if (!alreadyRead) {
      notice.readBy.push({ user: userId, readAt: new Date() });
      await notice.save();
    }

    res.json({ message: 'Notice marked as read successfully' });
  } catch (err) {
    console.error('❌ Error marking as read:', err);
    res.status(500).json({ message: 'Server error while marking notice as read' });
  }
};

// ================================
// 🚫 Mark Notice as Unread (User)
// ================================
export const markAsUnread = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    notice.readBy = notice.readBy.filter((entry) => entry.user.toString() !== userId.toString());
    await notice.save();

    res.json({ message: 'Notice marked as unread successfully' });
  } catch (err) {
    console.error('❌ Error marking as unread:', err);
    res.status(500).json({ message: 'Server error while marking notice as unread' });
  }
};

// ================================
// 👁️ Mark All Notices as Read (User)
// ================================
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadNotices = await Notice.find({
      'readBy.user': { $ne: userId },
    });

    for (const notice of unreadNotices) {
      notice.readBy.push({ user: userId, readAt: new Date() });
      await notice.save();
    }

    res.json({ message: 'All notices marked as read successfully', count: unreadNotices.length });
  } catch (err) {
    console.error('❌ Error marking all as read:', err);
    res.status(500).json({ message: 'Server error while marking all notices as read' });
  }
};
