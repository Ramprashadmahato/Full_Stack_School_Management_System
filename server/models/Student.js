import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
   classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class', // Student belongs to one class
      required: true,
    },
    rollNumber: {
      type: Number,
      required: [true, 'Roll number is required'],
    },
    parentName: {
      type: String,
      trim: true,
    },
  
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
