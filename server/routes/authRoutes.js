import express from 'express';
import { uploadUser } from '../middlewares/uploadMiddleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// ===================== AUTH ROUTES =====================

// Register a new user (with optional profile image)
// Make sure the frontend FormData key is 'image' to match upload.single('image')
router.post('/register', uploadUser.single('image'), registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

// Request password reset (forgot password)
router.post('/forgotpassword', forgotPassword);

// Reset password using token (frontend sends PUT request with new password)
router.put('/resetpassword/:token', resetPassword);

export default router;
