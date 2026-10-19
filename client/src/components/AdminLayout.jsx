import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, Package, Tag, Film, Image as ImageIcon, 
  Settings, LogOut, ExternalLink, Menu, X, Shield, Camera, Layers, Bell 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { ErrorBoundary } from './ErrorBoundary';

export const AdminLayout = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If loading, show minimal spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono text-sm">
        Verifying Owner Credentials...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Manage Packages', path: '/admin/packages', icon: Package },
    { name: 'Manage Offers', path: '/admin/offers', icon: Tag },
    { name: 'Manage Videos', path: '/admin/videos', icon: Film },
    { name: 'Manage Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Manage Services', path: '/admin/services', icon: Layers },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col md:flex-row">
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-zinc-950 border-b border-white/10 px-4 py-3 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
            <Camera className="w-4 h-4" />
          </div>
          <span className="font-heading font-black text-sm tracking-tight text-white">
            CHINNI <span className="text-red-500">OWNER</span>
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-white/10 flex flex-col justify-between p-4 z-40 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & User Info */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-950">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-sm text-white">
                  CHINNI <span className="text-red-500">DIGITALS</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">Owner Portal v2.0</div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
              </span>
              <span className="font-mono">{user?.username}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};
