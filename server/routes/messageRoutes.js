import express from 'express';
import {
  submitMessage,
  listMessages,
  toggleReadStatus,
  deleteMessage
} from '../controllers/messageController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route: student submits message
router.post('/', submitMessage);

// Admin routes
router.get('/', protect, admin, listMessages);

// routes/messageRoutes.js
router.patch('/:id/toggle', protect, admin, toggleReadStatus);

router.delete('/:id', protect, admin, deleteMessage);

export default router;
