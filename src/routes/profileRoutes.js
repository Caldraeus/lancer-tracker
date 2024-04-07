// profileRoutes.js
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

const publicPath = path.resolve(__dirname, '..', '..', 'public');

router.get('/profile', (req, res) => {
    console.log("User is: " + req.session.user);
    // Check if user is logged in
    if (req.session.user) {
        // If user is logged in, serve the profile HTML
        res.sendFile(path.join(publicPath, 'html', 'profile.html'));
    } else {
        // If user is not logged in, redirect to login page
        res.redirect('/html/login.html'); // Fixed the redirect path
    }
});

// Endpoint to fetch user information
router.get('/profile/info', (req, res) => {
    // Check if user is logged in
    if (req.session.user) {
        // If user is logged in, send user information as JSON
        res.json({
            email: req.session.user.email,
            uid: req.session.user.uid
        });
    } else {
        // If user is not logged in, send 401 Unauthorized status
        res.status(401).json({ error: 'User not authenticated' });
    }
});

export default router;