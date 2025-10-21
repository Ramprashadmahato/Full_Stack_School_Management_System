// uploadMiddleware.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// User upload
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/users';
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});

const uploadUser = multer({ storage: userStorage, limits: { fileSize: 5 * 1024 * 1024 } });

// Gallery upload
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/gallery';
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});

const uploadGallery = multer({ storage: galleryStorage, limits: { fileSize: 50 * 1024 * 1024 } });

export { uploadUser, uploadGallery };
