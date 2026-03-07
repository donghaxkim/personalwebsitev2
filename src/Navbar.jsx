import { BiHomeAlt } from 'react-icons/bi'
import { FaCubes } from 'react-icons/fa'
import { IoMdPhotos } from 'react-icons/io'
import { LuNotebookPen } from 'react-icons/lu'
import { WiMoonAltThirdQuarter, WiDaySunny } from 'react-icons/wi'
import Tooltip from '@mui/material/Tooltip'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = ({ theme, toggleTheme }) => {
  const tooltipSlotProps = {
    popper: {
      sx: {
        '& .MuiTooltip-tooltip': {
          fontFamily: "'Karla', sans-serif",
          bgcolor: theme === 'dark' ? 'rgb(200, 200, 200)' : 'rgb(38, 38, 38)',
          color: theme === 'dark' ? 'rgb(30, 30, 30)' : 'white',
          fontSize: '0.8125rem',
          fontWeight: 500,
          px: 1.5,
          py: 1.25,
          borderRadius: '8px',
          boxShadow: 'none',
        },
      },
    },
  }
  const glassClass = theme === 'dark' ? 'glass-dark' : 'glass-light'
  const iconColor = theme === 'dark' ? 'text-white/60' : 'text-gray-800/70'
  const iconHover = theme === 'dark' ? 'hover:text-gray-200 hover:scale-110' : 'hover:text-gray-900 hover:scale-110'

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`h-14 sm:h-[72px] rounded-full w-[calc(100vw-2rem)] max-w-[520px] px-4 sm:px-8 flex items-center justify-between text-xl sm:text-2xl ${glassClass} ${iconColor} backdrop-blur-3xl select-none`}>
            <Tooltip title="home" placement="top" enterDelay={500} slotProps={tooltipSlotProps}>
              <RouterLink
                to="/"
                className={`cursor-pointer w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center ${iconHover} transition-all duration-200`}
                draggable={false}
              >
                <BiHomeAlt />
              </RouterLink>
            </Tooltip>

            <Tooltip title="projects" placement="top" enterDelay={500} slotProps={tooltipSlotProps}>
              <RouterLink
                to="/projects"
                className={`cursor-pointer w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center ${iconHover} transition-all duration-200`}
                draggable={false}
              >
                <FaCubes />
              </RouterLink>
            </Tooltip>

            <Tooltip title="blog" placement="top" enterDelay={500} slotProps={tooltipSlotProps}>
              <RouterLink
                to="/blog"
                className={`cursor-pointer w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center ${iconHover} transition-all duration-200`}
                draggable={false}
              >
                <LuNotebookPen />
              </RouterLink>
            </Tooltip>

            <Tooltip title="gallery" placement="top" enterDelay={500} slotProps={tooltipSlotProps}>
              <RouterLink
                to="/grid"
                className={`cursor-pointer w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center ${iconHover} transition-all duration-200`}
                draggable={false}
              >
                <IoMdPhotos />
              </RouterLink>
            </Tooltip>

            <Tooltip title={theme === 'dark' ? 'light mode' : 'dark mode'} placement="top" enterDelay={500} slotProps={tooltipSlotProps}>
              <div
                className={`cursor-pointer w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center ${iconHover} transition-all duration-200`}
                onClick={toggleTheme}
                onKeyDown={(e) => e.key === 'Enter' && toggleTheme()}
                role="button"
                tabIndex={0}
              >
                {theme === 'dark' ? <WiDaySunny /> : <WiMoonAltThirdQuarter />}
              </div>
            </Tooltip>
        </div>
      </nav>

    </>
  )
}

export default Navbar
