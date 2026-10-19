import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get Videos (public & admin)
router.get('/', (req, res) => {
  const category = req.query.category;
  const featuredOnly = req.query.featured === 'true';
  const offerId = req.query.offerId;
  let videos = db.get('videos');

  if (category && category !== 'All') {
    videos = videos.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }

  if (featuredOnly) {
    videos = videos.filter(v => v.isFeatured);
  }

  if (offerId) {
    videos = videos.filter(v => v.offerId === offerId);
  }

  res.json({ success: true, count: videos.length, videos });
});

// Add Video (Admin)
router.post('/', authenticateAdmin, (req, res) => {
  const { title, description, category, videoUrl, thumbnailUrl, isFeatured, offerId } = req.body;

  if (!title || !videoUrl) {
    return res.status(400).json({ success: false, message: 'Video title and video URL are required.' });
  }

  const newVideo = {
    id: `vid_${Date.now()}`,
    title,
    description: description || '',
    category: category || 'Weddings',
    videoUrl,
    thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    isFeatured: !!isFeatured,
    offerId: offerId || '',
    createdAt: new Date().toISOString()
  };

  db.insert('videos', newVideo);

  res.status(201).json({
    success: true,
    message: 'Video published successfully!',
    video: newVideo
  });
});

// Update Video (Admin)
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const updated = db.update('videos', v => v.id === id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Video not found.' });
  }

  res.json({
    success: true,
    message: 'Video updated successfully!',
    video: updated
  });
});

// Toggle Featured (Admin)
router.patch('/:id/feature', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const video = db.findOne('videos', v => v.id === id);

  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found.' });
  }

  const updated = db.update('videos', v => v.id === id, { isFeatured: !video.isFeatured });

  res.json({
    success: true,
    message: `Video ${updated.isFeatured ? 'featured on homepage' : 'removed from featured'}!`,
    video: updated
  });
});

// Delete Video (Admin)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const removed = db.remove('videos', v => v.id === id);

  if (!removed) {
    return res.status(404).json({ success: false, message: 'Video not found.' });
  }

  res.json({ success: true, message: 'Video deleted successfully.' });
});

export default router;
