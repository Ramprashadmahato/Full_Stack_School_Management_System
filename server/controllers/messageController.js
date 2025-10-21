import Message from '../models/Message.js';

// Submit a new message (Student side)
export const submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List all messages (Admin)
export const listMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle read/unread status (Admin)
export const toggleReadStatus = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'Message ID is required' });

  try {
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.read = !message.read;
    await message.save();

    res.json({ message: 'Message status updated', message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete message (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    await message.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
