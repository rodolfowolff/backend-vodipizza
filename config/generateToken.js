const jwt = require('jsonwebtoken');

const { ACTIVE_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const generateActiveToken = (payload) =>
  jwt.sign(payload, `${ACTIVE_TOKEN_SECRET}`, { expiresIn: '5m' });

const generateAccessToken = (payload) =>
  jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, { expiresIn: '12h' });

const generateRefreshToken = (payload, res) => {
  const refreshToken = jwt.sign(payload, `${REFRESH_TOKEN_SECRET}`, { expiresIn: '30d' });
  const maxAgeToken = 1000 * 60 * 60 * 24 * 30; // 30days

  res.cookie('refreshtoken', refreshToken, {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    path: '/api/refresh_token',
    maxAge: maxAgeToken,
  });

  return refreshToken;
};

module.exports = {
  generateActiveToken,
  generateAccessToken,
  generateRefreshToken,
};