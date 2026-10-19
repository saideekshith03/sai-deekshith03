import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import servicesRoutes from './routes/services.js';
import packagesRoutes from './routes/packages.js';
import offersRoutes from './routes/offers.js';
import videosRoutes from './routes/videos.js';
import galleryRoutes from './routes/gallery.js';
import bookingsRoutes from './routes/bookings.js';
import quotationsRoutes from './routes/quotations.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';
import testimonialsRoutes from './routes/testimonials.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
const UPLOADS_DIR = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {}
}
app.use('/uploads', express.static(UPLOADS_DIR));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/quotations', quotationsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/testimonials', testimonialsRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CHINNI DIGITALS API Engine'
  });
});

// Production: Serve React Client Build & SPA Fallback (for standalone Express deployments)
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
