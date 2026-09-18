# 🐘 VIGHNAHARTA RUN — THE 108 VIGHNAS

> **Run. Remove. Collect. Conquer.**  
> *"Most endless runners make players avoid obstacles. Vighnaharta Run lets Ganesha remove them."*

An original, polished, 3D lane-based endless runner web game themed around **Lord Ganesha**, **Ganesh Chaturthi**, and Indian festival streets, connected with live weather, real-time leaderboards, and a dedicated analytics dashboard.

---

## 🌟 Highlights & Signature Mechanics

1. **Remove Vighnas (The Signature Mechanic)**:
   Unlike traditional runners that only penalize collisions, Lord Ganesha strikes down destructible Vighnas (wooden barriers, stone blocks, barricades). Smashes trigger golden particle explosions, camera shake, sound impact, and floating score bonuses (`+100 VIGHNA REMOVED!`).
2. **108 Vighnas Progression**:
   Travel through progressive festival realms:
   - **Vighnas 1–20**: Festival Street (warm sunlight, torans, hanging diyas, marigold petals)
   - **Vighnas 21–40**: Temple Street (stone pillars, temple gateways, golden lighting)
   - **Vighnas 41–60**: Monsoon Festival (rain particles, wet road reflections, lightning ambience)
   - **Vighnas 61–80**: Visarjan Path (procession banners, distant water)
   - **Vighnas 81–100**: Chaos Festival (twilight lanterns, combined obstacles)
   - **Vighnas 101–107**: Final Challenge
   - **Vighna 108**: **THE FINAL VIGHNA** (Colossus obstacle, defeated with golden explosion and divine completion sequence)
3. **Mushika Companion & Boost**:
   Faithful Mushika appears alongside Ganesha, granting a 7-second high-speed burst with motion trails and accelerated score.
4. **Divine Mode**:
   Collecting a rare Golden Modak activates 10 seconds of divine power—Ganesha turns golden, gains a glowing aura, infinite Vighna destruction, and a 2X score multiplier.
5. **Procedural Web Audio Engine**:
   Zero external audio files required! Synthesizes modak bell chimes, destruction booms, temple drone, and dhol/mridangam festive rhythm procedurally via Web Audio API.
6. **Live City Weather Integration (Open-Meteo)**:
   Syncs in-game lighting and atmosphere with the real-time weather of player's selected Indian festival city (Mumbai, Pune, Hyderabad, Bengaluru, Varanasi, etc.).
7. **Real-Time Leaderboard & Recharts Analytics**:
   Live rankings with podium cards, filterable by all-time or today's runs, paired with an analytics dashboard tracking score over time, vighnas per run, modaks, and combo efficiency.
8. **Bulletproof Demo Mode**:
   Works out of the box with zero external dependencies configured, featuring offline persistence and realistic simulated multiplayer activity.

---

## 🎮 Controls

### Desktop Keyboard
- **A / Left Arrow**: Move to Left Lane
- **D / Right Arrow**: Move to Right Lane
- **W / Up Arrow / Space**: Jump
- **S / Down Arrow**: Slide (ducks low or dives quickly from jump)
- **Escape**: Pause / Resume Menu

### Mobile & Tablet Touch
- **Swipe Left / Right**: Lane change
- **Swipe Up**: Jump
- **Swipe Down**: Slide
- **On-Screen Touch Buttons**: Left, Right, Jump, and Slide HUD buttons

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **3D Graphics Engine**: Three.js WebGL with custom low-poly stylized procedural geometry
- **Styling**: Vanilla CSS Design System with custom festival theme tokens (Midnight Navy, Saffron, Marigold, Divine Gold, Glassmorphism)
- **Audio**: Web Audio API Procedural Synthesizer
- **Charts**: Recharts (Area, Bar, and Line charts)
- **Database & Auth**: Supabase (`profiles`, `game_sessions`, `achievements`, `player_stats`) + LocalStorage Demo Mode fallback
- **Weather & Geocoding**: Open-Meteo REST APIs

---

## 🏛️ Project Architecture

```
src/
├── app/
│   ├── page.tsx            # Cinematic Landing Page
│   ├── game/page.tsx       # 3D Endless Runner Game Canvas
│   ├── auth/page.tsx       # Supabase Auth & Guest Demo Access
│   ├── onboarding/page.tsx # City weather sync, nickname & avatar selection
│   ├── dashboard/page.tsx  # Analytics Dashboard (Recharts + Festival Pulse)
│   ├── leaderboard/page.tsx# Live Realtime Leaderboard
│   ├── results/page.tsx    # Share Score Card & Certification
│   ├── profile/page.tsx    # Devotee Profile & 8 Sacred Achievements
│   ├── layout.tsx          # Root Layout & SEO
│   └── globals.css         # Festival Theme Design System
├── components/
│   ├── game/
│   │   ├── GameCanvas.tsx      # Main Game mount and input manager
│   │   ├── GameHUD.tsx         # In-game HUD (108 progress, score, lives, combo)
│   │   ├── GamePause.tsx       # Pause modal & graphics settings
│   │   ├── GameOverModal.tsx   # Victory & Game Over modal
│   │   ├── TouchControls.tsx   # On-screen touch buttons
│   │   └── TutorialOverlay.tsx # Ready screen, tutorial & 3-2-1 countdown
│   └── layout/
│       └── Navbar.tsx          # Responsive navigation & audio toggle
├── lib/
│   ├── game/
│   │   ├── gameEngine.ts       # 60 FPS Three.js runner loop & physics
│   │   ├── models.ts           # Procedural 3D models (Ganesha, Mushika, Vighnas)
│   │   ├── trackGenerator.ts   # 3-lane chunk recycling & safe obstacle patterns
│   │   └── particleSystem.ts   # Object-pooled golden spark bursts & petals
│   ├── audioEngine.ts          # Procedural Web Audio synthesizer
│   ├── weather.ts              # Open-Meteo weather & geocoding
│   ├── storage.ts              # Unified Supabase + LocalStorage provider
│   ├── achievements.ts         # 8 Sacred Achievements tracking
│   └── supabase.ts             # Supabase client configuration
└── types/
    ├── game.ts                 # Game physics, stats, and powerup types
    └── database.ts             # Profile, session, and leaderboard types
```

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Configuration (Optional)

Create a `.env.local` file with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Execute the database schema located in [supabase/schema.sql](file:///c:/Users/hp/projects/brave/supabase/schema.sql) in the Supabase SQL Editor.

> **Note**: If Supabase keys are not set, Vighnaharta Run automatically runs in **Demo Mode**, enabling 100% of game features, offline sessions, live mock rankings, and profile customization without errors.

---

## 🏆 3-Minute Hackathon Demo Script

1. **0:00 – 0:15 | Landing Page**:
   "Vighnaharta Run is an endless runner where Lord Ganesha doesn't avoid obstacles—he removes them."
2. **0:15 – 0:30 | Quick Start / Onboarding**:
   Select your festival city (e.g. Mumbai, Pune) to preview live weather syncing with the in-game environment.
3. **0:30 – 1:20 | Core Gameplay**:
   Show 3-lane movement, jumping over hurdles, sliding under banners, collecting Modaks, smashing Vighnas (+100 popup & camera shake), and building combo multipliers.
4. **1:20 – 1:40 | Golden Modak & Divine Mode**:
   Collect a Golden Modak to enter Divine Mode: screen glowing with golden aura, camera zoom, and effortless obstacle destruction.
5. **1:40 – 2:10 | Results & Share Card**:
   Showcase final score certification and copy score snippet.
6. **2:10 – 2:40 | Dashboard & Leaderboard**:
   Walk through Recharts analytics and live leaderboard ranking.
7. **2:40 – 3:00 | 108 Vighnas**:
   "We transformed a culturally profound idea into a high-performance 3D connected gaming experience."
