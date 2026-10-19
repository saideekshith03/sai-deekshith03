import express from 'express';
import { db } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer: Submit Custom Quotation Request
router.post('/', (req, res) => {
  const {
    customerName,
    phone,
    email,
    eventType,
    eventDate,
    durationDays,
    expectedGuests,
    servicesRequired,
    budgetRange,
    location,
    message
  } = req.body;

  if (!customerName || !phone || !eventType) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your name, phone number, and event type.'
    });
  }

  const newQuotation = {
    id: `quot_${Date.now()}`,
    customerName: customerName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    eventType,
    eventDate: eventDate || '',
    durationDays: Number(durationDays) || 1,
    expectedGuests: expectedGuests || '',
    servicesRequired: Array.isArray(servicesRequired) ? servicesRequired : (servicesRequired ? servicesRequired.split(',') : []),
    budgetRange: budgetRange || 'Custom',
    location: location || '',
    message: message || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.insert('quotations', newQuotation);

  res.status(201).json({
    success: true,
    message: 'Custom quotation request submitted successfully! Chinni Digitals team will contact you within 24 hours.',
    quotation: newQuotation
  });
});

// Admin: Get all quotation requests
router.get('/', authenticateAdmin, (req, res) => {
  const quotations = db.get('quotations');
  res.json({ success: true, count: quotations.length, quotations });
});

// Admin: Update quotation status / notes
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const updated = db.update('quotations', q => q.id === id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Quotation request not found.' });
  }

  res.json({ success: true, message: 'Quotation updated successfully!', quotation: updated });
});

export default router;
