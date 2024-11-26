const mongoose = require('mongoose');

const diarySchema = mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  journal: {
    type: String,
    // required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  password: {
    string: String,
    // required: true,

  },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Diary = mongoose.model( 'Diary', diarySchema);

module.exports = Diary;