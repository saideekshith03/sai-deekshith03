# CHINNI DIGITALS — Photography & Cinematic Videography Platform

A modern, attractive, and fully responsive photo studio business website and management platform built for **CHINNI DIGITALS**.

---

## 📸 Studio Details
- **Studio Name:** CHINNI DIGITALS
- **Primary Contact Number:** `9396931802`
- **Secondary Contact Number:** `7337440060`
- **WhatsApp Support:** `+91 9396931802`
- **Currency:** Indian Rupees (₹)
- **Business Type:** Wedding Photography, 4K Cinematography, Pre-Wedding Shoots, Half Saree & Traditional Ceremonies, Birthday Celebrations, Maternity & Baby Shoots, Luxury Album Printing.

---

## 🌟 Key Features

### 1. Cinematic Theme & Interactive Camera Background
- **Visual Design:** Dark theme (`#0A0A0C`) with vibrant red, pure white, and subtle gold accents.
- **Interactive Camera Viewfinder HUD:** Real-time simulated camera viewfinder overlay with `REC ●` pulsating dot, ISO, aperture, 1/250s shutter speed, battery indicator, focus reticle, and rule-of-thirds grid.
- **Live Camera Lens Switcher:** Switch between `24mm Wide`, `50mm Prime`, `85mm Master Bokeh`, and `Cinema 35 Anamorphic` to experience real-time lens zoom, color grading, and focal adjustments.
- **Synthesized Camera Shutter:** Web Audio API sound generator and visual shutter flash on shutter clicks without external audio files.
- **35mm Film Strip Marquee:** Continuous scrolling film reel showcasing captured wedding and traditional moments.

### 2. Complete Studio Services Showcase (14 Services)
1. Wedding Photography
2. Wedding Cinematography (4K Multi-Cam & Drone)
3. Pre-Wedding Shoots & Music Videos
4. Engagement Photography & Ring Ceremony
5. Birthday Photography & Cake Smash
6. Baby Photography & Milestone Sessions
7. Half Saree (Langa Voni) & Traditional Functions
8. Anniversary Photography
9. Maternity and Family Photoshoots
10. Birthday and Event Videography
11. Outdoor & Portfolio Photoshoots
12. Photo Albums and Premium Acrylic Printing
13. Passport, Visa & Biometric ID Photos
14. Other Custom Events & Corporate Inaugurations

### 3. Event Packages & Pricing
- Dynamic pricing cards with photographer/videographer count, album sheets, edited photos, and video details.
- Prices are completely dynamic and managed by the owner via the dashboard.
- Automatic price-lock mechanism: When a customer submits a booking, the quoted price is locked into the booking record. Future price updates do not retroactively alter existing quotes.
- Custom package quotation request builder.

### 4. Special Offers & Automatic Expiry Handling
- Festival discounts, limited-time promotions, and wedding season offers.
- Discount percentage calculator and original strikethrough price display.
- Expiry date validation: Expired offers are automatically moved from active display into the archive tab.
- Attached promotional video preview with modal player.

### 5. Online Event Booking & Conflict Prevention Engine
- Step-by-step booking wizard: Event Type & Package &rarr; Date & Available Slot &rarr; Contact Info &rarr; Price Summary.
- **Double Booking Conflict Prevention:** Server verifies existing active bookings for the selected date and slot. Rejects conflicting requests with clear notification.
- Generates a unique **Booking Reference Number** (e.g., `CD-2026-9110`).
- Celebratory confetti animation upon submission.
- One-click WhatsApp button pre-filled with all booking details to notify the studio owner immediately.

### 6. Customer Booking Status Tracker
- Customers can track their booking status anytime at `/booking-status` using their Reference Number or Mobile Number.
- Shows real-time lifecycle progress (Pending &rarr; Confirmed &rarr; Team Assigned &rarr; Completed).
- Displays locked price and payment status.

### 7. Owner Admin Dashboard (`/admin/login`)
- **Credentials:**
  - **Username:** `admin`
  - **Password:** `admin123`
- **Dashboard Modules:**
  - **Overview Analytics:** 10 live KPI statistic cards (Total bookings, Pending, Confirmed, Completed, Active offers, Videos, Packages, Recorded Revenue) and interactive **Recharts** charts (Monthly trend, Category distribution, Status breakdown, Popular packages).
  - **Manage Bookings:** Search, filter, approve, reschedule, reject, add internal notes, update payment status.
  - **Manage Packages:** Add, edit, change prices, toggle published status, delete.
  - **Manage Offers:** Add, edit, manage Active, Scheduled, Expired, and Draft tabs.
  - **Manage Videos:** Publish wedding teasers and reels, toggle homepage featured reels.
  - **Manage Gallery:** Add high-res photos, set categories, toggle featured images.
  - **Manage Services:** Update starting prices, descriptions, and feature checklists.
  - **Website Settings:** Change studio phone numbers (`9396931802`, `7337440060`), working hours, announcement banner, and change owner password.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Quick Start
To run both the Express backend and the Vite React frontend with a single command:

```bash
npm run dev
```

- **Frontend Website:** [http://localhost:3000](http://localhost:3000)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **Owner Admin Portal:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📁 Project Architecture

```
CHINNI DIGITALS/
├── client/                     # Frontend (React 19, Vite, Tailwind CSS v4)
│   ├── src/
│   │   ├── components/         # Viewfinder, FilmStrip, Navbar, Footer, WhatsApp, Modals
│   │   ├── context/            # AuthContext, SettingsContext
│   │   ├── pages/              # Home, About, Services, Packages, Offers, Gallery, Videos, Book, etc.
│   │   │   └── admin/          # Admin Dashboard, Bookings, Packages, Offers, Videos, Settings
│   │   ├── utils/              # API helpers, currency formatting, sound synthesiser
│   │   ├── App.jsx             # React Router routing
│   │   ├── index.css           # Camera HUD styling & typography
│   │   └── main.jsx
│   └── vite.config.js          # Vite config with Tailwind & port 5000 proxy
├── server/                     # Backend API (Node.js Express)
│   ├── data/                   # Persistent database (db.json)
│   ├── middleware/             # JWT auth middleware
│   ├── routes/                 # Auth, Bookings, Packages, Offers, Videos, Gallery, Analytics, Settings
│   ├── db.js                   # Persistent database manager & initial seed data
│   └── index.js                # Express app setup & route mounting
├── uploads/                    # Local storage for uploaded photos/videos
└── package.json                # Root scripts and dependencies
```

---

## 🔒 Security & Data Integrity
- Passwords hashed with `bcryptjs`.
- Admin endpoints protected with JWT Bearer tokens.
- Server-side validation on booking dates and slot conflicts.
- Upload file validation restricting allowed media types to JPEG, PNG, WebP, and MP4.
- Quoted booking prices are locked at submission time to ensure historical billing accuracy.
