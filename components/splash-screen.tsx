"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    // Scroll is already locked by the "loading-lock" class in layout.tsx
    // to prevent the "flash" of scrollbar on initial load.

    const fadeTimer = setTimeout(() => {
      setFadingOut(true)
    }, 3000)

    const removeTimer = setTimeout(() => {
      document.documentElement.classList.remove("loading-lock")
      setVisible(false)
    }, 3600) // 3s display + 0.6s fade-out

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
      document.documentElement.classList.remove("loading-lock")
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        height: "100svh",
        width: "100%",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <Image
        src="/logo.png"
        alt="Univers Instrument Service"
        width={200}
        height={200}
        priority
        className="animate-pulse-slow"
        style={{ objectFit: "contain" }}
      />
    </div>
  )
}
