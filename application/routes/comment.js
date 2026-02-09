const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/:id', async (req, res) => {
    const videoId = parseInt(req.params.id, 10);
    const user = req.session.user;
    const { comment } = req.body;

    if (!user) {
        return res.status(401).send('You must be logged in to comment.');
    }

    try {
        await db.execute(
            'INSERT INTO comments (video_id, user_id, comment) VALUES (?, ?, ?)',
            [videoId, user.id, comment]
        );
        res.redirect(`/viewpost/${videoId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

module.exports = router;
