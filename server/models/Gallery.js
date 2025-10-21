// models/Gallery.js
import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false }, // optional
  mediaUrl: { type: String, required: true }, // image or video path
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure AdminUser model exists
    required: true,   // Admin must be logged in
  },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
