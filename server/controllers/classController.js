import Class from '../models/Class.js';

// ===============================
// Add New Class (Admin Only)
// ===============================
export const addClass = async (req, res) => {
  try {
    const { name, teacher, subjects, academicYear, status, numberOfStudents } = req.body;

    const existingClass = await Class.findOne({ name });
    if (existingClass) {
      return res.status(400).json({ message: 'Class with this name already exists' });
    }

    const subjectsArray = Array.isArray(subjects)
      ? subjects
      : subjects?.split(',').map((s) => s.trim()) || [];

    const newClass = new Class({
      name,
      teacher,
      subjects: subjectsArray,
      academicYear: academicYear || '2025',
      status: status || 'Active',
      numberOfStudents: numberOfStudents || 0,
    });

    const savedClass = await newClass.save();
    res.status(201).json({ message: 'Class added successfully', classObj: savedClass });
  } catch (err) {
    console.error('Error adding class:', err);
    res.status(500).json({ message: 'Server error while adding class' });
  }
};

// ===============================
// List Classes (Admin Only - all classes)
// ===============================
export const listAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ message: 'Server error while fetching classes' });
  }
};

// ===============================
// List Public Classes (Active Only)
// ===============================
export const listPublicClasses = async (req, res) => {
  try {
    const classes = await Class.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (err) {
    console.error('Error fetching public classes:', err);
    res.status(500).json({ message: 'Server error while fetching public classes' });
  }
};

// ===============================
// Get Single Class by ID (Admin Only)
// ===============================
export const getClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });

    res.status(200).json(classObj);
  } catch (err) {
    console.error('Error fetching class:', err);
    res.status(500).json({ message: 'Server error while fetching class' });
  }
};

// ===============================
// Update Class (Admin Only)
// ===============================
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, teacher, subjects, academicYear, status, numberOfStudents } = req.body;

    const classObj = await Class.findById(id);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });

    if (name) classObj.name = name;
    if (teacher) classObj.teacher = teacher;
    if (subjects)
      classObj.subjects = Array.isArray(subjects)
        ? subjects
        : subjects.split(',').map((s) => s.trim());
    if (academicYear) classObj.academicYear = academicYear;
    if (status) classObj.status = status;
    if (numberOfStudents !== undefined) classObj.numberOfStudents = numberOfStudents;

    const updatedClass = await classObj.save();
    res.status(200).json({ message: 'Class updated successfully', classObj: updatedClass });
  } catch (err) {
    console.error('Error updating class:', err);
    res.status(500).json({ message: 'Server error while updating class' });
  }
};

// ===============================
// Delete Class (Admin Only)
// ===============================
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classObj = await Class.findById(id);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });

    await classObj.deleteOne();
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error('Error deleting class:', err);
    res.status(500).json({ message: 'Server error while deleting class' });
  }
};
