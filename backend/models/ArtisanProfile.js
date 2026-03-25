import mongoose from 'mongoose';

const artisanProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true },
    description: { type: String, required: true },
    documents: [{ type: String }], // URLs to identity or business verification docs
    isVerified: { type: Boolean, default: false }, // Admins to toggle this
    qrCodeImage: { type: String, default: '' }, // For manual payment simulation
    earnings: { type: Number, default: 0 },
    workExperience: { type: String, default: '' } // Artisan work experience
}, { timestamps: true });

export default mongoose.model('ArtisanProfile', artisanProfileSchema);
