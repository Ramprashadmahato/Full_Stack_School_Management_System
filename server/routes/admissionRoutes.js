import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  submitAdmission,
  listAdmissions,
  updateAdmission,
  deleteAdmission
} from '../controllers/admissionController.js';

const router = express.Router();

// ===== Public route: Student submits admission =====
router.post('/', submitAdmission);

// ===== Admin routes =====
router.get('/', protect, admin, listAdmissions);            // List all admissions
router.put('/:id', protect, admin, updateAdmission);        // Update status
router.delete('/:id', protect, admin, deleteAdmission);     // Delete admission

export default router;
