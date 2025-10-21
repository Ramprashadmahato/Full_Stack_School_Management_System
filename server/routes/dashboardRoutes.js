import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';


const router = express.Router();

// Only admin can access this route
router.get('/stats',  getDashboardStats);

export default router;
