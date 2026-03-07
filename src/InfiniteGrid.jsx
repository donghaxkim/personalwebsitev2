import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useImagePreloader } from './hooks/useImagePreloader'

const images = import.meta.glob('./public/toWEBP/*.webp', { eager: true, import: 'default' })
const IMAGE_URLS = Object.values(images)

const CELL_SIZE = 280
const GAP = 25
const TOTAL_CELL = CELL_SIZE + GAP
const SPRING_CONFIG = { damping: 40, stiffness: 200, mass: 0.5 }
const SCALE_SPRING = { damping: 25, stiffness: 300, mass: 0.2 }
const TIER1_COUNT = 20

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
  const [isDragging, setIsDragging] = useState(false)
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
  const { tier1Ready, loadedCount, total } = useImagePreloader(shuffledImages, TIER1_COUNT)

  // Progress target: 0-100% for first TIER1_COUNT images, then 100% when tier1Ready
  const tier1Target = total === 0 ? 0 : (tier1Ready ? 100 : Math.min(100, Math.round((loadedCount / Math.min(TIER1_COUNT, total)) * 100)))

  // Animate displayed % upward slowly (so it doesn't jump to 100%)
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (displayRef.current >= tier1Target) return
      displayRef.current = Math.min(displayRef.current + 1, tier1Target)
      setDisplayProgress(displayRef.current)
    }, 180)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [tier1Target])

  useEffect(() => {
    if (tier1Target === 0) {
      displayRef.current = 0
      setDisplayProgress(0)
    }
    if (tier1Ready && tier1Target === 100) {
      displayRef.current = 100
      setDisplayProgress(100)
    }
  }, [tier1Target, tier1Ready])

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
          opacity: tier1Ready ? 1 : 0,
          pointerEvents: tier1Ready ? 'auto' : 'none',
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
        {!tier1Ready && (
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