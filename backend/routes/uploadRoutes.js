import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import path from 'path';

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Return proper file path
        const filePath = `/uploads/${req.file.filename}`;
        res.status(200).json(filePath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
