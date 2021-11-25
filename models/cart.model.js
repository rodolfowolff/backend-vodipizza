const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  products: Array,
  cartTotal: Number,
  discount: Number,
  appliedDiscount: Number,
  totalAfterDiscount: Number,
  orderBy: {
    type: ObjectId,
    ref: 'User',
  },
  requestedDate: Date,
},
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
