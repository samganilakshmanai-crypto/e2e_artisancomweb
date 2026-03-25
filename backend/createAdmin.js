import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin already exists!');
            process.exit(0);
        }

        const admin = new User({
            name: 'Super Admin',
            email: 'admin@gmail.com',
            password: 'admin@123',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin created successfully! You can now log in.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
