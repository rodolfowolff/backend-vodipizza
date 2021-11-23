const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  photoUrl: {
    type: String,
    required: true,
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
  wishlist: [
    {
      type: ObjectId,
      ref: 'Product',
    }
  ],
},
  {
    timestamps: true,
  });

const User = mongoose.model('User', userSchema);

module.exports = User;
