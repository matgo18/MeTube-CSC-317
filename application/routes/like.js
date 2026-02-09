const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/:id', async (req, res) => {
    const videoId = req.params.id;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'You need be logged in to like videos' });
    }

    try {
        // Check if user already liked the video
        const [existing] = await db.execute(
            'SELECT * FROM video_likes WHERE user_id = ? AND video_id = ?',
            [userId, videoId]
        );

        if (existing.length > 0) {
            // User already liked — so unlike it
            await db.execute('DELETE FROM video_likes WHERE user_id = ? AND video_id = ?', [userId, videoId]);
            await db.execute('UPDATE videos SET likes = likes - 1 WHERE id = ?', [videoId]);
        } else {
            // Not liked yet — so like it
            await db.execute('INSERT INTO video_likes (user_id, video_id) VALUES (?, ?)', [userId, videoId]);
            await db.execute('UPDATE videos SET likes = likes + 1 WHERE id = ?', [videoId]);
        }

        // Return updated like count
        const [rows] = await db.execute('SELECT likes FROM videos WHERE id = ?', [videoId]);
        res.json({ likes: rows[0].likes });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;
