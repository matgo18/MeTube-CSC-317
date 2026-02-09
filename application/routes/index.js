var express = require('express');
var router = express.Router();
const db = require("../db");

/* GET home page. */
router.get(['/index', '/'], function(req, res, next) {
  res.render('index', { title: 'Landing Page', script: '/public/js/index.js', welcomeMessage:'Welcome', user: req.session.user });
});

/* API Route: Fetch videos */
router.get('/api/videos', async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search
        ? 'SELECT id, title, thumbnail_path, author FROM videos WHERE title LIKE ?'
        : 'SELECT id, title, thumbnail_path, author FROM videos';
    const params = search ? [`%${search}%`] : [];

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/api/user-videos', async (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const [rows] = await db.execute(
        'SELECT id, title, thumbnail_path, author FROM videos WHERE user_id = ?',
        [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/api/videos/:id', async (req, res) => {
  const videoId = req.params.id;
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const [result] = await db.execute(
        'DELETE FROM videos WHERE id = ? AND user_id = ?',
        [videoId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or video not found' });
    }

    res.status(200).json({ message: 'Video deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;