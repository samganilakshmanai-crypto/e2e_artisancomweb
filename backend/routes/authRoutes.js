import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, getAllUsers, getAllArtisans, deleteUserById, deleteArtisanById } from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/customers', protect, authorizeRoles('admin'), getAllUsers);
router.get('/artisans', protect, authorizeRoles('admin'), getAllArtisans);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUserById);
router.delete('/artisans/:id', protect, authorizeRoles('admin'), deleteArtisanById);

export default router;
