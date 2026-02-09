const express = require('express');
const router = express.Router();
const db = require('../db'); // uses db.js
const bcrypt = require("bcrypt")

// GET login page
router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login',
        user: req.session.user,
        welcomeMessage: 'Log in to your account'
    });
});

// POST login credentials
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.render('login', {
                title: 'Login',
                error: '<p style="color: red">Invalid username or password</p>',
                welcomeMessage: 'Log in to your account'
            });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture
            };
            res.redirect('/');
        } else {
            res.render('login', {
                title: 'Login',
                error: '<p style="color: red">Invalid username or password</p>',
                welcomeMessage: 'Log in to your account'
            });
        }
    } catch (err) {
        console.error(err);
        res.render('login', {
            title: 'Login',
            error: 'Server error'
        });
    }
});



module.exports = router;