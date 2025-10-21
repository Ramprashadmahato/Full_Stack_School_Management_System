import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import  { uploadGallery } from '../middlewares/uploadMiddleware.js';
import {
  addMedia,
  listGallery,
  updateMedia,
  deleteMedia,
} from '../controllers/galleryController.js';

const router = express.Router();

// ================================
// Public routes
// ================================

// Get gallery items
// ?latest=true → latest 3 for homepage
// ?excludeLatest=true → all except latest 3 for gallery page
router.get('/', listGallery);

// ================================
// Admin routes
// ================================

// Add new media (image/video)
// Use 'media' as the field name for file upload
router.post('/', protect, admin, uploadGallery.single('media'), addMedia);

// Update existing media by ID
router.put('/:id', protect, admin, uploadGallery.single('media'), updateMedia);

// Delete media by ID
router.delete('/:id', protect, admin, deleteMedia);

export default router;
