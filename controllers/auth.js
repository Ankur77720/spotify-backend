const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userModel = require('../models/user');

passport.use(new LocalStrategy(userModel.authenticate()));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret' // Replace with your secret key
},
    function (jwtPayload, cb) {
        // This function extracts the payload and checks if the user exists in the database
        return userModel.findById(jwtPayload._id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));

module.exports.registerPost = function registerPost(req, res) {

    var userData = new userModel({
        username: req.body.username,
        email: req.body.email
    });
    userModel.register(userData, req.body.password)
        .then(function (registeredUser) {
            passport.authenticate('local')(req, res, function () {
                const token = jwt.sign({ _id: registeredUser._id }, process.env.JWT_SECRET); // Create JWT token
                res.status(200).json({
                    message: 'registered successfully',
                    user: registeredUser,
                    token: token // Send the token in the response
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
}

module.exports.loginPost = function loginPost(req, res) {
    // Authenticate user
    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err) {
            // Error during authentication
            return res.status(500).json({ message: err });
        }
        if (!user) {
            // User not found or incorrect credentials
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // User authenticated successfully
        req.login(user, { session: false }, function (err) {
            if (err) {
                return res.status(500).json({ message: err });
            }
            // Generate JWT token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            // Send response with token
            return res.status(200).json({
                message: 'Login successful',
                user: user,
                token: token
            });
        });
    })(req, res);
};

