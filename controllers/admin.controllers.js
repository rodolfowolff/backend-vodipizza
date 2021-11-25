const Order = require('../models/order.model');

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}).sort('-createdAt').exec();
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUserOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const updateUserOrder = await Order.findOneAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true },
    ).exec();
    res.status(200).json(updateUserOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllOrders,
  updateUserOrderStatus,
};
