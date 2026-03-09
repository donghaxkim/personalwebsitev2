import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useImagePreloader } from './hooks/useImagePreloader'

const images = import.meta.glob('./public/toWEBP/*.webp', { eager: true, import: 'default' })
const IMAGE_URLS = Object.values(images)

const SPRING_CONFIG = { damping: 40, stiffness: 200, mass: 0.5 }
const SCALE_SPRING = { damping: 25, stiffness: 300, mass: 0.2 }
const TIER1_COUNT = 40

function getGridMetrics(containerSize) {
  const shortSide = Math.min(containerSize.width, containerSize.height)
  const cellSize = Math.round(Math.min(320, Math.max(140, shortSide * 0.22)))
  const gap = Math.max(12, Math.round(cellSize * 0.09))
  const totalCell = cellSize + gap
  const hoverRadius = cellSize * 1.25
  return { cellSize, gap, totalCell, hoverRadius }
}

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
  const [shouldReduceMotion, setShouldReduceMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e) => setShouldReduceMotion(e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const shuffledImages = useMemo(() => shuffleArray(IMAGE_URLS), [])
  useImagePreloader(shuffledImages, TIER1_COUNT)

  useEffect(() => {
    const handleResize = () => setContainerSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const metrics = useMemo(() => getGridMetrics(containerSize), [containerSize])

  const gridConfig = useMemo(() => {
    const { totalCell } = metrics
    const cols = Math.ceil(containerSize.width / totalCell) + 4
    const rows = Math.ceil(containerSize.height / totalCell) + 4
    const items = []

    // Constraint-based placement: no duplicate within Chebyshev distance 2 (5×5 neighborhood)
    const grid = Array.from({ length: rows }, () => new Array(cols).fill(null))

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const forbidden = new Set()
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue
            const nr = (r + dr + rows) % rows
            const nc = (c + dc + cols) % cols
            if (grid[nr][nc] !== null) forbidden.add(grid[nr][nc])
          }
        }
        const candidates = shuffledImages.filter(img => !forbidden.has(img))
        const pool = candidates.length > 0 ? candidates : shuffledImages
        grid[r][c] = pool[Math.floor(Math.random() * pool.length)]
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({ id: `${r}-${c}`, relX: c - 1, relY: r - 1, imgUrl: grid[r][c] })
      }
    }
    return { items, cols, rows, ...metrics }
  }, [containerSize, shuffledImages, metrics])

  const onPanStart = useCallback(() => setIsDragging(true), [])
  const onPan = useCallback((_, info) => {
    rawX.set(rawX.get() + info.delta.x)
    rawY.set(rawY.get() + info.delta.y)
  }, [rawX, rawY])
  const onPanEnd = useCallback(() => setIsDragging(false), [])

  const handlePointer = useCallback((clientX, clientY) => {
    mouseX.set(clientX)
    mouseY.set(clientY)
  }, [mouseX, mouseY])

  return (
    <div
      aria-hidden="true"
      onMouseMove={(e) => handlePointer(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handlePointer(e.touches[0].clientX, e.touches[0].clientY)
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          handlePointer(e.touches[0].clientX, e.touches[0].clientY)
        }
      }}
      className={`h-screen overflow-hidden relative select-none transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}
      style={{ marginLeft: '-2.5rem', marginRight: '-2.5rem', width: 'calc(100% + 5rem)' }}
    >
      <motion.div 
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        className="absolute inset-0 z-0"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
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
            gridWidth={gridConfig.cols * gridConfig.totalCell}
            gridHeight={gridConfig.rows * gridConfig.totalCell}
            cellSize={gridConfig.cellSize}
            totalCell={gridConfig.totalCell}
            hoverRadius={gridConfig.hoverRadius}
            reduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>
    </div>
  )
}

const GridItem = memo(({ item, x, y, mouseX, mouseY, gridWidth, gridHeight, cellSize, totalCell, hoverRadius, reduceMotion }) => {
  const [loaded, setLoaded] = useState(false)
  const tx = useTransform(x, (v) => mod((item.relX * totalCell) + v + totalCell, gridWidth) - totalCell)
  const ty = useTransform(y, (v) => mod((item.relY * totalCell) + v + totalCell, gridHeight) - totalCell)

  const hoverRadiusSq = hoverRadius * hoverRadius
  const rawScale = useTransform([tx, ty, mouseX, mouseY], ([latestX, latestY, mx, my]) => {
    if (reduceMotion) return 1
    const centerX = latestX + cellSize / 2
    const centerY = latestY + cellSize / 2
    const distanceSq = (mx - centerX) ** 2 + (my - centerY) ** 2

    if (distanceSq > hoverRadiusSq) return 1

    const distance = Math.sqrt(distanceSq)
    return 1 + (1 - distance / hoverRadius) * 0.12
  })

  const scale = useSpring(rawScale, SCALE_SPRING)

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
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