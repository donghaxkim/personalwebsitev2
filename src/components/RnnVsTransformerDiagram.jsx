import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const WORDS = ['the', 'cat', 'sat', 'on', 'the', 'mat']
const N = WORDS.length

const RNN_OPACITIES = [0.08, 0.13, 0.22, 0.38, 0.62, 1.0]

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

const RnnVsTransformerDiagram = ({ theme }) => {
  const dark = theme === 'dark'
  const c = (opacity) => dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`
  const containerRef = useRef(null)
  const inView = useInView(containerRef)

  // RNN layout
  const rnnBoxW = 32
  const rnnBoxH = 24
  const rnnGap = 14
  const rnnTotalW = N * rnnBoxW + (N - 1) * rnnGap
  const rnnStartX = 10
  const rnnBoxY = 20

  // Transformer layout
  const tBoxW = 32
  const tBoxH = 24
  const tGap = 14
  const tTotalW = N * tBoxW + (N - 1) * tGap
  const tStartX = 10
  const tBoxY = 20

  const svgH = 90
  const wordY = rnnBoxY + rnnBoxH + 18

  // Generate attention lines for transformer (from each token to every other)
  const tLines = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i === j) continue
      const x1 = tStartX + i * (tBoxW + tGap) + tBoxW / 2
      const x2 = tStartX + j * (tBoxW + tGap) + tBoxW / 2
      const y1 = tBoxY + tBoxH + 2
      const y2 = tBoxY + tBoxH + 2
      // Arc below the boxes
      const midX = (x1 + x2) / 2
      const dist = Math.abs(i - j)
      const arcY = y1 + 8 + dist * 5
      tLines.push({ x1, y1, x2, y2, midX, arcY, i, j, dist })
    }
  }

  const rnnSvgW = rnnTotalW + 20
  const tSvgW = tTotalW + 20

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
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* RNN Side */}
        <div style={{ flex: '1 1 auto', minWidth: 200, maxWidth: 320 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: c(0.35), marginBottom: 6, textAlign: 'center' }}>
            RNN
          </div>
          <svg viewBox={`0 0 ${rnnSvgW} ${svgH}`} width="100%" style={{ overflow: 'visible' }}>
            {WORDS.map((word, i) => {
              const x = rnnStartX + i * (rnnBoxW + rnnGap)
              const opacity = RNN_OPACITIES[i]
              const delay = i * 0.2

              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay }}
                >
                  {/* Hidden state box */}
                  <rect
                    x={x} y={rnnBoxY}
                    width={rnnBoxW} height={rnnBoxH}
                    rx={5}
                    fill={c(opacity * 0.5)}
                    stroke={c(opacity * 0.3)}
                    strokeWidth={1}
                  />
                  <text
                    x={x + rnnBoxW / 2} y={rnnBoxY + rnnBoxH / 2 + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={9} fontWeight={500} fill={c(opacity * 0.9)}
                    fontFamily="'Karla', sans-serif"
                  >
                    h{i}
                  </text>

                  {/* Arrow to next */}
                  {i < N - 1 && (
                    <motion.line
                      x1={x + rnnBoxW + 1} y1={rnnBoxY + rnnBoxH / 2}
                      x2={x + rnnBoxW + rnnGap - 1} y2={rnnBoxY + rnnBoxH / 2}
                      stroke={c(0.2)}
                      strokeWidth={1}
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{ duration: 0.2, delay: delay + 0.15 }}
                    />
                  )}
                  {/* Arrow tip */}
                  {i < N - 1 && (
                    <motion.polygon
                      points={`${x + rnnBoxW + rnnGap - 1},${rnnBoxY + rnnBoxH / 2} ${x + rnnBoxW + rnnGap - 5},${rnnBoxY + rnnBoxH / 2 - 3} ${x + rnnBoxW + rnnGap - 5},${rnnBoxY + rnnBoxH / 2 + 3}`}
                      fill={c(0.2)}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.15, delay: delay + 0.3 }}
                    />
                  )}

                  {/* Word label */}
                  <text
                    x={x + rnnBoxW / 2} y={wordY}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={9} fill={c(opacity * 0.6)}
                    fontFamily="'Karla', sans-serif"
                  >
                    {word}
                  </text>

                  {/* Memory fade dot */}
                  <circle
                    cx={x + rnnBoxW / 2} cy={rnnBoxY - 8}
                    r={2.5}
                    fill={c(opacity * 0.4)}
                  />
                </motion.g>
              )
            })}
          </svg>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: c(0.06), alignSelf: 'stretch', margin: '18px 0' }} />

        {/* Transformer Side */}
        <div style={{ flex: '1 1 auto', minWidth: 200, maxWidth: 320 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: c(0.35), marginBottom: 6, textAlign: 'center' }}>
            Transformer
          </div>
          <svg viewBox={`0 0 ${tSvgW} ${svgH}`} width="100%" style={{ overflow: 'visible' }}>
            {/* Attention arc lines */}
            {tLines.map((line, idx) => (
              <motion.path
                key={`line-${idx}`}
                d={`M ${line.x1} ${line.y1} Q ${line.midX} ${line.arcY} ${line.x2} ${line.y2}`}
                fill="none"
                stroke={c(0.12)}
                strokeWidth={0.7}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.4 + idx * 0.015 }}
              />
            ))}

            {/* Token boxes */}
            {WORDS.map((word, i) => {
              const x = tStartX + i * (tBoxW + tGap)
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.25, delay: 1.3 }}
                >
                  <rect
                    x={x} y={tBoxY}
                    width={tBoxW} height={tBoxH}
                    rx={5}
                    fill={c(0.04)}
                    stroke={c(0.12)}
                    strokeWidth={1}
                  />
                  <text
                    x={x + tBoxW / 2} y={tBoxY + tBoxH / 2 + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={9} fontWeight={500} fill={c(0.7)}
                    fontFamily="'Karla', sans-serif"
                  >
                    {word}
                  </text>

                  {/* Equal intensity dots */}
                  <circle
                    cx={x + tBoxW / 2} cy={tBoxY - 8}
                    r={2.5}
                    fill={c(0.35)}
                  />
                </motion.g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 2 }}
        style={{
          textAlign: 'center',
          fontSize: 11,
          color: c(0.3),
          lineHeight: 1.4,
          marginTop: 10,
          marginBottom: 0,
        }}
      >
        sequential processing loses early context vs parallel attention preserves all connections
      </motion.p>
    </div>
  )
}

export default RnnVsTransformerDiagram
