import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  addStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  listStudents
} from '../controllers/studentController.js';

const router = express.Router();

/**
 * ================================
 * STUDENT MANAGEMENT ROUTES (Admin)
 * ================================
 */

// 🔹 Add a new student (Admin only)
router.post('/', protect, admin, addStudent);

// 🔹 Get all students (Admin only)
router.get('/', protect, admin, listStudents);

// 🔹 Get single student by ID (Admin only)
router.get('/:id', protect, admin, getStudent);

// 🔹 Update student by ID (Admin only)
router.put('/:id', protect, admin, updateStudent);

// 🔹 Delete student by ID (Admin only)
router.delete('/:id', protect, admin, deleteStudent);

export default router;
