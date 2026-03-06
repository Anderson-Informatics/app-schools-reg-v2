import mongoose from 'mongoose';

const schema: mongoose.Schema = new mongoose.Schema({
  _id: String,
  g2cap: Number,
  g3cap: Number,
  g4cap: Number,
  g5cap: Number,
  g6cap: Number,
  g7cap: Number,
  g8cap: Number,
  g34cap: Number,
  g56cap: Number,
  g78cap: Number,
  group34: Boolean,
  group56: Boolean,
  group78: Boolean,
},
{ 
  collection: 'config',
});

// config model
export default mongoose.model('Config', schema);
