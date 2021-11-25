const Order = require('../models/order.model');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const createOrder = async (req, res) => {
  const { paymentResponse, address } = req.body;
  const { paymentIntent } = paymentResponse;

  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    const { products, requestedDate } = await Cart.findOne({
      orderedBy: user._id,
    }).exec();
    const newOrder = await new Order({
      products,
      paymentIntent,
      address: { ...address, email: req.user.email },
      requestedDate,
      orderedBy: user._id,
    }).save();

    const bulkOptionWrite = products.map((product) => {
      return {
        updateOne: {
          filter: {
            _id: product._id,
          },
          update: {
            $inc: {
              sold: +product.quantity,
            },
          },
        },
      };
    });

    await Product.bulkWrite(bulkOptionWrite, {});

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params._id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
  }
};

const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params._id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
  }
};

const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params._id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    const orders = await Order.find({ orderedBy: user._id }).exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
