import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { getArtisanProfile, updateArtisanProfile, getArtisanQrCode, getAdminStats, verifyArtisan } from '../controllers/artisanController.js';

const router = express.Router();

router.route('/profile')
    .get(protect, authorizeRoles('artisan'), getArtisanProfile)
    .put(protect, authorizeRoles('artisan'), updateArtisanProfile);

router.get('/admin/stats', protect, authorizeRoles('admin'), getAdminStats);
router.put('/admin/verify/:id', protect, authorizeRoles('admin'), verifyArtisan);

router.get('/:id/qrcode', getArtisanQrCode);

export default router;
