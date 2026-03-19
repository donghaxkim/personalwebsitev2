import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const useInView = (ref) => {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return inView
}

const HEADS = [
  { label: 'Head 1', sub: 'subject-verb', z: 'Z₁', color: [245, 183, 49] },
  { label: 'Head 2', sub: 'proximity', z: 'Z₂', color: [232, 101, 42] },
  { label: 'Head 3', sub: 'pronoun-noun', z: 'Z₃', color: [45, 184, 138] },
]

const MultiHeadDiagram = ({ theme }) => {
  const dark = theme === 'dark'
  const c = (opacity) => dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`
  const headColor = (rgb, opacity) => `rgba(${rgb.join(',')},${opacity})`
  const containerRef = useRef(null)
  const inView = useInView(containerRef)

  const W = 360
  const H = 340

  const inputBox = { x: W / 2 - 35, y: 12, w: 70, h: 28 }
  const headW = 80
  const headH = 50
  const headY = 100
  const headGap = 20
  const totalHeadsW = HEADS.length * headW + (HEADS.length - 1) * headGap
  const headsStartX = (W - totalHeadsW) / 2

  const concatBox = { x: headsStartX, y: 220, w: totalHeadsW, h: 26 }
  const woBox = { x: W / 2 - 40, y: 295, w: 80, h: 28 }

  const arrowId = 'mh-arrow'

  return (
    <div
      ref={containerRef}
      style={{
        background: c(0.02),
        border: `1px solid ${c(0.06)}`,
        borderRadius: 10,
        padding: '16px 14px 12px',
        margin: '24px 0',
        fontFamily: "'Karla', sans-serif",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible', maxWidth: 400, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id={arrowId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill={c(0.3)} />
          </marker>
        </defs>

        {/* Input box */}
        <motion.g
          initial={{ opacity: 0, y: -5 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <rect
            x={inputBox.x} y={inputBox.y} width={inputBox.w} height={inputBox.h}
            rx={6} fill={c(0.05)} stroke={c(0.12)} strokeWidth={1}
          />
          <text
            x={inputBox.x + inputBox.w / 2} y={inputBox.y + inputBox.h / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={11} fontWeight={500} fill={c(0.55)}
            fontFamily="'Karla', sans-serif"
          >
            Input
          </text>
        </motion.g>

        {/* Fan-out arrows from input to heads */}
        {HEADS.map((_, i) => {
          const hx = headsStartX + i * (headW + headGap) + headW / 2
          const fromX = inputBox.x + inputBox.w / 2
          const fromY = inputBox.y + inputBox.h
          const toY = headY
          const midY = (fromY + toY) / 2

          return (
            <motion.path
              key={`fan-${i}`}
              d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${hx} ${midY}, ${hx} ${toY}`}
              fill="none" stroke={c(0.18)} strokeWidth={1}
              markerEnd={`url(#${arrowId})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
            />
          )
        })}

        {/* Head boxes */}
        {HEADS.map((head, i) => {
          const hx = headsStartX + i * (headW + headGap)
          const bgOpacity = dark ? 0.12 : 0.08
          const borderOpacity = dark ? 0.25 : 0.2

          return (
            <motion.g
              key={head.label}
              initial={{ opacity: 0, y: 5 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.65 + i * 0.1 }}
            >
              <rect
                x={hx} y={headY} width={headW} height={headH}
                rx={6}
                fill={headColor(head.color, bgOpacity)}
                stroke={headColor(head.color, borderOpacity)}
                strokeWidth={1}
              />
              <text
                x={hx + headW / 2} y={headY + 17}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontWeight={600} fill={c(0.55)}
                fontFamily="'Karla', sans-serif"
              >
                {head.label}
              </text>
              <text
                x={hx + headW / 2} y={headY + 32}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={7.5} fill={c(0.3)}
                fontFamily="'Karla', sans-serif"
              >
                {head.sub}
              </text>

              {/* Z output label */}
              <motion.text
                x={hx + headW / 2} y={headY + headH + 14}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fontWeight={500} fill={c(0.35)}
                fontFamily="'Karla', sans-serif"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.2, delay: 0.95 + i * 0.08 }}
              >
                {head.z}
              </motion.text>
            </motion.g>
          )
        })}

        {/* Converging arrows from heads to concat */}
        {HEADS.map((_, i) => {
          const hx = headsStartX + i * (headW + headGap) + headW / 2
          const fromY = headY + headH + 22
          const toX = concatBox.x + concatBox.w * ((i + 1) / (HEADS.length + 1))
          const toY = concatBox.y

          return (
            <motion.path
              key={`conv-${i}`}
              d={`M ${hx} ${fromY} L ${toX} ${toY}`}
              fill="none" stroke={c(0.15)} strokeWidth={1}
              markerEnd={`url(#${arrowId})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.05 }}
            />
          )
        })}

        {/* Concat box */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <rect
            x={concatBox.x} y={concatBox.y} width={concatBox.w} height={concatBox.h}
            rx={6} fill={c(0.03)} stroke={c(0.1)} strokeWidth={1}
          />
          <text
            x={concatBox.x + concatBox.w / 2} y={concatBox.y + concatBox.h / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fill={c(0.45)}
            fontFamily="'Karla', sans-serif"
          >
            Concat(Z₁, Z₂, Z₃)
          </text>
        </motion.g>

        {/* Arrow from concat to output with W_O label */}
        <motion.path
          d={`M ${concatBox.x + concatBox.w / 2} ${concatBox.y + concatBox.h} L ${woBox.x + woBox.w / 2} ${woBox.y}`}
          fill="none" stroke={c(0.18)} strokeWidth={1}
          markerEnd={`url(#${arrowId})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.6 }}
        />
        <motion.text
          x={concatBox.x + concatBox.w / 2 + 18}
          y={(concatBox.y + concatBox.h + woBox.y) / 2 + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={9} fill={c(0.3)} fontStyle="italic"
          fontFamily="'Karla', sans-serif"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: 1.7 }}
        >
          W_O
        </motion.text>

        {/* Output box */}
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 1.8 }}
        >
          <rect
            x={woBox.x} y={woBox.y} width={woBox.w} height={woBox.h}
            rx={6} fill={c(0.06)} stroke={c(0.15)} strokeWidth={1}
          />
          <text
            x={woBox.x + woBox.w / 2} y={woBox.y + woBox.h / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={11} fontWeight={500} fill={c(0.55)}
            fontFamily="'Karla', sans-serif"
          >
            Output
          </text>
        </motion.g>
      </svg>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 2.0 }}
        style={{
          textAlign: 'center',
          fontSize: 11,
          color: c(0.3),
          lineHeight: 1.4,
          marginTop: 8,
          marginBottom: 0,
        }}
      >
        multiple heads attend to different relationships, then merge into one representation
      </motion.p>
    </div>
  )
}

export default MultiHeadDiagram
