const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

module.exports.isLoggedIn = function isLoggedIn(req, res, next) {

    const token = req.headers.authorization ? req.headers.authorization.split(' ')[ 1 ] : null;


    if (token) {
        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
            if (err) {
                // If token verification fails, return an error response
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                req.user = await userModel.findById(decoded._id);
                // If token verification succeeds, continue to the next middleware
                return next();
            }
        });
    } else {
        // If no token is provided, return an error response
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


module.exports.isAdmin = function isAdmin(req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[ 1 ] : null;
    if (token) {
        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                // If token verification fails, return an error response
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                // If token verification succeeds, continue to the next middleware
                if (decoded.accessLevel === 0) {
                    return next();
                }
                return res.status(401).json({ message: 'Unauthorized' });
            }
        });
    } else {
        // If no token is provided, return an error response
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.storeToken = async function storeToken(req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[ 1 ] : null;
    if (token) {
        try {
            // Assuming the token is a JWT and contains a userId claim
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userMode.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Assuming the User model has a tokens field that stores an array of tokens
            user.tokens.push(token);
            await user.save();
            next();
        } catch (err) {
            return res.status(500).json({ message: 'Error storing token', error: err.message });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
