# 🌍 Dream Globe
### *Where Dreams Meet Destinations*

> **DreamWare Hackathon 2025 Submission**
> *Engineering the Surreal - A dream-like journey through the world*

---

## 🎭 The Dream

**Dream Globe** is not just a travel app — it's an emotional voyage through consciousness. We've built an immersive, surreal experience where users don't browse destinations, they *dream* them into existence.

Close your eyes. Board a plane that exists in imagination. Open your passport to countries that feel both familiar and impossibly distant. Stand in the streets of Paris, Delhi, London through a lens that blends reality with the ethereal nature of memory.

This is travel as poetry. This is technology as emotion.

---

## 🧱 Dream Fragments Implemented

We've woven together **four Dream Fragments** to create a cohesive surreal experience:

### 1. **🌊 Fluid Interface**
- **Smooth eye-opening/closing transitions** between every scene, mimicking the liminal space between sleep and waking
- **GSAP-powered animations** that make UI elements breathe and flow organically
- **Dynamic passport opening** with 3D perspective transforms that feel like turning pages in a fever dream
- **Seamless flight animations** using Three.js where the camera glides through clouds and continents
- Every interaction whispers instead of clicks

### 2. **💭 Emotional Memory**
- **Personalized digital passport** that stores your journey as a tangible artifact
- **Photo compositing system** that places *you* into destinations, creating impossible memories that feel real
- **Persistent localStorage memories** — your name, your face, your destinations stay with you
- **Narrated voiceovers** at each destination that speak directly to you, like a guide in a dream
- The system remembers your current country, allowing seamless transitions between flights

### 3. **⏰ Temporal Shifts**
- **Non-linear travel flow** — start anywhere, return anytime, revisit destinations in any order
- **Day/night ambient transitions** with time-based lighting in 3D scenes
- **Background music shifts** based on which country you're in — India has sitar melodies, France has accordion whispers
- **Passport issuance dates** generated dynamically with 10-year expiry, anchoring the dream in pseudo-reality
- Flight animations that compress hours into seconds, warping the perception of journey time

### 4. **🗣️ Voice of the Machine**
- **AI-powered voiceovers** narrate each destination with human-like emotion
- **Airport pilot announcements** guide your flight experience
- **Adaptive narration system** that speaks your name, your nationality, your chosen destination
- **Background ambient soundscapes** — birds at the Taj Mahal, guards at Buckingham Palace
- The machine doesn't just show — it *tells*, it *welcomes*, it *remembers*

---

## ✨ Key Features

### 🎬 **Cinematic Journey Flow**
1. **Landing Scene** — Animated eye-opening effect with particles floating in consciousness
2. **Hero Section** — Interactive 3D globe (Spline) that rotates as you contemplate
3. **Dream Form** — Enter your name, nationality, capture your selfie with background removal
4. **Passport Display** — Realistic passport opens with your photo, destinations, and stamps
5. **Flight Transition** — Animated plane journey with Three.js, country-to-country
6. **Plane Interior** — 3D cockpit with pilot voice welcoming you
7. **Destination Arrival** — Google Street View panoramas at real locations (airports & landmarks)
8. **Photo Gallery** — Composite your selfie into destination backgrounds with position controls
9. **Multi-Country System** — Fly to any of 5 countries: India, USA, UK, Russia, France
10. **Goodbye Scene** — Emotional farewell with developer credits and dream-like aesthetics

### 🎨 **Technical Artistry**
- **Background Removal AI** — TensorFlow BodyPix removes backgrounds from selfies in real-time
- **Photo Compositing** — Canvas API places you into destination scenes with scaling/positioning
- **Google Maps Integration** — Real Street View coordinates with fallback locations
- **3D Graphics** — Spline scenes (2) + Three.js flight animation with custom shaders
- **Responsive Design** — Fully optimized for mobile and desktop
- **Music Manager** — Contextual music that fades between scenes and countries
- **Persistent State** — LocalStorage preserves your journey across sessions

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 16** (App Router) — React 19.2.0
- **TypeScript** — Type-safe throughout

### **Styling & Animation**
- **Tailwind CSS 4** — Utility-first with custom animations
- **GSAP** — Advanced timeline animations
- **Custom CSS Keyframes** — For passport flips, eye transitions, particle effects

### **3D & Graphics**
- **@splinetool/react-spline** — 3D interactive globe and plane
- **Three.js + React Three Fiber** — Custom flight transition scene
- **@react-three/drei** — 3D helpers and controls

### **AI & Image Processing**
- **@tensorflow-models/body-segmentation** — Real-time background removal
- **@tensorflow/tfjs** — Client-side ML inference
- **Canvas API** — Photo compositing and image manipulation
- **html2canvas** — Passport screenshot generation

### **Maps & Location**
- **@googlemaps/js-api-loader** — Google Street View integration
- **Custom panorama controls** — Interactive 360° destination views

### **Audio**
- **Custom Music Manager** — Context-aware audio system
- **Fade transitions** — Smooth audio crossfades between scenes
- **Narration system** — MP3 voiceovers with timing sync

### **UI Components**
- **Lucide React** — Icon library
- **class-variance-authority** — Dynamic component variants
- **clsx + tailwind-merge** — Intelligent class composition

---

## 🚀 Setup & Installation

### **Prerequisites**
- Node.js 18+ and npm
- Google Maps API key (for Street View)

### **Installation**

```bash
# Clone the repository
git clone <your-repo-url>
cd finaldream

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### **Build for Production**

```bash
npm run build
npm start
```

---

## 🎯 User Journey (The Dream Flow)

1. **Eyes Open** → Landing animation, particle effects swirl
2. **Hero Globe** → Interactive 3D world spins, "Start Your Journey" button pulses
3. **Dream Form** → Enter name, nationality, destination, capture selfie
4. **Passport Reveal** → Digital passport opens with your data, stamps appear
5. **Flight Boarding** → Eye closes, plane transition begins
6. **In Flight** → 3D clouds, continents pass, pilot voice speaks
7. **Airport Arrival** → Eyes open at destination airport, narration plays
8. **Explore Destinations** → Visit 3 landmarks per country via Street View
9. **Photo Memories** → Take composite photos at landmarks
10. **Next Country** → Choose another destination or end journey
11. **Goodbye** → Farewell message, developer credits, return home

---

## 📊 Evaluation Criteria Alignment

### **40% Technical Execution** ✅
- **Stable & Responsive:** Fully mobile-optimized, touch-friendly, no crashes
- **Advanced Tech:** TensorFlow, Three.js, Google Maps, Spline, GSAP all integrated smoothly
- **Performance:** Lazy loading, dynamic imports, optimized assets
- **Clean Code:** TypeScript, modular components, reusable utilities

### **30% Concept & Depth** ✅
- **Emotional Impact:** Every transition designed to evoke wonder, nostalgia, longing
- **Dream Logic:** Non-linear flow, impossible memories (photos in places you've never been)
- **Narrative Cohesion:** Passport as storytelling device, journey as metaphor for aspiration
- **Personal Connection:** Uses your name, face, choices — it's *your* dream

### **30% Originality & Presence** ✅
- **Unique Concept:** No other project combines travel, dreams, and passports this way
- **Atmospheric:** Soundscapes, voiceovers, music, and visuals create immersive world
- **Artistic Execution:** Gradient overlays, particle effects, smooth animations feel ethereal
- **Narrative Voice:** The "machine" speaks to you with warmth, not coldness

---


## 🌙 Why This Matters

In a world of functional apps and utility software, **Dream Globe** dares to ask: *What if technology could make you feel?*

We didn't build a booking platform. We built a meditation on wanderlust. A digital artifact that captures the ache of wanting to be somewhere else, the joy of imagining yourself in distant places, the bittersweet beauty of dreams we can't quite reach.

This is software that whispers. Code that remembers. A machine that dreams *with* you.

---

## 🎥 Demo

**Live Demo:** [Coming Soon]
**Video Walkthrough:** [Coming Soon]

---

## 📜 License

This project was created for **DreamWare Hackathon 2025**.
Built with Next.js, Three.js, TensorFlow, and a lot of ❤️.

---

## 🙏 Acknowledgments

- **Spline** for beautiful 3D design tools
- **Google Maps** for Street View API
- **TensorFlow** for accessible ML models
- **Next.js Team** for an incredible framework
- **DreamWare Hackathon** for inspiring us to build something surreal

---

<div align="center">

### ✨ Don't just code. Feel. Build. Dream. ✨

**Dream Globe** — Where every journey begins with closing your eyes.

</div>
