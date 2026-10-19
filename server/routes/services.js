import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get Services (all or active only)
router.get('/', (req, res) => {
  const includeAll = req.query.all === 'true';
  const services = db.get('services');

  const result = includeAll
    ? [...services].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    : services.filter(s => s.isActive).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  res.json({ success: true, count: result.length, services: result });
});

// Add Service (Admin)
router.post('/', authenticateAdmin, (req, res) => {
  const { title, shortDesc, fullDesc, category, priceStarting, imageUrl, features } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Service title is required.' });
  }

  const services = db.get('services');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newService = {
    id: `srv_${Date.now()}`,
    title,
    slug,
    shortDesc: shortDesc || '',
    fullDesc: fullDesc || '',
    category: category || 'Weddings',
    priceStarting: Number(priceStarting) || 0,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
    orderIndex: services.length + 1,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.insert('services', newService);

  res.status(201).json({
    success: true,
    message: 'Service added successfully!',
    service: newService
  });
});

// Update Service (Admin)
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.features && typeof updates.features === 'string') {
    updates.features = updates.features.split(',').map(f => f.trim()).filter(Boolean);
  }
  if (updates.priceStarting !== undefined) {
    updates.priceStarting = Number(updates.priceStarting);
  }

  const updated = db.update('services', s => s.id === id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  res.json({
    success: true,
    message: 'Service updated successfully!',
    service: updated
  });
});

// Delete Service (Admin)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.remove('services', s => s.id === id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  res.json({ success: true, message: 'Service deleted successfully.' });
});

// Reorder Services (Admin)
router.post('/reorder', authenticateAdmin, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ success: false, message: 'orderedIds array required' });
  }

  const services = db.get('services');
  orderedIds.forEach((id, index) => {
    const s = services.find(item => item.id === id);
    if (s) {
      s.orderIndex = index + 1;
    }
  });

  db.save();
  res.json({ success: true, message: 'Services reordered successfully.' });
});

export default router;
