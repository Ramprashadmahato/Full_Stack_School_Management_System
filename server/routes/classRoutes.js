import express from 'express';
import {
  addClass,
  listAllClasses,
  listPublicClasses,
  getClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * ================================
 * CLASS MANAGEMENT ROUTES
 * ================================
 */

// 🔹 Public route: get all active classes
router.get('/public', listPublicClasses); // No protect/admin needed

// 🔹 Admin route: get all classes (any status)
router.get('/', protect, admin, listAllClasses);

// 🔹 Admin route: get single class by ID
router.get('/:id', protect, admin, getClass);

// 🔹 Admin route: add new class
router.post('/', protect, admin, addClass);

// 🔹 Admin route: update existing class
router.put('/:id', protect, admin, updateClass);

// 🔹 Admin route: delete class
router.delete('/:id', protect, admin, deleteClass);

export default router;
