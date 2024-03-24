const jwt = require('jsonwebtoken');

module.exports.isLoggedIn = function isLoggedIn(req, res, next) {

    const token = req.headers.authorization ? req.headers.authorization.split(' ')[ 1 ] : null;


    if (token) {
        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                // If token verification fails, return an error response
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
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


