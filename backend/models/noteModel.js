const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
    noteType: {
      type: String,
      enum: ["NOTE", "PIN","ARCHIVE"],
      default: "NOTE"
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
