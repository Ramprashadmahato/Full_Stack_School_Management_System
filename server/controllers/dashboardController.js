// controllers/dashboardController.js
import Notice from '../models/Notice.js';
import Message from '../models/Message.js';
import ClassModel from '../models/Class.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    // You can also filter counts per user if needed
    const noticesCount = await Notice.countDocuments();
    const messagesCount = await Message.countDocuments();
    const classesCount = await ClassModel.countDocuments();
    const studentsCount = await Student.countDocuments();
    const teachersCount = await Teacher.countDocuments();

    res.json({
      noticesCount,
      messagesCount,
      classesCount,
      studentsCount,
      teachersCount,
    });
  } catch (err) {
    console.error('❌ Failed to fetch dashboard stats:', err.message);
    res.status(500).json({ error: err.message });
  }
};
