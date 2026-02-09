var express = require('express');
var router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Set up Multer storage for profile pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/profile_picture'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profile', { title: 'Profile Page', welcomeMessage: 'Your Profile', username: req.session.user.username, email: req.session.user.email, user: req.session.user, script: '/public/js/profile.js',});
});

// POST: Upload profile picture
router.post('/upload-picture', upload.single('profile_picture'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const userId = req.session.user.id;
    const picturePath = `public/uploads/profile_picture/${req.file.filename}`;

    try {
        await db.execute(
            'UPDATE users SET profile_picture = ? WHERE id = ?',
            [picturePath, userId]
        );

        // Update session data
        req.session.user.profile_picture = picturePath;

        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading profile picture.');
    }
});

router.post('/delete-account', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;
    const username = req.session.user.username;

    try {
        await db.execute('DELETE FROM videos WHERE author = ?', [username]);
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);

        // Destroy session after deleting the user
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Account deleted, but session cleanup failed.');
            }
            res.redirect('/login');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete account.');
    }
});

module.exports = router;

