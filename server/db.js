import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const getInitialSeed = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);

  return {
    admin: {
      id: 'admin_1',
      username: 'admin',
      passwordHash: adminPasswordHash,
      name: 'Chinni Digitals Owner',
      email: 'chinnidigitals@gmail.com',
      role: 'superadmin',
      lastLogin: new Date().toISOString()
    },
    settings: {
      studioName: 'CHINNI DIGITALS',
      tagline: 'Capturing Your Precious Moments Forever',
      subtitle: 'Professional Photography & Cinematic Videography for Every Special Occasion.',
      phone1: '9396931802',
      phone2: '7337440060',
      whatsapp: '9396931802',
      email: 'chinnidigitals@gmail.com',
      address: 'Main Road, Digital Plaza, Andhra Pradesh, India - 530001',
      mapUrl: 'https://maps.google.com/?q=Chinni+Digitals+Studio',
      workingHours: '9:00 AM – 9:30 PM (All 7 Days Open)',
      instagram: 'https://instagram.com/chinnidigitals',
      youtube: 'https://youtube.com/@chinnidigitals',
      facebook: 'https://facebook.com/chinnidigitals',
      announcementBanner: '✨ Festive Wedding Season Offer: Flat 20% OFF on Royal Wedding & Cinematography Packages! Limited Booking Slots Available.',
      heroBadge: 'Award Winning Photo & Cine Studio',
      yearsOfExperience: 10,
      totalEventsCovered: 1850,
      happyClients: 3200
    },
    services: [
      {
        id: 'srv_1',
        title: 'Wedding Photography',
        slug: 'wedding-photography',
        shortDesc: 'Traditional and candid coverage of rituals, joy, and emotional moments.',
        fullDesc: 'Complete wedding day coverage by expert candid and traditional photographers using high-end Sony Alpha full-frame cameras and premium prime lenses.',
        category: 'Weddings',
        priceStarting: 25000,
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        features: ['Candid Moments', 'Traditional Poses', 'High-Res Edited Photos', 'Bridal & Groom Portraits'],
        orderIndex: 1,
        isActive: true
      },
      {
        id: 'srv_2',
        title: 'Wedding Cinematography',
        slug: 'wedding-cinematography',
        shortDesc: '4K cinematic film, drone aerial shots, and heart-touching highlight teasers.',
        fullDesc: 'Transform your wedding into a silver-screen movie with multi-cam setups, gimbal stabilization, 4K HDR recording, cinematic color grading, and drone coverage.',
        category: 'Weddings',
        priceStarting: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        features: ['4K Ultra HD Teaser', 'Full Length Cine Film', 'Drone Aerial Views', 'Cinema Color Grading'],
        orderIndex: 2,
        isActive: true
      },
      {
        id: 'srv_3',
        title: 'Pre-Wedding Shoots',
        slug: 'pre-wedding-shoots',
        shortDesc: 'Romantic storytelling at scenic outdoor locations, beaches, and heritage resorts.',
        fullDesc: 'Celebrate your love journey with a relaxed, romantic photoshoot and music video teaser. Includes concept planning, creative props, and outfit consultation.',
        category: 'Weddings',
        priceStarting: 18000,
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        features: ['Scenic Locations', 'Music Video Teaser', 'Cinematic Drone Shots', 'Instagram Reels'],
        orderIndex: 3,
        isActive: true
      },
      {
        id: 'srv_4',
        title: 'Engagement Photography',
        slug: 'engagement-photography',
        shortDesc: 'Capturing the ring ceremony, family blessings, and couple chemistry.',
        fullDesc: 'Graceful documentation of engagement ceremonies, ring exchange, family group portraits, and romantic portraits.',
        category: 'Engagements',
        priceStarting: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
        features: ['Ring Exchange Moments', 'Family Portraits', 'Fast Digital Preview', 'High-Res Edits'],
        orderIndex: 4,
        isActive: true
      },
      {
        id: 'srv_5',
        title: 'Birthday Photography',
        slug: 'birthday-photography',
        shortDesc: 'Cake cutting, vibrant decor, laughter, and candid memories of the celebrant.',
        fullDesc: 'Make birthdays unforgettable with playful candid shots, theme decor coverage, family group pictures, and exciting reels.',
        category: 'Birthdays',
        priceStarting: 8000,
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        features: ['Theme Decor Shots', 'Cake Cutting Highlights', 'Candid Smiles', 'Instant Reel Clip'],
        orderIndex: 5,
        isActive: true
      },
      {
        id: 'srv_6',
        title: 'Baby Photography & Milestone Shoots',
        slug: 'baby-photography',
        shortDesc: 'Gentle, creative newborn and toddler photography with cute themes and safe setups.',
        fullDesc: 'Preserve the innocence and precious milestones of your baby with cozy, sanitised studio setups, adorable props, and patience.',
        category: 'Baby & Family',
        priceStarting: 9000,
        imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
        features: ['Baby-Safe Studio Props', 'Gentle Natural Lighting', 'Multiple Theme Outfits', 'Keepsake Frame'],
        orderIndex: 6,
        isActive: true
      },
      {
        id: 'srv_7',
        title: 'Half Saree & Traditional Functions',
        slug: 'half-saree-traditional-functions',
        shortDesc: 'Rich South Indian traditions, Sreemantham, Dhoti ceremonies, and puja coverage.',
        fullDesc: 'Specialized coverage of South Indian traditions including Half Saree (Langa Voni) ceremonies, Dhoti ceremonies, Housewarmings (Gruhapravesam), and Poojas.',
        category: 'Traditional Events',
        priceStarting: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        features: ['Traditional Rituals', 'Langa Voni Portraits', 'Family Blessings', 'Premium Print Album'],
        orderIndex: 7,
        isActive: true
      },
      {
        id: 'srv_8',
        title: 'Anniversary Photography',
        slug: 'anniversary-photography',
        shortDesc: 'Celebrating enduring love, milestones, and family legacy with warmth.',
        fullDesc: 'Special photoshoot sessions for Silver, Golden, or 1st Wedding Anniversaries, renewing memories and capturing generational family portraits.',
        category: 'Baby & Family',
        priceStarting: 10000,
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        features: ['Couple Portraits', 'Family Reunion Group Photos', 'Highlight Video', 'Framed Canvas'],
        orderIndex: 8,
        isActive: true
      },
      {
        id: 'srv_9',
        title: 'Maternity and Family Photoshoots',
        slug: 'maternity-family-photoshoots',
        shortDesc: 'Elegance of motherhood and warm bonds in indoor studio and garden settings.',
        fullDesc: 'Celebrate the miracle of motherhood with graceful maternity gowns, studio lighting, and affectionate family moments.',
        category: 'Baby & Family',
        priceStarting: 11000,
        imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
        features: ['Maternity Gown Options', 'Artistic Lighting', 'Partner & Family Inclusion', 'Luxury Photo Book'],
        orderIndex: 9,
        isActive: true
      },
      {
        id: 'srv_10',
        title: 'Birthday & Event Videography',
        slug: 'birthday-event-videography',
        shortDesc: 'High-definition video coverage with music sync, cinematic cuts, and reels.',
        fullDesc: 'Full HD / 4K event videography capturing guest reactions, games, dances, and memorable speeches with crystal-clear audio recording.',
        category: 'Cinematic Videos',
        priceStarting: 10000,
        imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        features: ['Full HD / 4K Video', 'Dynamic Music Cuts', 'Wireless Lapel Mic Audio', 'Fast Delivery'],
        orderIndex: 10,
        isActive: true
      },
      {
        id: 'srv_11',
        title: 'Outdoor Photoshoots',
        slug: 'outdoor-photoshoots',
        shortDesc: 'Golden hour portraits at picturesque beaches, lush parks, and architectural sites.',
        fullDesc: 'Outdoor portfolio, fashion, and lifestyle photoshoots during optimum natural lighting conditions with reflectors and off-camera flashes.',
        category: 'Studio & Portraits',
        priceStarting: 10000,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        features: ['Golden Hour Lighting', 'Creative Compositions', 'High-Fashion Touchup', 'Multiple Outfits'],
        orderIndex: 11,
        isActive: true
      },
      {
        id: 'srv_12',
        title: 'Photo Albums & Premium Printing',
        slug: 'photo-albums-printing',
        shortDesc: 'Flush mount photobooks, acrylic glass covers, velvet finish, and canvas wraps.',
        fullDesc: 'Museum-grade photo albums printed on non-tearable metallic and luster paper with 3D embossed and acrylic luxury covers designed to last generations.',
        category: 'Studio & Portraits',
        priceStarting: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
        features: ['Acrylic / Leather Covers', 'Non-Tearable Luster Sheets', 'Custom Page Layouts', 'Waterproof Printing'],
        orderIndex: 12,
        isActive: true
      },
      {
        id: 'srv_13',
        title: 'Passport, Visa & ID Photos',
        slug: 'passport-id-photos',
        shortDesc: 'Instant biometric photo printing according to all international visa standards.',
        fullDesc: '5-minute instant passport and visa photos adhering strictly to US, UK, Schengen, Canada, and Indian biometric specifications.',
        category: 'Studio & Portraits',
        priceStarting: 200,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        features: ['Instant 5-Minute Print', 'All Embassy Compliant', 'Soft Copy Provided', 'White / Blue Backgrounds'],
        orderIndex: 13,
        isActive: true
      },
      {
        id: 'srv_14',
        title: 'Other Custom Events & Corporate',
        slug: 'other-custom-events',
        shortDesc: 'College fests, corporate inaugurations, political rallies, and cultural galas.',
        fullDesc: 'Professional multi-camera and live broadcasting setup for corporate seminars, brand promotions, musical concerts, and custom private celebrations.',
        category: 'Cinematic Videos',
        priceStarting: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        features: ['Multi-Cam Live Streaming', 'LED Screen Feeds', 'Quick Turnaround', 'Experienced Crew'],
        orderIndex: 14,
        isActive: true
      }
    ],
    packages: [
      {
        id: 'pkg_1',
        name: 'Royal Heritage Wedding Package',
        category: 'Weddings',
        price: 85000,
        originalPrice: 105000,
        duration: '2 Full Days (Pellikuthuru / Sangeet + Muhurtham & Reception)',
        photographersCount: 2,
        videographersCount: 2,
        albumDetails: '2 Premium Non-Tearable Acrylic Cover Canvera Style Albums (80 Sheets total)',
        editedPhotosCount: '400+ High-Res Retouched Photos + All Raw Files on 64GB Pendrive',
        cinematicVideoDetails: '4K Cinematic Teaser (3-5 min) + Full HD Traditional Video (90-120 min) + Drone Aerial Coverage',
        additionalFeatures: ['Pre-wedding mini shoot included', '2 Big 20x30 Wall Mount Canvas Frames', 'Live YouTube streaming link'],
        description: 'Our most comprehensive VIP wedding package designed for grand Telugu and South Indian weddings. Covers every ritual with majestic cinematic flair.',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
        isPublished: true,
        isPopular: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg_2',
        name: 'Classic Muhurtham Wedding Package',
        category: 'Weddings',
        price: 48000,
        originalPrice: 58000,
        duration: '1 Full Day (Muhurtham & Reception)',
        photographersCount: 1,
        videographersCount: 1,
        albumDetails: '1 Luxury Velvet Cover Album (40 Sheets / 200 Photos)',
        editedPhotosCount: '250+ Retouched Master Photos + Soft Copies on Pendrive',
        cinematicVideoDetails: 'Full HD Traditional Video (60-90 min) + 2-min Instagram Reel',
        additionalFeatures: ['1 16x24 Glossy Wall Frame', 'Traditional and Candid coverage combined'],
        description: 'Ideal for intimate weddings and traditional muhurtham functions. Covers all auspicious rituals, mangalsutra dharana, talambralu, and family portraits.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
        isPublished: true,
        isPopular: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg_3',
        name: 'Dream Destination Pre-Wedding Shoot',
        category: 'Weddings',
        price: 24000,
        originalPrice: 30000,
        duration: '1 Full Day Outdoor (2-3 Locations)',
        photographersCount: 1,
        videographersCount: 1,
        albumDetails: 'Mini Coffee Table Photobook (20 Sheets)',
        editedPhotosCount: '50 Master Retouched Portraits + Full Raw Archive',
        cinematicVideoDetails: '3-Minute Romantic Music Video Teaser + 3 Instagram Reels',
        additionalFeatures: ['Drone shots included', 'Smoke bombs & romantic props provided', 'Outfit guidance'],
        description: 'A cinematic romantic shoot at beaches, hillocks, or heritage resorts. Craft unforgettable love story visuals before the big day.',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
        isPublished: true,
        isPopular: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg_4',
        name: 'Traditional Half Saree (Langa Voni) Grand Package',
        category: 'Traditional Events',
        price: 22000,
        originalPrice: 28000,
        duration: '6 to 8 Hours Coverage',
        photographersCount: 1,
        videographersCount: 1,
        albumDetails: '1 Premium Photobook Album (30 Sheets / 150 Photos)',
        editedPhotosCount: '150+ Edited Photos + All Digital Originals',
        cinematicVideoDetails: 'Full HD Function Video + 1 Cinematic Highlight Reel',
        additionalFeatures: ['1 12x18 Framed Portrait', 'Solo bridal style portrait session before puja'],
        description: 'Specially tailored for Half Saree (Rithu Shudhi) and Dhoti ceremonies. Captures the beauty of South Indian attire, family blessings, and jewelry.',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
        isPublished: true,
        isPopular: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg_5',
        name: 'Grand Birthday Bash & Cake Smash',
        category: 'Birthdays',
        price: 14000,
        originalPrice: 18000,
        duration: '4 to 5 Hours Coverage',
        photographersCount: 1,
        videographersCount: 1,
        albumDetails: 'Fun Designer Birthday Album (25 Sheets)',
        editedPhotosCount: '100+ Candid and Group Photos',
        cinematicVideoDetails: 'Full Event Video + Fast-Paced 60-Second Birthday Reel',
        additionalFeatures: ['Cake smash & decor photos', 'Family group portraits', '1 12x18 Birthday Collage Frame'],
        description: 'Perfect for 1st birthdays or milestone celebrations. High energy candid moments, decor highlights, and joyful family frames.',
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
        isPublished: true,
        isPopular: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg_6',
        name: 'Blissful Maternity & Baby Miracle Session',
        category: 'Baby & Family',
        price: 16000,
        originalPrice: 20000,
        duration: '4 Hours (Studio + Garden)',
        photographersCount: 1,
        videographersCount: 0,
        albumDetails: 'Luxury Keepsake Baby Photobook (20 Sheets)',
        editedPhotosCount: '60 Artistic Retouched Images',
        cinematicVideoDetails: '1-Minute Emotional Highlight Reel',
        additionalFeatures: ['3 Outfit Changes', 'Husband and Sibling inclusion', '1 12x18 Canvas Portrait'],
        description: 'Cherish the glowing days of pregnancy or newborn warmth in our peaceful, temperature-controlled studio environment with premium props.',
        imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=900&q=80',
        isPublished: true,
        isPopular: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg_7',
        name: 'Grand Engagement & Ring Ceremony',
        category: 'Engagements',
        price: 20000,
        originalPrice: 25000,
        duration: '5 to 6 Hours Coverage',
        photographersCount: 1,
        videographersCount: 1,
        albumDetails: '1 Designer Album (30 Sheets)',
        editedPhotosCount: '180+ Processed Photos',
        cinematicVideoDetails: 'Full Event Video + Cinematic Couple Teaser',
        additionalFeatures: ['Couple solo session', 'Family stage photos', 'Online digital gallery'],
        description: 'Immortalize the vows, laughter, and ring exchange ceremonies with vibrant lighting and heartfelt portraits.',
        imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80',
        isPublished: true,
        isPopular: false,
        createdAt: new Date().toISOString()
      }
    ],
    offers: [
      {
        id: 'off_1',
        title: 'Wedding Season Special: Flat 20% OFF',
        description: 'Book your Royal Heritage Wedding Package 30 days in advance and get flat ₹20,000 discount PLUS a free 20x30 Canvas Wall Frame!',
        originalPrice: 105000,
        discountedPrice: 85000,
        discountPercentage: 20,
        startDate: '2026-01-01',
        expiryDate: '2026-12-31',
        bannerImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        applicableCategories: ['Weddings', 'Traditional Events'],
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'off_2',
        title: 'Pre-Wedding & Drone Combo Saver',
        description: 'Get an aerial drone music teaser and extra 15 retouched portraits free when booking any pre-wedding package this month.',
        originalPrice: 30000,
        discountedPrice: 24000,
        discountPercentage: 20,
        startDate: '2026-02-01',
        expiryDate: '2026-11-30',
        bannerImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
        videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
        applicableCategories: ['Weddings'],
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'off_3',
        title: 'Birthday Bash & Cake Smash Super Offer',
        description: 'Flat ₹4,000 off on complete birthday photo & video coverage with instant Instagram reel delivery within 24 hours.',
        originalPrice: 18000,
        discountedPrice: 14000,
        discountPercentage: 22,
        startDate: '2026-03-01',
        expiryDate: '2026-11-15',
        bannerImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
        videoUrl: '',
        applicableCategories: ['Birthdays'],
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'off_4',
        title: 'Previous Summer Wedding Early Bird (Expired)',
        description: 'Early bird summer package discount that concluded last month.',
        originalPrice: 50000,
        discountedPrice: 40000,
        discountPercentage: 20,
        startDate: '2025-01-01',
        expiryDate: '2025-05-31',
        bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        videoUrl: '',
        applicableCategories: ['Weddings'],
        isPublished: true,
        createdAt: new Date('2025-01-01').toISOString()
      }
    ],
    videos: [
      {
        id: 'vid_1',
        title: 'Suresh & Sneha | Royal Telugu Wedding Cinematic Teaser',
        description: 'A magical celebration of eternal love filled with joyous talambralu, heartfelt tears, and majestic drone shots.',
        category: 'Weddings',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        offerId: 'off_1',
        createdAt: new Date().toISOString()
      },
      {
        id: 'vid_2',
        title: 'Karthik & Pooja | Coastal Pre-Wedding Music Video',
        description: 'Romantic sunset moments and windblown laughter filmed on pristine Andhra golden sands.',
        category: 'Weddings',
        videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        offerId: 'off_2',
        createdAt: new Date().toISOString()
      },
      {
        id: 'vid_3',
        title: 'Aadhya 1st Birthday & Cake Smash Wonderland',
        description: 'Pure innocence and delightful smiles at our fairy-tale pink and gold balloon setup.',
        category: 'Birthdays',
        videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        isFeatured: false,
        offerId: 'off_3',
        createdAt: new Date().toISOString()
      },
      {
        id: 'vid_4',
        title: 'Harika Half Saree Ceremony | Traditional Grandeur',
        description: 'Rich silk sarees, temple jewelry, and traditional Telugu rituals captured in high-definition cinematography.',
        category: 'Traditional Events',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        offerId: '',
        createdAt: new Date().toISOString()
      },
      {
        id: 'vid_5',
        title: 'CHINNI DIGITALS | Studio Tour & Gear Showcase',
        description: 'Inside our digital studio: Sony Alpha FX3 cinema cameras, GM prime lenses, Ronin stabilizers, and DJI drones.',
        category: 'Studio Photography',
        videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        offerId: '',
        createdAt: new Date().toISOString()
      }
    ],
    gallery: [
      {
        id: 'gal_1',
        title: 'The Sacred Muhurtham',
        category: 'Weddings',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-02-14',
        eventType: 'Wedding',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_2',
        title: 'Mangalsutra Dharana Ritual',
        category: 'Weddings',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-01-20',
        eventType: 'Wedding',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_3',
        title: 'Sunset Beach Romance',
        category: 'Weddings',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-03-05',
        eventType: 'Pre-Wedding',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_4',
        title: 'Traditional Langa Voni Grace',
        category: 'Traditional Events',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-02-28',
        eventType: 'Half Saree',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_5',
        title: 'Ring Exchange Promise',
        category: 'Engagements',
        imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-01-18',
        eventType: 'Engagement',
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_6',
        title: '1st Birthday Joy & Confetti',
        category: 'Birthdays',
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-03-12',
        eventType: 'Birthday',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_7',
        title: 'Motherhood in Bloom',
        category: 'Studio Photography',
        imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-02-10',
        eventType: 'Maternity',
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_8',
        title: 'Sleeping Angel Newborn Shoot',
        category: 'Studio Photography',
        imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-02-02',
        eventType: 'Baby Milestone',
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_9',
        title: 'Artistic Lighting Portrait',
        category: 'Studio Photography',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-03-01',
        eventType: 'Fashion / Studio',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'gal_10',
        title: 'Festive Pooja & Blessings',
        category: 'Traditional Events',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
        shootDate: '2026-01-14',
        eventType: 'Traditional',
        featured: false,
        createdAt: new Date().toISOString()
      }
    ],
    bookings: [
      {
        id: 'bk_1',
        referenceNo: 'CD-2026-8941',
        customerName: 'Ramesh Varma',
        phone: '9849012345',
        email: 'ramesh.varma@gmail.com',
        eventType: 'Wedding Photography',
        packageId: 'pkg_1',
        packageName: 'Royal Heritage Wedding Package',
        quotedPrice: 85000,
        eventDate: '2026-11-20',
        timeSlot: 'Full Day (8:00 AM - 10:00 PM)',
        eventLocation: 'Novotel Varun Beach Convention Hall, Visakhapatnam',
        eventAddress: 'Beach Road, Maharanipeta, Visakhapatnam, AP',
        notes: 'Need drone entry shot and 2 candid photographers for muhurtham.',
        status: 'Confirmed',
        paymentStatus: 'Advance Paid',
        internalNotes: 'Received advance ₹25,000 via Google Pay on 10 Oct. Team assigned: Lead Chinni + 2 assistants.',
        createdAt: new Date('2026-10-10').toISOString(),
        updatedAt: new Date('2026-10-10').toISOString()
      },
      {
        id: 'bk_2',
        referenceNo: 'CD-2026-7215',
        customerName: 'Priyanka Reddy',
        phone: '9988776655',
        email: 'priyanka.r@outlook.com',
        eventType: 'Traditional Functions',
        packageId: 'pkg_4',
        packageName: 'Traditional Half Saree (Langa Voni) Grand Package',
        quotedPrice: 22000,
        eventDate: '2026-11-25',
        timeSlot: 'Morning (8:00 AM - 1:00 PM)',
        eventLocation: 'Sri Venkateswara Kalyana Mandapam, Rajahmundry',
        eventAddress: 'Danavaipeta, Rajahmundry, AP',
        notes: 'Traditional half saree function of our daughter Sravani.',
        status: 'Pending',
        paymentStatus: 'Pending',
        internalNotes: 'Customer requested discount, owner to call back.',
        createdAt: new Date('2026-10-15').toISOString(),
        updatedAt: new Date('2026-10-15').toISOString()
      },
      {
        id: 'bk_3',
        referenceNo: 'CD-2026-5120',
        customerName: 'Kiran Kumar',
        phone: '9440112233',
        email: 'kiran.k@gmail.com',
        eventType: 'Birthday Photography',
        packageId: 'pkg_5',
        packageName: 'Grand Birthday Bash & Cake Smash',
        quotedPrice: 14000,
        eventDate: '2026-10-28',
        timeSlot: 'Evening (4:00 PM - 9:00 PM)',
        eventLocation: 'Grand Bay Banquet, Vijayawada',
        eventAddress: 'MG Road, Labbipet, Vijayawada, AP',
        notes: 'Baby girl 1st birthday celebration.',
        status: 'Confirmed',
        paymentStatus: 'Advance Paid',
        internalNotes: '₹5,000 advance received. Decor color theme is Lavender & Pink.',
        createdAt: new Date('2026-10-12').toISOString(),
        updatedAt: new Date('2026-10-12').toISOString()
      },
      {
        id: 'bk_4',
        referenceNo: 'CD-2026-3094',
        customerName: 'Venkatesh Naidu',
        phone: '9123456789',
        email: 'venkat.naidu@yahoo.com',
        eventType: 'Engagement Photography',
        packageId: 'pkg_7',
        packageName: 'Grand Engagement & Ring Ceremony',
        quotedPrice: 20000,
        eventDate: '2026-10-05',
        timeSlot: 'Morning (8:00 AM - 1:00 PM)',
        eventLocation: 'Siddhartha Convention Center, Guntur',
        eventAddress: 'Ring Road, Guntur, AP',
        notes: 'Ring ceremony and lunch function.',
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        internalNotes: 'Event successfully covered. Album design delivered on 15 Oct.',
        createdAt: new Date('2026-09-20').toISOString(),
        updatedAt: new Date('2026-10-15').toISOString()
      }
    ],
    quotations: [
      {
        id: 'quot_1',
        customerName: 'Sanjay Chowdary',
        phone: '9876543210',
        email: 'sanjay.c@hotmail.com',
        eventType: '3-Day Destination Wedding',
        eventDate: '2026-12-18',
        durationDays: 3,
        expectedGuests: '800-1000',
        servicesRequired: ['Wedding Photography', 'Wedding Cinematography', 'Pre-Wedding Shoots', 'Drone Aerial Views', 'Live Streaming'],
        budgetRange: '₹1,50,000 - ₹2,00,000',
        location: 'Araku Valley & Visakhapatnam',
        message: 'Looking for high-end cinematic crew for Haldi, Mehendi, Sangeet in Araku and Muhurtham in Vizag.',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ],
    testimonials: [
      {
        id: 'tst_1',
        clientName: 'Suresh & Sneha',
        eventType: 'Wedding & Cinematography',
        rating: 5,
        reviewText: 'CHINNI DIGITALS made our wedding look like an epic cinema! The candid shots captured real emotions that we will treasure forever. Chinni garu and his crew were so patient, energetic, and professional.',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        date: 'October 2026'
      },
      {
        id: 'tst_2',
        clientName: 'Dr. Srinivas & Lakshmi',
        eventType: 'Daughter Half Saree Ceremony',
        rating: 5,
        reviewText: 'We booked the Half Saree package for our daughter. The photo album quality with the acrylic cover is simply mind-blowing! All our relatives were asking who did the photography. Best studio in town!',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        date: 'September 2026'
      },
      {
        id: 'tst_3',
        clientName: 'Anand & Madhavi',
        eventType: 'Pre-Wedding Beach Shoot',
        rating: 5,
        reviewText: 'The drone music teaser they created for our pre-wedding went viral on Instagram! Extremely creative poses, beautiful lighting, and prompt delivery. Thank you Chinni Digitals team!',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        date: 'August 2026'
      }
    ],
    availabilitySlots: [
      'Morning (8:00 AM - 1:00 PM)',
      'Evening (4:00 PM - 9:00 PM)',
      'Full Day (8:00 AM - 10:00 PM)',
      'Custom Hours'
    ]
  };
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = getInitialSeed();
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      this.data = initialData;
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db.json, re-initializing seed:', err);
        this.data = getInitialSeed();
        fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  // Get whole collection
  get(collectionName) {
    return this.data[collectionName] || [];
  }

  // Set collection
  set(collectionName, value) {
    this.data[collectionName] = value;
    this.save();
  }

  // Find one item by predicate
  findOne(collectionName, predicate) {
    const list = this.get(collectionName);
    if (!Array.isArray(list)) return null;
    return list.find(predicate) || null;
  }

  // Insert item
  insert(collectionName, item) {
    if (!Array.isArray(this.data[collectionName])) {
      this.data[collectionName] = [];
    }
    this.data[collectionName].unshift(item);
    this.save();
    return item;
  }

  // Update item
  update(collectionName, predicate, updates) {
    const list = this.get(collectionName);
    if (!Array.isArray(list)) return null;
    const index = list.findIndex(predicate);
    if (index === -1) return null;
    this.data[collectionName][index] = {
      ...this.data[collectionName][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data[collectionName][index];
  }

  // Delete item
  remove(collectionName, predicate) {
    const list = this.get(collectionName);
    if (!Array.isArray(list)) return false;
    const index = list.findIndex(predicate);
    if (index === -1) return false;
    this.data[collectionName].splice(index, 1);
    this.save();
    return true;
  }
}

export const db = new Database();
