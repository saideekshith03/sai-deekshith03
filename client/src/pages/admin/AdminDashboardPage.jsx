import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, Clock, CheckCircle2, AlertCircle, TrendingUp, 
  Tag, Film, Layers, Package, IndianRupee, ArrowRight, User, Phone 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { apiFetch, formatRupee, formatDate } from '../../utils/api';

export const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [anaRes, bkRes] = await Promise.all([
        apiFetch('/analytics'),
        apiFetch('/bookings')
      ]);

      if (anaRes.success) setAnalytics(anaRes);
      if (bkRes.success) setRecentBookings(bkRes.bookings ? bkRes.bookings.slice(0, 5) : []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await apiFetch(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const stats = analytics?.stats || {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedEvents: 0,
    upcomingEvents: 0,
    activeOffers: 0,
    expiredOffers: 0,
    totalVideos: 0,
    totalPublishedServices: 0,
    totalPackages: 0,
    totalRevenue: 0
  };

  const charts = analytics?.charts || {
    bookingsByMonth: [],
    bookingsByCategory: [],
    statusDistribution: [],
    mostPopularPackages: []
  };

  const COLORS = ['#E50914', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Studio Performance Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time analytics & bookings generated directly from CHINNI DIGITALS database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950 transition-all"
          >
            <span>Manage All Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 10 KPI Metric Cards (Actual Database Counts) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Total Bookings</span>
            <CalendarCheck className="w-4 h-4 text-red-500" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white">
            {stats.totalBookings}
          </div>
          <div className="text-[10px] text-zinc-500">All customer requests</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-xs font-mono">
            <span>Pending Bookings</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400">
            {stats.pendingBookings}
          </div>
          <div className="text-[10px] text-zinc-500">Awaiting confirmation</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-mono">
            <span>Confirmed Slots</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-400">
            {stats.confirmedBookings}
          </div>
          <div className="text-[10px] text-zinc-500">Locked on calendar</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-blue-500/30 space-y-1">
          <div className="flex items-center justify-between text-blue-400 text-xs font-mono">
            <span>Completed Events</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-blue-400">
            {stats.completedEvents}
          </div>
          <div className="text-[10px] text-zinc-500">Delivered albums & video</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Upcoming Events</span>
            <CalendarCheck className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white">
            {stats.upcomingEvents}
          </div>
          <div className="text-[10px] text-zinc-500">Future scheduled dates</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Recorded Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-xl sm:text-2xl text-emerald-400">
            {formatRupee(stats.totalRevenue)}
          </div>
          <div className="text-[10px] text-zinc-500">Based on recorded bookings</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Active Offers</span>
            <Tag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white">
            {stats.activeOffers}
          </div>
          <div className="text-[10px] text-zinc-500">{stats.expiredOffers} in archive</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Published Videos</span>
            <Film className="w-4 h-4 text-red-500" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white">
            {stats.totalVideos}
          </div>
          <div className="text-[10px] text-zinc-500">Cinematic showcase</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Studio Services</span>
            <Layers className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white">
            {stats.totalPublishedServices}
          </div>
          <div className="text-[10px] text-zinc-500">Active services listed</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Packages Listed</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white">
            {stats.totalPackages}
          </div>
          <div className="text-[10px] text-zinc-500">Pricing options published</div>
        </div>
      </div>

      {/* Interactive Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Bookings & Revenue by Month */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Bookings Volume by Month</h3>
            <span className="text-xs text-zinc-500 font-mono">Live DB Timeline</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.bookingsByMonth}>
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="bookings" name="Bookings Count" fill="#E50914" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bookings by Event Category (Donut / Pie) */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Bookings by Event Category</h3>
            <span className="text-xs text-zinc-500 font-mono">Distribution</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {charts.bookingsByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.bookingsByCategory}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {charts.bookingsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-zinc-500">No category data yet</div>
            )}
          </div>
        </div>

        {/* Chart 3: Booking Status Breakdown */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Booking Status Distribution</h3>
            <span className="text-xs text-zinc-500 font-mono">Operational Status</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.statusDistribution} layout="vertical">
                <XAxis type="number" stroke="#71717a" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard: Most Popular Packages */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Most Popular Packages</h3>
            <span className="text-xs text-zinc-500 font-mono">Customer Demand</span>
          </div>

          <div className="space-y-3 pt-2">
            {charts.mostPopularPackages?.length > 0 ? (
              charts.mostPopularPackages.map((pkg, idx) => (
                <div
                  key={pkg.name}
                  className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-white truncate max-w-xs">{pkg.name}</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">
                    {pkg.bookingsCount} booking(s)
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 text-center py-8">No package bookings yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Customer Bookings Quick Action Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Recent Customer Bookings</h3>
            <p className="text-xs text-zinc-400">Quickly confirm or manage recent online reservations.</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-red-400 hover:underline"
          >
            View All ({stats.totalBookings}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Ref No</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Date & Slot</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-lg">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-400">{bk.referenceNo}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{bk.customerName}</div>
                    <div className="text-[10px] text-zinc-400">{bk.phone}</div>
                  </td>
                  <td className="p-3 text-zinc-300">{bk.eventType}</td>
                  <td className="p-3">
                    <div className="text-white font-medium">{bk.eventDate}</div>
                    <div className="text-[10px] text-zinc-400">{bk.timeSlot}</div>
                  </td>
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
                  <td className="p-3 text-right space-x-1">
                    {bk.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'Confirmed')}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {bk.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'Completed')}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                    <Link
                      to="/admin/bookings"
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px]"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
