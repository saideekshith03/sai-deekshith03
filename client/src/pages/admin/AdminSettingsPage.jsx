import React, { useState, useEffect } from 'react';
import { Settings, Save, Lock, Phone, MessageCircle, MapPin, Clock, Sparkles, Check } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

export const AdminSettingsPage = () => {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', isError: false });
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        studioName: settings.studioName || 'CHINNI DIGITALS',
        tagline: settings.tagline || '',
        subtitle: settings.subtitle || '',
        phone1: settings.phone1 || '9396931802',
        phone2: settings.phone2 || '7337440060',
        whatsapp: settings.whatsapp || '9396931802',
        email: settings.email || '',
        address: settings.address || '',
        workingHours: settings.workingHours || '',
        announcementBanner: settings.announcementBanner || '',
        heroBadge: settings.heroBadge || '',
        instagram: settings.instagram || '',
        youtube: settings.youtube || '',
        facebook: settings.facebook || ''
      });
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await apiFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        setSaveSuccess(true);
        refreshSettings();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsUpdatingPwd(true);
    setPwdMsg({ text: '', isError: false });

    try {
      const res = await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.success) {
        setPwdMsg({ text: 'Password successfully updated!', isError: false });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPwdMsg({ text: err.message || 'Failed to update password', isError: true });
    } finally {
      setIsUpdatingPwd(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          Website Settings & Studio Profile
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Update studio contact numbers, address, working hours, announcement banner, and admin password.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Website settings updated successfully! Public pages are instantly updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-6 text-xs">
        <h2 className="font-heading font-bold text-lg text-white pb-3 border-b border-white/10 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-500" /> Studio Details & Branding
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400">Studio Business Name</label>
            <input
              type="text"
              required
              value={formData.studioName || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, studioName: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400">Hero Section Badge</label>
            <input
              type="text"
              value={formData.heroBadge || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, heroBadge: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-mono uppercase text-zinc-400">Studio Tagline</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-mono uppercase text-zinc-400">Studio Subtitle</label>
            <textarea
              rows="2"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Contact Numbers */}
          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-red-500" /> Primary Phone Number *
            </label>
            <input
              type="text"
              required
              value={formData.phone1 || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone1: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-red-500" /> Secondary Phone Number *
            </label>
            <input
              type="text"
              required
              value={formData.phone2 || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone2: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Official WhatsApp Number
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400">Business Working Hours</label>
            <input
              type="text"
              value={formData.workingHours || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
              placeholder="9:00 AM – 9:30 PM (All 7 Days Open)"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-mono uppercase text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" /> Studio Address
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Announcement Bar */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Top Announcement Banner Text (Appears on all pages)
            </label>
            <input
              type="text"
              value={formData.announcementBanner || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, announcementBanner: e.target.value }))}
              placeholder="e.g. Special Wedding Season Discount: Flat 20% OFF..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-200 text-xs focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Studio Settings'}</span>
          </button>
        </div>
      </form>

      {/* Admin Password Change Form */}
      <form onSubmit={handleUpdatePassword} className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4 text-xs">
        <h2 className="font-heading font-bold text-lg text-white pb-3 border-b border-white/10 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" /> Change Owner Password
        </h2>

        {pwdMsg.text && (
          <div className={`p-3 rounded-xl text-xs ${
            pwdMsg.isError ? 'bg-red-950/70 border border-red-500/40 text-red-200' : 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
          }`}>
            {pwdMsg.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono uppercase text-zinc-400">New Password (Min 6 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={isUpdatingPwd}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <span>{isUpdatingPwd ? 'Updating...' : 'Update Admin Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
