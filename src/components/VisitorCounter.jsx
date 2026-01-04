import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const VisitorCounter = ({ theme }) => {
  const [visitorCount, setVisitorCount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [showCounter, setShowCounter] = useState(false)

  // Check if admin mode is enabled via URL parameter or localStorage
  useEffect(() => {
    const isAdmin = searchParams.get('admin') === 'true' || localStorage.getItem('showVisitorCount') === 'true'
    setShowCounter(isAdmin)
  }, [searchParams])

  // Track total visits (runs on every page load)
  useEffect(() => {
    const namespace = 'dongha-kim-portfolio'
    const key = 'total-visits'
    
    // Prevent counting multiple times within 2 seconds (for rapid navigation)
    const lastCountTime = sessionStorage.getItem('lastVisitCount')
    const now = Date.now()
    const shouldCount = !lastCountTime || (now - parseInt(lastCountTime)) > 2000
    
    const trackVisit = async () => {
      try {
        // Always increment the count (total visits)
        const hitResponse = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
        const hitData = await hitResponse.json()
        
        if (hitData.value !== undefined) {
          sessionStorage.setItem('lastVisitCount', now.toString())
        }
      } catch (error) {
        console.error('Error tracking visit:', error)
      }
    }

    // Track the visit (always, but with rate limiting)
    if (shouldCount) {
      trackVisit()
    }
  }, [])

  // Fetch and display count (only when admin mode is enabled)
  useEffect(() => {
    if (!showCounter) {
      setIsLoading(false)
      return
    }

    const namespace = 'dongha-kim-portfolio'
    const key = 'total-visits'
    
    const fetchCount = async () => {
      try {
        // Get current count
        const getResponse = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
        const getData = await getResponse.json()
        
        if (getData.value !== undefined) {
          setVisitorCount(getData.value)
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error)
        // Fallback to localStorage if API fails
        const localCount = parseInt(localStorage.getItem('totalVisits') || '0')
        setVisitorCount(localCount)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCount()
    
    // Refresh count every 5 seconds when admin mode is on
    const interval = setInterval(fetchCount, 5000)
    return () => clearInterval(interval)
  }, [showCounter])

  // Don't render anything if admin mode is not enabled
  if (!showCounter || isLoading) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 px-3 py-2 rounded-md text-xs font-light ${
        theme === 'dark' 
          ? 'bg-white/10 text-white/60 border border-white/20' 
          : 'bg-black/5 text-black/60 border border-black/10'
      }`}
      style={{ fontFamily: "'Karla', sans-serif" }}
    >
      {visitorCount !== null && (
        <span>
          {visitorCount.toLocaleString()} {visitorCount === 1 ? 'visit' : 'visits'}
        </span>
      )}
    </div>
  )
}

export default VisitorCounter

