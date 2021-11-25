const Users = require('../models/user.model');
const bcrypt = require('bcrypt');


const updateUser = async (req, res) => {
  if (!req.user) return res.status(400).json({ msg: "Autenticação inválida." });

  try {
    const { avatar, name } = req.body;

    await Users.findOneAndUpdate({ _id: req.user._id }, {
      avatar, name
    });

    res.json({ msg: "Atualização feita com sucesso!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const resetPassword = async (req, res) => {
  if (!req.user) return res.status(400).json({ msg: "Autenticação inválida." });

  if (req.user.type !== 'register')
    return res.status(400).json({
      msg: `Conta de login rápido com ${req.user.type} não pode usar esta função.`
    });

  try {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    await Users.findOneAndUpdate({ _id: req.user._id }, {
      password: passwordHash
    });

    res.json({ msg: "Sucesso na redefinição da senha!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  updateUser,
  resetPassword,
  getUser
};
