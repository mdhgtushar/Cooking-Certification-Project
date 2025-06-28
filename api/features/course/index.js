const courseRoutes = require('./course.routes');
const Course = require('./course.model');
const courseController = require('./course.controller');

module.exports = {
  courseRoutes,
  Course,
  courseController
}; 