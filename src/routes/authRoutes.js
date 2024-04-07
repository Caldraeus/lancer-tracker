// authRoutes.js
/*
   Contains routes for:
   - login
   - signup
   - logout
   - change-password
*/

import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import firebaseApp from '../config/firebase-config.js'; // Import the Firebase app instance

const router = express.Router();

// Initialize Firebase Authentication
const auth = getAuth(firebaseApp);

// Add body parsing middleware
router.use(express.json());

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email and password
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' }); // Use 400 status code for bad request
    }
    
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters' });
    }

    // Sign up the user using Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    req.session.user = user; // Store user data in session
    res.status(200).json({ message: 'Account created successfully', user: { email: user.email } }); // Send only necessary user data to client
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Error creating account' }); // Do not expose error details to client
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email and password
    if (!isValidEmail(email) || !isStrongPassword(password)) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Log in the user using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    req.session.user = user; // Store user data in session
    
    // Send info to client.
    res.status(200).json({ message: 'Login successful', user: { email: user.email, uid: user.uid } }); // Send only necessary user data to client

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ message: 'Invalid email or password' }); // Use 401 status code for unauthorized access
  }
});

// Simple logout route
router.post('/logout', async(req, res) => {
  req.session.destroy(err => {
    if (err) {
        console.error('Error logging out:', err);
        res.status(500).json({ error: 'Logout failed' });
    } else {
        res.sendStatus(200); // Logout successful
    }
  });
});

// Change password route.
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
      // Get the currently authenticated user
      const user = req.session.user;

      // Validate the new password
      if (!isStrongPassword(newPassword)) {
          return res.status(400).json({ message: 'Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters' });
      }

      // Re-authenticate the user using their current password
      //console.log(`Signing in: ${user.email} and ${currentPassword}`)
      await reauthenticate(user.email, currentPassword);

      // If re-authentication is successful, update the user's password
      await updatePassword(credentials.user, newPassword);

      // Password successfully updated
      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Error changing password' });
  }
});

// Change email route
router.post('/change-email', async (req, res) => {
  const { newEmail, password } = req.body;

  try {
    // Get the currently authenticated user from the session
    const user = req.session.user;

    // Ensure the user is properly authenticated
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Re-authenticate the user using the provided password
    await reauthenticate(user.email, password);

    // Update the user's email address
    await updateEmail(auth.currentUser, newEmail);

    // Update the session with the new email
    req.session.user.email = newEmail;

    // Send success response
    res.status(200).json({ message: 'Email changed successfully' });
  } catch (error) {
    console.error('Error changing email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reauthenticate function
async function reauthenticate(email, password) {
  try {
    // Create a credential for re-authentication
    const credential = EmailAuthProvider.credential(email, password);

    // Re-authenticate the user
    await reauthenticateWithCredential(auth.currentUser, credential);

    console.log('User re-authenticated successfully');
    return true;
  } catch (error) {
    console.error('Error re-authenticating user:', error);
    return false;
  }
}

// Validate email function
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Validate password function
function isStrongPassword(password) {
  const minLength = 8;
  const uppercasePattern = /[A-Z]/;
  const lowercasePattern = /[a-z]/;
  const digitPattern = /\d/;
  const specialCharacterPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  
  return (
    password.length >= minLength &&
    uppercasePattern.test(password) &&
    lowercasePattern.test(password) &&
    digitPattern.test(password) &&
    specialCharacterPattern.test(password)
  );
}

export default router;