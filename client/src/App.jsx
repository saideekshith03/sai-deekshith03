import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { AdminLayout } from './components/AdminLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PackagesPage } from './pages/PackagesPage';
import { OffersPage } from './pages/OffersPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideosPage } from './pages/VideosPage';
import { BookingPage } from './pages/BookingPage';
import { CustomQuotationPage } from './pages/CustomQuotationPage';
import { ContactPage } from './pages/ContactPage';
import { BookingStatusPage } from './pages/BookingStatusPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminPackagesPage } from './pages/admin/AdminPackagesPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Layout wrapper for public pages with Navbar, Footer, and Floating WhatsApp
const PublicLayout = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </div>
    </ErrorBoundary>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
            <Route path="/packages" element={<PublicLayout><PackagesPage /></PublicLayout>} />
            <Route path="/offers" element={<PublicLayout><OffersPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/videos" element={<PublicLayout><VideosPage /></PublicLayout>} />
            <Route path="/book" element={<PublicLayout><BookingPage /></PublicLayout>} />
            <Route path="/quotation" element={<PublicLayout><CustomQuotationPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/booking-status" element={<PublicLayout><BookingStatusPage /></PublicLayout>} />
            <Route path="/track" element={<Navigate to="/booking-status" replace />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Dashboard Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="packages" element={<AdminPackagesPage />} />
              <Route path="offers" element={<AdminOffersPage />} />
              <Route path="videos" element={<AdminVideosPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
