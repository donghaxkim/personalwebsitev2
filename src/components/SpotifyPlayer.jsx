import { useState, useEffect } from 'react'
import { BiSkipNext, BiSkipPrevious, BiPlayCircle, BiPauseCircle } from 'react-icons/bi'

// Pool of tracks with durations
const trackPool = [
  {
    title: 'Over My Dead Body',
    artist: 'Drake',
    albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop',
    duration: 243, // in seconds
  },
  {
    title: 'I Feel It Coming',
    artist: 'The Weeknd',
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    duration: 269,
  },
  {
    title: 'Past Life',
    artist: 'Tame Impala',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    duration: 228,
  },
  {
    title: 'P2',
    artist: 'Lil Uzi Vert',
    albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    duration: 192,
  },
]

export default function SpotifyPlayer({ isExpanded = false, onToggle, theme = 'light' }) {
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const currentTrack = trackPool[trackIndex]

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Progress bar animation
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack.duration])

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % trackPool.length)
    setProgress(0)
  }

  const handlePrevious = () => {
    if (progress > 3) {
      setProgress(0)
    } else {
      setTrackIndex((prev) => (prev - 1 + trackPool.length) % trackPool.length)
      setProgress(0)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    setProgress(percentage * currentTrack.duration)
  }

  return (
    <>
      <style>{`
        @keyframes playing1 {
          0%, 100% { transform: scaleY(0.2); }
          45% { transform: scaleY(0.7); }
        }
        @keyframes playing2 {
          0%, 100% { transform: scaleY(0.15); }
          40% { transform: scaleY(0.55); }
        }
        @keyframes playing3 {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(0.8); }
        }
        @keyframes playing4 {
          0%, 100% { transform: scaleY(0.25); }
          35% { transform: scaleY(0.6); }
        }
        @keyframes playing5 {
          0%, 100% { transform: scaleY(0.2); }
          55% { transform: scaleY(0.65); }
        }
      `}</style>
      
      <div 
        className={`fixed bottom-6 right-6 w-[250px] h-[120px] rounded-[10px] shadow-2xl ${
          theme === 'dark' 
            ? 'bg-[#2a2a2a] border border-gray-700/30' 
            : 'bg-white border border-gray-200/50'
        }`}
        style={{ paddingTop: '0.625rem', paddingLeft: '0.625rem', paddingRight: '0.625rem', paddingBottom: '0.625rem' }}
      >
        {/* Top section - Album art and track info */}
        <div className="relative w-full flex gap-2.5" style={{ marginTop: '0.125rem' }}>
          <div className="relative top-[5px] left-[5px] h-10 w-10 bg-[#d2d2d2] rounded-[5px] flex justify-center items-center overflow-hidden flex-shrink-0">
            <img 
              src={currentTrack.albumArt} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 pt-1 min-w-0 h-10 flex flex-col justify-center">
            <div className={`text-sm font-bold leading-tight overflow-hidden ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`} style={{ 
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              fontSize: currentTrack.title.length > 20 ? '11px' : '14px'
            }}>
              {currentTrack.title}
            </div>
            <div className={`text-[10px] font-semibold truncate opacity-70 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>{currentTrack.artist}</div>
          </div>
          {/* Playing animation */}
          <div className="flex items-end justify-center gap-[1px] w-[30px] h-5" style={{ marginTop: '10px', marginLeft: '-5px' }}>
            {['playing1', 'playing2', 'playing3', 'playing4', 'playing5'].map((animName, i) => (
              <div
                key={i}
                className="bg-[#1db954]"
                style={{ 
                  width: '2px',
                  height: '20px',
                  animation: isPlaying ? `${animName} ${0.6 + i * 0.1}s ease-in-out infinite` : 'none',
                  transformOrigin: 'bottom',
                  transform: 'scaleY(0.2)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div 
          className={`w-[90%] h-[6px] rounded-[3px] absolute left-[5%] bottom-[22px] cursor-pointer ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`}
          onClick={handleProgressClick}
        >
          <div 
            className="bg-[#1db954] h-full rounded-[3px] transition-all"
            style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
          />
        </div>

        {/* Time stamps */}
        <div className={`text-[8px] absolute bottom-[11px] left-[10px] ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {formatTime(progress)}
        </div>
        <div className={`text-[8px] absolute bottom-[11px] right-[10px] ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {formatTime(currentTrack.duration)}
        </div>

        {/* Controls */}
        <div className={`flex absolute bottom-[32px] left-0 w-full justify-center gap-1 ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}>
          <button 
            onClick={handlePrevious}
            className="cursor-pointer transition-colors duration-100 hover:text-[#1db954]"
          >
            <BiSkipPrevious size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="cursor-pointer transition-colors duration-100 hover:text-[#1db954]"
          >
            {isPlaying ? <BiPauseCircle size={24} /> : <BiPlayCircle size={24} />}
          </button>
          
          <button 
            onClick={handleNext}
            className="cursor-pointer transition-colors duration-100 hover:text-[#1db954]"
          >
            <BiSkipNext size={24} />
          </button>
        </div>
      </div>
    </>
  )
}