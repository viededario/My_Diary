const mongoose = require('mongoose');

const diarySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  journal: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Diary = mongoose.model( Diary, diarySchema);

module.exports = Diary;