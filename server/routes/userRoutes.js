import express from 'express';
import { uploadUser } from '../middlewares/uploadMiddleware.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin
} from '../controllers/userController.js';

const router = express.Router();

// ===== USER PROFILE ROUTES ===== //

// Get logged-in user's profile
// GET /api/users/profile
router.get('/profile', protect, getProfile);

// Update logged-in user's profile (with optional profile image)
// PUT /api/users/profile
router.put('/update-profile', protect, uploadUser.single('image'), updateProfile); // unified field name

// Change logged-in user's password
// PUT /api/users/change-password
router.put('/change-password', protect, changePassword);

// ===== ADMIN USER MANAGEMENT ===== //

// Get all users (Admin only)
// GET /api/users/
router.get('/', protect, admin, getAllUsers);

// Update any user by ID (Admin only)
// PUT /api/users/:id
router.put('/:id', protect, admin, uploadUser.single('image'), updateUserByAdmin); // optional image upload

// Delete any user by ID (Admin only)
// DELETE /api/users/:id
router.delete('/:id', protect, admin, deleteUserByAdmin);

export default router;
