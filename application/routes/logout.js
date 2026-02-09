const express = require('express');
const router = express.Router();

// GET logout page
router.get("/", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during disconnection :", err);
            return res.status(500).send("Disconnection Error.");
        }
        res.redirect("/login");
    });
});

module.exports = router;

