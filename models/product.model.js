const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
    text: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000,
    text: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
  },
  range_price: {
    type: Number,
    default: 0,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: 'Category',
  },
  sold: {
    type: Number,
    default: 0,
  },
  images: {
    type: Array,
  },
  shipping: {
    type: String,
    enum: ['Sim', 'Não'],
  },
  productType: {
    type: String,
  },
  productSpecifics: Object,
},
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
