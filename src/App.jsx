import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdEmail } from 'react-icons/md'
import { FaLinkedin, FaGithub, FaXTwitter } from 'react-icons/fa6'
import Navbar from './Navbar'
import SpotifyPlayer from './SpotifyPlayer'
import Projects from './Projects'
import Blog from './Blog'
import BlogPost from './BlogPost'
import InfiniteGrid from './InfiniteGrid'
import Tooltip from '@mui/material/Tooltip'
import VisitorCounter from './components/VisitorCounter'

// Home component
const Home = ({ theme }) => {
  const tooltipSlotProps = {
    popper: {
      sx: {
        '& .MuiTooltip-tooltip': {
          fontFamily: "'Karla', sans-serif",
          bgcolor: theme === 'dark' ? 'rgb(200, 200, 200)' : 'rgb(38, 38, 38)',
          color: theme === 'dark' ? 'rgb(30, 30, 30)' : 'white',
          fontSize: '0.8125rem',
          fontWeight: 500,
          px: 1,
          py: 0.5,
          borderRadius: '8px',
          boxShadow: 'none',
        },
      },
    },
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
    >
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-left -mt-8 md:-mt-12" style={{ fontFamily: "'Gowun Batang', serif", marginBottom: '0.5rem' }}>
        dongha kim
      </h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontFamily: "'Karla', sans-serif" }}
        className={`space-y-6 md:space-y-8 text-sm md:text-base font-light leading-loose ${
          theme === 'dark' ? 'text-white/80' : 'text-black/80'
        }`}
      >
        <p>i study <strong className="font-medium">math</strong> at <strong className="font-medium">waterloo</strong> and enjoy software. i talk about random things at <strong className="font-medium">@imdonghakim</strong> on <a
            href="https://instagram.com/imdonghakim"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium underline ${
              theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
            }`}
          >instagram</a>, <a
            href="https://tiktok.com/@imdonghakim"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium underline ${
              theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
            }`}
          >tiktok</a>, and <a
            href="https://x.com/imdonghakim"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium underline ${
              theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
            }`}
          >x</a>. i like playing basketball and hanging out with my cat. message me if you wanna make something cool <a
            href="mailto:d396kim@uwaterloo.ca"
            className={`font-medium underline ${
              theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
            }`}
          >here</a>.</p>
        
        {/* Social Media Icons */}
        <div className="flex gap-4 mt-14 select-none">
          <Tooltip title="Email" placement="bottom" enterDelay={500} slotProps={tooltipSlotProps}>
            <a
              href="mailto:d396kim@uwaterloo.ca"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-opacity ${
                theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
              }`}
              draggable={false}
            >
              <MdEmail size={20} />
            </a>
          </Tooltip>
          <Tooltip title="LinkedIn" placement="bottom" enterDelay={500} slotProps={tooltipSlotProps}>
            <a
              href="https://www.linkedin.com/in/donghaxkim/"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-opacity ${
                theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
              }`}
              draggable={false}
            >
              <FaLinkedin size={20} />
            </a>
          </Tooltip>
          <Tooltip title="GitHub" placement="bottom" enterDelay={500} slotProps={tooltipSlotProps}>
            <a
              href="https://github.com/donghaxkim"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-opacity ${
                theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
              }`}
              draggable={false}
            >
              <FaGithub size={20} />
            </a>
          </Tooltip>
          <Tooltip title="X" placement="bottom" enterDelay={500} slotProps={tooltipSlotProps}>
            <a
              href="https://x.com/imdonghakim"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-opacity ${
                theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
              }`}
              draggable={false}
            >
              <FaXTwitter size={20} />
            </a>
          </Tooltip>
        </div>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Force default theme to light on first load
    setTheme('light')
    localStorage.setItem('theme', 'light')
  }, [])

  useEffect(() => {
    // Apply theme to html element for overscroll areas
    document.documentElement.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff'
    document.body.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff'
    // Apply dark class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Navbar */}
        <Navbar 
          theme={theme}
          toggleTheme={toggleTheme}
        />

      {/* Main Content */}
      <main className="w-full min-h-screen flex items-center justify-center py-6 pb-24 md:pb-32" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/projects" element={<Projects theme={theme} />} />
          <Route path="/blog" element={<Blog theme={theme} />} />
          <Route path="/blog/:id" element={<BlogPost theme={theme} />} />
          <Route path="/grid" element={<InfiniteGrid theme={theme} />} />
        </Routes>

        {/* Spotify Player in bottom-right */}
        <div
          className="fixed z-50 w-[min(280px,90vw)] sm:w-[min(320px,90vw)] origin-bottom-right scale-[0.75] sm:scale-100"
          style={{
            bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
            right: 'max(1rem, env(safe-area-inset-right, 1rem))',
          }}
        >
          <SpotifyPlayer theme={theme} />
        </div>

        {/* Visitor Counter - Only visible when ?admin=true in URL */}
        <VisitorCounter theme={theme} />
      </main>
      <Analytics />
    </motion.div>
  )
}

export default App

