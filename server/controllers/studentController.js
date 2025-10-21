import Student from '../models/Student.js';
import Class from '../models/Class.js'; // to populate class name if needed

// ===============================
// Add New Student
// ===============================
export const addStudent = async (req, res) => {
  try {
    const { name, classId, rollNumber, parentName } = req.body;

    // Validate class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const newStudent = new Student({
      name,
      classId,
      rollNumber,
      parentName,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: savedStudent });
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ message: 'Server error while adding student' });
  }
};

// ===============================
// Get All Students
// ===============================
export const listStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('classId', 'name') // populate class name
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

// ===============================
// Get Single Student by ID
// ===============================
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'name');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json(student);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ message: 'Server error while fetching student' });
  }
};

// ===============================
// Update Student
// ===============================
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, classId, rollNumber, parentName } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (name) student.name = name;
    if (classId) {
      const classObj = await Class.findById(classId);
      if (!classObj) return res.status(404).json({ message: 'Class not found' });
      student.classId = classId;
    }
    if (rollNumber !== undefined) student.rollNumber = rollNumber;
    if (parentName) student.parentName = parentName;

    const updatedStudent = await student.save();
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Server error while updating student' });
  }
};

// ===============================
// Delete Student
// ===============================
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await student.deleteOne();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ message: 'Server error while deleting student' });
  }
};
