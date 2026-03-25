import express from 'express';
import { addOrderItems, getOrderById, getMyOrders, getArtisanOrders, addOrderFeedback, addOrderIssue, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorizeRoles('customer'), addOrderItems);
router.route('/myorders').get(protect, authorizeRoles('customer'), getMyOrders);
router.route('/artisanorders').get(protect, authorizeRoles('artisan'), getArtisanOrders);
router.route('/all').get(protect, authorizeRoles('admin'), getAllOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, authorizeRoles('admin'), updateOrderStatus);
router.route('/:id/feedback').post(protect, addOrderFeedback);
router.route('/:id/issue').post(protect, addOrderIssue);

export default router;
