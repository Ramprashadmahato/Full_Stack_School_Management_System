import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    contact: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class', // Reference Class
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Teacher', teacherSchema);
