const fbAdmin = require('../firebase');
const User = require('../models/user.model');

const authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await fbAdmin
      .auth()
      .verifyIdToken(req.headers.authorization);

    const user = await User.findOne({ email: firebaseUser.email });
    if (user) {
      req.user = user;
      next();
    } else {
      const newUser = await new User({
        email: firebaseUser.email,
        displayName: firebaseUser.name,
        photoUrl: firebaseUser.picture,
      });
      await newUser.save();
      req.user = newUser;
      next();
    }
  } catch (error) {
    res.status(401).json({
      err: error.message,
    });
  }
};

module.exports = {
  authCheck
};
