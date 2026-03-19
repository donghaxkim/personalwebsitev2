import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import { useImagePreloader } from './hooks/useImagePreloader'

const images = import.meta.glob('./public/toWEBP/*.webp', { eager: true, import: 'default' })
const IMAGE_URLS = Object.values(images)

const LERP_FACTOR = 0.12
const SCALE_LERP = 0.15
const HOVER_SCALE_AMOUNT = 0.12
// Drag speed: dampen all movement, cap max delta
const DRAG_DAMPEN = 0.5      // scale all drag deltas (1 = normal, lower = slower)
const MAX_DRAG_DELTA = 20    // hard cap on pixels per frame
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

  const containerRef = useRef(null)
  const itemRefs = useRef({})
  const rafId = useRef(null)

  // Pan state (target = where user dragged to, current = lerped display value)
  const panTarget = useRef({ x: 0, y: 0 })
  const panCurrent = useRef({ x: 0, y: 0 })

  // Momentum state
  const velocity = useRef({ x: 0, y: 0 })
  const lastPanDelta = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  // Pointer position for hover scale
  const mousePos = useRef({ x: -9999, y: -9999 })

  // Per-item current scale for lerping
  const itemScales = useRef({})

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

  // --- Single RAF loop: position + hover scale ---
  useEffect(() => {
    const { items, cols, rows, totalCell, cellSize, hoverRadius } = gridConfig
    const gridWidth = cols * totalCell
    const gridHeight = rows * totalCell
    const hoverRadiusSq = hoverRadius * hoverRadius

    const tick = () => {
      // Apply momentum when not dragging
      if (!isDraggingRef.current) {
        panTarget.current.x += velocity.current.x
        panTarget.current.y += velocity.current.y
        // Friction
        velocity.current.x *= 0.95
        velocity.current.y *= 0.95
        if (Math.abs(velocity.current.x) < 0.1) velocity.current.x = 0
        if (Math.abs(velocity.current.y) < 0.1) velocity.current.y = 0
      }

      // Lerp current toward target
      panCurrent.current.x += (panTarget.current.x - panCurrent.current.x) * LERP_FACTOR
      panCurrent.current.y += (panTarget.current.y - panCurrent.current.y) * LERP_FACTOR

      const cx = panCurrent.current.x
      const cy = panCurrent.current.y
      const mx = mousePos.current.x
      const my = mousePos.current.y

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const el = itemRefs.current[item.id]
        if (!el) continue

        // Wrapping position
        const px = mod((item.relX * totalCell) + cx + totalCell, gridWidth) - totalCell
        const py = mod((item.relY * totalCell) + cy + totalCell, gridHeight) - totalCell

        // Hover scale
        let targetScale = 1
        const centerX = px + cellSize / 2
        const centerY = py + cellSize / 2
        const distSq = (mx - centerX) ** 2 + (my - centerY) ** 2
        if (distSq < hoverRadiusSq) {
          const dist = Math.sqrt(distSq)
          targetScale = 1 + (1 - dist / hoverRadius) * HOVER_SCALE_AMOUNT
        }

        // Lerp scale
        const prevScale = itemScales.current[item.id] ?? 1
        const newScale = prevScale + (targetScale - prevScale) * SCALE_LERP
        itemScales.current[item.id] = newScale

        el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${newScale})`
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [gridConfig])

  // --- Pointer/touch handlers ---
  const pointerStart = useRef({ x: 0, y: 0 })

  const handlePointerDown = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    pointerStart.current = { x: clientX, y: clientY }
    isDraggingRef.current = true
    velocity.current = { x: 0, y: 0 }
    setIsDragging(true)
  }, [])

  const handlePointerMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    // Update pointer position for hover zoom (mouse and touch)
    mousePos.current = { x: clientX, y: clientY }

    if (!isDraggingRef.current) return

    const rawDx = clientX - pointerStart.current.x
    const rawDy = clientY - pointerStart.current.y
    pointerStart.current = { x: clientX, y: clientY }

    const clampDrag = (d) => {
      const dampened = d * DRAG_DAMPEN
      return Math.sign(dampened) * Math.min(Math.abs(dampened), MAX_DRAG_DELTA)
    }

    const dx = clampDrag(rawDx)
    const dy = clampDrag(rawDy)

    panTarget.current.x += dx
    panTarget.current.y += dy
    lastPanDelta.current = { x: dx, y: dy }
  }, [])

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false
    setIsDragging(false)
    // Gentle coast in the drag direction
    velocity.current = { x: lastPanDelta.current.x * 0.5, y: lastPanDelta.current.y * 0.5 }
    lastPanDelta.current = { x: 0, y: 0 }
  }, [])

  // Register ref callback
  const setItemRef = useCallback((id, el) => {
    if (el) {
      itemRefs.current[id] = el
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className={`h-screen overflow-hidden relative select-none transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}
      style={{
        marginLeft: '-2.5rem',
        marginRight: '-2.5rem',
        width: 'calc(100% + 5rem)',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      {gridConfig.items.map((item) => (
        <GridItem
          key={item.id}
          item={item}
          cellSize={gridConfig.cellSize}
          setItemRef={setItemRef}
        />
      ))}
    </div>
  )
}

const GridItem = memo(({ item, cellSize, setItemRef }) => {
  const [loaded, setLoaded] = useState(false)
  const refCb = useCallback((el) => setItemRef(item.id, el), [item.id, setItemRef])

  return (
    <div
      ref={refCb}
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0) scale(1)',
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
    </div>
  )
}, (prevProps, nextProps) =>
  prevProps.item.id === nextProps.item.id && prevProps.cellSize === nextProps.cellSize
)

export default InfiniteGrid
