import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const admin = db.data.admin;

  if (username !== admin.username) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your username.' });
  }

  const passwordValid = bcrypt.compareSync(password, admin.passwordHash);
  if (!passwordValid) {
    return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
  }

  // Update last login
  admin.lastLogin = new Date().toISOString();
  db.save();

  const token = generateToken(admin);

  return res.json({
    success: true,
    message: 'Login successful. Welcome back, Owner!',
    token,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

// Verify Admin Token
router.get('/verify', authenticateAdmin, (req, res) => {
  const admin = db.data.admin;
  return res.json({
    success: true,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin
    }
  });
});

// Change Admin Password
router.post('/change-password', authenticateAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
  }

  const admin = db.data.admin;
  const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);

  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  db.save();

  return res.json({ success: true, message: 'Password updated successfully!' });
});

export default router;
