const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require("bcrypt")
const multer = require('multer');
const path = require('path');

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/profile_picture'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadProfile = multer({ storage: profileStorage });

// GET registration page
router.get('/', function(req, res) {
    res.render('registration', {
        title: 'Registration Page',
        script: '/public/js/registration.js',
        welcomeMessage: 'Register your account',
        user: req.session.user
    });
});

function validateRegistration(username, password, confirmPassword) {
    const errors = [];

    if (!/^[a-zA-Z][a-zA-Z0-9]{2,}$/.test(username)) {
        errors.push("Username must start with a letter and be at least 3 alphanumeric characters.");
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[\/\*\-\+\!@#\$^\&~\[\]]/.test(password);

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
    }
    if (!hasUpper) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!hasNumber) {
        errors.push("Password must contain at least one number.");
    }
    if (!hasSpecial) {
        errors.push("Password must contain at least one special character (/ * - + ! @ # $ ^ & ~ [ ]).");
    }

    if (password !== confirmPassword) {
        errors.push("Passwords do not match.");
    }

    return errors;
}

// POST new user registration
router.post('/', uploadProfile.single('profile_picture'), async (req, res) => {
    const { username, password, confirm_password, email } = req.body;

    const validationErrors = validateRegistration(username, password, confirm_password);

    if (validationErrors.length > 0) {
        return res.render('registration', {
            title: 'Registration Page',
            error: `<p style="color: red">${validationErrors.join('<br>')}</p>`,
        });
    } else {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            if (rows.length > 0) {
                return res.render('registration', {
                    title: 'Registration Page',
                    error: '<p style="color: red">Username already taken.</p>',
                    welcomeMessage: 'Register your account',
                });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const profilePath = req.file
                ? `/public/uploads/profile_picture/${req.file.filename}`
                : '/public/uploads/profile_picture/default.png';

            await db.execute(
                'INSERT INTO users (username, password, email, profile_picture) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, email, profilePath]
            );

            res.redirect('/login');
        } catch (err) {
            console.error(err);
            res.render('registration', {
                title: 'Registration Page',
                error: 'Registration failed. Please try again later.',
                welcomeMessage: 'Register your account',
            });
        }
    }
});

module.exports = router;


