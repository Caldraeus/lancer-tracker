import express from 'express';

const router = express.Router();

// Route to check session status
router.get('/session/status', (req, res) => {
    if (req.session && req.session.user) {
        // User has an active session
        res.status(200).json({ loggedIn: true });
    } else {
        // User does not have an active session
        res.status(401).json({ loggedIn: false });
    }
});

export default router;
