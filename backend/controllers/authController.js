import User from '../models/User.js';
import ArtisanProfile from '../models/ArtisanProfile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, businessName, description } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const validRole = ['customer', 'artisan'].includes(role) ? role : 'customer';

        const user = await User.create({
            name, email, password: hashedPassword, role: validRole
        });

        if (user) {
            // If artisan, create artisan profile
            if (validRole === 'artisan') {
                if (!businessName || !description) return res.status(400).json({ message: 'Business name and description required for artisans' });
                await ArtisanProfile.create({
                    userId: user._id, businessName, description
                });
            }

            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id, name: user.name, email: user.email, role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.status === 'banned') return res.status(403).json({ message: 'User is banned' });
            
            generateToken(res, user._id);
            res.status(200).json({
                _id: user._id, name: user.name, email: user.email, role: user.role
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'customer' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllArtisans = async (req, res) => {
    try {
        const artisans = await User.find({ role: 'artisan' }).select('-password');
        res.json(artisans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find and delete the user
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteArtisanById = async (req, res) => {
    try {
        const artisanId = req.params.id;
        
        // Find and delete the artisan user
        const artisan = await User.findByIdAndDelete(artisanId);
        
        if (!artisan) {
            return res.status(404).json({ message: 'Artisan not found' });
        }

        // Also delete artisan profile if exists
        await ArtisanProfile.deleteOne({ userId: artisanId });

        res.json({ message: 'Artisan deleted successfully', artisan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
