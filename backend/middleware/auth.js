const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check if token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded; // { id, role }

            next();
        } catch (error) {
            console.error("Auth Error:", error.message);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const adminRequired = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Forbidden. Admin credentials required.' });
    }
};

const adminOrFacultyRequired = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Faculty')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Forbidden. Admin or Faculty credentials required.' });
    }
};

module.exports = { protect, adminRequired, adminOrFacultyRequired };
