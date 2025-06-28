const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtExpiresIn }
  );
};

module.exports = generateToken; 