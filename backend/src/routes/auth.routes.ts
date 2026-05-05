import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, updateProfile, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, upload.single('fotoPerfil'), updateProfile);
router.put('/password', protect, updatePassword);

export default router;
