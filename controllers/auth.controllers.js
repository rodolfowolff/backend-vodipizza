const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user.model');

const {
  generateActiveToken,
  generateAccessToken,
  generateRefreshToken,
} = require('../config/generateToken');

const sendMail = require('../config/sendMail');

const { validateEmail } = require('../validations/register.validations');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
const CLIENT_URL = `${process.env.BASE_URL}`;

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: 'E-mail já existe.' });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, email, password: passwordHash };

      const new_user = new Users(newUser);

      // const payload = {
      //   _id: new_user._id,
      //   name: new_user.name,
      //   avatar: new_user.avatar,
      //   role: new_user.role,
      // };
      // const token = await jwt.sign(payload, process.env.ACTIVE_TOKEN_SECRET, {
      //   expiresIn: "24h",
      // });
      // res.json({ token });

      await new_user.save();
      res.status(201).json({ msg: "A conta foi criada!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: 'Essa conta não existe.' });

      // if user exists
      loginUser(user, password, res);

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    if (!req.user)
      return res.status(400).json({ msg: "Autenticação inválida." });

    try {
      res.clearCookie('refreshtoken', { path: `/api/refresh_token` });

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        rf_token: ''
      });

      return res.json({ msg: "Desconectado!" });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Por favor, faça o login agora!" });

      const decoded = jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`);
      if (!decoded.id)
        return res.status(400).json({ msg: "Por favor, faça o login agora!" });

      const user = await Users.findById(decoded.id).select("-password +rf_token");
      if (!user)
        return res.status(400).json({ msg: "Essa conta não existe." });

      if (rf_token !== user.rf_token)
        return res.status(400).json({ msg: "Por favor, faça o login agora!" });

      const access_token = generateAccessToken({ id: user._id });
      const refresh_token = generateRefreshToken({ id: user._id }, res);

      await Users.findOneAndUpdate({ _id: user._id }, {
        rf_token: refresh_token
      });

      res.json({ access_token, user });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { id_token } = req.body;
      const verify = await client.verifyIdToken({
        idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`
      });

      const {
        email, email_verified, name, picture
      } = verify.getPayload();

      if (!email_verified)
        return res.status(500).json({ msg: "A verificação do email falhou." });

      const password = email + 'your google secrect password';
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ email });

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name,
          email,
          password: passwordHash,
          avatar: picture,
          type: 'google'
        };

        registerUser(user, res);
      }

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: 'Essa conta não existe.' });

      if (user.type !== 'register')
        return res.status(400).json({
          msg: `Conta de login rápido com ${user.type} não pode usar esta função.`
        });

      const access_token = generateAccessToken({ id: user._id });

      const url = `${CLIENT_URL}/reset_password/${access_token}`;

      if (validateEmail(email)) {
        sendMail(email, url, "Esqueceu sua senha?");
        return res.json({ msg: "Sucesso! Por favor verifique seu email." });
      }

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const loginUser = async (user, password, res) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    let msgError = user.type === 'register'
      ? 'Senha é incorreta.'
      : `Senha é incorreta. Este login da conta com ${user.type}`;

    return res.status(400).json({ msg: msgError });
  }

  const access_token = generateAccessToken({ id: user._id });
  const refresh_token = generateRefreshToken({ id: user._id }, res);

  await Users.findOneAndUpdate({ _id: user._id }, {
    rf_token: refresh_token
  });

  res.json({
    msg: 'Sucesso no login!',
    access_token,
    user: { ...user._doc, password: '' }
  });

};

const registerUser = async (user, res) => {
  const newUser = new Users(user);

  const access_token = generateAccessToken({ id: newUser._id });
  const refresh_token = generateRefreshToken({ id: newUser._id }, res);

  newUser.rf_token = refresh_token;
  await newUser.save();

  res.json({
    msg: 'Sucesso no login!',
    access_token,
    user: { ...newUser._doc, password: '' }
  });

};

module.exports = {
  authController
};
