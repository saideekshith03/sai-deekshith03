import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get Public Website Settings
router.get('/', (req, res) => {
  const settings = db.data.settings || {};
  res.json({ success: true, settings });
});

// Update Website Settings (Admin only)
router.put('/', authenticateAdmin, (req, res) => {
  const updates = req.body;
  db.data.settings = {
    ...db.data.settings,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  db.save();

  res.json({
    success: true,
    message: 'Studio settings updated successfully!',
    settings: db.data.settings
  });
});

export default router;
