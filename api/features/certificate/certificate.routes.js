const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
  getAllCertificates,
  revokeCertificate,
  viewCertificate
} = require('./certificate.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// Public routes
router.get('/verify/:code', verifyCertificate);

// Protected routes
router.use(protect);

// Student routes
router.get('/my-certificates', getMyCertificates);
router.get('/:id', getCertificateById);
router.get('/:id/download', downloadCertificate);
router.get('/:id/view', viewCertificate);

// Admin/Instructor routes
router.post('/', authorize('admin', 'instructor'), generateCertificate);
router.get('/', authorize('admin', 'instructor'), getAllCertificates);
router.put('/:id/revoke', authorize('admin'), revokeCertificate);

module.exports = router; 