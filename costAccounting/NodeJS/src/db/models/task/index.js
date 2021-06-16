const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskScheme = new Schema({
  shop: String,
  date: String,
  price: Number
});

module.exports = Task = mongoose.model('tasks', taskScheme);