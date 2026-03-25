import ArtisanProfile from '../models/ArtisanProfile.js';

export const getArtisanProfile = async (req, res) => {
    try {
        const profile = await ArtisanProfile.findOne({ userId: req.user._id }).populate('userId', 'name email');
        if (profile) return res.json(profile);
        res.status(404).json({ message: 'Artisan profile not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateArtisanProfile = async (req, res) => {
    try {
        const { qrCodeImage, workExperience, businessName, description } = req.body;
        const profile = await ArtisanProfile.findOne({ userId: req.user._id });
        
        if (profile) {
            profile.qrCodeImage = qrCodeImage || profile.qrCodeImage;
            profile.workExperience = workExperience || profile.workExperience;
            profile.businessName = businessName || profile.businessName;
            profile.description = description || profile.description;
            
            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Artisan profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getArtisanQrCode = async (req, res) => {
    try {
        const profile = await ArtisanProfile.findOne({ userId: req.params.id });
        if (profile) {
            res.json({ qrCodeImage: profile.qrCodeImage });
        } else {
            res.status(404).json({ message: 'Artisan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import User from '../models/User.js';

export const getAdminStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments({ role: 'customer' });
        const artisansCount = await User.countDocuments({ role: 'artisan' });
        
        const pendingArtisans = await ArtisanProfile.find({ isVerified: false }).populate('userId', 'name email');
        
        res.json({
            usersCount,
            artisansCount,
            pendingVerificationCount: pendingArtisans.length,
            flagsCount: 0,
            pendingArtisans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyArtisan = async (req, res) => {
    try {
        const profile = await ArtisanProfile.findById(req.params.id);
        if (profile) {
            profile.isVerified = true;
            await profile.save();
            res.json({ message: 'Artisan verified' });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
