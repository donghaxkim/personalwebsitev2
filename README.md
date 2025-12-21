# Dongha Kim's Portfolio

A minimalistic, interactive portfolio website built with React, featuring an infinite draggable photo grid, custom Spotify player, and smooth animations.

## 🌟 Features

### 1. **Infinite Photo Grid with Physics**
An infinitely scrollable photo gallery with advanced physics and optimizations:

#### **Spring Dynamics**
- Uses Framer Motion's `useSpring` for buttery-smooth dragging
- Spring configuration: `damping: 40, stiffness: 200, mass: 0.5`
- Creates natural, fluid motion with realistic inertia
- Eliminates jitter and provides smooth deceleration

```javascript
const x = useSpring(rawX, { damping: 40, stiffness: 200, mass: 0.5 })
const y = useSpring(rawY, { damping: 40, stiffness: 200, mass: 0.5 })
```

#### **Toroidal Wrapping (Modulus Arithmetic)**
- Implements infinite scrolling using modular arithmetic
- Grid wraps seamlessly at boundaries (torus topology)
- Formula: `mod(n, m) = ((n % m) + m) % m`
- Creates the illusion of infinite space with finite grid items

```javascript
const tx = useTransform(x, (v) => 
  mod((item.relX * TOTAL_CELL) + v + TOTAL_CELL, gridWidth) - TOTAL_CELL
)
```

#### **Magnetic Hover Effect**
- Images scale up when cursor/finger is near (within 350px)
- Uses distance calculation with squared optimization
- Spring physics applied to scale for smooth transitions
- Formula: `scale = 1 + (1 - distance / 350) * 0.12`

#### **Performance Optimizations**
- **React.memo**: Prevents unnecessary re-renders of grid items
- **GPU Acceleration**: Uses `translate3d` for hardware-accelerated transforms
- **Image Preloading**: All images fully loaded and decoded before display
- **Eager Loading**: Images decoded synchronously for instant rendering
- **No Duplicates**: Fisher-Yates shuffle ensures unique images per viewport

### 2. **Custom Spotify Player**
A fully functional music player with real audio playback:

#### **Features**
- Real MP3 playback with 4 curated tracks
- Expandable/collapsible interface
- Custom progress bar with seek functionality
- Animated audio visualizer (5 bars)
- Previous/Next track navigation
- Time display (current/duration)
- Auto-plays next track on completion

#### **Track Catalog**
1. Over My Dead Body - Drake
2. I Feel It Coming - The Weeknd
3. Past Life - Tame Impala
4. P2 - Lil Uzi Vert

#### **Animation Details**
- Hover state expands player with spring animation
- Playing indicator: 5 animated bars with staggered timing
- Smooth transitions using Framer Motion
- Progress bar updates in real-time

### 3. **Main Portfolio Page**
Clean, minimalistic landing page with:

#### **Content**
- About section with personal introduction
- Links to Instagram and TikTok (@imdonghakim)
- Professional contact information
- Social media icons (Email, LinkedIn, GitHub, X/Twitter)

#### **Typography**
- Headers: Gowun Batang (serif) - elegant, traditional feel
- Body: Karla (sans-serif) - clean, modern readability
- Responsive font sizing for all devices

#### **Design Philosophy**
- Minimalistic layout with ample whitespace
- Smooth fade-in animations on load
- Glass morphism navbar
- Dark/Light theme toggle

### 4. **Projects Page**
Showcases portfolio projects with:
- Project cards with tech stack badges
- Clean descriptions
- Consistent typography and spacing
- Responsive grid layout

### 5. **Theme System**
Dynamic theme switching with:
- Dark mode: `#1e1e1e` background
- Light mode: `#ffffff` background
- Smooth 500ms transitions
- Persists in localStorage
- Icon changes (Sun/Moon)

### 6. **Loading System**
Elegant loading experience:
- Grey circular spinner (LoadingIndicator component)
- Shows progress during image preloading
- Full-screen overlay prevents blank states
- Smooth fade-out transition
- Grid appears only when 100% ready

## 🛠️ Technical Stack

### **Core**
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

### **Animation & Physics**
- **Framer Motion** - Spring physics, animations, gestures
- **useSpring** - Smooth interpolation for dragging
- **useTransform** - Efficient value transformations
- **useMotionValue** - High-performance animated values

### **Styling**
- **Tailwind CSS** - Utility-first styling
- **Custom CSS** - Glass morphism effects
- **PostCSS** - CSS processing

### **Icons & Assets**
- **React Icons** - Icon library (bi, fa, md, wi)
- **WebP Images** - Optimized 77 unique photos
- **MP3 Audio** - Real music files

## 📐 Mathematical Implementations

### **Modular Arithmetic (Toroidal Wrapping)**
```javascript
const mod = (n, m) => ((n % m) + m) % m
```
This ensures values wrap correctly in both positive and negative directions, creating seamless infinite scrolling.

### **Distance Calculation (Hover Effect)**
```javascript
const distanceSq = (mx - centerX) ** 2 + (my - centerY) ** 2
if (distanceSq > 122500) return 1  // 350² optimization
const distance = Math.sqrt(distanceSq)
```
Calculates squared distance first to avoid expensive square root operation when possible.

### **Fisher-Yates Shuffle**
```javascript
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[array[i], array[j]] = [array[j], array[i]]
}
```
Ensures unbiased randomization of image order for variety.

## 🎨 Design Patterns

### **Memoization**
```javascript
const GridItem = memo(({ item, ... }) => {
  // Component logic
}, (prevProps, nextProps) => 
  prevProps.item.id === nextProps.item.id
)
```
Prevents re-renders when theme changes, dramatically improving performance.

### **Custom Hooks**
- `useMotionValue` - Reactive animated values
- `useSpring` - Physics-based animations
- `useTransform` - Value transformations
- `useCallback` - Memoized functions
- `useMemo` - Memoized computations

### **Lazy Loading Strategy**
```javascript
// Preload and decode all images
await img.decode()
// Store in memory
preloadedImagesRef.current = loadedImages
// Then show grid
setIsReady(true)
```

## 📱 Mobile Optimizations

### **Touch Events**
- Custom `onTouchMove` handler for hover effects
- `touchAction: 'none'` prevents browser gestures
- `-webkit-user-select: none` prevents text selection
- Viewport meta prevents zoom during drag

### **Responsive Design**
- Flexbox and Grid layouts
- Mobile-first approach
- Touch-friendly hit targets
- Adaptive font sizes

## 🚀 Performance Optimizations

1. **Image Loading**
   - All images preloaded before grid appears
   - Decoded in memory for instant rendering
   - No progressive loading or blank states

2. **GPU Acceleration**
   - `translate3d` for hardware acceleration
   - `willChange: 'transform'` optimization
   - `transformTemplate` for efficient updates

3. **React Optimizations**
   - Memo prevents unnecessary re-renders
   - Callback functions memoized
   - Grid config memoized with dependencies

4. **Render Optimization**
   - Only visible items + buffer rendered
   - Theme changes don't re-render grid items
   - Smooth 500ms color transitions

## 📦 Project Structure

```
portfolio3/
├── src/
│   ├── App.jsx                 # Main app & routing
│   ├── Navbar.jsx             # Glass navigation bar
│   ├── Projects.jsx           # Projects showcase
│   ├── InfiniteGrid.jsx       # Photo grid (core feature)
│   ├── SpotifyPlayer.jsx      # Music player
│   ├── components/
│   │   └── application/
│   │       └── loading-indicator/  # Loading spinner
│   └── public/
│       ├── toWEBP/           # 77 unique photos
│       ├── currents.jpg      # Album art
│       ├── ea.jpeg
│       ├── starboy.jpg
│       ├── takecare.jpg
│       └── *.mp3             # Music files
├── index.html                # Entry point
├── tailwind.config.js        # Tailwind configuration
└── vite.config.js           # Vite configuration
```

## 🔧 Setup & Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

Built with Vite for optimal production builds:
- Code splitting
- Tree shaking
- Asset optimization
- Minification

## 🎯 Key Algorithms

### **Grid Generation**
1. Calculate viewport size and required cells
2. Create image pool (shuffled, no duplicates in viewport)
3. Assign images sequentially to grid positions
4. Apply toroidal wrapping for infinite scrolling

### **Drag Physics**
1. Capture raw delta from pan gesture
2. Update motion values
3. Spring interpolates to target position
4. Transform applies modular wrapping
5. GPU renders final position

### **Image Preloading**
1. Create Image objects for all photos
2. Wait for `onload` event
3. Call `img.decode()` for full decode
4. Store in memory reference
5. Display grid when 100% complete

## 📝 Credits

**Design & Development**: Dongha Kim  
**Built with**: React, Framer Motion, Tailwind CSS  
**Photography**: Personal collection (77 photos)  
**Music**: Curated playlist with proper audio files

## 📄 License

Personal portfolio project - All rights reserved.

---

Made with ❤️ by Dongha Kim
