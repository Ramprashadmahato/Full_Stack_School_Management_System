// Correct import
import Settings from '../models/Setting.js';
import fs from 'fs';
import path from 'path';

// ========== PUBLIC / ADMIN GET ==========
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ========== ADMIN CREATE ==========
export const createSettings = async (req, res) => {
  try {
    const allowedFields = [
      'schoolName', 'address', 'phone', 'email',
      'facebook', 'twitter', 'instagram', 'tiktok', 'homepageText'
    ];

    const data = {};
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    });

    if (req.file) {
      data.logo = req.file.filename;
    }

    const newSettings = await Settings.create(data);
    res.status(201).json(newSettings);
  } catch (err) {
    console.error('Error creating settings:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ========== ADMIN UPDATE ==========
export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    const allowedFields = [
      'schoolName', 'address', 'phone', 'email',
      'facebook', 'twitter', 'instagram', 'tiktok', 'homepageText'
    ];

    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) settings[f] = req.body[f];
    });

    if (req.file) {
      // Delete old logo if exists
      if (settings.logo) {
        const oldLogoPath = path.join('uploads/logos', settings.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      settings.logo = req.file.filename;
    }

    await settings.save();
    res.status(200).json(settings);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ========== ADMIN DELETE ==========
export const deleteSettings = async (req, res) => {
  try {
    const settings = await Settings.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Delete logo file if exists
    if (settings.logo) {
      const logoPath = path.join('uploads/logos', settings.logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    await settings.deleteOne();
    res.status(200).json({ message: 'Settings deleted successfully' });
  } catch (err) {
    console.error('Error deleting settings:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
