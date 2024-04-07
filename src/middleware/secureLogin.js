// Middleware function to check if user is logged in
const requireLogin = (req, res, next) => {
    if (req.session.user) {
      next(); // User is logged in, proceed to the next middleware
    } else {
      res.status(401).send('Unauthorized: Please log in to access this page.');
    }
};