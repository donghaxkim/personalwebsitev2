import { BiHomeAlt } from 'react-icons/bi'
import { FaCubes } from 'react-icons/fa'
import { IoMdPhotos } from 'react-icons/io'
import { WiMoonAltThirdQuarter, WiDaySunny } from 'react-icons/wi'
import { Link } from 'react-scroll'
import { useState, useEffect } from 'react'

const Navbar = ({ theme, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleSectionScroll = () => {
      const sections = ['home', 'about', 'techstack', 'projects', 'contact', 'resume', 'contact-info']
      let currentSection = ''

      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section
          }
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleSectionScroll)
    return () => window.removeEventListener('scroll', handleSectionScroll)
  }, [])

  const glassClass = theme === 'dark' ? 'glass-dark' : 'glass-light'
  const iconColor = theme === 'dark' ? 'text-white/60' : 'text-gray-800/70'
  const iconHover = theme === 'dark' ? 'hover:text-gray-200 hover:scale-110' : 'hover:text-gray-900 hover:scale-110'

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`h-[72px] rounded-full w-[520px] px-8 flex items-center justify-between text-2xl ${glassClass} ${iconColor} backdrop-blur-3xl`}>
            <Link
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              title="home"
            >
              <BiHomeAlt />
            </Link>

            <Link
              to="projects"
              spy={true}
              smooth={true}
              duration={500}
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              title="projects"
            >
              <FaCubes />
            </Link>

            <Link
              to="gallery"
              spy={true}
              smooth={true}
              duration={500}
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              title="gallery"
            >
              <IoMdPhotos />
            </Link>

            <div
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'toggle light mode' : 'toggle dark mode'}
            >
              {theme === 'dark' ? <WiDaySunny /> : <WiMoonAltThirdQuarter />}
            </div>
        </div>
      </nav>

    </>
  )
}

export default Navbar

