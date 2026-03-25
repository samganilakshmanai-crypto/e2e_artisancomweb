import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview } from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, authorizeRoles('artisan', 'admin'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorizeRoles('artisan', 'admin'), updateProduct)
    .delete(protect, authorizeRoles('admin', 'artisan'), deleteProduct);

router.route('/:id/reviews')
    .post(protect, createProductReview);

export default router;
