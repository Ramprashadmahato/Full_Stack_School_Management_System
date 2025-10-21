import Admission from '../models/Admission.js';

// ===== Student submits admission =====
export const submitAdmission = async (req, res) => {
  try {
    const { name, grade, parentContact, message } = req.body;

    const admission = new Admission({
      name,
      grade,
      parentContact,
      message,
    });

    await admission.save();
    res.status(201).json({ message: 'Admission inquiry submitted', admission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== List all admissions (Admin) =====
export const listAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== Update admission status (Admin) =====
export const updateAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission not found' });

    const { status } = req.body;
    if (status) admission.status = status;

    await admission.save();
    res.json({ message: 'Admission updated', admission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== Delete admission (Admin) =====
export const deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission not found' });

    await admission.deleteOne();
    res.json({ message: 'Admission deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
