const { findOne, findOneAndUpdate } = require('../models/user.model');
const { Types } = require('mongoose');

const addUserAddress = async (req, res) => {
  const user = await findOne({ email: req.user.email }).exec();

  try {
    const addedAddress = await findOneAndUpdate(
      { email: user.email },
      {
        $push: { addresses: { _id: Types.ObjectId(), ...req.body } },
      },
      { new: true },
    ).exec();
    res.status(200).json({
      message: 'Address added successfully',
      addedAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addUserAddress
};
