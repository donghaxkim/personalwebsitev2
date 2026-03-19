import { useState, useEffect } from 'react'

const TableOfContents = ({ theme, contentRef, contentLoaded }) => {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')

  // Re-run when contentLoaded changes (signals MDX has rendered)
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

  useEffect(() => {
    if (!contentRef?.current) return
    const elements = contentRef.current.querySelectorAll('h2')
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (headings.length === 0) return null

  return (
    <nav style={{ fontFamily: "'Karla', sans-serif" }}>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => handleClick(h.id)}
              className={`text-left text-xs leading-relaxed transition-all duration-200 cursor-pointer ${
                activeId === h.id
                  ? theme === 'dark'
                    ? 'text-white/90 font-medium'
                    : 'text-black/90 font-medium'
                  : theme === 'dark'
                    ? 'text-white/30 hover:text-white/60'
                    : 'text-black/30 hover:text-black/60'
              }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
