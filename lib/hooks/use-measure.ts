import { useState, useRef, useEffect } from 'react'

export default function useMeasure() {
  const ref = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return
    
    // Initial measure
    setBounds({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight
    })

    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      })
    })
    
    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [])

  return [ref, bounds] as const
}
