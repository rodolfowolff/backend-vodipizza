const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Insira o nome'],
    trim: true,
    minlength: [3, 'O nome deve ter pelo menos 3 caracteres.'],
    maxLength: [20, 'O nome deve ter no máximo 20 caracteres.']
  },
  email: {
    type: String,
    required: [true, 'Insira o email'],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Insira a senha.'],
    minLength: [6, 'A senha deve ter no mínimo 6 caracteres.']
  },
  photoURL: {
    type: String,
    default: 'https://res.cloudinary.com/dbue8wkkw/image/upload/v1637701808/default-user_myug3e.png'
  },
  role: {
    type: String,
    default: 'subscriber',
  },
  cart: {
    type: Array,
    default: [],
  },
  addresses: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: 'register' // login
  },
  rf_token: {
    type: String,
    select: false
  },
  wishlist: [
    {
      type: ObjectId,
      ref: 'Product',
    },
  ],
},
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
