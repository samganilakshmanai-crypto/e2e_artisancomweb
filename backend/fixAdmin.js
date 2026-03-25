import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const fix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ email: 'admin@gmail.com' });
        if (admin) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('admin@123', salt);
            await admin.save();
            console.log('Fixed admin password: Now securely hashed with bcrypt!');
        }
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
};

fix();
