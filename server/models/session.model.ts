import mongoose from 'mongoose';

const schema: mongoose.Schema = new mongoose.Schema({
  _id: String,
  sessionId: {
    type: String,
    default: 'unassigned',
  },
  proctor: String,
  phone: String,
  room: String,
  grade: String,
  date: String,
  status: String,
  students: Array,
  capacity: Number,
});

// session model
export default mongoose.model('Session', schema);
