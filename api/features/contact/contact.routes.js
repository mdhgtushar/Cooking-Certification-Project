const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  respondToContact,
  getContactStats,
  markAsSpam
} = require('./contact.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// Public routes
router.post('/', submitContact);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.put('/:id/respond', respondToContact);
router.put('/:id/spam', markAsSpam);

module.exports = router; 