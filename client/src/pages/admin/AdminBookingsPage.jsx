import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Search, Filter, Phone, MessageCircle, 
  MapPin, User, Eye, Trash2, Edit3, X, CheckCircle2, Clock 
} from 'lucide-react';
import { apiFetch, formatRupee, formatDate } from '../../utils/api';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editPayment, setEditPayment] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      let query = `/bookings?status=${statusFilter}`;
      if (search.trim()) query += `&search=${encodeURIComponent(search.trim())}`;
      const res = await apiFetch(query);
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleOpenDetailModal = (b) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditPayment(b.paymentStatus || 'Pending');
    setInternalNotes(b.internalNotes || '');
  };

  const handleSaveBookingUpdate = async () => {
    if (!selectedBooking) return;
    try {
      await apiFetch(`/bookings/${selectedBooking.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status: editStatus,
          paymentStatus: editPayment,
          internalNotes: internalNotes
        })
      });
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to update booking');
    }
  };

  const handleDeleteBooking = async (id, refNo) => {
    if (!window.confirm(`Are you sure you want to permanently delete booking #${refNo}? This action cannot be undone.`)) {
      return;
    }
    try {
      await apiFetch(`/bookings/${id}`, { method: 'DELETE' });
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to delete booking');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Manage Customer Bookings
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            View, approve, reschedule, and manage event reservations and internal notes.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, phone, ref no, venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 text-zinc-400 font-mono text-[10px] uppercase">
            <tr>
              <th className="p-3 rounded-l-lg">Ref No</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Event Type / Package</th>
              <th className="p-3">Date & Slot</th>
              <th className="p-3">Venue</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3 text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.map((bk) => (
              <tr key={bk.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-mono font-bold text-amber-400">{bk.referenceNo}</td>
                <td className="p-3">
                  <div className="font-bold text-white">{bk.customerName}</div>
                  <a href={`tel:${bk.phone}`} className="text-[10px] text-zinc-400 hover:text-red-400 block font-mono">
                    {bk.phone}
                  </a>
                </td>
                <td className="p-3">
                  <div className="text-zinc-200 font-semibold">{bk.eventType}</div>
                  <div className="text-[10px] text-zinc-500 truncate max-w-xs">{bk.packageName}</div>
                </td>
                <td className="p-3">
                  <div className="text-white font-medium">{bk.eventDate}</div>
                  <div className="text-[10px] text-zinc-400">{bk.timeSlot}</div>
                </td>
                <td className="p-3 text-zinc-300 truncate max-w-xs">{bk.eventLocation}</td>
                <td className="p-3 font-bold text-white">{formatRupee(bk.quotedPrice)}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    bk.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                    bk.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                    bk.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {bk.status}
                  </span>
                </td>
                <td className="p-3 text-zinc-400 text-[11px]">{bk.paymentStatus || 'Pending'}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleOpenDetailModal(bk)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                    title="View & Edit"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(bk.id, bk.referenceNo)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 text-zinc-500 hover:text-red-400"
                    title="Delete Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-xs">
            No bookings found matching current filters.
          </div>
        )}
      </div>

      {/* Booking Details & Status Update Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Booking Inspection</span>
                <h3 className="font-heading font-black text-xl text-white">
                  Ref #{selectedBooking.referenceNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 font-mono uppercase">Customer Name:</span>
                <div className="text-white font-bold mt-0.5">{selectedBooking.customerName}</div>
              </div>
              <div>
                <span className="text-zinc-500 font-mono uppercase">Contact Phone:</span>
                <div className="text-white font-mono mt-0.5">
                  <a href={`tel:${selectedBooking.phone}`} className="hover:underline text-red-400 font-bold">
                    {selectedBooking.phone}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-zinc-500 font-mono uppercase">Event Type:</span>
                <div className="text-white mt-0.5">{selectedBooking.eventType}</div>
              </div>
              <div>
                <span className="text-zinc-500 font-mono uppercase">Locked Quoted Price:</span>
                <div className="text-white font-bold text-sm mt-0.5">{formatRupee(selectedBooking.quotedPrice)}</div>
              </div>
              <div>
                <span className="text-zinc-500 font-mono uppercase">Date & Time Slot:</span>
                <div className="text-amber-400 font-bold mt-0.5">{selectedBooking.eventDate} ({selectedBooking.timeSlot})</div>
              </div>
              <div>
                <span className="text-zinc-500 font-mono uppercase">Venue Location:</span>
                <div className="text-zinc-300 mt-0.5">{selectedBooking.eventLocation}</div>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-500 font-mono uppercase">Address & Landmark:</span>
                <div className="text-zinc-300 mt-0.5">{selectedBooking.eventAddress || 'N/A'}</div>
              </div>
              {selectedBooking.notes && (
                <div className="col-span-2 p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-zinc-400 font-mono uppercase text-[10px]">Customer Notes:</span>
                  <div className="text-zinc-200 mt-1 italic">{selectedBooking.notes}</div>
                </div>
              )}
            </div>

            {/* Edit Controls */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Update Booking Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Payment Status</label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Advance Paid">Advance Paid</option>
                    <option value="Fully Paid">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Owner Internal Notes (Private)</label>
                <textarea
                  rows="2"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. ₹10,000 advance received via PhonePe, assigned camera crew Suresh & Kumar"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Fast WhatsApp message button */}
              <a
                href={`https://wa.me/91${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedBooking.customerName}! Greetings from CHINNI DIGITALS regarding your event booking #${selectedBooking.referenceNo} for ${selectedBooking.eventDate}. Your status is currently: ${editStatus}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Customer on WhatsApp (+91 {selectedBooking.phone})</span>
              </a>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBookingUpdate}
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-950 cursor-pointer"
                >
                  Save Booking Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
