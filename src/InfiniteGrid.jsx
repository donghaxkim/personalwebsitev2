import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

// Configuration
const CELL_SIZE = 300 
const GAP = 20
const TOTAL_CELL = CELL_SIZE + GAP

const IMAGES = [
  '1164962732570788597.jpg', 'IMG_0486.JPG', 'IMG_1007.JPG', 'IMG_1454.JPG',
  'IMG_3177.JPG', 'IMG_3195.JPG', 'IMG_3356.JPG', 'IMG_3476.JPG',
  'IMG_4263.JPG', 'IMG_4951.JPG', 'IMG_5224.JPG', 'IMG_5422.JPG',
  'IMG_5475.JPG', 'IMG_5649.JPG', 'IMG_6065.JPG', 'IMG_6111.JPG',
  'IMG_6168.JPG', 'IMG_6414.JPG', 'IMG_6881.JPG', 'IMG_6972.JPG',
  'IMG_7194.JPG', 'IMG_7496.JPG', 'IMG_7795.JPG', 'IMG_8234.JPG',
  'IMG_8416.JPG', 'IMG_8949.JPG', 'IMG_9231.JPG',
]

const mod = (n, m) => ((n % m) + m) % m

const InfiniteGrid = ({ theme }) => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  
  // Base motion values
  const xRaw = useMotionValue(0)
  const yRaw = useMotionValue(0)
  
  // Spring handles the "momentum" glide after you let go
  const x = useSpring(xRaw, { stiffness: 400, damping: 60, restDelta: 0.1 })
  const y = useSpring(yRaw, { stiffness: 400, damping: 60, restDelta: 0.1 })

  useEffect(() => {
    const handleResize = () => setContainerSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const gridConfig = useMemo(() => {
    const cols = Math.ceil(containerSize.width / TOTAL_CELL) + 2
    const rows = Math.ceil(containerSize.height / TOTAL_CELL) + 2
    const items = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({ id: `${r}-${c}`, relX: c, relY: r })
      }
    }
    return { items, cols, rows }
  }, [containerSize])

  // Capture dragging everywhere on the screen
  const onPan = (_, info) => {
    xRaw.set(xRaw.get() + info.delta.x)
    yRaw.set(yRaw.get() + info.delta.y)
  }

  return (
    <div 
      className={`w-full h-screen overflow-hidden relative touch-none select-none transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#111]' : 'bg-[#f5f5f5]'
      }`}
    >
      <motion.div
        onPan={onPan}
        className="absolute inset-0 z-0 active:cursor-grabbing"
        style={{ cursor: 'grab' }}
      >
        {gridConfig.items.map((slot) => (
          <GridItem
            key={slot.id}
            slot={slot}
            x={x}
            y={y}
            gridWidth={gridConfig.cols * TOTAL_CELL}
            gridHeight={gridConfig.rows * TOTAL_CELL}
            theme={theme}
          />
        ))}
      </motion.div>
    </div>
  )
}

const GridItem = ({ slot, x, y, gridWidth, gridHeight, theme }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  // Use transforms for high-performance positioning
  const translateX = useTransform(x, (v) => mod((slot.relX * TOTAL_CELL) + v + TOTAL_CELL, gridWidth) - TOTAL_CELL)
  const translateY = useTransform(y, (v) => mod((slot.relY * TOTAL_CELL) + v + TOTAL_CELL, gridHeight) - TOTAL_CELL)

  // Image index calculation
  const [imgIndex, setImgIndex] = useState(0)
  
  // Track position to update image source when wrapping
  useEffect(() => {
    const updateIndex = () => {
      const colOffset = Math.floor(((slot.relX * TOTAL_CELL) + x.get()) / gridWidth)
      const rowOffset = Math.floor(((slot.relY * TOTAL_CELL) + y.get()) / gridHeight)
      const newIdx = mod(slot.relX + slot.relY + colOffset + rowOffset, IMAGES.length)
      setImgIndex(newIdx)
    }
    
    // Check index on mount and on spring change
    updateIndex()
    const unsub = x.on("change", updateIndex)
    return () => unsub()
  }, [gridWidth, gridHeight])

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        x: translateX,
        y: translateY,
      }}
      className="pointer-events-none"
    >
      <div 
        className={`w-full h-full rounded-lg overflow-hidden transition-opacity duration-1000 ${
          theme === 'dark' ? 'bg-white/[0.03] ring-1 ring-white/10' : 'bg-black/[0.03] ring-1 ring-black/5'
        }`}
      >
        <img
          src={`/src/public/Website/${IMAGES[imgIndex]}`}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          decoding="async"
          loading="lazy"
        />
      </div>
    </motion.div>
  )
}

export default InfiniteGrid