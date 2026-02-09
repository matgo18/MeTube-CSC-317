var express = require('express');
var router = express.Router();
const path = require("path");
const multer = require("multer");
const db = require("../db");

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Different directories for videos and thumbnails
        if (file.fieldname === 'video') {
            cb(null, path.join(__dirname, "../public/uploads/videos"));
        } else if (file.fieldname === 'thumbnail') {
            cb(null, path.join(__dirname, "../public/uploads/thumbnails"));
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

/* GET postvideo page. */
router.get('/', function(req, res, next) {
    res.render('postvideo', { title: 'Post Video Page', script:'', welcomeMessage:'Post your videos', user: req.session.user});
});

// POST: Handle video and thumbnail submission
router.post('/', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async function (req, res, next) {
    if (!req.session.user) {
        return res.status(401).send('You must be logged in to post.');
    }

    const { title, description } = req.body;

    // Get the video and thumbnail file paths
    const videoPath = req.files['video'] ? `/public/uploads/videos/${req.files['video'][0].filename}` : null;
    const thumbnailPath = req.files['thumbnail']
        ? `/public/uploads/thumbnails/${req.files['thumbnail'][0].filename}`
        : '/public/uploads/thumbnails/default.jpg';
    const userId = req.session.user.id;

    // Insert the video details into the database
    const sql = `
        INSERT INTO videos (user_id, title, author, description, video_path, thumbnail_path, likes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 0, NOW())
    `;

    try {
        const [results] = await db.execute(sql, [userId, title, req.session.user.username, description, videoPath, thumbnailPath]);
        const insertedVideoId = results.insertId;
        res.redirect(`/viewpost/${insertedVideoId}`);
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Database error', error: err });
    }
});

module.exports = router;