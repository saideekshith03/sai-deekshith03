import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateAdmin, (req, res) => {
  const bookings = db.get('bookings') || [];
  const packages = db.get('packages') || [];
  const offers = db.get('offers') || [];
  const videos = db.get('videos') || [];
  const services = db.get('services') || [];
  const quotations = db.get('quotations') || [];

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Core KPIs
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const completedEvents = bookings.filter(b => b.status === 'Completed').length;
  const upcomingEvents = bookings.filter(b => ['Pending', 'Confirmed'].includes(b.status) && b.eventDate >= todayStr).length;

  // Active vs Expired offers
  const activeOffers = offers.filter(o => o.isPublished && (!o.expiryDate || o.expiryDate >= todayStr)).length;
  const expiredOffers = offers.filter(o => o.expiryDate && o.expiryDate < todayStr).length;

  const totalVideos = videos.length;
  const totalPublishedServices = services.filter(s => s.isActive).length;
  const totalPackages = packages.length;
  const pendingQuotations = quotations.filter(q => q.status === 'Pending').length;

  // Revenue calculation from confirmed & completed bookings with payments
  let totalRevenue = 0;
  bookings.forEach(b => {
    if (b.status === 'Completed' || b.paymentStatus === 'Fully Paid') {
      totalRevenue += (b.quotedPrice || 0);
    } else if (b.paymentStatus === 'Advance Paid') {
      // Estimate 35% advance
      totalRevenue += Math.round((b.quotedPrice || 0) * 0.35);
    }
  });

  // 2. Bookings by Month (dynamically grouped)
  const monthMap = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Seed last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
    monthMap[key] = { month: key, bookings: 0, revenue: 0 };
  }

  bookings.forEach(b => {
    const date = new Date(b.eventDate || b.createdAt);
    if (!isNaN(date.getTime())) {
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
      if (!monthMap[key]) {
        monthMap[key] = { month: key, bookings: 0, revenue: 0 };
      }
      monthMap[key].bookings += 1;
      if (b.status === 'Completed' || b.paymentStatus === 'Fully Paid') {
        monthMap[key].revenue += (b.quotedPrice || 0);
      } else if (b.paymentStatus === 'Advance Paid') {
        monthMap[key].revenue += Math.round((b.quotedPrice || 0) * 0.35);
      }
    }
  });

  const bookingsByMonth = Object.values(monthMap);

  // 3. Bookings by Event Category
  const categoryCounts = {};
  bookings.forEach(b => {
    const cat = b.eventType || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const bookingsByCategory = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));

  // 4. Booking Status Distribution
  const statusCounts = { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0, Rejected: 0 };
  bookings.forEach(b => {
    if (statusCounts[b.status] !== undefined) {
      statusCounts[b.status] += 1;
    } else {
      statusCounts[b.status] = 1;
    }
  });
  const statusDistribution = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count
  }));

  // 5. Most Popular Packages (frequency in bookings)
  const packagePopularity = {};
  bookings.forEach(b => {
    const pName = b.packageName || 'Custom / Unspecified';
    packagePopularity[pName] = (packagePopularity[pName] || 0) + 1;
  });
  const mostPopularPackages = Object.entries(packagePopularity)
    .map(([name, bookingsCount]) => ({ name, bookingsCount }))
    .sort((a, b) => b.bookingsCount - a.bookingsCount)
    .slice(0, 5);

  res.json({
    success: true,
    stats: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedEvents,
      upcomingEvents,
      activeOffers,
      expiredOffers,
      totalVideos,
      totalPublishedServices,
      totalPackages,
      pendingQuotations,
      totalRevenue
    },
    charts: {
      bookingsByMonth,
      bookingsByCategory,
      statusDistribution,
      mostPopularPackages
    }
  });
});

export default router;
