import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'artisan', 'admin'], default: 'customer' },
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
    profileImage: { type: String, default: '' },
    qrCodeImage: { type: String, default: '' },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        isDefault: Boolean
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
