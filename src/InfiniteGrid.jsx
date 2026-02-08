import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

const images = import.meta.glob('./public/toWEBP/*.webp', { eager: true, import: 'default' })
const IMAGE_URLS = Object.values(images)

const CELL_SIZE = 280
const GAP = 25
const TOTAL_CELL = CELL_SIZE + GAP
const SPRING_CONFIG = { damping: 40, stiffness: 200, mass: 0.5 }
const SCALE_SPRING = { damping: 25, stiffness: 300, mass: 0.2 }
const PRELOAD_CONCURRENCY = 20 // Increased from 6

const mod = (n, m) => ((n % m) + m) % m

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const InfiniteGrid = ({ theme }) => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [isReady, setIsReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const displayRef = useRef(0)
  const intervalRef = useRef(null)
  
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const shuffledImages = useMemo(() => shuffleArray(IMAGE_URLS), [])

  // Animate displayed % upward slowly (so it doesn't jump to 100%)
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (displayRef.current >= loadProgress) return
      displayRef.current = Math.min(displayRef.current + 1, loadProgress)
      setDisplayProgress(displayRef.current)
    }, 180)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadProgress])

  // Reset displayed progress when starting a new load
  useEffect(() => {
    if (loadProgress === 0) {
      displayRef.current = 0
      setDisplayProgress(0)
    }
  }, [loadProgress])

  // Optimized preloading: all at once with higher concurrency
  useEffect(() => {
    let cancelled = false
    const imageCache = new Map()
    
    const loadOne = async (url) => {
      try {
        // Create image element
        const img = new Image()
        img.fetchPriority = 'high' // Prioritize image loading
        img.decoding = 'async' // Decode off main thread
        
        // Create promise that resolves on load
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => {
            // Decode the image off the main thread
            img.decode()
              .then(() => {
                imageCache.set(url, img)
                resolve(true)
              })
              .catch(() => resolve(true)) // Still resolve even if decode fails
          }
          img.onerror = () => resolve(false) // Don't reject, just mark as failed
        })
        
        // Start loading
        img.src = url
        
        return loadPromise
      } catch {
        return false
      }
    }

    const preloadAll = async () => {
      const total = shuffledImages.length
      let loaded = 0
      
      // Process in batches for better control
      for (let i = 0; i < total && !cancelled; i += PRELOAD_CONCURRENCY) {
        const batch = shuffledImages.slice(i, i + PRELOAD_CONCURRENCY)
        
        // Load batch in parallel
        await Promise.all(batch.map(url => 
          loadOne(url).then(success => {
            if (success) loaded++
            if (!cancelled) {
              setLoadProgress(Math.round((loaded / total) * 100))
            }
          })
        ))
      }
      
      if (!cancelled) {
        // Small delay to ensure smooth transition
        await new Promise(r => setTimeout(r, 100))
        setIsReady(true)
      }
    }

    preloadAll()
    return () => { cancelled = true }
  }, [shuffledImages])

  useEffect(() => {
    const handleResize = () => setContainerSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const gridConfig = useMemo(() => {
    const cols = Math.ceil(containerSize.width / TOTAL_CELL) + 4
    const rows = Math.ceil(containerSize.height / TOTAL_CELL) + 4
    const totalCells = cols * rows
    const items = []
    
    const imagePool = []
    const repetitions = Math.ceil(totalCells / shuffledImages.length)
    for (let i = 0; i < repetitions; i++) {
      imagePool.push(...shuffleArray(shuffledImages))
    }
    
    let poolIndex = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({ 
          id: `${r}-${c}`, 
          relX: c - 1, 
          relY: r - 1,
          imgUrl: imagePool[poolIndex % imagePool.length]
        })
        poolIndex++
      }
    }
    return { items, cols, rows }
  }, [containerSize, shuffledImages])

  const onPanStart = useCallback(() => setIsDragging(true), [])
  const onPan = useCallback((_, info) => {
    rawX.set(rawX.get() + info.delta.x)
    rawY.set(rawY.get() + info.delta.y)
  }, [rawX, rawY])
  const onPanEnd = useCallback(() => setIsDragging(false), [])

  return (
    <div 
      onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          mouseX.set(e.touches[0].clientX)
          mouseY.set(e.touches[0].clientY)
        }
      }}
      className={`w-full h-screen overflow-hidden relative select-none transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}
    >
      <motion.div 
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        className="absolute inset-0 z-0"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isReady ? 1 : 0,
          pointerEvents: isReady ? 'auto' : 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none'
        }}
      >
        {gridConfig.items.map((item) => (
          <GridItem
            key={item.id}
            item={item}
            x={x}
            y={y}
            mouseX={mouseX}
            mouseY={mouseY}
            gridWidth={gridConfig.cols * TOTAL_CELL}
            gridHeight={gridConfig.rows * TOTAL_CELL}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {!isReady && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}
          >
            <span 
              className={`text-2xl font-light tabular-nums ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}
              style={{ fontFamily: "'Karla', sans-serif" }}
            >
              {displayProgress}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const GridItem = memo(({ item, x, y, mouseX, mouseY, gridWidth, gridHeight }) => {
  const [loaded, setLoaded] = useState(false)
  const tx = useTransform(x, (v) => mod((item.relX * TOTAL_CELL) + v + TOTAL_CELL, gridWidth) - TOTAL_CELL)
  const ty = useTransform(y, (v) => mod((item.relY * TOTAL_CELL) + v + TOTAL_CELL, gridHeight) - TOTAL_CELL)

  const rawScale = useTransform([tx, ty, mouseX, mouseY], ([latestX, latestY, mx, my]) => {
    const centerX = latestX + CELL_SIZE / 2
    const centerY = latestY + CELL_SIZE / 2
    const distanceSq = (mx - centerX) ** 2 + (my - centerY) ** 2
    
    if (distanceSq > 122500) return 1
    
    const distance = Math.sqrt(distanceSq)
    return 1 + (1 - distance / 350) * 0.12
  })
  
  const scale = useSpring(rawScale, SCALE_SPRING)

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        x: tx,
        y: ty,
        scale,
        willChange: 'transform',
        transformTemplate: ({ x, y, scale }) => `translate3d(${x}, ${y}, 0) scale(${scale})`,
      }}
      className="pointer-events-none"
    >
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative bg-neutral-200 dark:bg-neutral-800">
        <img
          src={item.imgUrl}
          alt=""
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          fetchpriority="high"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </motion.div>
  )
}, (prevProps, nextProps) => 
  prevProps.item.id === nextProps.item.id
)

export default InfiniteGrid