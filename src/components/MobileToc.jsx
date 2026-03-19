import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MobileToc = ({ theme, contentRef, contentLoaded }) => {
  const [headings, setHeadings] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!contentRef?.current) return
    const elements = contentRef.current.querySelectorAll('h2')
    const items = Array.from(elements).map((el) => {
      if (!el.id) {
        el.id = el.textContent
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      }
      return { id: el.id, text: el.textContent }
    })
    setHeadings(items)
  }, [contentLoaded])

  const handleClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsOpen(false)
  }

  if (headings.length === 0) return null

  return (
    <div className="xl:hidden mb-6" style={{ fontFamily: "'Karla', sans-serif" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-xs font-medium cursor-pointer ${
          theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-black/50 hover:text-black/80'
        }`}
      >
        {isOpen ? '▾ Table of Contents' : '▸ Table of Contents'}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2 space-y-1.5 pl-2"
          >
            {headings.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => handleClick(h.id)}
                  className={`text-left text-xs cursor-pointer ${
                    theme === 'dark'
                      ? 'text-white/40 hover:text-white/70'
                      : 'text-black/40 hover:text-black/70'
                  }`}
                >
                  {h.text}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileToc
