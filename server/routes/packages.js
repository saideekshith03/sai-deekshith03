import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get Packages (public gets published; admin gets all)
router.get('/', (req, res) => {
  const includeAll = req.query.all === 'true';
  const category = req.query.category;
  let packages = db.get('packages');

  if (!includeAll) {
    packages = packages.filter(p => p.isPublished);
  }

  if (category && category !== 'All') {
    packages = packages.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  res.json({ success: true, count: packages.length, packages });
});

// Get Single Package by ID
router.get('/:id', (req, res) => {
  const pkg = db.findOne('packages', p => p.id === req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Package not found.' });
  }
  res.json({ success: true, package: pkg });
});

// Create Package (Admin)
router.post('/', authenticateAdmin, (req, res) => {
  const {
    name,
    category,
    price,
    originalPrice,
    duration,
    photographersCount,
    videographersCount,
    albumDetails,
    editedPhotosCount,
    cinematicVideoDetails,
    additionalFeatures,
    description,
    imageUrl,
    isPopular
  } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'Package name and price are required.' });
  }

  const featuresList = Array.isArray(additionalFeatures)
    ? additionalFeatures
    : (additionalFeatures ? additionalFeatures.split('\n').map(f => f.trim()).filter(Boolean) : []);

  const newPackage = {
    id: `pkg_${Date.now()}`,
    name,
    category: category || 'Weddings',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    duration: duration || '1 Day Event',
    photographersCount: Number(photographersCount) || 1,
    videographersCount: Number(videographersCount) || 0,
    albumDetails: albumDetails || 'Standard Album',
    editedPhotosCount: editedPhotosCount || '100+ Photos',
    cinematicVideoDetails: cinematicVideoDetails || 'Full HD coverage',
    additionalFeatures: featuresList,
    description: description || '',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    isPublished: true,
    isPopular: !!isPopular,
    createdAt: new Date().toISOString()
  };

  db.insert('packages', newPackage);

  res.status(201).json({
    success: true,
    message: 'Package published successfully!',
    package: newPackage
  });
});

// Update Package (Admin)
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice);
  if (updates.photographersCount !== undefined) updates.photographersCount = Number(updates.photographersCount);
  if (updates.videographersCount !== undefined) updates.videographersCount = Number(updates.videographersCount);
  if (updates.additionalFeatures && typeof updates.additionalFeatures === 'string') {
    updates.additionalFeatures = updates.additionalFeatures.split('\n').map(f => f.trim()).filter(Boolean);
  }

  const updated = db.update('packages', p => p.id === id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Package not found.' });
  }

  res.json({
    success: true,
    message: 'Package updated successfully!',
    package: updated
  });
});

// Toggle Publish Status (Admin)
router.patch('/:id/publish', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const pkg = db.findOne('packages', p => p.id === id);

  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Package not found.' });
  }

  const updated = db.update('packages', p => p.id === id, { isPublished: !pkg.isPublished });

  res.json({
    success: true,
    message: `Package ${updated.isPublished ? 'published' : 'unpublished'} successfully!`,
    package: updated
  });
});

// Delete Package (Admin)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const removed = db.remove('packages', p => p.id === id);

  if (!removed) {
    return res.status(404).json({ success: false, message: 'Package not found.' });
  }

  res.json({ success: true, message: 'Package deleted successfully.' });
});

export default router;
