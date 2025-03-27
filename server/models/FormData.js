const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  childAge: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  analysis: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FormData', formDataSchema); 