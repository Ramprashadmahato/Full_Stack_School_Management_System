import express from 'express';
import {
  addNotice,
  listNotices,
  updateNotice,
  deleteNotice,
  markAsRead,
  markAsUnread,
  markAllAsRead,
} from '../controllers/noticeController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ================================
// 📢 Get Notices
// ✅ Optional query: ?latest=true for latest 3 notices
// ================================
router.get('/', protect, listNotices);

// ================================
// 👑 Admin Routes – Manage Notices
// ================================
router.post('/', protect, admin, addNotice);        // Add new notice
router.put('/:id', protect, admin, updateNotice);   // Update notice
router.delete('/:id', protect, admin, deleteNotice);// Delete notice

// ================================
// 🙋‍♂️ User Routes – Mark Read/Unread
// ================================
router.post('/:id/read', protect, markAsRead);      // Mark single notice as read
router.post('/:id/unread', protect, markAsUnread);  // Mark single notice as unread
router.post('/read/all', protect, markAllAsRead);   // Mark all notices as read

export default router;
