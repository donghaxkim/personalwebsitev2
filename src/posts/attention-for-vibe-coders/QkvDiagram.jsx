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

const QkvDiagram = ({ theme }) => {
  const dark = theme === 'dark'
  const c = (opacity) => dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`
  const containerRef = useRef(null)
  const inView = useInView(containerRef)

  const W = 380
  const H = 310

  // Positions
  const xBox = { x: W / 2 - 30, y: 15, w: 60, h: 28 }
  const qBox = { x: 30, y: 120, w: 54, h: 28 }
  const kBox = { x: W / 2 - 27, y: 120, w: 54, h: 28 }
  const vBox = { x: W - 84, y: 120, w: 54, h: 28 }

  const dotBox = { x: W / 2 - 50, y: 210, w: 100, h: 26 }
  const zBox = { x: W / 2 - 30, y: 270, w: 60, h: 28 }

  const sublabels = [
    { text: 'what am I looking for?', box: qBox },
    { text: 'how do I advertise myself?', box: kBox },
    { text: "here's my information", box: vBox },
  ]

  const arrowId = 'qkv-arrow'

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
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible', maxWidth: 420, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id={arrowId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill={c(0.3)} />
          </marker>
        </defs>

        {/* Token embedding "x" */}
        <motion.g
          initial={{ opacity: 0, y: -5 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <rect
            x={xBox.x} y={xBox.y} width={xBox.w} height={xBox.h}
            rx={6} fill={c(0.05)} stroke={c(0.12)} strokeWidth={1}
          />
          <text
            x={xBox.x + xBox.w / 2} y={xBox.y + xBox.h / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={12} fontWeight={600} fill={c(0.6)}
            fontFamily="'Karla', sans-serif" fontStyle="italic"
          >
            x
          </text>
          <text
            x={xBox.x + xBox.w / 2} y={xBox.y - 6}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fill={c(0.25)}
            fontFamily="'Karla', sans-serif"
          >
            token embedding
          </text>
        </motion.g>

        {/* Arrows from x to Q, K, V */}
        {[qBox, kBox, vBox].map((box, i) => {
          const labels = ['W_Q', 'W_K', 'W_V']
          const fromX = xBox.x + xBox.w / 2
          const fromY = xBox.y + xBox.h
          const toX = box.x + box.w / 2
          const toY = box.y
          const midY = (fromY + toY) / 2

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
            >
              <motion.path
                d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
                fill="none"
                stroke={c(0.2)}
                strokeWidth={1}
                markerEnd={`url(#${arrowId})`}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              />
              <text
                x={(fromX + toX) / 2 + (i === 0 ? -12 : i === 2 ? 12 : 0)}
                y={midY - 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fill={c(0.3)} fontStyle="italic"
                fontFamily="'Karla', sans-serif"
              >
                {labels[i]}
              </text>
            </motion.g>
          )
        })}

        {/* Q, K, V boxes */}
        {[
          { box: qBox, label: 'Q', color: dark ? 'rgba(245,183,49,0.12)' : 'rgba(245,183,49,0.08)', border: dark ? 'rgba(245,183,49,0.25)' : 'rgba(245,183,49,0.2)' },
          { box: kBox, label: 'K', color: dark ? 'rgba(232,101,42,0.12)' : 'rgba(232,101,42,0.08)', border: dark ? 'rgba(232,101,42,0.25)' : 'rgba(232,101,42,0.2)' },
          { box: vBox, label: 'V', color: dark ? 'rgba(45,184,138,0.12)' : 'rgba(45,184,138,0.08)', border: dark ? 'rgba(45,184,138,0.25)' : 'rgba(45,184,138,0.2)' },
        ].map(({ box, label, color, border }, i) => (
          <motion.g
            key={label}
            initial={{ opacity: 0, y: 5 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.7 + i * 0.08 }}
          >
            <rect
              x={box.x} y={box.y} width={box.w} height={box.h}
              rx={6} fill={color} stroke={border} strokeWidth={1}
            />
            <text
              x={box.x + box.w / 2} y={box.y + box.h / 2 + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontWeight={600} fill={c(0.65)}
              fontFamily="'Karla', sans-serif"
            >
              {label}
            </text>
          </motion.g>
        ))}

        {/* Sublabels under Q, K, V */}
        {sublabels.map(({ text, box }, i) => (
          <motion.text
            key={i}
            x={box.x + box.w / 2}
            y={box.y + box.h + 13}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={7.5} fill={c(0.25)}
            fontFamily="'Karla', sans-serif"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 1.0 + i * 0.1 }}
          >
            {text}
          </motion.text>
        ))}

        {/* Arrows from Q and K down to dot product box */}
        {[qBox, kBox].map((box, i) => {
          const fromX = box.x + box.w / 2
          const fromY = box.y + box.h + 22
          const toX = dotBox.x + (i === 0 ? dotBox.w * 0.3 : dotBox.w * 0.7)
          const toY = dotBox.y
          return (
            <motion.path
              key={`qk-${i}`}
              d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
              fill="none" stroke={c(0.15)} strokeWidth={1}
              markerEnd={`url(#${arrowId})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 1.3 }}
            />
          )
        })}

        {/* Dot product / scores box */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.5 }}
        >
          <rect
            x={dotBox.x} y={dotBox.y} width={dotBox.w} height={dotBox.h}
            rx={6} fill={c(0.03)} stroke={c(0.1)} strokeWidth={1}
          />
          <text
            x={dotBox.x + dotBox.w / 2} y={dotBox.y + dotBox.h / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill={c(0.45)}
            fontFamily="'Karla', sans-serif"
          >
            attention weights
          </text>
        </motion.g>

        {/* Arrow from V curving to Z, and from scores to Z */}
        <motion.path
          d={`M ${vBox.x + vBox.w / 2} ${vBox.y + vBox.h + 22} C ${vBox.x + vBox.w / 2} ${zBox.y - 10}, ${zBox.x + zBox.w + 20} ${zBox.y - 10}, ${zBox.x + zBox.w} ${zBox.y + zBox.h / 2}`}
          fill="none" stroke={c(0.15)} strokeWidth={1}
          markerEnd={`url(#${arrowId})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.7 }}
        />
        <motion.path
          d={`M ${dotBox.x + dotBox.w / 2} ${dotBox.y + dotBox.h} L ${zBox.x + zBox.w / 2} ${zBox.y}`}
          fill="none" stroke={c(0.15)} strokeWidth={1}
          markerEnd={`url(#${arrowId})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.7 }}
        />

        {/* Multiply label between scores and V */}
        <motion.text
          x={dotBox.x + dotBox.w + 22}
          y={dotBox.y + dotBox.h + 18}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={10} fill={c(0.2)}
          fontFamily="'Karla', sans-serif"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: 1.7 }}
        >
          ×  V
        </motion.text>

        {/* Output Z box */}
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 2.0 }}
        >
          <rect
            x={zBox.x} y={zBox.y} width={zBox.w} height={zBox.h}
            rx={6} fill={c(0.06)} stroke={c(0.15)} strokeWidth={1}
          />
          <text
            x={zBox.x + zBox.w / 2} y={zBox.y + zBox.h / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={13} fontWeight={600} fill={c(0.6)}
            fontFamily="'Karla', sans-serif"
          >
            Z
          </text>
          <text
            x={zBox.x + zBox.w / 2} y={zBox.y + zBox.h + 13}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fill={c(0.25)}
            fontFamily="'Karla', sans-serif"
          >
            output
          </text>
        </motion.g>
      </svg>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 2.2 }}
        style={{
          textAlign: 'center',
          fontSize: 11,
          color: c(0.3),
          lineHeight: 1.4,
          marginTop: 8,
          marginBottom: 0,
        }}
      >
        each token produces q, k, v simultaneously from learned weight matrices
      </motion.p>
    </div>
  )
}

export default QkvDiagram
