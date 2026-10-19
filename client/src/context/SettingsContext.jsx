import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    studioName: 'CHINNI DIGITALS',
    tagline: 'Capturing Your Precious Moments Forever',
    subtitle: 'Professional Photography & Cinematic Videography for Every Special Occasion.',
    phone1: '9396931802',
    phone2: '7337440060',
    whatsapp: '9396931802',
    email: 'chinnidigitals@gmail.com',
    address: 'Main Road, Digital Plaza, Andhra Pradesh, India',
    workingHours: '9:00 AM – 9:30 PM (All 7 Days Open)',
    announcementBanner: '✨ Festive Wedding Season Offer: Flat 20% OFF on Royal Wedding Packages! Limited Booking Slots Available.',
    heroBadge: 'Award Winning Photo & Cine Studio'
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/settings');
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Could not fetch settings, using defaults:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, refreshSettings: fetchSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
