const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const authCheck = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(400).json({ msg: "Autenticação inválida." });

    const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    if (!decoded)
      return res.status(400).json({ msg: "Autenticação inválida." });

    const user = await User.findOne({ _id: decoded.id }).select("-password");
    if (!user)
      return res.status(400).json({ msg: "Usuário ou senha errada!" });

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const currentUser = await User.findOne({ email }).exec();

  if (currentUser.role !== 'admin') {
    res.status(403).json({
      error: 'Acesso proibido!',
    });
  } else {
    next();
  }
};

module.exports = {
  authCheck,
  adminCheck
};
