const userRoutes = require('./user.routes');
const User = require('./user.model');
const userController = require('./user.controller');

module.exports = {
  userRoutes,
  User,
  userController
}; 