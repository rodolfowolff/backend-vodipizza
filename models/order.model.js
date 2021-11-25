const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  delivery: {
    type: Number,
    required: true
  },
  typePayment: {
    type: String,
    required: true
  },
  expireAtTimer: {
    type: Date
  }
},
  {
    timestamps: true,
  });

orderSchema.pre('save', function (next) {
  this.expireAtTimer = Date.now() + 2 * (1000 * 60); // 2 minutes

  next();
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
