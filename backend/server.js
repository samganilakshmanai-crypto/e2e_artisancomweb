import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const frontendUrl = process.env.FRONTEND_URL || 'https://artisanfrontend.onrender.com';
const allowedOrigins = [frontendUrl, 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Allow tools like Postman / server-to-server
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express.json());
app.use(cookieParser()); // Enables reading HttpOnly cookies

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artisan-marketplace')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/artisans', artisanRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic route
app.get('/', (req, res) => {
    res.send('Artisan Marketplace API is running...');
});

// Serve frontend SPA when requested (Render-style single-repo/full-stack flow)
if (process.env.NODE_ENV === 'production' || process.env.SERVE_BACKEND_WITH_FRONTEND === 'true') {
    const frontendDist = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendDist));

    app.get('*', (req, res) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
            return res.status(404).json({ message: 'API route not found' });
        }

        return res.sendFile(path.join(frontendDist, 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
