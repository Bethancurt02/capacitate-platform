import express from 'express';
import { generateCertificate, verifyCertificate } from '../controllers/certificate.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

// Ruta pública para validación por QR
router.get('/verify/:codigo', verifyCertificate);

router.route('/:courseId')
  .get(protect, generateCertificate);

router.get('/admin/:userId/:courseId', protect, admin, generateCertificate);

export default router;
