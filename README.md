# Anshin Map (Beta) - Emergency Hospital Finder

A mobile-first, production-ready dashboard for finding the nearest hospitals with night service availability in Ibaraki Prefecture, Japan. Built for emergency situations with one-tap calling and navigation.

![Anshin Map](https://img.shields.io/badge/Status-Beta-yellow) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

- **📍 Smart Geolocation**: Automatically detects your location and sorts hospitals by distance
- **🗺️ Interactive Map**: OpenStreetMap-powered Leaflet map with custom markers
- **🌙 Night Service Indicators**: Green markers show hospitals with 24/7 availability
- **☎️ One-Tap Actions**: Direct calling and Google Maps navigation from any hospital
- **📱 Mobile-First Design**: Optimized for emergency use on phones, responsive on desktop
- **⚡ Performance Optimized**: Lazy-loaded map, smooth Framer Motion animations
- **♿ Accessible**: Semantic HTML, ARIA labels, keyboard navigation, 44px tap targets

## 🛠️ Tech Stack

- **React 18** + **Vite** - Fast, modern frontend
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling with custom design system
- **React Leaflet** - Interactive maps with OpenStreetMap tiles
- **Framer Motion** - Smooth, production-grade animations
- **Lucide React** - Beautiful, consistent icons
- **shadcn/ui** - High-quality, accessible components

## 📦 Installation

### Prerequisites

- Node.js 18+ (with npm)
- Modern web browser with geolocation support

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd anshin-map

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:8080`

## 📂 Project Structure

```
anshin-map/
├── public/
│   └── hospitals.json       # Hospital data (15 records)
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.tsx       # App header with 119 quick-dial
│   │   ├── Footer.tsx       # Disclaimer and attribution
│   │   ├── MapClient.tsx    # Leaflet map (lazy-loaded)
│   │   ├── NearestCard.tsx  # Fixed bottom card with CTAs
│   │   └── HospitalList.tsx # Collapsible hospital list
│   ├── lib/
│   │   ├── geolocation.ts   # Haversine distance, location utils
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Index.tsx        # Main dashboard page
│   │   └── NotFound.tsx     # 404 page
│   ├── index.css            # Design system tokens (HSL colors)
│   └── App.tsx              # Root component
├── tailwind.config.ts       # Tailwind configuration
└── package.json
```

## 🎨 Design System

The app uses a medical-grade teal and red color scheme optimized for emergency use:

- **Primary (Teal)**: `#0F766E` - Medical brand color for headers and accents
- **Emergency (Red)**: `#EF4444` - Reserved for Call buttons only
- **Success (Green)**: `#16A34A` - Night service available markers
- **Inactive (Gray)**: `#9CA3AF` - Hospitals without night service
- **Background**: `#F8FAFC` - Soft, low-eye-strain background

All colors are defined as HSL tokens in `src/index.css` for consistency and theming.

## 📊 Hospital Data

Hospital data is stored in `/public/hospitals.json`. Each record contains:

```json
{
  "id": "h1",
  "name": "Hospital Name",
  "lat": 36.08322,
  "lng": 140.26005,
  "departments": ["Emergency", "Surgery"],
  "night_service": true,
  "tel": "+81-29-830-3711",
  "official": "https://example.com"
}
```

### Updating Hospital Data

1. Edit `/public/hospitals.json`
2. Ensure valid latitude/longitude coordinates
3. Update the "Last updated" date in `src/components/Footer.tsx`
4. Rebuild and redeploy

## 🚢 Deployment

### Deploy to Netlify

1. **Via Netlify UI**:
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages

```bash
npm run build
# Copy dist/ contents to gh-pages branch
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Geolocation prompt appears on first load
- [ ] Map centers to user location when granted
- [ ] Nearest hospital card appears with correct data
- [ ] Call button opens phone dialer (mobile)
- [ ] Directions button opens Google Maps
- [ ] Hospital list sorts by distance
- [ ] Map markers show correct colors (green/gray)
- [ ] Popups display all hospital info
- [ ] Responsive layout works on 360px and 1280px widths
- [ ] Animations are smooth (no jank)
- [ ] 119 button in header works

### Browser Testing

Tested on:
- ✅ Chrome Android
- ✅ Safari iOS
- ✅ Chrome Desktop
- ✅ Firefox Desktop

## ⚠️ Important Notes

- **Emergency Disclaimer**: This app is for informational purposes only. In life-threatening emergencies, always call 119 immediately.
- **Data Accuracy**: Hospital information may not be real-time. Verify availability before visiting.
- **Geolocation**: Requires HTTPS in production for browser geolocation to work.
- **Map Attribution**: OpenStreetMap attribution is required and included in footer.

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Contact: [canarylumen@gmail.com]

## 🙏 Acknowledgments

- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/)
- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

**Built with ❤️ for Tom by Treasure**
