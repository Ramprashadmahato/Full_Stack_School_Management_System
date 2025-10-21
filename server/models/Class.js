import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      unique: true,
      trim: true,
    },
    teacher: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true,
    },
    subjects: {
      type: [String],
      validate: {
        validator: function (subjects) {
          return Array.isArray(subjects) && subjects.length > 0;
        },
        message: 'At least one subject is required',
      },
    },

    // ✅ optional fields for better future-proofing
    numberOfStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    academicYear: {
      type: String,
      default: '2025',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);
const Class = mongoose.model('Class', classSchema);
export default Class;
