// redirectRoutes.js

import express from 'express';

const router = express.Router();

router.get('/redirect/:page', (req, res) => {
    const page = req.params.page;
    console.log(`Redirecting to: /html/${page}.html`); // Log the redirect path
    if (/^[a-zA-Z0-9-]+$/.test(page)) {
      res.redirect(`/html/${page}.html`);
    } else {
      res.status(400).send('Invalid page name');
    }
});

export default router;