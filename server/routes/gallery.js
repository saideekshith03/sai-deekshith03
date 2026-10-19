import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get Gallery Images (public & admin)
router.get('/', (req, res) => {
  const category = req.query.category;
  const featuredOnly = req.query.featured === 'true';
  let gallery = db.get('gallery');

  if (category && category !== 'All') {
    gallery = gallery.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (featuredOnly) {
    gallery = gallery.filter(item => item.featured);
  }

  res.json({ success: true, count: gallery.length, gallery });
});

// Add Gallery Image (Admin)
router.post('/', authenticateAdmin, (req, res) => {
  const { title, category, imageUrl, shootDate, eventType, featured } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'Image URL or file is required.' });
  }

  const newImage = {
    id: `gal_${Date.now()}`,
    title: title || 'Studio Photograph',
    category: category || 'Weddings',
    imageUrl,
    shootDate: shootDate || new Date().toISOString().split('T')[0],
    eventType: eventType || category || 'Event',
    featured: !!featured,
    createdAt: new Date().toISOString()
  };

  db.insert('gallery', newImage);

  res.status(201).json({
    success: true,
    message: 'Photo added to gallery!',
    image: newImage
  });
});

// Update Gallery Image (Admin)
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const updated = db.update('gallery', g => g.id === id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Gallery item not found.' });
  }

  res.json({
    success: true,
    message: 'Gallery item updated successfully!',
    image: updated
  });
});

// Delete Gallery Image (Admin)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const removed = db.remove('gallery', g => g.id === id);

  if (!removed) {
    return res.status(404).json({ success: false, message: 'Gallery item not found.' });
  }

  res.json({ success: true, message: 'Image deleted from gallery successfully.' });
});

export default router;
