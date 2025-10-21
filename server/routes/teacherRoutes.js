import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  addTeacher,
  listTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teacherController.js';

const router = express.Router();

// Admin only
router.post('/', protect, admin, addTeacher);
router.get('/', protect, admin, listTeachers);
router.get('/:id', protect, admin, getTeacher);
router.put('/:id', protect, admin, updateTeacher);
router.delete('/:id', protect, admin, deleteTeacher);

export default router;
