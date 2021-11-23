const User = require('../models/user.model');

const createOrupdateUser = async (req, res) => {
  const { name, picture, email } = req.user;
  const user = await User.findOneAndUpdate(
    { email },
    { displayName: name, photoUrl: picture },
    { new: true },
  );

  if (user) {
    res.status(200).json({
      message: 'User created or updated successfully',
      user,
    });
  } else {
    const newUser = await new User({
      email,
      displayName: name,
      photoUrl: picture,
    }).save();

    res.status(200).json({
      message: 'User created or updated successfully',
      user: newUser,
    });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User
    .findOne({ email: req.user.email })
    .exec((err, user) => {
      if (err) throw new Error(err);
      res.status(200).json({
        message: 'User found',
        user,
      });
    });
};

module.exports = {
  createOrupdateUser,
  getCurrentUser,
};
