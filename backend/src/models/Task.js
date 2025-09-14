const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedBy: { type: String },
  status: { type: String, enum: ['pending','in-progress','completed'], default: 'pending' },
  remarks: { type: String },
  mode: { type: String, enum: ['work','personal'], default: 'work' } // 👈 mode added
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
