import express from 'express';
import { getAdminStats, getAllUsers, getUserDetails, updateUserAdmin, deleteUser } from '../controllers/admin.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

// Todas las rutas de admin requieren estar logueado y ser admin
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUserAdmin);
router.delete('/users/:id', deleteUser);

export default router;
