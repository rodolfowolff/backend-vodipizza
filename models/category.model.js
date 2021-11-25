const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'O nome deve ter pelo menos 3 caracteres.'],
    maxlength: [32, 'O nome deve ter no máximo 32 caracteres.'],
  },
  initials: {
    type: String,
    required: true,
    uppercase: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
},
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
