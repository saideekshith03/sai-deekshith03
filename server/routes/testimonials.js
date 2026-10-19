import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get testimonials
router.get('/', (req, res) => {
  const testimonials = db.get('testimonials');
  res.json({ success: true, count: testimonials.length, testimonials });
});

// Add testimonial (admin)
router.post('/', authenticateAdmin, (req, res) => {
  const { clientName, eventType, rating, reviewText, imageUrl, date } = req.body;
  if (!clientName || !reviewText) {
    return res.status(400).json({ success: false, message: 'Client name and review text required.' });
  }

  const newTestimonial = {
    id: `tst_${Date.now()}`,
    clientName,
    eventType: eventType || 'Client',
    rating: Number(rating) || 5,
    reviewText,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    date: date || 'Recent'
  };

  db.insert('testimonials', newTestimonial);
  res.status(201).json({ success: true, testimonial: newTestimonial });
});

// Delete testimonial (admin)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const removed = db.remove('testimonials', t => t.id === id);
  if (!removed) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, message: 'Testimonial removed' });
});

export default router;
