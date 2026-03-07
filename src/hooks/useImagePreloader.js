import { useState, useEffect, useRef } from 'react'

const BATCH_SIZE = 10

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.fetchPriority = 'high'
    img.decoding = 'async'
    img.onload = () => {
      img.decode().then(() => resolve(true)).catch(() => resolve(true))
    }
    img.onerror = () => resolve(false)
    img.src = url
  })
}

export function useImagePreloader(imageUrls, tier1Count = 40) {
  const [tier1Ready, setTier1Ready] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    if (!imageUrls?.length) {
      setTier1Ready(true)
      setLoadedCount(0)
      return
    }

    const tier1 = imageUrls.slice(0, tier1Count)
    const tier2 = imageUrls.slice(tier1Count)

    const run = async () => {
      let loaded = 0

      // Tier 1: load first N images in parallel, then show grid
      const tier1Results = await Promise.all(tier1.map(loadImage))
      if (cancelledRef.current) return
      loaded = tier1Results.filter(Boolean).length
      setLoadedCount(loaded)
      setTier1Ready(true)

      // Tier 2: load rest in background batches
      for (let i = 0; i < tier2.length && !cancelledRef.current; i += BATCH_SIZE) {
        const batch = tier2.slice(i, i + BATCH_SIZE)
        const results = await Promise.all(batch.map(loadImage))
        if (cancelledRef.current) return
        loaded += results.filter(Boolean).length
        setLoadedCount(loaded)
      }
    }

    run()
    return () => {
      cancelledRef.current = true
    }
  }, [imageUrls, tier1Count])

  return {
    tier1Ready,
    loadedCount,
    total: imageUrls?.length ?? 0,
  }
}
