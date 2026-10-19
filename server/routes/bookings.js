import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Generate unique booking reference number (e.g. CD-2026-4821)
const generateReferenceNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CD-${year}-${randomNum}`;
};

// Check slot availability for a given date
router.get('/check-slot', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date parameter is required.' });
  }

  const allSlots = db.data.availabilitySlots || [
    'Morning (8:00 AM - 1:00 PM)',
    'Evening (4:00 PM - 9:00 PM)',
    'Full Day (8:00 AM - 10:00 PM)',
    'Custom Hours'
  ];

  const bookings = db.get('bookings');

  // Active bookings that block the slot
  const bookedSlots = bookings
    .filter(b => b.eventDate === date && ['Pending', 'Confirmed'].includes(b.status))
    .map(b => b.timeSlot);

  const availability = allSlots.map(slot => {
    const isBooked = bookedSlots.includes(slot) || bookedSlots.includes('Full Day (8:00 AM - 10:00 PM)');
    return {
      slot,
      isAvailable: !isBooked,
      status: isBooked ? 'Booked' : 'Available'
    };
  });

  res.json({
    success: true,
    date,
    slots: availability
  });
});

// Customer: Submit Booking Request
router.post('/', (req, res) => {
  const {
    customerName,
    phone,
    email,
    eventType,
    packageId,
    packageName,
    quotedPrice,
    eventDate,
    timeSlot,
    eventLocation,
    eventAddress,
    notes
  } = req.body;

  // Validation
  if (!customerName || !phone || !eventType || !eventDate || !timeSlot) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, phone, event type, date, and time slot.'
    });
  }

  // Check double booking conflict
  const existingBookings = db.get('bookings');
  const hasConflict = existingBookings.some(b => 
    b.eventDate === eventDate &&
    (b.timeSlot === timeSlot || b.timeSlot === 'Full Day (8:00 AM - 10:00 PM)' || timeSlot === 'Full Day (8:00 AM - 10:00 PM)') &&
    ['Pending', 'Confirmed'].includes(b.status)
  );

  if (hasConflict) {
    return res.status(409).json({
      success: false,
      message: `The selected date (${eventDate}) and time slot (${timeSlot}) is already reserved. Please choose another date or slot, or contact us directly on WhatsApp.`
    });
  }

  // Look up package to lock price if packageId provided
  let finalQuotedPrice = Number(quotedPrice) || 0;
  let finalPackageName = packageName || eventType;

  if (packageId) {
    const pkg = db.findOne('packages', p => p.id === packageId);
    if (pkg) {
      finalQuotedPrice = pkg.price;
      finalPackageName = pkg.name;
    }
  }

  const referenceNo = generateReferenceNumber();

  const newBooking = {
    id: `bk_${Date.now()}`,
    referenceNo,
    customerName: customerName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    eventType,
    packageId: packageId || null,
    packageName: finalPackageName,
    quotedPrice: finalQuotedPrice,
    eventDate,
    timeSlot,
    eventLocation: eventLocation ? eventLocation.trim() : 'Studio / TBD',
    eventAddress: eventAddress ? eventAddress.trim() : '',
    notes: notes ? notes.trim() : '',
    status: 'Pending',
    paymentStatus: 'Pending',
    internalNotes: 'Online booking submitted by customer.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.insert('bookings', newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking request received! Our studio manager will confirm your slot shortly.',
    booking: newBooking
  });
});

// Customer: Track Booking Status by Reference Number or Phone
router.get('/track/:query', (req, res) => {
  const query = req.params.query.trim().toLowerCase();
  const bookings = db.get('bookings');

  // Match by reference number (case-insensitive) or phone number
  const matched = bookings.filter(b => 
    b.referenceNo.toLowerCase() === query ||
    b.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
  );

  if (!matched || matched.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No booking found matching this reference number or phone. Please verify and try again.'
    });
  }

  // Return sanitized customer view (excluding internal notes if preferred or including status overview)
  res.json({
    success: true,
    count: matched.length,
    bookings: matched.map(b => ({
      referenceNo: b.referenceNo,
      customerName: b.customerName,
      eventType: b.eventType,
      packageName: b.packageName,
      quotedPrice: b.quotedPrice,
      eventDate: b.eventDate,
      timeSlot: b.timeSlot,
      eventLocation: b.eventLocation,
      status: b.status,
      paymentStatus: b.paymentStatus,
      createdAt: b.createdAt
    }))
  });
});

// Admin: Get all bookings (with search & filters)
router.get('/', authenticateAdmin, (req, res) => {
  const { status, search, date } = req.query;
  let bookings = db.get('bookings');

  if (status && status !== 'All') {
    bookings = bookings.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }

  if (date) {
    bookings = bookings.filter(b => b.eventDate === date);
  }

  if (search) {
    const q = search.toLowerCase();
    bookings = bookings.filter(b => 
      b.referenceNo.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.eventType.toLowerCase().includes(q) ||
      b.eventLocation.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// Admin: Update Booking Status, Internal Notes & Payment Status
router.put('/:id/status', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, internalNotes, timeSlot, eventDate, quotedPrice } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const updates = {};
  if (status) updates.status = status;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (internalNotes !== undefined) updates.internalNotes = internalNotes;
  if (timeSlot) updates.timeSlot = timeSlot;
  if (eventDate) updates.eventDate = eventDate;
  if (quotedPrice !== undefined) updates.quotedPrice = Number(quotedPrice);

  const updated = db.update('bookings', b => b.id === id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  res.json({
    success: true,
    message: `Booking #${updated.referenceNo} updated successfully!`,
    booking: updated
  });
});

// Admin: Delete Booking
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const removed = db.remove('bookings', b => b.id === id);

  if (!removed) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  res.json({ success: true, message: 'Booking deleted successfully.' });
});

export default router;
