import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';

// Add new teacher
export const addTeacher = async (req, res) => {
  try {
    const { name, subject, contact, classId } = req.body;

    // Validate class exists
    const classObj = await Class.findById(classId);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });

    const newTeacher = new Teacher({ name, subject, contact, classId });
    const savedTeacher = await newTeacher.save();

    res.status(201).json({ message: 'Teacher added successfully', teacher: savedTeacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding teacher' });
  }
};

// List all teachers
export const listTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('classId', 'name') // populate class name
      .sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching teachers' });
  }
};

// Get single teacher
export const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('classId', 'name');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching teacher' });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, subject, contact, classId } = req.body;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    if (name) teacher.name = name;
    if (subject) teacher.subject = subject;
    if (contact) teacher.contact = contact;
    if (classId) {
      const classObj = await Class.findById(classId);
      if (!classObj) return res.status(404).json({ message: 'Class not found' });
      teacher.classId = classId;
    }

    const updatedTeacher = await teacher.save();
    res.status(200).json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating teacher' });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await teacher.deleteOne();
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting teacher' });
  }
};
