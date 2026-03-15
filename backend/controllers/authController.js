const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, facultyId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        // Check user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // If role is Faculty, ensure facultyId is provided
        if (role === 'Faculty' && !facultyId) {
            return res.status(400).json({ success: false, message: 'Faculty ID is required for faculty registration' });
        }

        // Create user
        const userData = {
            name,
            email,
            password_hash,
            role: role === 'Admin' ? 'Admin' : (role === 'Faculty' ? 'Faculty' : 'Student'),
        };

        if (role === 'Faculty') {
            userData.facultyId = facultyId;
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                success: true,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, facultyId: user.facultyId },
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("====== REGISTRATION FULL ERROR ======");
        console.error(error);
        console.error("====================================");
        res.status(500).json({ success: false, message: 'Server Error', details: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                success: true,
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("====== LOGIN FULL ERROR ======");
        console.error(error);
        console.error("==============================");
        res.status(500).json({ success: false, message: 'Server Error', details: error.message });
    }
};

module.exports = { registerUser, loginUser };
