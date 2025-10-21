import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { uploadUser } from '../middlewares/uploadMiddleware.js'; // we'll use user upload for logos
import {
  getSettings,
  createSettings,
  updateSettings,
  deleteSettings
} from '../controllers/settingsController.js';

const router = express.Router();

// ---------------- PUBLIC ROUTE ----------------
// GET all settings (viewable by public & admin)
router.get('/', getSettings);

// ---------------- ADMIN ROUTES ----------------
// CREATE settings with optional logo upload
router.post('/', protect, admin, uploadUser.single('logo'), createSettings);

// UPDATE settings by ID with optional logo upload
router.put('/:id', protect, admin, uploadUser.single('logo'), updateSettings);

// DELETE settings by ID
router.delete('/:id', protect, admin, deleteSettings);

export default router;
