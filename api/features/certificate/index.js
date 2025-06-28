const certificateRoutes = require('./certificate.routes');
const Certificate = require('./certificate.model');
const certificateController = require('./certificate.controller');

module.exports = {
  certificateRoutes,
  Certificate,
  certificateController
}; 