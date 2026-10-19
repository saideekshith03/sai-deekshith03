import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to determine offer status
const getOfferStatus = (offer) => {
  if (!offer.isPublished) return 'draft';
  const today = new Date().toISOString().split('T')[0];
  if (offer.expiryDate && offer.expiryDate < today) {
    return 'expired';
  }
  if (offer.startDate && offer.startDate > today) {
    return 'scheduled';
  }
  return 'active';
};

// Get Offers
router.get('/', (req, res) => {
  const includeAll = req.query.all === 'true';
  const tab = req.query.tab; // 'active', 'scheduled', 'expired', 'draft'
  const offers = db.get('offers');

  const offersWithStatus = offers.map(off => ({
    ...off,
    status: getOfferStatus(off)
  }));

  if (includeAll) {
    if (tab && tab !== 'all') {
      const filtered = offersWithStatus.filter(o => o.status === tab);
      return res.json({ success: true, count: filtered.length, offers: filtered });
    }
    return res.json({ success: true, count: offersWithStatus.length, offers: offersWithStatus });
  }

  // Public website only gets currently active and published offers
  const activeOffers = offersWithStatus.filter(o => o.status === 'active' && o.isPublished);
  res.json({ success: true, count: activeOffers.length, offers: activeOffers });
});

// Add Offer (Admin)
router.post('/', authenticateAdmin, (req, res) => {
  const {
    title,
    description,
    originalPrice,
    discountedPrice,
    discountPercentage,
    startDate,
    expiryDate,
    bannerImage,
    videoUrl,
    applicableCategories
  } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Offer title is required.' });
  }

  const orig = Number(originalPrice) || 0;
  const disc = Number(discountedPrice) || 0;
  let percent = Number(discountPercentage);
  if (!percent && orig > 0 && disc > 0) {
    percent = Math.round(((orig - disc) / orig) * 100);
  }

  const categories = Array.isArray(applicableCategories)
    ? applicableCategories
    : (applicableCategories ? applicableCategories.split(',').map(c => c.trim()) : ['All']);

  const newOffer = {
    id: `off_${Date.now()}`,
    title,
    description: description || '',
    originalPrice: orig,
    discountedPrice: disc,
    discountPercentage: percent || 0,
    startDate: startDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || '',
    bannerImage: bannerImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    videoUrl: videoUrl || '',
    applicableCategories: categories,
    isPublished: true,
    createdAt: new Date().toISOString()
  };

  db.insert('offers', newOffer);

  res.status(201).json({
    success: true,
    message: 'Special offer published successfully!',
    offer: {
      ...newOffer,
      status: getOfferStatus(newOffer)
    }
  });
});

// Update Offer (Admin)
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice);
  if (updates.discountedPrice !== undefined) updates.discountedPrice = Number(updates.discountedPrice);
  if (updates.discountPercentage !== undefined) updates.discountPercentage = Number(updates.discountPercentage);
  if (updates.applicableCategories && typeof updates.applicableCategories === 'string') {
    updates.applicableCategories = updates.applicableCategories.split(',').map(c => c.trim());
  }

  const updated = db.update('offers', o => o.id === id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Offer not found.' });
  }

  res.json({
    success: true,
    message: 'Offer updated successfully!',
    offer: {
      ...updated,
      status: getOfferStatus(updated)
    }
  });
});

// Toggle Publish Status (Admin)
router.patch('/:id/publish', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const offer = db.findOne('offers', o => o.id === id);

  if (!offer) {
    return res.status(404).json({ success: false, message: 'Offer not found.' });
  }

  const updated = db.update('offers', o => o.id === id, { isPublished: !offer.isPublished });

  res.json({
    success: true,
    message: `Offer ${updated.isPublished ? 'published' : 'moved to draft'}!`,
    offer: {
      ...updated,
      status: getOfferStatus(updated)
    }
  });
});

// Delete Offer (Admin)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const removed = db.remove('offers', o => o.id === id);

  if (!removed) {
    return res.status(404).json({ success: false, message: 'Offer not found.' });
  }

  res.json({ success: true, message: 'Offer deleted successfully.' });
});

export default router;
