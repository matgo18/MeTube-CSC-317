const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db.js is configured correctly

/* GET viewpost page with video data. */
router.get('/:id', async function (req, res, next) {
    const videoId = req.params.id;

    try {
        // Query the database to fetch the video data
        const [rows] = await db.execute('SELECT * FROM videos WHERE id = ?', [videoId]);

        if (rows.length === 0) {
            return res.status(404).render('error', { message: 'Video not found' });
        }

        const video = rows[0];

        // Fetch comments for the video
        const [comments] = await db.execute(`
            SELECT c.comment, c.created_at, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.video_id = ?
            ORDER BY c.created_at DESC
        `, [videoId]);

        // Render viewpost.hbs
        res.render('viewpost', {
            title: 'View Post Page',
            user: req.session.user,
            video: video,
            comments: comments,
            welcomeMessage: video.title,
            script: '/public/js/like.js'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).render('error', { message: 'Server error', error: err });
    }
});

module.exports = router;
