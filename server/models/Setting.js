// server/models/Settings.js
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    logo: { type: String }, // filename stored in /uploads/logos
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    tiktok: { type: String },
    homepageText: { type: String },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Settings = mongoose.model('Settings', SettingsSchema);

export default Settings;
